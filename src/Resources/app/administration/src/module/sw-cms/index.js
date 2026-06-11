import './blocks/erma/faq';
import './blocks/erma/faq-listing';
import './elements/faq';
import './elements/faq-listing';

Shopware.Service('cmsService').registerCmsBlockCategory({
    name: 'erma',
    label: 'sw-cms.blocks.erma.label',
});
