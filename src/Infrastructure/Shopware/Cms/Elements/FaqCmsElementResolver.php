<?php

declare(strict_types=1);

namespace Erma\Faq\Infrastructure\Shopware\Cms\Elements;

use Erma\Faq\Infrastructure\Entities\Faq\FaqCollection;
use Erma\Faq\Infrastructure\Entities\Faq\FaqDefinition;
use Erma\Faq\Infrastructure\Shopware\Cms\SalesChannel\Struct\FaqStruct;
use Shopware\Core\Content\Cms\Aggregate\CmsSlot\CmsSlotEntity;
use Shopware\Core\Content\Cms\DataResolver\CriteriaCollection;
use Shopware\Core\Content\Cms\DataResolver\Element\AbstractCmsElementResolver;
use Shopware\Core\Content\Cms\DataResolver\Element\ElementDataCollection;
use Shopware\Core\Content\Cms\DataResolver\ResolverContext\ResolverContext;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;
use Shopware\Core\Framework\DataAbstractionLayer\Search\EntitySearchResult;
use Shopware\Core\Framework\Log\Package;

#[Package('discovery')]
class FaqCmsElementResolver extends AbstractCmsElementResolver
{
    public function getType(): string
    {
        return 'faq';
    }

    public function collect(CmsSlotEntity $slot, ResolverContext $resolverContext): ?CriteriaCollection
    {
        $faqsConfig = $slot->getFieldConfig()->get('faqs');

        if (!$faqsConfig || !$faqsConfig->isStatic()) {
            return null;
        }

        $faqIds = $faqsConfig->getValue();
        if (!is_array($faqIds) || count($faqIds) === 0) {
            return null;
        }

        /** @var array<string> $faqIds */
        $criteria = new Criteria($faqIds);
        $criteria->addAssociation('faqCategory');
        $criteria->addAssociation('translations');

        $criteriaCollection = new CriteriaCollection();
        $criteriaCollection->add('faqs_' . $slot->getUniqueIdentifier(), FaqDefinition::class, $criteria);

        return $criteriaCollection;
    }

    public function enrich(CmsSlotEntity $slot, ResolverContext $resolverContext, ElementDataCollection $result): void
    {
        $data = new FaqStruct();
        $slot->setData($data);

        $faqsConfig = $slot->getFieldConfig()->get('faqs');
        if (!$faqsConfig || !$faqsConfig->isStatic()) {
            return;
        }

        $searchResult = $result->get('faqs_' . $slot->getUniqueIdentifier());
        if (!$searchResult instanceof EntitySearchResult) {
            return;
        }

        $faqs = $searchResult->getEntities();
        if ($faqs instanceof FaqCollection) {
            $data->setFaqs($faqs);
        }
    }
}
