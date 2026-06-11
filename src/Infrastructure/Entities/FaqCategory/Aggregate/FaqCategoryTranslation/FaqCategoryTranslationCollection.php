<?php

declare(strict_types=1);

namespace Erma\Faq\Infrastructure\Entities\FaqCategory\Aggregate\FaqCategoryTranslation;

use Shopware\Core\Framework\DataAbstractionLayer\EntityCollection;

/**
 * @extends EntityCollection<FaqCategoryTranslationEntity>
 *
 * @method void add(FaqCategoryTranslationEntity $entity)
 * @method void set(string $key, FaqCategoryTranslationEntity $entity)
 * @method FaqCategoryTranslationEntity[] getIterator()
 * @method FaqCategoryTranslationEntity[] getElements()
 * @method FaqCategoryTranslationEntity|null get(string $key)
 * @method FaqCategoryTranslationEntity|null first()
 * @method FaqCategoryTranslationEntity|null last()
 */
class FaqCategoryTranslationCollection extends EntityCollection
{
    protected function getExpectedClass(): string
    {
        return FaqCategoryTranslationEntity::class;
    }
}
