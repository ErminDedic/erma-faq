/**
 * @private
 * @sw-package discovery
 */
Shopware.Component.register('sw-cms-preview-faq-listing', () => import('./preview'));
/**
 * @private
 * @sw-package discovery
 */
Shopware.Component.register('sw-cms-block-faq-listing', () => import('./component'));

/**
 * @private
 * @sw-package discovery
 */
Shopware.Service('cmsService').registerCmsBlock({
    name: 'faq-listing',
    label: 'sw-cms.blocks.erma.faqListing.label',
    category: 'erma',
    component: 'sw-cms-block-faq-listing',
    previewComponent: 'sw-cms-preview-faq-listing',
    defaultConfig: {
        marginBottom: '20px',
        marginTop: '20px',
        marginLeft: null,
        marginRight: null,
        sizingMode: 'boxed',
    },
    slots: {
        faqListing: 'faq-listing'
    },
});
