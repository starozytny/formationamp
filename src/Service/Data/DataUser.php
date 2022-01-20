<?php


namespace App\Service\Data;


use App\Entity\Fnaim\FnAgency;
use App\Entity\User;
use App\Service\SanitizeData;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class DataUser
{
    private $sanitizeData;

    public function __construct(SanitizeData $sanitizeData)
    {
        $this->sanitizeData = $sanitizeData;
    }

    public function setData(User $obj, $data, FnAgency $agency): User
    {
        if (isset($data->roles)) {
            $obj->setRoles($data->roles);
        }

        $username = isset($data->username) ? $this->sanitizeData->fullSanitize($data->username) : $data->email;

        return ($obj)
            ->setUsername($username)
            ->setFirstname(ucfirst($this->sanitizeData->sanitizeString($data->firstname)))
            ->setLastname(mb_strtoupper($this->sanitizeData->sanitizeString($data->lastname)))
            ->setEmail($data->email)
            ->setAgency($agency)
        ;
    }

    public function setDataAgency(FnAgency $obj, $data): FnAgency
    {
        return ($obj)
            ->setName($this->sanitizeData->trimData($data->name))
            ->setPhone($this->sanitizeData->trimData($data->phone))
            ->setSiren($this->sanitizeData->trimData($data->siren))
            ->setGarantie($this->sanitizeData->trimData($data->garantie))
            ->setNumCompta($this->sanitizeData->trimData($data->numCompta))
            ->setNbFreeAca($this->sanitizeData->setToInteger($data->nbFreeAca, 0))
            ->setType($this->sanitizeData->setToInteger($data->type, FnAgency::TYPE_PRINCIPAL))
            ->setAddress($this->sanitizeData->trimData($data->address))
            ->setZipcode($this->sanitizeData->trimData($data->zipcode))
            ->setCity($this->sanitizeData->trimData($data->city))
            ->setFirstname($this->sanitizeData->trimData($data->firstname))
            ->setFirstname2($this->sanitizeData->trimData($data->firstname2))
            ->setFirstname3($this->sanitizeData->trimData($data->firstname3))
            ->setLastname($this->sanitizeData->trimData($data->lastname))
            ->setLastname2($this->sanitizeData->trimData($data->lastname2))
            ->setLastname3($this->sanitizeData->trimData($data->lastname3))
        ;
    }
}