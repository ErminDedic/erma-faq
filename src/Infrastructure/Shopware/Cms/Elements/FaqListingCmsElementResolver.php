<?php

declare(strict_types=1);

namespace Erma\Faq\Infrastructure\Shopware\Cms\Elements;

use Erma\Faq\Infrastructure\Entities\Faq\FaqCollection;
use Erma\Faq\Infrastructure\Entities\Faq\FaqDefinition;
use Erma\Faq\Infrastructure\Entities\FaqCategory\FaqCategoryCollection;
use Erma\Faq\Infrastructure\Entities\FaqCategory\FaqCategoryDefinition;
use Erma\Faq\Infrastructure\Shopware\Cms\SalesChannel\Struct\FaqListingStruct;
use Shopware\Core\Content\Cms\Aggregate\CmsSlot\CmsSlotEntity;
use Shopware\Core\Content\Cms\DataResolver\CriteriaCollection;
use Shopware\Core\Content\Cms\DataResolver\Element\AbstractCmsElementResolver;
use Shopware\Core\Content\Cms\DataResolver\Element\ElementDataCollection;
use Shopware\Core\Content\Cms\DataResolver\ResolverContext\ResolverContext;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\EqualsFilter;
use Shopware\Core\Framework\DataAbstractionLayer\Search\EntitySearchResult;
use Shopware\Core\Framework\Log\Package;

#[Package('discovery')]
class FaqListingCmsElementResolver extends AbstractCmsElementResolver
{
    public function getType(): string
    {
        return 'faq-listing';
    }

    public function collect(CmsSlotEntity $slot, ResolverContext $resolverContext): ?CriteriaCollection
    {
        // Collect criteria for all active FAQs
        $faqCriteria = new Criteria();
        $faqCriteria->addAssociation('faqCategory');
        $faqCriteria->addAssociation('translations');
        $faqCriteria->addFilter(new EqualsFilter('active', true));

        // Collect criteria for all categories
        $categoryCriteria = new Criteria();
        $categoryCriteria->addAssociation('translations');

        $criteriaCollection = new CriteriaCollection();
        $criteriaCollection->add('faqs_' . $slot->getUniqueIdentifier(), FaqDefinition::class, $faqCriteria);
        $criteriaCollection->add('categories_' . $slot->getUniqueIdentifier(), FaqCategoryDefinition::class, $categoryCriteria);

        return $criteriaCollection;
    }

    public function enrich(CmsSlotEntity $slot, ResolverContext $resolverContext, ElementDataCollection $result): void
    {
        $data = new FaqListingStruct();
        $slot->setData($data);

        // Load FAQs
        $faqsResult = $result->get('faqs_' . $slot->getUniqueIdentifier());
        if ($faqsResult instanceof EntitySearchResult) {
            $faqs = $faqsResult->getEntities();
            if ($faqs instanceof FaqCollection) {
                $data->setFaqs($faqs);
            }
        }

        // Load Categories
        $categoriesResult = $result->get('categories_' . $slot->getUniqueIdentifier());
        if ($categoriesResult instanceof EntitySearchResult) {
            $categories = $categoriesResult->getEntities();
            if ($categories instanceof FaqCategoryCollection) {
                $data->setCategories($categories);
            }
        }
    }
}
