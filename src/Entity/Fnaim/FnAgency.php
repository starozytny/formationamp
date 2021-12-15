<?php

namespace App\Entity\Fnaim;

use App\Repository\Fnaim\FnAgencyRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=FnAgencyRepository::class)
 */
class FnAgency
{
    const TYPE_PRINCIPAL = 0;
    const TYPE_SUCCU = 1;

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $name;

    /**
     * @ORM\Column(type="string", length=60, nullable=true)
     */
    private $phone;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $numCompta;

    /**
     * @ORM\Column(type="integer")
     */
    private $type = self::TYPE_PRINCIPAL;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $lastname;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $firstname;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $lastname2;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $firstname2;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $lastname3;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $firstname3;

    /**
     * @ORM\Column(type="integer")
     */
    private $nbFreeAca = 0;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $siren;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $garantie;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $address;

    /**
     * @ORM\Column(type="string", length=10)
     */
    private $zipcode;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $city;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getPhone(): ?string
    {
        return $this->phone;
    }

    public function setPhone(?string $phone): self
    {
        $this->phone = $phone;

        return $this;
    }

    public function getNumCompta(): ?string
    {
        return $this->numCompta;
    }

    public function setNumCompta(?string $numCompta): self
    {
        $this->numCompta = $numCompta;

        return $this;
    }

    public function getType(): ?int
    {
        return $this->type;
    }

    public function setType(int $type): self
    {
        $this->type = $type;

        return $this;
    }

    public function getLastname(): ?string
    {
        return $this->lastname;
    }

    public function setLastname(string $lastname): self
    {
        $this->lastname = $lastname;

        return $this;
    }

    public function getFirstname(): ?string
    {
        return $this->firstname;
    }

    public function setFirstname(string $firstname): self
    {
        $this->firstname = $firstname;

        return $this;
    }

    public function getLastname2(): ?string
    {
        return $this->lastname2;
    }

    public function setLastname2(?string $lastname2): self
    {
        $this->lastname2 = $lastname2;

        return $this;
    }

    public function getFirstname2(): ?string
    {
        return $this->firstname2;
    }

    public function setFirstname2(?string $firstname2): self
    {
        $this->firstname2 = $firstname2;

        return $this;
    }

    public function getLastname3(): ?string
    {
        return $this->lastname3;
    }

    public function setLastname3(?string $lastname3): self
    {
        $this->lastname3 = $lastname3;

        return $this;
    }

    public function getFirstname3(): ?string
    {
        return $this->firstname3;
    }

    public function setFirstname3(?string $firstname3): self
    {
        $this->firstname3 = $firstname3;

        return $this;
    }

    public function getNbFreeAca(): ?int
    {
        return $this->nbFreeAca;
    }

    public function setNbFreeAca(int $nbFreeAca): self
    {
        $this->nbFreeAca = $nbFreeAca;

        return $this;
    }

    public function getSiren(): ?string
    {
        return $this->siren;
    }

    public function setSiren(?string $siren): self
    {
        $this->siren = $siren;

        return $this;
    }

    public function getGarantie(): ?string
    {
        return $this->garantie;
    }

    public function setGarantie(?string $garantie): self
    {
        $this->garantie = $garantie;

        return $this;
    }

    public function getAddress(): ?string
    {
        return $this->address;
    }

    public function setAddress(string $address): self
    {
        $this->address = $address;

        return $this;
    }

    public function getZipcode(): ?string
    {
        return $this->zipcode;
    }

    public function setZipcode(string $zipcode): self
    {
        $this->zipcode = $zipcode;

        return $this;
    }

    public function getCity(): ?string
    {
        return $this->city;
    }

    public function setCity(string $city): self
    {
        $this->city = $city;

        return $this;
    }
}
