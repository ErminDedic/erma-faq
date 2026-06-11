/**
 * @private
 * @sw-package discovery
 */
Shopware.Component.register('sw-cms-el-preview-faq-listing', () => import('./preview'));
/**
 * @private
 * @sw-package discovery
 */
Shopware.Component.register('sw-cms-el-config-faq-listing', () => import('./config'));
/**
 * @private
 * @sw-package discovery
 */
Shopware.Component.register('sw-cms-el-faq-listing', () => import('./component'));

/**
 * @private
 * @sw-package discovery
 */
Shopware.Service('cmsService').registerCmsElement({
    name: 'faq-listing',
    label: 'sw-cms.elements.faqListing.label',
    component: 'sw-cms-el-faq-listing',
    configComponent: 'sw-cms-el-config-faq-listing',
    previewComponent: 'sw-cms-el-preview-faq-listing',
    defaultConfig: {},
});
