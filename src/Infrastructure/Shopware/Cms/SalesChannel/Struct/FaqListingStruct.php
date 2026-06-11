<?php

declare(strict_types=1);

namespace Erma\Faq\Infrastructure\Shopware\Cms\SalesChannel\Struct;

use Erma\Faq\Infrastructure\Entities\Faq\FaqCollection;
use Erma\Faq\Infrastructure\Entities\FaqCategory\FaqCategoryCollection;
use Shopware\Core\Framework\Log\Package;
use Shopware\Core\Framework\Struct\Struct;

#[Package('discovery')]
class FaqListingStruct extends Struct
{
    protected ?FaqCollection $faqs = null;

    protected ?FaqCategoryCollection $categories = null;

    public function getFaqs(): ?FaqCollection
    {
        return $this->faqs;
    }

    public function setFaqs(?FaqCollection $faqs): void
    {
        $this->faqs = $faqs;
    }

    public function getCategories(): ?FaqCategoryCollection
    {
        return $this->categories;
    }

    public function setCategories(?FaqCategoryCollection $categories): void
    {
        $this->categories = $categories;
    }

    public function getApiAlias(): string
    {
        return 'cms_faq_listing';
    }
}
