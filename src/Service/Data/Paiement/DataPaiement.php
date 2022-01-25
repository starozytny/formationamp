<?php

namespace App\Service\Data\Paiement;

use App\Entity\Formation\FoSession;
use App\Entity\Paiement\PaOrder;
use App\Entity\User;

class DataPaiement
{
    private $privateDirectory;

    public function __construct($privateDirectory)
    {
        $this->privateDirectory = $privateDirectory;
    }

    /**
     * @param PaOrder $obj
     * @param $data
     * @param User $user
     * @param $rum
     * @param $code
     * @param $ip
     * @return PaOrder
     */
    public function setDataOrder(PaOrder $obj, $data, User $user, FoSession $session, $rum, $code, $ip): PaOrder
    {
        return ($obj)
            ->setRum($rum)
            ->setPrice((float) $data->price)
            ->setName(trim($data->name))
            ->setTitulaire(trim($data->titulaire))
            ->setIban(trim($data->iban))
            ->setBic(trim($data->bic))
            ->setEmail(trim($data->email))
            ->setCode($code)
            ->setParticipants((int) $data->participants)
            ->setIp($ip)
            ->setAddress(trim($data->address))
            ->setZipcode((int) $data->zipcode)
            ->setCity(trim($data->city))
            ->setUser($user)
            ->setSession($session)
        ;
    }

    /**
     * @param $filename
     * @return string
     */
    public function getFile($filename): string
    {
        $path = $this->getPrivateDirectory() . "paiements";
        return $path . "/" .$filename;
    }

    /**
     * @return string
     */
    public function getPaiementDirectory(): string
    {
        return $this->getPrivateDirectory() . "paiements";
    }

    protected function getPrivateDirectory()
    {
        return $this->privateDirectory;
    }
}