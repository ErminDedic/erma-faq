import template from './sw-cms-el-faq.html.twig';
import './sw-cms-el-faq.scss';

const { Mixin } = Shopware;
const { Criteria } = Shopware.Data;

function manualItemHasContent(item) {
    if (!item) {
        return false;
    }
    const question = typeof item.question === 'string' ? item.question.trim() : '';
    const rawAnswer = typeof item.answer === 'string' ? item.answer : '';
    const answerText = rawAnswer.replace(/<[^>]*>/g, '').trim();

    return Boolean(question || answerText);
}

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
 * CMS resolver / API may expose FAQs as an array, EntityCollection, or iterable.
 *
 * @param {unknown} raw
 * @returns {unknown[]}
 */
function faqListFromData(raw) {
    if (!raw) {
        return [];
    }
    if (Array.isArray(raw)) {
        return raw;
    }
    if (typeof raw.getElements === 'function') {
        return raw.getElements();
    }
    if (typeof raw[Symbol.iterator] === 'function') {
        return Array.from(raw);
    }

    return [];
}

/**
 * @param {unknown} result
 * @returns {unknown[]}
 */
function faqEntitiesFromSearchResult(result) {
    if (!result) {
        return [];
    }
    if (typeof result.getElements === 'function') {
        return result.getElements();
    }
    if (typeof result.getEntities === 'function') {
        const nested = result.getEntities();
        if (nested && typeof nested.getElements === 'function') {
            return nested.getElements();
        }
        if (nested && typeof nested[Symbol.iterator] === 'function') {
            return Array.from(nested);
        }
    }
    if (Array.isArray(result)) {
        return result;
    }
    if (typeof result[Symbol.iterator] === 'function') {
        return Array.from(result);
    }

    return [];
}

/**
 * @private
 * @sw-package discovery
 */
export default {
    template,

    inject: ['repositoryFactory'],

    mixins: [
        Mixin.getByName('cms-element'),
    ],

    data() {
        return {
            entityFaqs: [],
            manualItemsTick: 0,
        };
    },

    computed: {
        manualFaqItems() {
            void this.manualItemsTick;

            return this.element.config?.items?.value ?? [];
        },

        manualFaqItemsWithContent() {
            return this.manualFaqItems.filter(manualItemHasContent);
        },

        faqRepository() {
            return this.repositoryFactory.create('faq');
        },

        /**
         * Prefer slot data from the CMS data resolver (same as storefront); fall back to repository search.
         */
        resolvedEntityFaqs() {
            const fromSlot = faqListFromData(this.element?.data?.faqs).filter(
                (faq) => faq && typeof faq === 'object' && typeof faq.id === 'string' && faq.id.length > 0,
            );
            if (fromSlot.length > 0) {
                return fromSlot;
            }

            return this.entityFaqs;
        },

        displayFaqItems() {
            const fromEntities = this.resolvedEntityFaqs.map((faq) => ({
                key: `entity-${faq.id}`,
                question: faq.translated?.question ?? faq.question ?? '',
                answer: faq.translated?.answer ?? faq.answer ?? '',
            }));

            const fromManual = this.manualFaqItemsWithContent.map((item, index) => ({
                key: `manual-${index}`,
                question: item.question ?? '',
                answer: item.answer ?? '',
            }));

            return [...fromEntities, ...fromManual];
        },

        hasAnyFaqs() {
            return this.resolvedEntityFaqs.length > 0 || this.manualFaqItemsWithContent.length > 0;
        },
    },

    watch: {
        'element.config.faqs': {
            handler() {
                this.loadSelectedFaqs();
            },
            deep: true,
        },
        'element.config.items.value': {
            handler() {
                this.manualItemsTick += 1;
            },
            deep: true,
        },
    },

    created() {
        this.createdComponent();
    },

    methods: {
        createdComponent() {
            this.initElementConfig('faq');
            this.initElementData('faq');
            // Defer until config/slot state has settled (differs between dev server and production bundle timing).
            this.$nextTick(() => {
                this.loadSelectedFaqs();
            });
        },

        async loadSelectedFaqs() {
            this.entityFaqs = [];

            const faqsConfig = this.element.config?.faqs;
            if (!faqsConfig || faqsConfig.value === undefined || faqsConfig.value === null) {
                return;
            }

            // Do not require source === 'static': CMS can keep source as "default" until the slot is saved,
            // while faqs.value already holds UUIDs from the entity multi-select.
            const ids = normalizeFaqConfigIds(faqsConfig.value);
            if (ids.length === 0) {
                return;
            }

            const criteria = new Criteria();
            criteria.setIds(ids);
            criteria.addAssociation('faqCategory');
            criteria.addAssociation('translations');

            try {
                const result = await this.faqRepository.search(criteria, Shopware.Context.api);
                this.entityFaqs = faqEntitiesFromSearchResult(result);
            } catch {
                this.entityFaqs = [];
            }
        },
    },
};
