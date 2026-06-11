<?php

declare(strict_types=1);

namespace Erma\Faq\Infrastructure\Entities\Faq;

use Erma\Faq\Infrastructure\Entities\FaqCategory\FaqCategoryEntity;
use Shopware\Core\Framework\DataAbstractionLayer\Entity;
use Shopware\Core\Framework\DataAbstractionLayer\EntityIdTrait;

class FaqEntity extends Entity
{
    use EntityIdTrait;

    protected ?string $question = null;
    protected ?string $answer = null;
    protected bool $active = false;
    protected ?string $faqCategoryId = null;
    protected ?FaqCategoryEntity $faqCategory = null;

    public function getQuestion(): ?string
    {
        return $this->question;
    }

    public function setQuestion(?string $question): void
    {
        $this->question = $question;
    }

    public function getAnswer(): ?string
    {
        return $this->answer;
    }

    public function setAnswer(?string $answer): void
    {
        $this->answer = $answer;
    }

    public function getActive(): bool
    {
        return $this->active;
    }

    public function setActive(bool $active): void
    {
        $this->active = $active;
    }

    public function getFaqCategoryId(): ?string
    {
        return $this->faqCategoryId;
    }

    public function setFaqCategoryId(?string $faqCategoryId): void
    {
        $this->faqCategoryId = $faqCategoryId;
    }

    public function getFaqCategory(): ?FaqCategoryEntity
    {
        return $this->faqCategory;
    }

    public function setFaqCategory(?FaqCategoryEntity $faqCategory): void
    {
        $this->faqCategory = $faqCategory;
    }
}
