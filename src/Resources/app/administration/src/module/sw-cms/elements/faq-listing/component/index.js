import template from './sw-cms-el-faq-listing.html.twig';
import './sw-cms-el-faq-listing.scss';

const { Mixin } = Shopware;

/**
 * @private
 * @sw-package discovery
 */
export default {
    template,

    mixins: [
        Mixin.getByName('cms-element'),
    ],

    created() {
        this.createdComponent();
    },

    methods: {
        createdComponent() {
            this.initElementConfig('faq-listing');
        },
    },
};
