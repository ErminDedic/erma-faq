import template from './sw-faq-list.html.twig';

const { Mixin } = Shopware;
const { Criteria } = Shopware.Data;

export default {
    template,

    inject: [
        'repositoryFactory',
        'acl',
    ],

    mixins: [
        Mixin.getByName('listing'),
    ],

    data() {
        return {
            faqs: null,
            isLoading: true,
            sortBy: 'question',
            sortDirection: 'ASC',
            total: 0,
            searchConfigEntity: 'faq',
        };
    },

    metaInfo() {
        return {
            title: this.$createTitle(),
        };
    },

    computed: {
        faqRepository() {
            return this.repositoryFactory.create('faq');
        },

        faqColumns() {
            return [
                {
                    property: 'question',
                    dataIndex: 'question',
                    allowResize: true,
                    routerLink: 'sw.faq.detail',
                    label: 'sw-faq.list.columnQuestion',
                    inlineEdit: 'string',
                    primary: true,
                },
                {
                    property: 'answer',
                    label: 'sw-faq.list.columnAnswer',
                    allowResize: true,
                },
                {
                    property: 'faqCategory.name',
                    label: 'sw-faq.list.columnCategory',
                    allowResize: true,
                },
                {
                    property: 'active',
                    label: 'sw-faq.list.columnActive',
                    align: 'center',
                    allowResize: true,
                },
            ];
        },

        faqCriteria() {
            const criteria = new Criteria(this.page, this.limit);
            criteria.addAssociation('faqCategory');
            criteria.setTerm(this.term);
            criteria.addSorting(Criteria.sort(this.sortBy, this.sortDirection, this.naturalSorting));

            return criteria;
        },
    },

    methods: {
        onChangeLanguage(languageId) {
            this.getList(languageId);
        },

        async getList() {
            this.isLoading = true;

            const criteria = await this.addQueryScores(this.term, this.faqCriteria);

            if (!this.entitySearchable) {
                this.isLoading = false;
                this.total = 0;
                return false;
            }

            if (this.freshSearchTerm) {
                criteria.resetSorting();
            }

            return this.faqRepository.search(criteria).then((searchResult) => {
                this.faqs = searchResult;
                this.total = searchResult.total;
                this.isLoading = false;
            });
        },

        updateTotal({ total }) {
            this.total = total;
        },
    },
};
