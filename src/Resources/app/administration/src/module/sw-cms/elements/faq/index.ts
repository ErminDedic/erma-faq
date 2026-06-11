/**
 * @private
 * @sw-package discovery
 */
Shopware.Component.register('sw-cms-el-preview-faq', () => import('./preview'));
/**
 * @private
 * @sw-package discovery
 */
Shopware.Component.register('sw-cms-el-config-faq', () => import('./config'));
/**
 * @private
 * @sw-package discovery
 */
Shopware.Component.register('sw-cms-el-faq', () => import('./component'));

/**
 * @private
 * @sw-package discovery
 */
Shopware.Service('cmsService').registerCmsElement({
    name: 'faq',
    label: 'sw-cms.elements.faq.label',
    component: 'sw-cms-el-faq',
    configComponent: 'sw-cms-el-config-faq',
    previewComponent: 'sw-cms-el-preview-faq',
    defaultConfig: {
        title: {
            source: 'static',
            value: '',
        },
        faqs: {
            source: 'static',
            value: [],
            entity: {
                name: 'faq',
                criteria: new Shopware.Data.Criteria(1, 25)
                    .addAssociation('faqCategory')
                    .addAssociation('translations')
                    .addFilter(Shopware.Data.Criteria.equals('active', true)),
            },
        },
        items: {
            source: 'static',
            value: [],
        },
    },
    // Same as core entity elements (e.g. product-slider): inheritance context is required for
    // reliable translation hydration in the CMS preview when the administration is built for production.
    collect: Shopware.Service('cmsService').getCollectFunction(),
});
