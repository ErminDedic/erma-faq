/**
 * @private
 * @sw-package discovery
 */
Shopware.Component.register('sw-cms-preview-faq', () => import('./preview'));
/**
 * @private
 * @sw-package discovery
 */
Shopware.Component.register('sw-cms-block-faq', () => import('./component'));

/**
 * @private
 * @sw-package discovery
 */
Shopware.Service('cmsService').registerCmsBlock({
    name: 'faq',
    label: 'sw-cms.blocks.erma.faq.label',
    category: 'erma',
    component: 'sw-cms-block-faq',
    previewComponent: 'sw-cms-preview-faq',
    defaultConfig: {
        marginBottom: '20px',
        marginTop: '20px',
        marginLeft: null,
        marginRight: null,
        sizingMode: 'boxed',
    },
    slots: {
        faq: 'faq'
    },
});
