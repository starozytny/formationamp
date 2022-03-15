<?php


namespace App\Service\Data\Formation;


use App\Entity\Formation\FoFormation;
use App\Entity\Formation\FoSession;
use App\Service\Data\DataConstructor;

class DataFormation extends DataConstructor
{
    public function setData(FoFormation $obj, $data): FoFormation
    {
        $name = $this->sanitizeData->sanitizeString($data->name);

        return ($obj)
            ->setName($name)
            ->setSlug(null)
            ->setContent(trim($data->content->html))
            ->setPrerequis(trim($data->prerequis->html))
            ->setGoals(trim($data->goals->html))
            ->setAptitudes(trim($data->aptitudes->html))
            ->setSkills(trim($data->skills->html))
            ->setTarget(trim($data->target->html))
            ->setCat(trim($data->cat->html))
            ->setAccessibility((int) $data->accessibility)
            ->setCategories($data->categories)
            ->setIsAca((int) $data->isAca)
        ;
    }

    public function setDataSession(FoFormation $formation, FoSession $obj, $data): FoSession
    {
        $animator = $this->sanitizeData->sanitizeString($data->animator);
        $start = $this->sanitizeData->createDateFromString($data->start);
        $end = $this->sanitizeData->createDateFromString($data->end, "Europe/Paris", $start);

        return ($obj)
            ->setSlug(null)
            ->setFormation($formation)
            ->setAnimator($animator)
            ->setType((int) $data->type)
            ->setStart($start)
            ->setEnd($end)
            ->setTime($data->time ? trim($data->time) : null)
            ->setTime2($data->time2 ? trim($data->time2) : null)
            ->setDuration(trim($data->duration))
            ->setDuration2(trim($data->duration2))
            ->setDurationTotal(trim($data->durationTotal))
            ->setDurationByDay(trim($data->durationByDay))
            ->setPriceHT((float) $data->priceHt)
            ->setPriceTTC((float) $data->priceTtc)
            ->setTva((float) $data->tva)
            ->setMin((int) $data->min)
            ->setMax((int) $data->max)
            ->setAddress(trim($data->address))
            ->setZipcode($data->zipcode ? trim($data->zipcode) : null)
            ->setCity($data->city ? trim($data->city) : null)
            ->setModTrav($data->modTrav->html ? trim($data->modTrav->html) : null)
            ->setModEval($data->modEval->html ? trim($data->modEval->html) : null)
            ->setModPeda($data->modPeda->html ? trim($data->modPeda->html) : null)
            ->setModAssi($data->modAssi->html ? trim($data->modAssi->html) : null)
            ->setIsAca($formation->getIsAca())
        ;
    }
}
