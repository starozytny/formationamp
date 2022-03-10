<?php

namespace App\Service\Registration;

use App\Entity\Fnaim\FnAgency;
use App\Entity\Formation\FoRegistration;
use App\Entity\Formation\FoSession;
use App\Entity\Formation\FoWorker;
use App\Entity\Paiement\PaOrder;
use App\Entity\User;
use App\Service\Data\Formation\DataRegistration;
use App\Service\Data\Paiement\DataPaiement;
use App\Service\ValidatorService;

class RegistrationService
{
    private $validator;
    private $dataPaiement;
    private $dataRegistration;

    public function __construct(ValidatorService $validator, DataPaiement $dataPaiement, DataRegistration $dataRegistration)
    {
        $this->validator = $validator;
        $this->dataPaiement = $dataPaiement;
        $this->dataRegistration = $dataRegistration;
    }

    public function createNameOrder(FoSession $session): string
    {
        $nameFormation = $session->getFormation()->getName();
        $dateFormation = $session->getFullDateHuman();
        $fullNameFormation = $nameFormation . " " . $dateFormation;
        return strlen($fullNameFormation) < 255 ? $fullNameFormation : $nameFormation . " #" . $session->getId();
    }

    /**
     * @param $type
     * @param $code
     * @param User $user
     * @param FnAgency $agency
     * @param FoSession $session
     * @param $nameOrder
     * @param $workers
     * @param $bank
     * @param $ip
     * @return PaOrder|array|bool
     */
    public function createOrder($type, $code, User $user, FnAgency $agency, FoSession $session, $nameOrder, $workers, $bank, $ip)
    {
        $dataOrder = $this->dataPaiement->createDataOrderJson($user, $type === "A" ? $bank : $agency, $session, $nameOrder, $workers, $bank);
        $order =  $this->dataPaiement->setDataOrder(new PaOrder(), $dataOrder, $user, $session, $type . $agency->getNumCompta(), $code, $ip);

        $noErrors = $this->validator->validate($order);
        if ($noErrors !== true) {
            return $noErrors;
        }

        return $order;
    }

    /**
     * @param User $user
     * @param FoSession $session
     * @param FoWorker $worker
     * @param PaOrder $order
     * @return FoRegistration|array|bool
     */
    public function createRegistration(User $user, FoSession $session, FoWorker $worker, PaOrder $order)
    {
        $obj = $this->dataRegistration->setData(new FoRegistration(), $user, $session, $worker, $order);
        $noErrors = $this->validator->validate($obj);
        if ($noErrors !== true) {
            return $noErrors;
        }

        return $obj;
    }

    /**
     * @param $em
     * @param $type
     * @param $code
     * @param User $user
     * @param FnAgency $agency
     * @param FoSession $session
     * @param $nameOrder
     * @param $workers
     * @param $bank
     * @param $ip
     * @return array
     */
    public function createOrderAndRegistration($em, $type, $code, User $user, FnAgency $agency, FoSession $session, $nameOrder, $workers, $bank, $ip): array
    {
        $order = $this->createOrder($type, $code, $user, $agency, $session, $nameOrder, $workers, $bank, $ip);
        if(!$order instanceof PaOrder){
            return ["code" => 0, "data" => $order];
        }
        $order->setNumGroup($user->getId().$code);
        $em->persist($order);

        foreach($workers as $worker){
            $obj = $this->createRegistration($user, $session, $worker, $order);
            if(!$obj instanceof FoRegistration){
                return ["code" => 0, "data" => $obj];
            }
            $em->persist($obj);
        }

        return ["code" => 1, "data" => $order];
    }
}
