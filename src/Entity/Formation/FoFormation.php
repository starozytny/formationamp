<?php

namespace App\Entity\Formation;

use App\Entity\DataEntity;
use App\Repository\Formation\FoFormationRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=FoFormationRepository::class)
 */
class FoFormation extends DataEntity
{
    const FOLDER_FORMATION = "formations";
    const ACCESSIBILITY_NO_HANDI = 0;
    const ACCESSIBILITY_HANDI = 1;

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
    private $name;

    /**
     * @ORM\Column(type="string", length=255, unique=true)
     * @Gedmo\Slug(updatable=true, fields={"name"})
     * @Groups({"admin:read"})
     */
    private $slug;

    /**
     * @ORM\Column(type="boolean")
     * @Groups({"admin:read"})
     */
    private $isPublished = true;

    /**
     * @ORM\Column(type="float", nullable=true)
     * @Groups({"admin:read"})
     */
    private $rating;

    /**
     * @ORM\Column(type="text")
     * @Groups({"admin:read"})
     */
    private $content;

    /**
     * @ORM\Column(type="text", nullable=true)
     * @Groups({"admin:read"})
     */
    private $prerequis;

    /**
     * @ORM\Column(type="text", nullable=true)
     * @Groups({"admin:read"})
     */
    private $goals;

    /**
     * @ORM\Column(type="text", nullable=true)
     * @Groups({"admin:read"})
     */
    private $aptitudes;

    /**
     * @ORM\Column(type="text", nullable=true)
     * @Groups({"admin:read"})
     */
    private $skills;

    /**
     * @ORM\Column(type="text", nullable=true)
     * @Groups({"admin:read"})
     */
    private $target;

    /**
     * @ORM\Column(type="text", nullable=true)
     * @Groups({"admin:read"})
     */
    private $cat;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"admin:read"})
     */
    private $accessibility = 0;

    /**
     * @ORM\Column(type="datetime")
     */
    private $createdAt;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $updatedAt;

    /**
     * @ORM\OneToMany(targetEntity=FoSession::class, mappedBy="formation")
     */
    private $sessions;

    /**
     * @ORM\OneToMany(targetEntity=FoRegistration::class, mappedBy="formation")
     */
    private $registrations;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"admin:read"})
     */
    private $programme;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"admin:read"})
     */
    private $support;

    /**
     * @ORM\Column(type="json", nullable=true)
     * @Groups({"admin:read"})
     */
    private $categories = [];

    public function __construct()
    {
        $this->createdAt = $this->initNewDate();
        $this->sessions = new ArrayCollection();
        $this->registrations = new ArrayCollection();
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

    public function getSlug(): ?string
    {
        return $this->slug;
    }

    public function setSlug(?string $slug): self
    {
        $this->slug = $slug;

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

    /**
     * How long ago a user was added.
     *
     * @return string
     * @Groups({"admin:read"})
     */
    public function getCreatedAtAgo(): string
    {
        return $this->getHowLongAgo($this->createdAt);
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

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(string $content): self
    {
        $this->content = $content;

        return $this;
    }

    public function getRating(): ?float
    {
        return $this->rating;
    }

    public function setRating(?float $rating): self
    {
        $this->rating = $rating;

        return $this;
    }

    public function getPrerequis(): ?string
    {
        return $this->prerequis;
    }

    public function setPrerequis(?string $prerequis): self
    {
        $this->prerequis = $prerequis;

        return $this;
    }

    public function getGoals(): ?string
    {
        return $this->goals;
    }

    public function setGoals(?string $goals): self
    {
        $this->goals = $goals;

        return $this;
    }

    public function getAptitudes(): ?string
    {
        return $this->aptitudes;
    }

    public function setAptitudes(?string $aptitudes): self
    {
        $this->aptitudes = $aptitudes;

        return $this;
    }

    public function getSkills(): ?string
    {
        return $this->skills;
    }

    public function setSkills(?string $skills): self
    {
        $this->skills = $skills;

        return $this;
    }

    public function getTarget(): ?string
    {
        return $this->target;
    }

    public function setTarget(?string $target): self
    {
        $this->target = $target;

        return $this;
    }

    public function getCat(): ?string
    {
        return $this->cat;
    }

    public function setCat(?string $cat): self
    {
        $this->cat = $cat;

        return $this;
    }

    public function getAccessibility(): ?int
    {
        return $this->accessibility;
    }

    public function setAccessibility(int $accessibility): self
    {
        $this->accessibility = $accessibility;

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

    /**
     * @return Collection|FoSession[]
     */
    public function getSessions(): Collection
    {
        return $this->sessions;
    }

    public function addSession(FoSession $session): self
    {
        if (!$this->sessions->contains($session)) {
            $this->sessions[] = $session;
            $session->setFormation($this);
        }

        return $this;
    }

    public function removeSession(FoSession $session): self
    {
        if ($this->sessions->removeElement($session)) {
            // set the owning side to null (unless already changed)
            if ($session->getFormation() === $this) {
                $session->setFormation(null);
            }
        }

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
            $registration->setFormation($this);
        }

        return $this;
    }

    public function removeRegistration(FoRegistration $registration): self
    {
        if ($this->registrations->removeElement($registration)) {
            // set the owning side to null (unless already changed)
            if ($registration->getFormation() === $this) {
                $registration->setFormation(null);
            }
        }

        return $this;
    }

    public function getProgramme(): ?string
    {
        return $this->programme;
    }

    public function setProgramme(?string $programme): self
    {
        $this->programme = $programme;

        return $this;
    }

    public function getSupport(): ?string
    {
        return $this->support;
    }

    public function setSupport(?string $support): self
    {
        $this->support = $support;

        return $this;
    }

    /**
     * @return string
     * @Groups({"admin:read"})
     */
    public function getProgrammeFile(): string
    {
        return $this->programme ? "/". self::FOLDER_FORMATION ."/" . $this->programme : "";
    }

    /**
     * @return string
     * @Groups({"admin:read"})
     */
    public function getSupportFile(): string
    {
        return $this->support ? "/". self::FOLDER_FORMATION ."/" . $this->support : "";
    }

    public function getCategories(): ?array
    {
        return $this->categories;
    }

    public function setCategories(?array $categories): self
    {
        $this->categories = $categories;

        return $this;
    }

    public function getAccessibilityString(): string
    {
        $values = ["Bâtiment non conforme", "Bâtiment conforme"];

        return $values[$this->accessibility];
    }
}
