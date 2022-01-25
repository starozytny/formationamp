<?php

namespace App\Controller\Api\Paiement;

use App\Entity\Paiement\PaLot;
use App\Service\ApiResponse;
use App\Service\Data\DataService;
use App\Service\Data\Paiement\DataPaiement;
use App\Service\FileCreator;
use Doctrine\Common\Persistence\ManagerRegistry;
use Exception;
use Mpdf\MpdfException;
use OpenApi\Annotations as OA;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/api/lots", name="api_lots_")
 */
class LotController extends AbstractController
{
    private $doctrine;

    public function __construct(ManagerRegistry $doctrine)
    {
        $this->doctrine = $doctrine;
    }

    /**
     * Developer - Delete a lot
     *
     * @Security("is_granted('ROLE_DEVELOPER')")
     *
     * @Route("/{id}", name="delete", options={"expose"=true}, methods={"DELETE"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Return message successful",
     * )
     *
     * @OA\Tag(name="Lots")
     *
     * @param PaLot $obj
     * @param DataService $dataService
     * @return JsonResponse
     */
    public function delete(PaLot $obj, DataService $dataService): JsonResponse
    {
        return $dataService->delete($obj);
    }

    /**
     * Developer - Delete a group of lot
     *
     * @Security("is_granted('ROLE_DEVELOPER')")
     *
     * @Route("/", name="delete_group", options={"expose"=true}, methods={"DELETE"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Return message successful",
     * )
     *
     * @OA\Tag(name="Lots")
     *
     * @param Request $request
     * @param DataService $dataService
     * @return JsonResponse
     */
    public function deleteSelected(Request $request, DataService $dataService): JsonResponse
    {
        return $dataService->deleteSelected(PaLot::class, json_decode($request->getContent()));
    }

    /**
     * Get file
     *
     * @Security("is_granted('ROLE_ADMIN')")
     *
     * @Route("/{id}", name="file", options={"expose"=true}, methods={"GET"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Return message successful",
     * )
     *
     * @OA\Tag(name="Lots")
     *
     * @param PaLot $obj
     * @param DataPaiement $dataEntity
     * @return BinaryFileResponse
     */
    public function getFile(PaLot $obj, DataPaiement $dataEntity): BinaryFileResponse
    {
        return new BinaryFileResponse($dataEntity->getFile($obj->getFilename()));
    }

    /**
     * Generate bordereau
     *
     * @Route("/bordereau/{id}", name="bordereau", options={"expose"=true}, methods={"GET"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a message",
     * )
     *
     * @OA\Tag(name="Lots")
     *
     * @param PaLot $obj
     * @param FileCreator $fileCreator
     * @param ApiResponse $apiResponse
     * @return JsonResponse
     * @throws MpdfException
     * @throws Exception
     */
    public function bordereau(PaLot $obj, FileCreator $fileCreator, ApiResponse $apiResponse): JsonResponse
    {
        $mpdf = $fileCreator->initPDF("Bordereau-" . $obj->getMsgId());
        $mpdf = $fileCreator->addCustomStyle($mpdf, "bordereau.css");

        $mpdf = $fileCreator->writePDF($mpdf, "admin/pdf/bordereau.html.twig", [
            'elem' => $obj,
        ]);

        $mpdf = $fileCreator->outputPDF($mpdf, "bordereau-" . $obj->getMsgId() . '.pdf');

        return $apiResponse->apiJsonResponseSuccessful("ok");
    }
}
