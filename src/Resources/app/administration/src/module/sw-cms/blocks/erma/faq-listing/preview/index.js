import template from './sw-cms-preview-faq-listing.html.twig';
import './sw-cms-preview-faq-listing.scss';

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
