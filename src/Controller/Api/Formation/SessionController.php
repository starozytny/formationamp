<?php

namespace App\Controller\Api\Formation;

use App\Entity\Formation\FoSession;
use App\Entity\User;
use App\Service\ApiResponse;
use App\Service\Data\DataFormation;
use App\Service\Data\DataService;
use App\Service\ValidatorService;
use Doctrine\Common\Persistence\ManagerRegistry;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use OpenApi\Annotations as OA;

/**
 * @Route("/api/sessions", name="api_sessions_")
 */
class SessionController extends AbstractController
{
    private $doctrine;

    public function __construct(ManagerRegistry $doctrine)
    {
        $this->doctrine = $doctrine;
    }

    public function submitForm($type, FoSession $obj, Request $request, ApiResponse $apiResponse,
                               ValidatorService $validator, DataFormation $dataEntity): JsonResponse
    {
        $em = $this->doctrine->getManager();
        $data = json_decode($request->getContent());

        if ($data === null) {
            return $apiResponse->apiJsonResponseBadRequest('Les données sont vides.');
        }

        $obj = $dataEntity->setDataSession($obj, $data);

        $noErrors = $validator->validate($obj);
        if ($noErrors !== true) {
            return $apiResponse->apiJsonResponseValidationFailed($noErrors);
        }

        $em->persist($obj);
        $em->flush();

        return $apiResponse->apiJsonResponse($obj, User::ADMIN_READ);
    }
    
    /**
     * Create a session
     *
     * @Security("is_granted('ROLE_ADMIN')")
     *
     * @Route("/", name="create", options={"expose"=true}, methods={"POST"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a message",
     * )
     *
     * @OA\Tag(name="Formations")
     *
     * @param Request $request
     * @param ValidatorService $validator
     * @param ApiResponse $apiResponse
     * @param DataFormation $dataEntity
     * @return JsonResponse
     */
    public function create(Request $request, ValidatorService $validator, ApiResponse $apiResponse,
                           DataFormation $dataEntity): JsonResponse
    {
        return $this->submitForm("create", new FoSession(), $request, $apiResponse, $validator, $dataEntity);
    }

    /**
     * Update a session
     *
     * @Security("is_granted('ROLE_ADMIN')")
     *
     * @Route("/{id}", name="update", options={"expose"=true}, methods={"PUT"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns an session object"
     * )
     *
     * @OA\Response(
     *     response=400,
     *     description="Validation failed",
     * )
     *
     * @OA\Tag(name="Formations")
     *
     * @param Request $request
     * @param FoSession $obj
     * @param ValidatorService $validator
     * @param ApiResponse $apiResponse
     * @param DataFormation $dataEntity
     * @return JsonResponse
     */
    public function update(Request $request, FoSession $obj, ValidatorService $validator,
                           ApiResponse $apiResponse, DataFormation $dataEntity): JsonResponse
    {
        return $this->submitForm("update", $obj, $request, $apiResponse, $validator, $dataEntity);
    }

    /**
     * Switch is published
     *
     * @Security("is_granted('ROLE_ADMIN')")
     *
     * @Route("/session/{id}", name="formation_published", options={"expose"=true}, methods={"POST"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a session object",
     * )
     *
     * @OA\Tag(name="Formations")
     *
     * @param DataService $dataService
     * @param FoSession $obj
     * @return JsonResponse
     */
    public function switchIsPublished(DataService $dataService, FoSession $obj): JsonResponse
    {
        return $dataService->switchIsPublished($obj);
    }

    /**
     * Admin - Delete a session
     *
     * @Security("is_granted('ROLE_ADMIN')")
     *
     * @Route("/{id}", name="delete", options={"expose"=true}, methods={"DELETE"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Return message successful",
     * )
     *
     * @OA\Tag(name="Formations")
     *
     * @param FoSession $obj
     * @param DataService $dataService
     * @return JsonResponse
     */
    public function delete(FoSession $obj, DataService $dataService): JsonResponse
    {
        return $dataService->delete($obj);
    }

    /**
     * Admin - Delete a group of sessions
     *
     * @Security("is_granted('ROLE_ADMIN')")
     *
     * @Route("/", name="delete_group", options={"expose"=true}, methods={"DELETE"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Return message successful",
     * )
     *
     * @OA\Tag(name="Formations")
     *
     * @param Request $request
     * @param DataService $dataService
     * @return JsonResponse
     */
    public function deleteSelected(Request $request, DataService $dataService): JsonResponse
    {
        return $dataService->deleteSelected(FoSession::class, json_decode($request->getContent()));
    }
}
