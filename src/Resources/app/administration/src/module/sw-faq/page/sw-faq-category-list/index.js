import template from './sw-faq-category-list.html.twig';

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
            categories: null,
            isLoading: true,
            sortBy: 'name',
            sortDirection: 'ASC',
            total: 0,
            searchConfigEntity: 'faq_category',
        };
    },

    metaInfo() {
        return {
            title: this.$createTitle(),
        };
    },

    computed: {
        faqCategoryRepository() {
            return this.repositoryFactory.create('faq_category');
        },

        categoryColumns() {
            return [
                {
                    property: 'name',
                    dataIndex: 'name',
                    allowResize: true,
                    routerLink: 'sw.faq.categoryDetail',
                    label: 'sw-faq.category.list.columnName',
                    inlineEdit: 'string',
                    primary: true,
                },
            ];
        },

        categoryCriteria() {
            const criteria = new Criteria(this.page, this.limit);
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

            const criteria = await this.addQueryScores(this.term, this.categoryCriteria);

            if (!this.entitySearchable) {
                this.isLoading = false;
                this.total = 0;
                return false;
            }

            if (this.freshSearchTerm) {
                criteria.resetSorting();
            }

            return this.faqCategoryRepository.search(criteria).then((searchResult) => {
                this.categories = searchResult;
                this.total = searchResult.total;
                this.isLoading = false;
            });
        },

        updateTotal({ total }) {
            this.total = total;
        },
    },
};
