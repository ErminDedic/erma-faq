<?php

declare(strict_types=1);

namespace Erma\Faq\Infrastructure\Entities\Faq;

use Erma\Faq\Infrastructure\Entities\Faq\Aggregate\FaqTranslation\FaqTranslationDefinition;
use Erma\Faq\Infrastructure\Entities\FaqCategory\FaqCategoryDefinition;
use Shopware\Core\Framework\DataAbstractionLayer\EntityDefinition;
use Shopware\Core\Framework\DataAbstractionLayer\Field\BoolField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\ApiAware;
use Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\PrimaryKey;
use Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\Required;
use Shopware\Core\Framework\DataAbstractionLayer\Field\FkField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\IdField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\ManyToOneAssociationField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\TranslatedField;
use Shopware\Core\Framework\DataAbstractionLayer\Field\TranslationsAssociationField;
use Shopware\Core\Framework\DataAbstractionLayer\FieldCollection;

class FaqDefinition extends EntityDefinition
{
    public const ENTITY_NAME = 'faq';

    public function getEntityName(): string
    {
        return self::ENTITY_NAME;
    }

    public function getEntityClass(): string
    {
        return FaqEntity::class;
    }

    public function getCollectionClass(): string
    {
        return FaqCollection::class;
    }

    protected function defineFields(): FieldCollection
    {
        return new FieldCollection([
            (new IdField('id', 'id'))
                ->addFlags(new PrimaryKey(), new Required()),

            new TranslatedField('question'),
            new TranslatedField('answer'),

            (new BoolField('active', 'active'))
                ->addFlags(new ApiAware()),

            (new FkField('faq_category_id', 'faqCategoryId', FaqCategoryDefinition::class))
                ->addFlags(new ApiAware()),

            (new ManyToOneAssociationField(
                'faqCategory',
                'faq_category_id',
                FaqCategoryDefinition::class,
                'id'
            ))->addFlags(new ApiAware()),

            (new TranslationsAssociationField(
                FaqTranslationDefinition::class,
                'faq_id'
            ))->addFlags(new Required()),
        ]);
    }
}
