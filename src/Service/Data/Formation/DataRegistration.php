<?php

namespace App\Service\Data\Formation;

use App\Entity\Formation\FoRegistration;
use App\Entity\Formation\FoSession;
use App\Entity\Formation\FoWorker;
use App\Entity\Paiement\PaOrder;
use App\Entity\User;

class DataRegistration
{
    public function setData(FoRegistration $obj, User $user, FoSession $session, FoWorker $worker, PaOrder $order): FoRegistration
    {
        return ($obj)
            ->setUser($user)
            ->setFormation($session->getFormation())
            ->setSession($session)
            ->setWorker($worker)
            ->setPaOrder($order)
        ;
    }
}
