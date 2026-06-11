import template from './sw-cms-el-config-faq.html.twig';

const { Mixin } = Shopware;
const { Criteria, EntityCollection } = Shopware.Data;

/**
 * @param {unknown} rawValue
 * @returns {string[]}
 */
function normalizeFaqConfigIds(rawValue) {
    if (!Array.isArray(rawValue)) {
        return [];
    }

    return rawValue
        .map((entry) => {
            if (typeof entry === 'string') {
                return entry;
            }
            if (entry && typeof entry === 'object' && 'id' in entry && typeof entry.id === 'string') {
                return entry.id;
            }

            return null;
        })
        .filter((id) => typeof id === 'string' && id.length > 0);
}

/**
 * @private
 * @sw-package discovery
 */
export default {
    template,

    emits: ['element-update'],

    inject: [
        'feature',
        'repositoryFactory',
    ],

    mixins: [
        Mixin.getByName('cms-element'),
    ],

    data() {
        return {
            selectedFaqsCollection: null,
        };
    },

    created() {
        this.createdComponent();
    },

    computed: {
        faqItems() {
            return this.element.config?.items?.value ?? [];
        },

        faqRepository() {
            return this.repositoryFactory.create('faq');
        },

        faqCriteria() {
            const criteria = new Criteria(1, 25);
            criteria.addAssociation('faqCategory');
            criteria.addAssociation('translations');
            criteria.addFilter(Criteria.equals('active', true));

            return criteria;
        },

        customTextEditorButtons() {
            // Return empty array - custom buttons can be added here if needed
            // For themes, it's safer to avoid importing core components directly
            return [];
        },
    },

    watch: {
        'element.config.faqs.value': {
            handler() {
                this.loadSelectedFaqs();
            },
            immediate: true,
        },
    },

    methods: {
        createdComponent() {
            this.initElementConfig('faq');
            this.selectedFaqsCollection = new EntityCollection('/faq', 'faq', Shopware.Context.api);

            const faqIds = normalizeFaqConfigIds(this.element.config?.faqs?.value);
            if (faqIds.length <= 0) {
                return;
            }

            this.loadSelectedFaqs();
        },

        async loadSelectedFaqs() {
            const faqsConfig = this.element.config?.faqs;
            if (!faqsConfig || faqsConfig.value === undefined || faqsConfig.value === null) {
                this.selectedFaqsCollection = new EntityCollection('/faq', 'faq', Shopware.Context.api);
                return;
            }

            const ids = normalizeFaqConfigIds(faqsConfig.value);
            if (ids.length === 0) {
                this.selectedFaqsCollection = new EntityCollection('/faq', 'faq', Shopware.Context.api);
                return;
            }

            const criteria = new Criteria();
            criteria.setIds(ids);
            criteria.addAssociation('faqCategory');
            criteria.addAssociation('translations');

            try {
                const result = await this.faqRepository.search(criteria, Shopware.Context.api);
                this.selectedFaqsCollection = result;
            } catch (error) {
                this.selectedFaqsCollection = new EntityCollection('/faq', 'faq', Shopware.Context.api);
            }
        },

        onAddFaqItem() {
            const items = this.element.config.items;
            
            if (items.source === 'default') {
                items.value = [];
                items.source = 'static';
            }

            items.value.push({
                question: '',
                answer: '',
            });

            this.$emit('element-update', this.element);
        },

        onRemoveFaqItem(index) {
            this.element.config.items.value.splice(index, 1);
            this.$emit('element-update', this.element);
        },

        onAnswerInput(item, value) {
            item.answer = value;
            this.$emit('element-update', this.element);
        },

        onAnswerBlur() {
            this.$emit('element-update', this.element);
        },

        onFaqsChange(faqCollection) {
            const faqsConfig = this.element.config.faqs;
            
            if (faqsConfig.source === 'default') {
                faqsConfig.source = 'static';
            }

            this.selectedFaqsCollection = faqCollection || new EntityCollection('/faq', 'faq', Shopware.Context.api);
            faqsConfig.value = faqCollection && faqCollection.length > 0 ? faqCollection.getIds() : [];
            this.$emit('element-update', this.element);
        },

        onTitleChange(value) {
            const titleConfig = this.element.config.title;
            if (titleConfig.source === 'default') {
                titleConfig.source = 'static';
            }
            titleConfig.value = value ?? '';
            this.$emit('element-update', this.element);
        },
    },
};
