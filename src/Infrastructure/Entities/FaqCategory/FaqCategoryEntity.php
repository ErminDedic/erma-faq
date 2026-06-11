<?php

declare(strict_types=1);

namespace Erma\Faq\Infrastructure\Entities\FaqCategory;

use Erma\Faq\Infrastructure\Entities\Faq\FaqCollection;
use Shopware\Core\Framework\DataAbstractionLayer\Entity;
use Shopware\Core\Framework\DataAbstractionLayer\EntityIdTrait;

class FaqCategoryEntity extends Entity
{
    use EntityIdTrait;

    protected ?string $name = null;
    protected ?FaqCollection $faqs = null;

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(?string $name): void
    {
        $this->name = $name;
    }

    public function getFaqs(): ?FaqCollection
    {
        return $this->faqs;
    }

    public function setFaqs(?FaqCollection $faqs): void
    {
        $this->faqs = $faqs;
    }
}
