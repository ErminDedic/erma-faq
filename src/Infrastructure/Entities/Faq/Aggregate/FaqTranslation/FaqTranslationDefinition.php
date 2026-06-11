<?php

declare(strict_types=1);

namespace Erma\Faq\Infrastructure\Entities\Faq\Aggregate\FaqTranslation;

use Erma\Faq\Infrastructure\Entities\Faq\FaqDefinition;
use Shopware\Core\Framework\DataAbstractionLayer\EntityTranslationDefinition;
use Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\Required;
use Shopware\Core\Framework\DataAbstractionLayer\Field\LongTextField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\StringField;
use Shopware\Core\Framework\DataAbstractionLayer\FieldCollection;

class FaqTranslationDefinition extends EntityTranslationDefinition
{
    public const ENTITY_NAME = 'faq_translation';

    public function getEntityName(): string
    {
        return self::ENTITY_NAME;
    }

    public function getEntityClass(): string
    {
        return FaqTranslationEntity::class;
    }

    public function getCollectionClass(): string
    {
        return FaqTranslationCollection::class;
    }

    public function getParentDefinitionClass(): string
    {
        return FaqDefinition::class;
    }

    protected function defineFields(): FieldCollection
    {
        return new FieldCollection([
            (new StringField('question', 'question'))
                ->addFlags(new Required()),

            (new LongTextField('answer', 'answer'))
                ->addFlags(new Required()),
        ]);
    }
}
