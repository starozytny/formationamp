<?php


namespace App\Service\Data;


use App\Entity\Formation\FoFormation;
use App\Entity\Formation\FoSession;
use App\Service\SanitizeData;

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
        ;
    }

    public function setDataSession(FoSession $obj, $data): FoSession
    {
        $animator = $this->sanitizeData->sanitizeString($data->animator);

        dd($data);

        return ($obj)
            ->setAnimator($animator)
            ->setType((int) $data->type)
            ->setModTrav(trim($data->modTrav->html))
            ->setModEval(trim($data->modEval->html))
            ->setModPeda(trim($data->modPeda->html))
            ->setModAssi(trim($data->modAssi->html))
            ;
    }
}