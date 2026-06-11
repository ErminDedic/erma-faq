<?php

declare(strict_types=1);

namespace Erma\Faq\Infrastructure\Entities\FaqCategory;

use Erma\Faq\Infrastructure\Entities\Faq\FaqDefinition;
use Erma\Faq\Infrastructure\Entities\FaqCategory\Aggregate\FaqCategoryTranslation\FaqCategoryTranslationDefinition;
use Shopware\Core\Framework\DataAbstractionLayer\EntityDefinition;
use Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\PrimaryKey;
use Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\Required;
use Shopware\Core\Framework\DataAbstractionLayer\Field\IdField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\OneToManyAssociationField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\TranslatedField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\TranslationsAssociationField;
use Shopware\Core\Framework\DataAbstractionLayer\FieldCollection;

class FaqCategoryDefinition extends EntityDefinition
{
    public const ENTITY_NAME = 'faq_category';

    public function getEntityName(): string
    {
        return self::ENTITY_NAME;
    }

    public function getEntityClass(): string
    {
        return FaqCategoryEntity::class;
    }

    public function getCollectionClass(): string
    {
        return FaqCategoryCollection::class;
    }

    protected function defineFields(): FieldCollection
    {
        return new FieldCollection([
            (new IdField('id', 'id'))
                ->addFlags(new PrimaryKey(), new Required()),

            new TranslatedField('name'),

            (new TranslationsAssociationField(
                FaqCategoryTranslationDefinition::class,
                'faq_category_id'
            ))->addFlags(new Required()),

            (new OneToManyAssociationField(
                'faqs',
                FaqDefinition::class,
                'faq_category_id'
            )),
        ]);
    }
}
