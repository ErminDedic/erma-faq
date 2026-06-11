<?php

declare(strict_types=1);

namespace Erma\Faq\Infrastructure\Entities\Faq\Aggregate\FaqTranslation;

use Shopware\Core\Framework\DataAbstractionLayer\TranslationEntity;

class FaqTranslationEntity extends TranslationEntity
{
    protected ?string $question = null;
    protected ?string $answer = null;

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
}
