<?php

namespace App\Controller\Api;

use App\Entity\Contact;
use App\Entity\User;
use App\Repository\ContactRepository;
use App\Repository\UserRepository;
use App\Service\ApiResponse;
use App\Service\Data\DataService;
use App\Service\MailerService;
use App\Service\NotificationService;
use App\Service\SanitizeData;
use App\Service\SettingsService;
use App\Service\ValidatorService;
use Doctrine\Common\Persistence\ManagerRegistry;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use OpenApi\Annotations as OA;

/**
 * @Route("/api/mails", name="api_mails_")
 */
class MailController extends AbstractController
{
    /**
     * Admin - Preview mail
     *
     * @Security("is_granted('ROLE_ADMIN')")
     *
     * @Route("/preview", name="preview", options={"expose"=true}, methods={"POST"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns array of contacts",
     * )
     * @OA\Tag(name="Mails")
     *
     * @param Request $request
     * @param SettingsService $settingsService
     * @param ApiResponse $apiResponse
     * @return Response
     */
    public function preview(Request $request, SettingsService $settingsService, ApiResponse $apiResponse): Response
    {
        $data = json_decode($request->get('data'));

        if($data == null){
            return $apiResponse->apiJsonResponseBadRequest("Les données sont vides.");
        }

        $html = $this->renderView('app/email/template/random.html.twig', [
            'subject' => $data->subject,
            'title' => $data->title,
            'message' => $data->message->html,
            'settings' => $settingsService->getSettings()
        ]);

        return new Response($html);
    }

    /**
     * Create a message contact
     *
     * @Route("/", name="create", options={"expose"=true}, methods={"POST"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a message",
     * )
     *
     * @OA\Tag(name="Contact")
     *
     * @param Request $request
     * @param ApiResponse $apiResponse
     * @param UserRepository $userRepository
     * @param MailerService $mailerService
     * @param SettingsService $settingsService
     * @return JsonResponse
     */
    public function create(Request $request, ApiResponse $apiResponse, UserRepository $userRepository,
                           MailerService $mailerService, SettingsService $settingsService): JsonResponse
    {
        $data = json_decode($request->get('data'));

        if ($data == null) {
            return $apiResponse->apiJsonResponseBadRequest('Les données sont vides.');
        }

        $destinataires = [];
        switch ((int) $data->type){
            case 0:
                $users = $userRepository->findAll();
                foreach($users as $user){
                    if($user->getHighRoleCode() != 1){
                        $destinataires[] = $user->getEmail();
                    }
                }
                break;
            default:
                foreach($data->emails as $email){
                    $destinataires[] = $email->value;
                }
                break;
        }

        if($mailerService->sendMailCCGroup(
                $destinataires,
                "[" . $settingsService->getWebsiteName() ."] " . trim($data->subject),
                trim($data->title),
                'app/email/template/random.html.twig',
                ['title' => trim($data->title), 'message' => trim($data->message->html), 'settings' => $settingsService->getSettings()]
            ) != true)
        {
            return $apiResponse->apiJsonResponseValidationFailed([[
                'name' => 'message',
                'message' => "Le message n\'a pas pu être délivré. Veuillez contacter le support."
            ]]);
        }

        return $apiResponse->apiJsonResponseSuccessful("Message envoyé.");
    }
}
