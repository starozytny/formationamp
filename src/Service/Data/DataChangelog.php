<?php

namespace App\Service\Data;

use App\Entity\Changelog;

class DataChangelog extends DataConstructor
{
    public function setData(Changelog $obj, $data): Changelog
    {
        return ($obj)
            ->setName($this->sanitizeData->trimData($data->name))
            ->setType($this->sanitizeData->setToZeroIfEmpty($data->type))
            ->setContent($this->sanitizeData->trimData($data->content->html))
        ;
    }
}