<?php

namespace App\Entity\Formation;

use App\Entity\DataEntity;
use App\Entity\Paiement\PaOrder;
use App\Repository\Formation\FoSessionRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Gedmo\Mapping\Annotation as Gedmo;

/**
 * @ORM\Entity(repositoryClass=FoSessionRepository::class)
 */
class FoSession extends DataEntity
{
    const TYPE_PRESENTIEL = 0;
    const TYPE_DISTANCE = 1;
    const TYPE_MIXTE = 2;

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"admin:read", "count:read"})
     */
    private $id;

    /**
     * @ORM\Column(type="date")
     * @Groups({"admin:read"})
     */
    private $start;

    /**
     * @ORM\Column(type="date", nullable=true)
     */
    private $end;

    /**
     * @ORM\Column(type="boolean")
     * @Groups({"admin:read"})
     */
    private $isPublished = false;

    /**
     * @ORM\Column(type="string", length=50, nullable=true)
     * @Groups({"admin:read"})
     */
    private $time;

    /**
     * @ORM\Column(type="string", length=50, nullable=true)
     * @Groups({"admin:read"})
     */
    private $time2;

    /**
     * @ORM\Column(type="float")
     * @Groups({"admin:read"})
     */
    private $priceHT;

    /**
     * @ORM\Column(type="float")
     * @Groups({"admin:read"})
     */
    private $priceTTC;

    /**
     * @ORM\Column(type="float")
     * @Groups({"admin:read"})
     */
    private $tva = 20;

    /**
     * @ORM\Column(type="string", length=50)
     * @Groups({"admin:read"})
     */
    private $duration;

    /**
     * @ORM\Column(type="string", length=50, nullable=true)
     * @Groups({"admin:read"})
     */
    private $duration2;

    /**
     * @ORM\Column(type="string", length=50)
     * @Groups({"admin:read"})
     */
    private $durationTotal;

    /**
     * @ORM\Column(type="string", length=50)
     * @Groups({"admin:read"})
     */
    private $durationByDay;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"admin:read"})
     */
    private $max;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"admin:read"})
     */
    private $min = 0;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"admin:read"})
     */
    private $animator;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"admin:read"})
     */
    private $address;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"admin:read"})
     */
    private $zipcode;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"admin:read"})
     */
    private $city;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"admin:read"})
     */
    private $type;

    /**
     * @ORM\Column(type="text", nullable=true)
     * @Groups({"admin:read"})
     */
    private $modTrav;

    /**
     * @ORM\Column(type="text", nullable=true)
     * @Groups({"admin:read"})
     */
    private $modEval;

    /**
     * @ORM\Column(type="text", nullable=true)
     * @Groups({"admin:read"})
     */
    private $modPeda;

    /**
     * @ORM\Column(type="text", nullable=true)
     * @Groups({"admin:read"})
     */
    private $modAssi;

    /**
     * @ORM\Column(type="string", length=255, unique=true)
     * @Gedmo\Slug(handlers={
     *      @Gedmo\SlugHandler(class="Gedmo\Sluggable\Handler\RelativeSlugHandler", options={
     *          @Gedmo\SlugHandlerOption(name="relationField", value="formation"),
     *          @Gedmo\SlugHandlerOption(name="relationSlugField", value="slug"),
     *          @Gedmo\SlugHandlerOption(name="separator", value="-"),
     *          @Gedmo\SlugHandlerOption(name="urilize", value="true"),
     *      })
     * }, updatable=true, fields={"animator"})
     * @Groups({"admin:read"})
     */
    private $slug;

    /**
     * @ORM\ManyToOne(targetEntity=FoFormation::class, fetch="EAGER", inversedBy="sessions")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"admin:read"})
     */
    private $formation;

    /**
     * @ORM\OneToMany(targetEntity=FoRegistration::class, mappedBy="session")
     * @Groups({"admin:read"})
     */
    private $registrations;

    /**
     * @ORM\OneToMany(targetEntity=PaOrder::class, mappedBy="session")
     */
    private $paOrders;

    public function __construct()
    {
        $this->registrations = new ArrayCollection();
        $this->paOrders = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @return string
     * @Groups({"admin:read"})
     */
    public function getFullDateHuman(): string
    {
        $start = $this->getFullDateString($this->start);
        $end = "";
        if($this->start && $this->end && $this->start != $this->end){
            return "du " . $start . " au " . $this->getFullDateString($this->end);
        }

        return $start . $end;
    }

    /**
     * @return string
     * @Groups({"admin:read"})
     */
    public function getFullDate(): string
    {
        $start = $this->getFullDateString($this->start);
        $end = "";
        if($this->end && $this->start != $this->end){
            $end = " - " . $this->getFullDateString($this->end);
        }

        return $start . $end;
    }

    /**
     * @return string|null
     * @Groups({"admin:read"})
     */
    public function getStartJavascript(): ?string
    {
        return $this->setDateJavascript($this->start);
    }

    public function getStart(): ?\DateTimeInterface
    {
        return $this->start;
    }

    public function setStart(\DateTimeInterface $start): self
    {
        $this->start = $start;

        return $this;
    }

    /**
     * @return string|null
     * @Groups({"admin:read"})
     */
    public function getEndJavascript(): ?string
    {
        return $this->setDateJavascript($this->end);
    }

    public function getEnd(): ?\DateTimeInterface
    {
        return $this->end;
    }

    public function setEnd(?\DateTimeInterface $end): self
    {
        $this->end = $end;

        return $this;
    }

    public function getIsPublished(): ?bool
    {
        return $this->isPublished;
    }

    public function setIsPublished(bool $isPublished): self
    {
        $this->isPublished = $isPublished;

        return $this;
    }

    public function getTime(): ?string
    {
        return $this->time;
    }

    public function setTime(?string $time): self
    {
        $this->time = $time;

        return $this;
    }

    public function getTime2(): ?string
    {
        return $this->time2;
    }

    public function setTime2(?string $time2): self
    {
        $this->time2 = $time2;

        return $this;
    }

    public function getPriceHT(): ?float
    {
        return $this->priceHT;
    }

    public function setPriceHT(float $priceHT): self
    {
        $this->priceHT = $priceHT;

        return $this;
    }

    public function getPriceTTC(): ?float
    {
        return $this->priceTTC;
    }

    public function setPriceTTC(float $priceTTC): self
    {
        $this->priceTTC = $priceTTC;

        return $this;
    }

    public function getTva(): ?float
    {
        return $this->tva;
    }

    public function setTva(float $tva): self
    {
        $this->tva = $tva;

        return $this;
    }

    public function getMax(): ?int
    {
        return $this->max;
    }

    public function setMax(int $max): self
    {
        $this->max = $max;

        return $this;
    }

    public function getMin(): ?int
    {
        return $this->min;
    }

    public function setMin(int $min): self
    {
        $this->min = $min;

        return $this;
    }

    public function getAnimator(): ?string
    {
        return $this->animator;
    }

    public function setAnimator(string $animator): self
    {
        $this->animator = $animator;

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

    public function setZipcode(?string $zipcode): self
    {
        $this->zipcode = $zipcode;

        return $this;
    }

    public function getCity(): ?string
    {
        return $this->city;
    }

    public function setCity(?string $city): self
    {
        $this->city = $city;

        return $this;
    }

    /**
     * @return string|null
     * @Groups({"admin:read"})
     */
    public function getTypeString(): ?string
    {
        $types = ["Présentiel", "Distance", "Mixte"];

        return $types[$this->type];
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

    public function getModTrav(): ?string
    {
        return $this->modTrav;
    }

    public function setModTrav(?string $modTrav): self
    {
        $this->modTrav = $modTrav;

        return $this;
    }

    public function getModEval(): ?string
    {
        return $this->modEval;
    }

    public function setModEval(?string $modEval): self
    {
        $this->modEval = $modEval;

        return $this;
    }

    public function getModPeda(): ?string
    {
        return $this->modPeda;
    }

    public function setModPeda(?string $modPeda): self
    {
        $this->modPeda = $modPeda;

        return $this;
    }

    public function getModAssi(): ?string
    {
        return $this->modAssi;
    }

    public function setModAssi(?string $modAssi): self
    {
        $this->modAssi = $modAssi;

        return $this;
    }

    public function getFormation(): ?FoFormation
    {
        return $this->formation;
    }

    public function setFormation(?FoFormation $formation): self
    {
        $this->formation = $formation;

        return $this;
    }

    public function getDuration(): ?string
    {
        return $this->duration;
    }

    public function setDuration(string $duration): self
    {
        $this->duration = $duration;

        return $this;
    }

    public function getDuration2(): ?string
    {
        return $this->duration2;
    }

    public function setDuration2(?string $duration2): self
    {
        $this->duration2 = $duration2;

        return $this;
    }

    public function getDurationTotal(): ?string
    {
        return $this->durationTotal;
    }

    public function setDurationTotal(string $durationTotal): self
    {
        $this->durationTotal = $durationTotal;

        return $this;
    }

    public function getDurationByDay(): ?string
    {
        return $this->durationByDay;
    }

    public function setDurationByDay(string $durationByDay): self
    {
        $this->durationByDay = $durationByDay;

        return $this;
    }


    public function getSlug(): ?string
    {
        return $this->slug;
    }

    public function setSlug(?string $slug): self
    {
        $this->slug = $slug;

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
            $registration->setSession($this);
        }

        return $this;
    }

    public function removeRegistration(FoRegistration $registration): self
    {
        if ($this->registrations->removeElement($registration)) {
            // set the owning side to null (unless already changed)
            if ($registration->getSession() === $this) {
                $registration->setSession(null);
            }
        }

        return $this;
    }

    public function getFullTime(): ?string
    {
        if($this->time && $this->time2){
            return "de " . $this->time . " à " . $this->time2;
        }

        if(!$this->time && !$this->time2){
            return null;
        }

        return $this->time ?: $this->time2;
    }

    /**
     * @return string
     * @Groups({"admin:read"})
     */
    public function getFullAddress(): string
    {
        return $this->getFullAddressString($this->address, $this->zipcode, $this->city);
    }

    /**
     * @return Collection|PaOrder[]
     */
    public function getPaOrders(): Collection
    {
        return $this->paOrders;
    }

    public function addPaOrder(PaOrder $paOrder): self
    {
        if (!$this->paOrders->contains($paOrder)) {
            $this->paOrders[] = $paOrder;
            $paOrder->setSession($this);
        }

        return $this;
    }

    public function removePaOrder(PaOrder $paOrder): self
    {
        if ($this->paOrders->removeElement($paOrder)) {
            // set the owning side to null (unless already changed)
            if ($paOrder->getSession() === $this) {
                $paOrder->setSession(null);
            }
        }

        return $this;
    }
}
