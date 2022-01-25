<?php

namespace App\Entity\Paiement;

use App\Entity\DataEntity;
use App\Entity\Formation\FoRegistration;
use App\Entity\Formation\FoSession;
use App\Entity\User;
use App\Repository\Paiement\PaOrderRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Exception;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=PaOrderRepository::class)
 */
class PaOrder extends DataEntity
{
    const STATUS_ATTENTE = 0;
    const STATUS_VALIDER = 1;
    const STATUS_TRAITER = 2;
    const STATUS_EXPIRER = 3;
    const STATUS_ANNULER = 4;

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"admin:read"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"admin:read"})
     */
    private $rum;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"admin:read"})
     */
    private $createdAt;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"admin:read"})
     */
    private $name;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"admin:read"})
     */
    private $status = self::STATUS_ATTENTE;

    /**
     * @ORM\Column(type="float")
     * @Groups({"admin:read"})
     */
    private $price;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"admin:read"})
     */
    private $email;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $code;

    /**
     * @ORM\Column(type="datetime")
     */
    private $codeAt;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"admin:read"})
     */
    private $participants = 1;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $address;

    /**
     * @ORM\Column(type="integer")
     */
    private $zipcode;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $city;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"admin:read"})
     */
    private $titulaire;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $iban;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"admin:read"})
     */
    private $bic;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $token;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $ip;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="paOrders")
     * @ORM\JoinColumn(nullable=false)
     */
    private $user;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $updatedAt;

    /**
     * @ORM\ManyToOne(targetEntity=PaLot::class, inversedBy="orders")
     */
    private $lot;

    /**
     * @ORM\OneToMany(targetEntity=FoRegistration::class, mappedBy="paOrder")
     */
    private $registrations;

    /**
     * @ORM\ManyToOne(targetEntity=FoSession::class, inversedBy="paOrders")
     * @ORM\JoinColumn(nullable=false)
     */
    private $session;

    /**
     * @throws Exception
     */
    public function __construct()
    {
        $this->createdAt = $this->initNewDate();
        $this->codeAt = $this->initNewDate();
        $this->token = $this->initToken();
        $this->registrations = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getRum(): ?string
    {
        return $this->rum;
    }

    public function setRum(string $rum): self
    {
        $this->rum = $rum;

        return $this;
    }

    /**
     * @return string|null
     * @Groups({"admin:read"})
     */
    public function getCreatedAtString(): ?string
    {
        return $this->getFullDateString($this->createdAt, 'lll');
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

    public function getPrice(): ?float
    {
        return $this->price;
    }

    public function setPrice(float $price): self
    {
        $this->price = $price;

        return $this;
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

    /**
     * @return string
     * @Groups({"admin:read"})
     */
    public function getStatusString(): string
    {
        $items = ["Attente", "Validé", "Traité", "Expiré", "Annulé"];

        return $items[$this->status];
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

    public function getTitulaire(): ?string
    {
        return $this->titulaire;
    }

    public function setTitulaire(string $titulaire): self
    {
        $this->titulaire = $titulaire;

        return $this;
    }

    /**
     * @return string
     * @Groups({"admin:read"})
     */
    public function getIbanHidden(): string
    {
        return $this->toFormatIbanHidden($this->iban);
    }

    public function getIban(): ?string
    {
        return $this->cryptBank('decrypt', $this->iban);
    }

    public function setIban(string $iban): self
    {
        $this->iban = $this->cryptBank('encrypt', $iban);

        return $this;
    }

    public function getBic(): ?string
    {
        return $this->cryptBank('decrypt', $this->bic);
    }

    public function setBic(string $bic): self
    {
        $this->bic = $this->cryptBank('encrypt', $bic);

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getCode(): ?string
    {
        return $this->code;
    }

    public function setCode(string $code): self
    {
        $this->code = $code;

        return $this;
    }

    public function getParticipants(): ?int
    {
        return $this->participants;
    }

    public function setParticipants(int $participants): self
    {
        $this->participants = $participants;

        return $this;
    }

    public function getToken(): ?string
    {
        return $this->token;
    }

    public function setToken(string $token): self
    {
        $this->token = $token;

        return $this;
    }

    public function getIp(): ?string
    {
        return $this->cryptBank('decrypt', $this->ip);
    }

    public function setIp(?string $ip): self
    {
        $this->ip = $this->cryptBank('encrypt', $ip);

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

    public function getZipcode(): ?int
    {
        return $this->zipcode;
    }

    public function setZipcode(int $zipcode): self
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

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

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

    public function getCodeAt(): ?\DateTimeInterface
    {
        return $this->codeAt;
    }

    public function setCodeAt(\DateTimeInterface $codeAt): self
    {
        $this->codeAt = $codeAt;

        return $this;
    }

    public function getLot(): ?PaLot
    {
        return $this->lot;
    }

    public function setLot(?PaLot $lot): self
    {
        $this->lot = $lot;

        return $this;
    }

    /**
     * @return Collection|FoRegistration[]
     */
    public function getRegistrations(): Collection
    {
        return $this->registrations;
    }

    public function addRegistration(FoRegistration $registration): self
    {
        if (!$this->registrations->contains($registration)) {
            $this->registrations[] = $registration;
            $registration->setPaOrder($this);
        }

        return $this;
    }

    public function removeRegistration(FoRegistration $registration): self
    {
        if ($this->registrations->removeElement($registration)) {
            // set the owning side to null (unless already changed)
            if ($registration->getPaOrder() === $this) {
                $registration->setPaOrder(null);
            }
        }

        return $this;
    }

    public function getSession(): ?FoSession
    {
        return $this->session;
    }

    public function setSession(?FoSession $session): self
    {
        $this->session = $session;

        return $this;
    }
}
