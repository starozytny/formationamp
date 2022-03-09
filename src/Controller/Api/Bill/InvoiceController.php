<?php

namespace App\Controller\Api\Bill;

use App\Entity\Bill\BiInvoice;
use App\Entity\User;
use App\Service\ApiResponse;
use App\Service\Data\Bill\DataInvoice;
use App\Service\FileCreator;
use App\Service\ValidatorService;
use Doctrine\Common\Persistence\ManagerRegistry;
use Exception;
use Mpdf\MpdfException;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use OpenApi\Annotations as OA;

/**
 * @Route("/api/bill/invoices", name="api_bill_invoices_")
 */
class InvoiceController extends AbstractController
{
    private $doctrine;

    public function __construct(ManagerRegistry $doctrine)
    {
        $this->doctrine = $doctrine;
    }

    public function submitForm($type, BiInvoice $obj, Request $request, ApiResponse $apiResponse,
                               ValidatorService $validator, DataInvoice $dataEntity): JsonResponse
    {
        $em = $this->doctrine->getManager();
        $data = json_decode($request->getContent());

        if ($data === null) {
            return $apiResponse->apiJsonResponseBadRequest('Les données sont vides.');
        }

        $obj = $dataEntity->setDataInvoice($obj, $data);

        if($type == "create"){
            $obj->setNumero("Brouillon");
        }else{
            $obj->setUpdatedAt(new \DateTime());
        }

        $noErrors = $validator->validate($obj);
        if ($noErrors !== true) {
            return $apiResponse->apiJsonResponseValidationFailed($noErrors);
        }

        $em->persist($obj);
        $em->flush();

        return $apiResponse->apiJsonResponse($obj, BiInvoice::INVOICE_READ);
    }

    /**
     * @Route("/", name="create", options={"expose"=true}, methods={"POST"})
     *
     * @Security("is_granted('ROLE_ADMIN')")
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
     * @OA\Tag(name="Invoices")
     *
     * @param Request $request
     * @param ValidatorService $validator
     * @param ApiResponse $apiResponse
     * @param DataInvoice $dataEntity
     * @return JsonResponse
     */
    public function create(Request $request, ValidatorService $validator, ApiResponse $apiResponse, DataInvoice $dataEntity): JsonResponse
    {
        return $this->submitForm("create", new BiInvoice(), $request, $apiResponse, $validator, $dataEntity);
    }

    /**
     * @Route("/{id}", name="update", options={"expose"=true}, methods={"PUT"})
     *
     * @Security("is_granted('ROLE_ADMIN')")
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns an object"
     * )
     * @OA\Response(
     *     response=403,
     *     description="Forbidden for not good role or user",
     * )
     * @OA\Response(
     *     response=400,
     *     description="Validation failed",
     * )
     *
     * @OA\Tag(name="Invoices")
     *
     * @param Request $request
     * @param BiInvoice $obj
     * @param ValidatorService $validator
     * @param ApiResponse $apiResponse
     * @param DataInvoice $dataEntity
     * @return JsonResponse
     */
    public function update(Request $request, BiInvoice $obj, ValidatorService $validator,  ApiResponse $apiResponse, DataInvoice $dataEntity): JsonResponse
    {
        return $this->submitForm("update", $obj, $request, $apiResponse, $validator, $dataEntity);
    }

    /**
     * @Route("/status/{id}", name="status_delete", options={"expose"=true}, methods={"PUT"})
     *
     * @Security("is_granted('ROLE_ADMIN')")
     *
     * @OA\Response(
     *     response=200,
     *     description="Return message successful",
     * )
     * @OA\Response(
     *     response=403,
     *     description="Forbidden for not good role or user",
     * )
     *
     * @OA\Tag(name="Invoices")
     *
     * @param BiInvoice $obj
     * @param ApiResponse $apiResponse
     * @return JsonResponse
     */
    public function statusDelete(BiInvoice $obj, ApiResponse $apiResponse): JsonResponse
    {
        $em = $this->doctrine->getManager();
        $obj->setStatus(BiInvoice::STATUS_DELETED);

        $em->flush();

        return $apiResponse->apiJsonResponse($obj, BiInvoice::INVOICE_READ);
    }

    /**
     * @Route("/download/{id}", name="download", options={"expose"=true}, methods={"GET"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Return message successful",
     * )
     * @OA\Response(
     *     response=403,
     *     description="Forbidden for not good role or user",
     * )
     *
     * @OA\Tag(name="Invoices")
     *
     * @param BiInvoice $obj
     * @param FileCreator $fileCreator
     * @param ApiResponse $apiResponse
     * @return JsonResponse
     * @throws MpdfException
     * @throws Exception
     */
    public function download(BiInvoice $obj, FileCreator $fileCreator, ApiResponse $apiResponse): JsonResponse
    {
        $mpdf = $fileCreator->initPDF("Facture - " . $obj->getNumero());
        $mpdf = $fileCreator->addCustomStyle($mpdf, 'custom-facture.css');

        $mpdf = $fileCreator->writePDF($mpdf, "admin/pdf/invoice.html.twig", [
            'elem' => $obj,
        ]);

        $mpdf = $fileCreator->outputPDF($mpdf, "facture-" . $obj->getNumero() . '.pdf');

        return $apiResponse->apiJsonResponseSuccessful("ok");
    }
}
