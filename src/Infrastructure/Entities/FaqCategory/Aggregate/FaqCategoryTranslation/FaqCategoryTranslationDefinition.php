<?php

declare(strict_types=1);

namespace Erma\Faq\Infrastructure\Entities\FaqCategory\Aggregate\FaqCategoryTranslation;

use Erma\Faq\Infrastructure\Entities\FaqCategory\FaqCategoryDefinition;
use Shopware\Core\Framework\DataAbstractionLayer\EntityTranslationDefinition;
use Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\Required;
use Shopware\Core\Framework\DataAbstractionLayer\Field\StringField;
use Shopware\Core\Framework\DataAbstractionLayer\FieldCollection;

class FaqCategoryTranslationDefinition extends EntityTranslationDefinition
{
    public const ENTITY_NAME = 'faq_category_translation';

    public function getEntityName(): string
    {
        return self::ENTITY_NAME;
    }

    public function getEntityClass(): string
    {
        return FaqCategoryTranslationEntity::class;
    }

    public function getCollectionClass(): string
    {
        return FaqCategoryTranslationCollection::class;
    }

    public function getParentDefinitionClass(): string
    {
        return FaqCategoryDefinition::class;
    }

    protected function defineFields(): FieldCollection
    {
        return new FieldCollection([
            (new StringField('name', 'name'))
                ->addFlags(new Required()),
        ]);
    }
}
