<?php

namespace App\Controller\Api;

use App\Entity\Society;
use App\Entity\User;
use App\Service\ApiResponse;
use App\Service\Data\Society\DataSociety;
use App\Service\Export;
use App\Service\FileUploader;
use App\Service\ValidatorService;
use Doctrine\Common\Persistence\ManagerRegistry;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use OpenApi\Annotations as OA;

/**
 * @Route("/api/societies", name="api_societies_")
 * @Security("is_granted('ROLE_ADMIN')")
 */
class SocietyController extends AbstractController
{
    const FOLDER_LOGOS = Society::FOLDER_LOGOS;
    const ICON = "user";

    private $doctrine;

    public function __construct(ManagerRegistry $doctrine)
    {
        $this->doctrine = $doctrine;
    }

    public function submitForm($type, Society $obj, Request $request, ApiResponse $apiResponse,
                               ValidatorService $validator, DataSociety $dataEntity, FileUploader $fileUploader): JsonResponse
    {
        $em = $this->doctrine->getManager();
        $data = json_decode($request->get('data'));

        if ($data === null) {
            return $apiResponse->apiJsonResponseBadRequest('Les données sont vides.');
        }

        if (!isset($data->name)) {
            return $apiResponse->apiJsonResponseBadRequest('Il manque des données.');
        }

        if($type === "create"){
            $last = $em->getRepository(Society::class)->findBy([], ['code' => 'DESC'],1,0);
            $code = count($last) !== 0 ? $last[0]->getCode() + 1 : 1;
        }else{
            $code = $obj->getCode();
        }

        $obj = $dataEntity->setData($obj, $data, $code);

        $file = $request->files->get('logo');
        if($type === "create"){
            if ($file) {
                $fileName = $fileUploader->upload($file, self::FOLDER_LOGOS);
                $obj->setLogo($fileName);
            }
        }else{
            if ($file) {
                $fileName = $fileUploader->replaceFile($file, $obj->getLogo(),self::FOLDER_LOGOS);
                $obj->setLogo($fileName);
            }
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
     * Create a society
     *
     * @Route("/", name="create", options={"expose"=true}, methods={"POST"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a new object"
     * )
     *
     * @OA\Response(
     *     response=400,
     *     description="JSON empty or missing data or validation failed",
     * )
     *
     * @OA\Tag(name="Societies")
     *
     * @param Request $request
     * @param ValidatorService $validator
     * @param ApiResponse $apiResponse
     * @param FileUploader $fileUploader
     * @param DataSociety $dataEntity
     * @return JsonResponse
     */
    public function create(Request $request, ValidatorService $validator, ApiResponse $apiResponse,
                           FileUploader $fileUploader, DataSociety $dataEntity): JsonResponse
    {
        return $this->submitForm("create", new Society(), $request, $apiResponse, $validator, $dataEntity, $fileUploader);
    }

    /**
     * Update a society
     *
     * @Route("/{id}", name="update", options={"expose"=true}, methods={"POST"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns an object"
     * )
     * @OA\Response(
     *     response=400,
     *     description="Validation failed",
     * )
     *
     * @OA\Tag(name="Societies")
     *
     * @param Request $request
     * @param ValidatorService $validator
     * @param ApiResponse $apiResponse
     * @param Society $obj
     * @param FileUploader $fileUploader
     * @param DataSociety $dataEntity
     * @return JsonResponse
     */
    public function update(Request $request, ValidatorService $validator, ApiResponse $apiResponse, Society $obj,
                           FileUploader $fileUploader, DataSociety $dataEntity): JsonResponse
    {
        return $this->submitForm("update", $obj, $request, $apiResponse, $validator, $dataEntity, $fileUploader);
    }

    /**
     * Delete a society
     *
     * @Route("/{id}", name="delete", options={"expose"=true}, methods={"DELETE"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Return message successful",
     * )
     *
     * @OA\Response(
     *     response=400,
     *     description="Cannot delete me",
     * )
     *
     * @OA\Tag(name="Societies")
     *
     * @param ApiResponse $apiResponse
     * @param Society $obj
     * @param FileUploader $fileUploader
     * @return JsonResponse
     */
    public function delete(ApiResponse $apiResponse, Society $obj, FileUploader $fileUploader): JsonResponse
    {
        $em = $this->doctrine->getManager();

        /** @var User $user */
        $user = $this->getUser();
        if ($obj === $user->getSociety()){
            return $apiResponse->apiJsonResponseBadRequest('Vous ne pouvez pas vous supprimer.');
        }

        $em->remove($obj);
        $em->flush();

        $fileUploader->deleteFile($obj->getLogo(), self::FOLDER_LOGOS);
        return $apiResponse->apiJsonResponseSuccessful("Supression réussie !");
    }

    /**
     * Delete a group of society
     *
     * @Route("/", name="delete_group", options={"expose"=true}, methods={"DELETE"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Return message successful",
     * )
     *
     * @OA\Response(
     *     response=400,
     *     description="Cannot delete me",
     * )
     *
     * @OA\Tag(name="Societies")
     *
     * @param Request $request
     * @param ApiResponse $apiResponse
     * @param FileUploader $fileUploader
     * @return JsonResponse
     */
    public function deleteGroup(Request $request, ApiResponse $apiResponse, FileUploader $fileUploader): JsonResponse
    {
        $em = $this->doctrine->getManager();
        $data = json_decode($request->getContent());

        /** @var User $user */
        $user = $this->getUser();

        $objs = $em->getRepository(Society::class)->findBy(['id' => $data]);

        $logos = [];
        if ($objs) {
            foreach ($objs as $obj) {
                if ($obj === $user->getSociety()) {
                    return $apiResponse->apiJsonResponseBadRequest('Vous ne pouvez pas vous supprimer.');
                }

                $logos[] = $obj->getLogo();

                $em->remove($obj);
            }
        }

        $em->flush();

        foreach($logos as $logo){
            $fileUploader->deleteFile($logo, self::FOLDER_LOGOS);
        }

        return $apiResponse->apiJsonResponseSuccessful("Supression de la sélection réussie !");
    }

    /**
     * Export list users
     *
     * @Route("/export/{format}", name="export", options={"expose"=true}, methods={"GET"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a new user object",
     * )
     *
     * @OA\Tag(name="Users")
     *
     * @param Export $export
     * @param $format
     * @return BinaryFileResponse
     */
    public function export(Export $export, $format): BinaryFileResponse
    {
        $em = $this->doctrine->getManager();
        $objs = $em->getRepository(Society::class)->findBy([], ['code' => 'ASC']);
        $data = [];

        $nameFile = 'societes';
        $nameFolder = 'export/';

        foreach ($objs as $obj) {
            $tmp = [
                $obj->getCode(),
                $obj->getName()
            ];
            if(!in_array($tmp, $data)){
                $data[] = $tmp;
            }
        }

        if($format == 'excel'){
            $fileName = $nameFile . '.xlsx';
            $header = array(array('Code', 'Raison sociale'));
        }else{
            $fileName = $nameFile . '.csv';
            $header = array(array('code', 'name'));

            header('Content-Type: application/csv');
            header('Content-Disposition: attachment; filename="'.$fileName.'"');
        }

        $export->createFile($format, 'Liste des ' . $nameFile, $fileName , $header, $data, 2, $nameFolder);
        return new BinaryFileResponse($this->getParameter('private_directory'). $nameFolder . $fileName);
    }
}
