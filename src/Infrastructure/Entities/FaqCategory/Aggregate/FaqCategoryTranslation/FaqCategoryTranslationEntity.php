<?php

declare(strict_types=1);

namespace Erma\Faq\Infrastructure\Entities\FaqCategory\Aggregate\FaqCategoryTranslation;

use Shopware\Core\Framework\DataAbstractionLayer\TranslationEntity;

class FaqCategoryTranslationEntity extends TranslationEntity
{
    protected ?string $name = null;

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(?string $name): void
    {
        $this->name = $name;
    }
}
