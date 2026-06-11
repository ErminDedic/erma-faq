import template from './sw-cms-preview-faq.html.twig';
import './sw-cms-preview-faq.scss';

/**
 * @private
 * @sw-package discovery
 */
export default {
    template,

    computed: {
        assetFilter() {
            return Shopware.Filter.getByName('asset');
        },
    },
};
