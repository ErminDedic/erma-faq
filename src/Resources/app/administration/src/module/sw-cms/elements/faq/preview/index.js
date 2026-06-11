import template from './sw-cms-el-preview-faq.html.twig';
import './sw-cms-el-preview-faq.scss';

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
