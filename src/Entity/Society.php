<?php

namespace App\Entity;

use App\Entity\Bill\BiInvoice;
use App\Repository\SocietyRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=SocietyRepository::class)
 */
class Society extends DataEntity
{
    const FOLDER_LOGOS = "societies/logos";

    const COUNT_READ = ["count-users:read"];

    const FORME_EURL = 0;
    const FORME_SARL = 1;
    const FORME_SA = 2;
    const FORME_SNC = 3;
    const FORME_SAS = 4;

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"admin:read", "count-users:read"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"admin:read"})
     */
    private $name;

    /**
     * @ORM\Column(type="integer", unique=true)
     * @Groups({"admin:read"})
     */
    private $code;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"admin:read"})
     */
    private $logo;

    /**
     * @ORM\OneToMany(targetEntity=User::class, mappedBy="society")
     */
    private $users;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"admin:read"})
     */
    private $siren;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"admin:read"})
     */
    private $siret;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"admin:read"})
     */
    private $rcs;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"admin:read"})
     */
    private $numeroTva;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"admin:read"})
     */
    private $forme;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $email;

    /**
     * @ORM\Column(type="string", length=60, nullable=true)
     */
    private $phone1;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"admin:read"})
     */
    private $address;

    /**
     * @ORM\Column(type="string", length=20)
     * @Groups({"admin:read"})
     */
    private $zipcode;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"admin:read"})
     */
    private $city;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"admin:read"})
     */
    private $complement;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $country = "France";

    /**
     * @ORM\Column(type="integer")
     */
    private $counterBill = 0;

    /**
     * @ORM\OneToMany(targetEntity=BiInvoice::class, mappedBy="society")
     */
    private $biInvoices;

    public function __construct()
    {
        $this->users = new ArrayCollection();
        $this->biInvoices = new ArrayCollection();
    }

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

    /**
     * @return string
     * @Groups({"admin:read"})
     */
    public function getCodeString(): string
    {
        $code = $this->code;
        if($code < 10){
            return "000" . $code;
        }elseif($code < 100){
            return "00" . $code;
        }elseif($code < 1000){
            return "0" . $code;
        }

        return $code;
    }

    public function getCode(): ?int
    {
        return $this->code;
    }

    public function setCode(int $code): self
    {
        $this->code = $code;

        return $this;
    }

    /**
     * @return Collection|User[]
     */
    public function getUsers(): Collection
    {
        return $this->users;
    }

    public function addUser(User $user): self
    {
        if (!$this->users->contains($user)) {
            $this->users[] = $user;
            $user->setSociety($this);
        }

        return $this;
    }

    public function removeUser(User $user): self
    {
        if ($this->users->removeElement($user)) {
            // set the owning side to null (unless already changed)
            if ($user->getSociety() === $this) {
                $user->setSociety(null);
            }
        }

        return $this;
    }

    public function getLogo(): ?string
    {
        return $this->logo;
    }

    public function setLogo(?string $logo): self
    {
        $this->logo = $logo;

        return $this;
    }

    /**
     * @return string
     * @Groups({"admin:read"})
     */
    public function getFullname(): string
    {
        return "#" . $this->getCodeString() . " - " . $this->name;
    }

    /**
     * @return string
     * @Groups({"admin:read"})
     */
    public function getLogoFile(): string
    {
        return $this->getFileOrDefault($this->logo, self::FOLDER_LOGOS, "/placeholders/society.jpg");
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

    public function getSiret(): ?string
    {
        return $this->siret;
    }

    public function setSiret(?string $siret): self
    {
        $this->siret = $siret;

        return $this;
    }

    public function getRcs(): ?string
    {
        return $this->rcs;
    }

    public function setRcs(?string $rcs): self
    {
        $this->rcs = $rcs;

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

    public function getForme(): ?int
    {
        return $this->forme;
    }

    public function setForme(int $forme): self
    {
        $this->forme = $forme;

        return $this;
    }

    public function getNumeroTva(): ?string
    {
        return $this->numeroTva;
    }

    public function setNumeroTva(?string $numeroTva): self
    {
        $this->numeroTva = $numeroTva;

        return $this;
    }

    /**
     * @return string
     * @Groups({"admin:read"})
     */
    public function getFormeString(): string
    {
        $values = ["EURL", "SARL", "SA", "SNC", "SAS"];

        return $values[$this->forme];
    }

    public function getComplement(): ?string
    {
        return $this->complement;
    }

    public function setComplement(?string $complement): self
    {
        $this->complement = $complement;

        return $this;
    }

    public function getCountry(): ?string
    {
        return $this->country;
    }

    public function setCountry(?string $country): self
    {
        $this->country = $country;

        return $this;
    }

    public function getPhone1(): ?string
    {
        return $this->phone1;
    }

    public function setPhone1(?string $phone1): self
    {
        $this->phone1 = $phone1;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(?string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getCounterBill(): ?int
    {
        return $this->counterBill;
    }

    public function setCounterBill(int $counterBill): self
    {
        $this->counterBill = $counterBill;

        return $this;
    }

    /**
     * @return Collection<int, BiInvoice>
     */
    public function getBiInvoices(): Collection
    {
        return $this->biInvoices;
    }

    public function addBiInvoice(BiInvoice $biInvoice): self
    {
        if (!$this->biInvoices->contains($biInvoice)) {
            $this->biInvoices[] = $biInvoice;
            $biInvoice->setSociety($this);
        }

        return $this;
    }

    public function removeBiInvoice(BiInvoice $biInvoice): self
    {
        if ($this->biInvoices->removeElement($biInvoice)) {
            // set the owning side to null (unless already changed)
            if ($biInvoice->getSociety() === $this) {
                $biInvoice->setSociety(null);
            }
        }

        return $this;
    }
}
