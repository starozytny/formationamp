<?php

namespace App\Entity\Paiement;

use App\Entity\DataEntity;
use App\Entity\User;
use App\Repository\Paiement\PaBankRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass=PaBankRepository::class)
 */
class PaBank extends DataEntity
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank
     */
    private $titulaire;

    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank
     */
    private $iban;

    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank
     */
    private $bic;

    /**
     * @ORM\Column(type="boolean")
     */
    private $isMain = false;

    /**
     * @ORM\Column(type="datetime")
     */
    private $createdAt;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $updatedAt;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="paBanks")
     * @ORM\JoinColumn(nullable=false)
     */
    private $user;

    public function __construct()
    {
        $this->createdAt = $this->initNewDate();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitulaire(): ?string
    {
        return $this->titulaire;
    }

    public function setTitulaire(string $titulaire): self
    {
        $this->titulaire = $titulaire;

        return $this;
    }

    public function getIban(): ?string
    {
        return $this->cryptBank('decrypt', $this->iban);
    }

    public function setIban(string $iban): self
    {
        $iban = trim($iban);
        $iban = preg_replace('/\s+/', '', $iban);
        $this->iban = $this->cryptBank('encrypt', $iban);

        return $this;
    }

    public function getBic(): ?string
    {
        return $this->cryptBank('decrypt', $this->bic);
    }

    public function setBic(string $bic): self
    {
        $bic = trim($bic);
        $bic = preg_replace('/\s+/', '', $bic);
        $this->bic = $this->cryptBank('encrypt', $bic);

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
        $updatedAt->setTimezone(new \DateTimeZone("Europe/Paris"));
        $this->updatedAt = $updatedAt;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }

    public function getIsMain(): ?bool
    {
        return $this->isMain;
    }

    public function setIsMain(bool $isMain): self
    {
        $this->isMain = $isMain;

        return $this;
    }
}
