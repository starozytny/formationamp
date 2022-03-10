<?php

namespace App\Controller\Api\Paiement;

use App\Entity\Formation\FoRegistration;
use App\Entity\Paiement\PaLot;
use App\Entity\Paiement\PaOrder;
use App\Entity\User;
use App\Service\ApiResponse;
use App\Service\Data\DataService;
use App\Service\Data\Paiement\DataPaiement;
use App\Service\FileCreator;
use App\Service\Registration\RegistrationService;
use Doctrine\Common\Persistence\ManagerRegistry;
use Exception;
use Mpdf\MpdfException;
use OpenApi\Annotations as OA;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Filesystem\Exception\IOExceptionInterface;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/api/orders", name="api_orders_")
 */
class OrderController extends AbstractController
{
    private $doctrine;

    public function __construct(ManagerRegistry $doctrine)
    {
        $this->doctrine = $doctrine;
    }

    /**
     * @Security("is_granted('ROLE_DEVELOPER')")
     *
     * @Route("/{id}", name="delete", options={"expose"=true}, methods={"DELETE"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Return message successful",
     * )
     *
     * @OA\Tag(name="Orders")
     *
     * @param PaOrder $obj
     * @param DataService $dataService
     * @param RegistrationService $registrationService
     * @return JsonResponse
     */
    public function delete(PaOrder $obj, DataService $dataService, RegistrationService $registrationService): JsonResponse
    {
        $em = $this->doctrine->getManager();
        $registrations = $em->getRepository(FoRegistration::class)->findBy(['paOrder' => $obj->getId()]);
        $registrationService->cancelRegistrationsFromOrder($registrations, $obj);
        return $dataService->delete($obj);
    }

    /**
     * @Security("is_granted('ROLE_DEVELOPER')")
     *
     * @Route("/", name="delete_group", options={"expose"=true}, methods={"DELETE"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Return message successful",
     * )
     *
     * @OA\Tag(name="Orders")
     *
     * @param Request $request
     * @param ApiResponse $apiResponse
     * @param RegistrationService $registrationService
     * @return JsonResponse
     */
    public function deleteSelected(Request $request, ApiResponse $apiResponse, RegistrationService $registrationService): JsonResponse
    {
        $em = $this->doctrine->getManager();


        $objs = $em->getRepository(PaOrder::class)->findBy(['id' => json_decode($request->getContent())]);
        $registrations = $em->getRepository(FoRegistration::class)->findBy(['paOrder' => $objs]);

        if ($objs) {
            foreach ($objs as $obj) {
                $registrationService->cancelRegistrationsFromOrder($registrations, $obj);
                $em->remove($obj);
            }
        }

        $em->flush();
        return $apiResponse->apiJsonResponseSuccessful("Supression de la sélection réussie !");
    }

    /**
     * @Route("/cancel/{id}", name="cancel", options={"expose"=true}, methods={"POST"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Return message successful",
     * )
     *
     * @OA\Tag(name="Orders")
     *
     * @param PaOrder $obj
     * @param ApiResponse $apiResponse
     * @param DataService $dataService
     * @param RegistrationService $registrationService
     * @return JsonResponse
     */
    public function cancel(PaOrder $obj, ApiResponse $apiResponse, DataService $dataService, RegistrationService $registrationService): JsonResponse
    {
        $em = $this->doctrine->getManager();

        $registrations = $em->getRepository(FoRegistration::class)->findBy(['paOrder' => $obj->getId()]);
        $registrationService->cancelRegistrationsFromOrder($registrations, $obj);

        $obj->setStatus(PaOrder::STATUS_ANNULER);
        $obj->setUpdatedAt($dataService->createDate());
        $em->flush();

        return $apiResponse->apiJsonResponse($obj, User::ADMIN_READ);
    }

    /**
     * Refresh codeAt of an order for validation
     *
     * @Security("is_granted('ROLE_ADMIN')")
     *
     * @Route("/refresh/{id}", name="refresh", options={"expose"=true}, methods={"POST"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Return message successful",
     * )
     *
     * @OA\Tag(name="Orders")
     *
     * @param PaOrder $obj
     * @param ApiResponse $apiResponse
     * @param DataService $dataService
     * @return JsonResponse
     */
    public function refresh(PaOrder $obj, ApiResponse $apiResponse, DataService $dataService): JsonResponse
    {
        $em = $this->doctrine->getManager();

        $objs = $em->getRepository(PaOrder::class)->findBy(['numGroup' => $obj->getNumGroup()]);

        $newDate = $dataService->createDate();
        foreach($objs as $item){
            $item->setCodeAt($newDate);
            $item->setUpdatedAt($newDate);
        }

        $em->flush();

        return $apiResponse->apiJsonResponse($obj, User::ADMIN_READ);
    }

    /**
     * Process an order
     *
     * @Security("is_granted('ROLE_ADMIN')")
     *
     * @Route("/process", name="process", options={"expose"=true}, methods={"POST"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Return message successful",
     * )
     *
     * @OA\Tag(name="Orders")
     *
     * @param Request $request
     * @param ApiResponse $apiResponse
     * @param DataService $dataService
     * @param DataPaiement $dataEntity
     * @return BinaryFileResponse|JsonResponse
     */
    public function process(Request $request, ApiResponse $apiResponse, DataService $dataService, DataPaiement $dataEntity)
    {
        $em = $this->doctrine->getManager();
        $data = json_decode($request->getContent());
        $id = $data->id;

        if($id == "all"){
            $objs = $em->getRepository(PaOrder::class)->findBy(['status' => PaOrder::STATUS_VALIDER]);
        }else{
            $objs = $em->getRepository(PaOrder::class)->findBy(['id' => $data->id, 'status' => PaOrder::STATUS_VALIDER]);
        }

        $orders = []; $total = 0; $nbOrders = 0;
        foreach($objs as $obj){
            if($obj->getPrice() > 0){
                $orders[] = $obj;
                $total += $obj->getPrice();
                $nbOrders++;
            }
        }

        $code = time();

        $fsObject = new Filesystem();
        $filename = "paiement-" . $code .".xml";

        $path = $dataEntity->getPaiementDirectory();
        $new_file_path = $dataEntity->getFile($filename);

        try {
            if (!$fsObject->exists($path)){
                $old = umask(0);
                $fsObject->mkdir($path, 0775);
                umask($old);
            }
        } catch (IOExceptionInterface $exception) {
            echo "Error creating directory at ". $exception->getPath();
        }

        try {
            if(count($orders) <= 0){
                return $apiResponse->apiJsonResponseBadRequest("Il n'y a pas d'ordres à traiter.");
            }

            if(file_exists($new_file_path)){
                unlink($new_file_path);
            }

            $fsObject->touch($new_file_path);
            $fsObject->chmod($new_file_path, 0777);

            $msgId = time() . '000' . mt_rand(10000, 99999);
            $dateNow = $dataService->createDate();
            $titulaire = $this->getParameter('creancier.titulaire');
            $iban = $this->getParameter('creancier.iban');
            $bic = $this->getParameter('creancier.bic');
            $schmedId = $this->getParameter('creancier.schmedid');

            $fsObject->dumpFile($new_file_path, $this->renderView('admin/xml/paiements.xml.twig', array(
                'orders' => $orders,
                'msgId' => $msgId,
                'NbOfTxs' => $nbOrders,
                'total' => $total,
                'createdAt' => $dateNow,
                'dateEcheance' => $dateNow,
                'creancier_titulaire' => $titulaire,
                'creancier_iban' => $iban,
                'creancier_bic' => $bic,
                'creancier_schmeId' => $schmedId
            )));

            $lot = (new PaLot())
                ->setMsgId($msgId)
                ->setNbOfTxs($nbOrders)
                ->setTotal($total)
                ->setDatePaiement($dateNow)
                ->setTitulaire($titulaire)
                ->setIban($iban)
                ->setBic($bic)
                ->setSchmedId($schmedId)
                ->setFilename($filename)
            ;

            foreach($orders as $order){
                $order->setStatus(PaOrder::STATUS_TRAITER);
                $order->setUpdatedAt($dateNow);
                $lot->addOrder($order);
            }

            $em->persist($lot);
            $em->flush();
        } catch (IOExceptionInterface $exception) {
            echo "Error creating file at ". $exception->getPath();
        }

        return new BinaryFileResponse($new_file_path);
    }

    /**
     * Generate mandat de prélèvement
     *
     * @Route("/mandat-prelevement/{id}", name="mandat", options={"expose"=true}, methods={"GET"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a message",
     * )
     *
     * @OA\Tag(name="Lots")
     *
     * @param PaOrder $obj
     * @param FileCreator $fileCreator
     * @param ApiResponse $apiResponse
     * @return JsonResponse
     * @throws MpdfException
     * @throws Exception
     */
    public function mandat(PaOrder $obj, FileCreator $fileCreator, ApiResponse $apiResponse): JsonResponse
    {
        $mpdf = $fileCreator->initPDF("Mandat de prélèvement SEPA -" . $obj->getRum());

        $mpdf = $fileCreator->writePDF($mpdf, "user/pdf/mandat.html.twig", [
            'elem' => $obj,
        ]);

        $mpdf = $fileCreator->outputPDF($mpdf, "mandat-prelevement-sepa-" . $obj->getRum() . '.pdf');

        return $apiResponse->apiJsonResponseSuccessful("ok");
    }
}
