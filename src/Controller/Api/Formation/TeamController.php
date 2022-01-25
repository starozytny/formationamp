<?php

namespace App\Controller\Api\Formation;

use App\Entity\Formation\FoWorker;
use App\Entity\User;
use App\Service\ApiResponse;
use App\Service\Data\Paiement\DataTeam;
use App\Service\ValidatorService;
use DateTime;
use Doctrine\Common\Persistence\ManagerRegistry;
use OpenApi\Annotations as OA;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/api/team", name="api_team_")
 */
class TeamController extends AbstractController
{
    private $doctrine;

    public function __construct(ManagerRegistry $doctrine)
    {
        $this->doctrine = $doctrine;
    }

    public function submitForm($type, FoWorker $obj, Request $request, ApiResponse $apiResponse,
                               ValidatorService $validator, DataTeam $dataEntity): JsonResponse
    {
        $em = $this->doctrine->getManager();
        $data = json_decode($request->getContent());

        if ($data === null) {
            return $apiResponse->apiJsonResponseBadRequest('Les données sont vides.');
        }

        /** @var User $user */
        $user = $this->getUser();
        $obj = $dataEntity->setData($obj, $data, $user);

        if($type == "update"){
            $obj->setUpdatedAt(new DateTime());
        }

        $noErrors = $validator->validate($obj);
        if ($noErrors !== true) {
            return $apiResponse->apiJsonResponseValidationFailed($noErrors);
        }

        $em->persist($obj);
        $em->flush();

        return $apiResponse->apiJsonResponse($obj, User::USER_READ);
    }

    /**
     * Create a worker
     *
     * @Route("/", name="create", options={"expose"=true}, methods={"POST"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a message",
     * )
     *
     * @OA\Tag(name="Team")
     *
     * @param Request $request
     * @param ValidatorService $validator
     * @param ApiResponse $apiResponse
     * @param DataTeam $dataEntity
     * @return JsonResponse
     */
    public function create(Request $request, ValidatorService $validator, ApiResponse $apiResponse,
                           DataTeam $dataEntity): JsonResponse
    {
        return $this->submitForm("create", new FoWorker(), $request, $apiResponse, $validator, $dataEntity);
    }

    /**
     * Update a worker
     *
     * @Route("/{id}", name="update", options={"expose"=true}, methods={"PUT"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns an worker object"
     * )
     *
     * @OA\Response(
     *     response=400,
     *     description="Validation failed",
     * )
     *
     * @OA\Tag(name="Team")
     *
     * @param Request $request
     * @param FoWorker $obj
     * @param ValidatorService $validator
     * @param ApiResponse $apiResponse
     * @param DataTeam $dataEntity
     * @return JsonResponse
     */
    public function update(Request $request, FoWorker $obj, ValidatorService $validator,
                           ApiResponse $apiResponse, DataTeam $dataEntity): JsonResponse
    {
        return $this->submitForm("update", $obj, $request, $apiResponse, $validator, $dataEntity);
    }

    /**
     * Switch archive a worker
     *
     * @Route("/archive/{id}", name="archived", options={"expose"=true}, methods={"POST"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Return message successful",
     * )
     *
     * @OA\Tag(name="Team")
     *
     * @param FoWorker $obj
     * @param ApiResponse $apiResponse
     * @return JsonResponse
     */
    public function switchArchived(FoWorker $obj, ApiResponse $apiResponse): JsonResponse
    {
        $em = $this->doctrine->getManager();

        $obj->setIsArchived(!$obj->getIsArchived());
        $em->flush();

        return  $apiResponse->apiJsonResponse($obj, User::USER_READ);
    }

    /**
     * Delete a worker
     *
     * @Route("/{id}", name="delete", options={"expose"=true}, methods={"DELETE"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Return message successful",
     * )
     *
     * @OA\Tag(name="Team")
     *
     * @param FoWorker $obj
     * @param ApiResponse $apiResponse
     * @return JsonResponse
     */
    public function delete(FoWorker $obj, ApiResponse $apiResponse): JsonResponse
    {
        $em = $this->doctrine->getManager();

        if(count($obj->getRegistrations()) != 0){
            return $apiResponse->apiJsonResponseBadRequest($obj->getLastname() . " est ou a été inscrit à une formation. Vous ne pouvez pas le supprimer.");
        }

        $em->remove($obj);
        $em->flush();

        return $apiResponse->apiJsonResponseSuccessful("Supression réussie !");
    }
}
