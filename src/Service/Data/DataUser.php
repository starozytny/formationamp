<?php


namespace App\Service\Data;


use App\Entity\Society;
use App\Entity\Fnaim\FnAgency;
use App\Entity\User;
use App\Service\SanitizeData;
use Doctrine\ORM\EntityManagerInterface;
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

        $society = $this->em->getRepository(Society::class)->find($data->society);

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
        $name = $this->sanitizeData->trimData($data->name);
        $numCompta = $this->sanitizeData->trimData($data->numCompta);
        $numCompta = $numCompta ?: "411" . ($name ? mb_strtoupper(substr($name, 0, 5)) : "");

        return ($obj)
            ->setName($name)
            ->setPhone($this->sanitizeData->trimData($data->phone))
            ->setSiren($this->sanitizeData->trimData($data->siren))
            ->setGarantie($this->sanitizeData->trimData($data->garantie))
            ->setNumCompta($numCompta)
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