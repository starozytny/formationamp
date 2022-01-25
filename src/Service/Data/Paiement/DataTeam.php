<?php


namespace App\Service\Data\Paiement;


use App\Entity\Formation\FoWorker;
use App\Entity\User;
use App\Service\Data\DataConstructor;

class DataTeam extends DataConstructor
{
    public function setData(FoWorker $obj, $data, User $user): FoWorker
    {
        return ($obj)
            ->setFirstname(ucfirst(trim($data->firstname)))
            ->setLastname(mb_strtoupper(trim($data->lastname)))
            ->setType((int) $data->type)
            ->setUser($user)
        ;
    }
}