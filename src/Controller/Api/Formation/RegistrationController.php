<?php

namespace App\Controller\Api\Formation;

use App\Entity\Formation\FoRegistration;
use App\Entity\Formation\FoSession;
use App\Entity\Formation\FoWorker;
use App\Entity\Paiement\PaOrder;
use App\Entity\User;
use App\Service\ApiResponse;
use App\Service\MailerService;
use App\Service\NotificationService;
use App\Service\Registration\RegistrationService;
use App\Service\SettingsService;
use DateTime;
use Doctrine\Common\Persistence\ManagerRegistry;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use OpenApi\Annotations as OA;

/**
 * @Route("/api/registration", name="api_registration_")
 */
class RegistrationController extends AbstractController
{
    const ICON = "book";

    private $doctrine;

    public function __construct(ManagerRegistry $doctrine)
    {
        $this->doctrine = $doctrine;
    }

    /**
     * Create registration worker-session
     *
     * @Route("/{session}", name="create", options={"expose"=true}, methods={"POST"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a message",
     * )
     *
     * @OA\Tag(name="Registration")
     *
     * @param Request $request
     * @param FoSession $session
     * @param ApiResponse $apiResponse
     * @param MailerService $mailerService
     * @param SettingsService $settingsService
     * @param NotificationService $notificationService
     * @param RegistrationService $registrationService
     * @return JsonResponse
     */
    public function create(Request $request, FoSession $session, ApiResponse $apiResponse,
                           MailerService $mailerService, SettingsService $settingsService,
                           NotificationService $notificationService, RegistrationService $registrationService): JsonResponse
    {
        $em = $this->doctrine->getManager();
        $data = json_decode($request->getContent());

        if ($data === null) {
            return $apiResponse->apiJsonResponseBadRequest('Les données sont vides.');
        }

        /** @var User $user */
        $user = $this->getUser();
        $agency = $user->getAgency();

        $workersRegulars = $em->getRepository(FoWorker::class)->findBy(['id' => $data->workersRegularsId]);
        $workersSpecials = $em->getRepository(FoWorker::class)->findBy(['id' => $data->workersSpecialsId]);

        $bank         = $data->bank;
        $bankSpecials = $data->bankSpecials;

        $nameFormation = $session->getFormation()->getName();
        $dateFormation = $session->getFullDateHuman();
        $fullNameFormation = $nameFormation . " " . $dateFormation;
        $nameOrder =  strlen($fullNameFormation) < 255 ? $fullNameFormation : $nameFormation . " #" . $session->getId();

        $code = uniqid();

        $orderRegulars = [];
        $orderSpecials = [];

        // Regulars = agence
        if(count($workersRegulars) != 0){
            $registration = $registrationService->createOrderAndRegistration(
                $em, "", $code,
                $user, $agency, $session, $nameOrder, $workersRegulars, $bank,
                $request->getClientIp()
            );
            if($registration["code"] != 1){
                return $apiResponse->apiJsonResponseValidationFailed($registration["data"]);
            }

            $orderRegulars[] = $registration["data"];
        }

        // Specials = agents commerciaux
        if(count($workersSpecials) != 0){
            foreach($workersSpecials as $w){

                $workers = [$w];

                $bankWorker = null;
                foreach($bankSpecials as $item){
                    if($item->workerId == $w->getId()){
                        $bankWorker = $item->bank;
                    }
                }

                $registration = $registrationService->createOrderAndRegistration(
                    $em, "A", $code,
                    $user, $bankWorker ?: $agency, $session, $nameOrder, $workers, $bankWorker ?: $bank,
                    $request->getClientIp()
                );
                if($registration["code"] != 1){
                    return $apiResponse->apiJsonResponseValidationFailed($registration["data"]);
                }

                $orderSpecials[] = $registration["data"];
            }
        }

        // Send mails
        if($mailerService->sendMail(
                $settingsService->getEmailContact(),
                $settingsService->getWebsiteName() ." - Inscription à confirmer pour : " . $fullNameFormation,
                "Inscription à confirmer pour : " . $fullNameFormation,
                'user/email/formation/registration.html.twig',
                [
                    'settings' => $settingsService->getSettings(),
                    'title' => $nameFormation,
                    'session' => $session,
                    "orderRegulars" => $orderRegulars,
                    "orderSpecials" => $orderSpecials,
                    'participants' => count($workersRegulars) + count($workersSpecials)
                ]
            ) != true)
        {
            return $apiResponse->apiJsonResponseValidationFailed([[
                'name' => 'message',
                'message' => "Le message n\'a pas pu être délivré. Veuillez contacter le support."
            ]]);
        }

        $em->flush();

        $notificationService->createNotification(
            "Inscription - " . $fullNameFormation,
            self::ICON,
            $this->getUser(),
            $this->generateUrl('admin_sessions_read', ['slug' => $session->getSlug()])
        );

        return $apiResponse->apiJsonResponseSuccessful("Success");
    }

    /**
     * Update registration worker-session
     *
     * @Route("/{session}", name="update", options={"expose"=true}, methods={"PUT"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a message",
     * )
     *
     * @OA\Tag(name="Registration")
     *
     * @param Request $request
     * @param FoSession $session
     * @param ApiResponse $apiResponse
     * @return JsonResponse
     */
    public function update(Request $request, FoSession $session, ApiResponse $apiResponse): JsonResponse
    {
        $em = $this->doctrine->getManager();
        $data = json_decode($request->getContent());

        if ($data === null) {
            return $apiResponse->apiJsonResponseBadRequest('Les données sont vides.');
        }

        $registrationsId = [];
        foreach($data->registrations as $registration){
            $registrationsId[] = $registration->id;
        }
        $registrations = $em->getRepository(FoRegistration::class)->findBy(["id" => $registrationsId]);

        //delete registration = update order or cancel order
        $registrationsToDelete = []; $noDuplication = [];
        foreach($registrations as $registration){
            foreach($data->registrationsToDelete as $reg){
                if($reg->id == $registration->getId()){
                    $registration->setStatus(FoRegistration::STATUS_INACTIVE);

                    $order = $registration->getPaOrder();

                    if($order->getParticipants() == 1){
                        ($order)
                            ->setStatus(PaOrder::STATUS_ANNULER)
                            ->setUpdatedAt(new DateTime())
                        ;
                    }else{

                        if(!in_array($reg->id, $noDuplication)){
                            $noDuplication[] = $reg->id;

                            $registrationsToDelete[] = [
                                "id" => $reg->id,
                                "participants" => $order->getParticipants() - 1,
                                "order" => $order,
                            ];

                        }else{
                            foreach($registrationsToDelete as $r){
                                if($r["id"] == $reg->id){
                                    $r["participants"]--;
                                }
                            }
                        }


                    }
                }
            }
        }

        foreach($registrationsToDelete as $reg){
            $order = $reg["order"];
            ($order)
                ->setParticipants($reg["participants"])
                ->setPrice($session->getPriceTTC() * $reg["participants"])
                ->setUpdatedAt(new DateTime())
            ;
        }

        //Update worker of registration
        foreach($data->registrations as $reg){
            $registration = $em->getRepository(FoRegistration::class)->find($reg->id);
            if($reg->worker->id != $registration->getWorker()->getId()){
                $worker = $em->getRepository(FoWorker::class)->find($reg->worker->id);
                $registration->setWorker($worker);
            }
        }

        $em->flush();

        return $apiResponse->apiJsonResponseSuccessful("Success");
    }

    /**
     * Switch attestation
     *
     * @Security("is_granted('ROLE_ADMIN')")
     *
     * @Route("/attestation/{id}", name="switch_attestation", options={"expose"=true}, methods={"POST"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a message",
     * )
     *
     * @OA\Tag(name="Registration")
     *
     * @param FoRegistration $obj
     * @param ApiResponse $apiResponse
     * @return JsonResponse
     */
    public function switchAttestation(FoRegistration $obj, ApiResponse $apiResponse): JsonResponse
    {
        $em = $this->doctrine->getManager();

        $obj->setHaveAttestation(!$obj->getHaveAttestation());
        $em->flush();

        return  $apiResponse->apiJsonResponse($obj, User::ADMIN_READ);
    }

    /**
     * Enable all attestation
     *
     * @Security("is_granted('ROLE_ADMIN')")
     *
     * @Route("/attestations/{session}", name="enable_attestations", options={"expose"=true}, methods={"GET"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a message",
     * )
     *
     * @OA\Tag(name="Registration")
     *
     * @param FoSession $session
     * @param ApiResponse $apiResponse
     * @return RedirectResponse
     */
    public function enableAttestations(FoSession $session, ApiResponse $apiResponse): RedirectResponse
    {
        $em = $this->doctrine->getManager();
        $registrations = $em->getRepository(FoRegistration::class)->findBy(['session' => $session]);
        foreach($registrations as $obj){
            $obj->setHaveAttestation(true);
        }

        $em->flush();

        return $this->redirectToRoute('admin_sessions_read', ['slug' => $session->getSlug()]);
    }
}
