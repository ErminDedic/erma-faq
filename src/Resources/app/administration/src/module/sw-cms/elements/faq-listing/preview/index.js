import template from './sw-cms-el-preview-faq-listing.html.twig';
import './sw-cms-el-preview-faq-listing.scss';

const { Mixin } = Shopware;

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
