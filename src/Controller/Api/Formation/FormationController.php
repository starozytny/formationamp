<?php

namespace App\Controller\Api\Formation;

use App\Entity\Formation\FoFormation;
use App\Entity\User;
use App\Service\ApiResponse;
use App\Service\Data\DataService;
use App\Service\Data\Formation\DataFormation;
use App\Service\FileUploader;
use App\Service\ValidatorService;
use DateTime;
use Doctrine\Common\Persistence\ManagerRegistry;
use OpenApi\Annotations as OA;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/api/formations", name="api_formations_")
 */
class FormationController extends AbstractController
{
    private $doctrine;

    public function __construct(ManagerRegistry $doctrine)
    {
        $this->doctrine = $doctrine;
    }

    public function submitForm($type, FoFormation $obj, Request $request, ApiResponse $apiResponse,
                               ValidatorService $validator, DataFormation $dataEntity, FileUploader $fileUploader): JsonResponse
    {
        $em = $this->doctrine->getManager();
        $data = json_decode($request->get('data'));

        if ($data === null) {
            return $apiResponse->apiJsonResponseBadRequest('Les données sont vides.');
        }

        $obj = $dataEntity->setData($obj, $data);

        $programme = $request->files->get('programme');
        $support = $request->files->get('support');

        if($type == "update"){
            if($programme){
                $fileName = $fileUploader->replaceFile($programme, $obj->getProgramme(),FoFormation::FOLDER_FORMATION);
                $obj->setProgramme($fileName);
            }
            if($support){
                $fileName = $fileUploader->replaceFile($support, $obj->getSupport(),FoFormation::FOLDER_FORMATION);
                $obj->setSupport($fileName);
            }

            $obj->setUpdatedAt(new DateTime());
        }else{
            $fileName = ($programme) ? $fileUploader->upload($programme, FoFormation::FOLDER_FORMATION, true) : null;
            $fileName1 = ($support) ? $fileUploader->upload($support, FoFormation::FOLDER_FORMATION, true) : null;
            $obj->setProgramme($fileName);
            $obj->setSupport($fileName1);
        }

        $noErrors = $validator->validate($obj);
        if ($noErrors !== true) {
            return $apiResponse->apiJsonResponseValidationFailed($noErrors);
        }

        $em->persist($obj);
        $em->flush();

        return $apiResponse->apiJsonResponse($obj, User::ADMIN_READ);
    }

    /**
     * Create a formation
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
     * @param FileUploader $fileUploader
     * @return JsonResponse
     */
    public function create(Request $request, ValidatorService $validator, ApiResponse $apiResponse,
                           DataFormation $dataEntity, FileUploader $fileUploader): JsonResponse
    {
        return $this->submitForm("create", new FoFormation(), $request, $apiResponse, $validator, $dataEntity, $fileUploader);
    }

    /**
     * Update a formation
     *
     * @Security("is_granted('ROLE_ADMIN')")
     *
     * @Route("/{id}", name="update", options={"expose"=true}, methods={"POST"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns an user object"
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
     * @param FoFormation $obj
     * @param ValidatorService $validator
     * @param ApiResponse $apiResponse
     * @param DataFormation $dataEntity
     * @param FileUploader $fileUploader
     * @return JsonResponse
     */
    public function update(Request $request, FoFormation $obj, ValidatorService $validator,
                           ApiResponse $apiResponse, DataFormation $dataEntity, FileUploader $fileUploader): JsonResponse
    {
        return $this->submitForm("update", $obj, $request, $apiResponse, $validator, $dataEntity, $fileUploader);
    }

    /**
     * Switch is published
     *
     * @Security("is_granted('ROLE_ADMIN')")
     *
     * @Route("/formation/{id}", name="formation_published", options={"expose"=true}, methods={"POST"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a formation object",
     * )
     *
     * @OA\Tag(name="Formations")
     *
     * @param DataService $dataService
     * @param FoFormation $obj
     * @return JsonResponse
     */
    public function switchIsPublished(DataService $dataService, FoFormation $obj): JsonResponse
    {
        return $dataService->switchIsPublished($obj);
    }

    /**
     * Admin - Delete a formation
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
     * @param FoFormation $obj
     * @param ApiResponse $apiResponse
     * @param FileUploader $fileUploader
     * @return JsonResponse
     */
    public function delete(FoFormation $obj, ApiResponse $apiResponse, FileUploader $fileUploader): JsonResponse
    {
        $em = $this->doctrine->getManager();

        $em->remove($obj);
        $em->flush();

        $fileUploader->deleteFile($obj->getProgramme(), FoFormation::FOLDER_FORMATION);
        $fileUploader->deleteFile($obj->getSupport(), FoFormation::FOLDER_FORMATION);

        return $apiResponse->apiJsonResponseSuccessful("Supression réussie !");
    }

    /**
     * Admin - Delete a group of formations
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
     * @param ApiResponse $apiResponse
     * @param FileUploader $fileUploader
     * @return JsonResponse
     */
    public function deleteSelected(Request $request, ApiResponse $apiResponse, FileUploader $fileUploader): JsonResponse
    {
        $em = $this->doctrine->getManager();
        $data = json_decode($request->getContent());

        $objs = $em->getRepository(FoFormation::class)->findBy(['id' => $data]);

        $files = [];
        if ($objs) {
            foreach ($objs as $obj) {
                $files[] = $obj->getProgramme();
                $files[] = $obj->getSupport();
                $em->remove($obj);
            }
        }

        $em->flush();

        foreach($files as $file){
            $fileUploader->deleteFile($file, FoFormation::FOLDER_FORMATION);
        }

        return $apiResponse->apiJsonResponseSuccessful("Supression de la sélection réussie !");
    }
}
