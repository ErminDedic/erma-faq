<?php

declare(strict_types=1);

namespace Erma\Faq\Infrastructure\Shopware\Cms\SalesChannel\Struct;

use Erma\Faq\Infrastructure\Entities\Faq\FaqCollection;
use Shopware\Core\Framework\Log\Package;
use Shopware\Core\Framework\Struct\Struct;

#[Package('discovery')]
class FaqStruct extends Struct
{
    protected ?FaqCollection $faqs = null;

    public function getFaqs(): ?FaqCollection
    {
        return $this->faqs;
    }

    public function setFaqs(?FaqCollection $faqs): void
    {
        $this->faqs = $faqs;
    }

    public function getApiAlias(): string
    {
        return 'cms_faq';
    }
}
