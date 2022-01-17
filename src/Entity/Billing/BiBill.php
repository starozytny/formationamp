<?php

namespace App\Entity\Billing;

use App\Repository\Billing\BiBillRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=BiBillRepository::class)
 */
class BiBill
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=20)
     */
    private $identifiant;

    /**
     * @ORM\Column(type="integer")
     */
    private $status;

    /**
     * @ORM\Column(type="boolean")
     */
    private $isPaid;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $paidAt;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    private $paidChoice;

    /**
     * @ORM\Column(type="string", length=60)
     */
    private $referenceClient;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    private $numTvaClient;

    /**
     * @ORM\Column(type="datetime")
     */
    private $createdAt;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $updatedAt;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getIdentifiant(): ?string
    {
        return $this->identifiant;
    }

    public function setIdentifiant(string $identifiant): self
    {
        $this->identifiant = $identifiant;

        return $this;
    }

    public function getStatus(): ?int
    {
        return $this->status;
    }

    public function setStatus(int $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getIsPaid(): ?bool
    {
        return $this->isPaid;
    }

    public function setIsPaid(bool $isPaid): self
    {
        $this->isPaid = $isPaid;

        return $this;
    }

    public function getPaidAt(): ?\DateTimeInterface
    {
        return $this->paidAt;
    }

    public function setPaidAt(?\DateTimeInterface $paidAt): self
    {
        $this->paidAt = $paidAt;

        return $this;
    }

    public function getPaidChoice(): ?int
    {
        return $this->paidChoice;
    }

    public function setPaidChoice(?int $paidChoice): self
    {
        $this->paidChoice = $paidChoice;

        return $this;
    }

    public function getReferenceClient(): ?string
    {
        return $this->referenceClient;
    }

    public function setReferenceClient(string $referenceClient): self
    {
        $this->referenceClient = $referenceClient;

        return $this;
    }

    public function getNumTvaClient(): ?int
    {
        return $this->numTvaClient;
    }

    public function setNumTvaClient(?int $numTvaClient): self
    {
        $this->numTvaClient = $numTvaClient;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeInterface $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeInterface
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(?\DateTimeInterface $updatedAt): self
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }
}
