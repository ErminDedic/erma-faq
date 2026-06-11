import template from './sw-faq-category-detail.html.twig';

const {
    Mixin,
    Data: { Criteria },
} = Shopware;

const { mapPropertyErrors } = Shopware.Component.getComponentHelper();

export default {
    template,

    inject: [
        'repositoryFactory',
        'acl',
    ],

    mixins: [
        Mixin.getByName('placeholder'),
        Mixin.getByName('notification'),
        Mixin.getByName('discard-detail-page-changes')('faqCategory'),
    ],

    shortcuts: {
        'SYSTEMKEY+S': 'onSave',
        ESCAPE: 'onCancel',
    },

    props: {
        categoryId: {
            type: String,
            required: false,
            default: null,
        },
    },

    data() {
        return {
            category: null,
            isLoading: false,
            isSaveSuccessful: false,
        };
    },

    metaInfo() {
        return {
            title: this.$createTitle(this.identifier),
        };
    },

    computed: {
        identifier() {
            return this.placeholder(this.category, 'name');
        },

        categoryIsLoading() {
            return this.isLoading || this.category === null;
        },

        faqCategoryRepository() {
            return this.repositoryFactory.create('faq_category');
        },

        tooltipSave() {
            const systemKey = this.$device.getSystemKey();
            return {
                message: `${systemKey} + S`,
                appearance: 'light',
            };
        },

        tooltipCancel() {
            return {
                message: 'ESC',
                appearance: 'light',
            };
        },

        ...mapPropertyErrors('category', [
            'name',
        ]),
    },

    watch: {
        categoryId() {
            this.createdComponent();
        },
    },

    created() {
        this.createdComponent();
    },

    methods: {
        isCreate(id) {
            return !id || id === 'create';
        },

        createdComponent() {
            const categoryId = this.categoryId || this.$route.params.id;

            if (categoryId && categoryId !== 'create') {
                this.loadEntityData();
                return;
            }

            Shopware.Store.get('context').resetLanguageToDefault();
            this.category = this.faqCategoryRepository.create();
        },

        async loadEntityData() {
            this.isLoading = true;

            const categoryId = this.categoryId || this.$route.params.id;
            const criteria = new Criteria();
            criteria.addAssociation('translations');

            const categoryResponse = await Promise.allSettled([
                this.faqCategoryRepository.get(categoryId, Shopware.Context.api, criteria),
            ]);

            if (categoryResponse && categoryResponse.length > 0 && categoryResponse[0].status === 'fulfilled') {
                this.category = categoryResponse[0].value;
            }

            if (categoryResponse && categoryResponse.length > 0 && categoryResponse[0].status === 'rejected') {
                this.createNotificationError({
                    message: this.$tc('global.notification.notificationLoadingDataErrorMessage'),
                });
            }

            this.isLoading = false;
        },

        abortOnLanguageChange() {
            return this.faqCategoryRepository.hasChanges(this.category);
        },

        saveOnLanguageChange() {
            return this.onSave();
        },

        onChangeLanguage() {
            this.loadEntityData();
        },

        onSave() {
            this.isLoading = true;

            this.faqCategoryRepository
                .save(this.category, Shopware.Context.api)
                .then(() => {
                    this.isLoading = false;
                    this.isSaveSuccessful = true;
                    const categoryId = this.categoryId || this.$route.params.id;
                    if (this.isCreate(categoryId)) {
                        this.$router.push({
                            name: 'sw.faq.categoryDetail',
                            params: { id: this.category.id },
                        });
                        return;
                    }

                    this.loadEntityData();
                })
                .catch((exception) => {
                    this.isLoading = false;
                    this.createNotificationError({
                        message: this.$tc('global.notification.notificationSaveErrorMessageRequiredFieldsInvalid'),
                    });
                    throw exception;
                });
        },

        onCancel() {
            this.$router.push({ name: 'sw.faq.categoryList' });
        },
    },
};
