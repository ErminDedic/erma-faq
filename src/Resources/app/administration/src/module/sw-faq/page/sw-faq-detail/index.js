import template from './sw-faq-detail.html.twig';

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
        Mixin.getByName('discard-detail-page-changes')('faq'),
    ],

    shortcuts: {
        'SYSTEMKEY+S': 'onSave',
        ESCAPE: 'onCancel',
    },

    props: {
        faqId: {
            type: String,
            required: false,
            default: null,
        },
    },

    data() {
        return {
            faq: null,
            faqCategories: [],
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
            return this.placeholder(this.faq, 'question');
        },

        faqIsLoading() {
            return this.isLoading || this.faq === null;
        },

        faqRepository() {
            return this.repositoryFactory.create('faq');
        },

        faqCategoryRepository() {
            return this.repositoryFactory.create('faq_category');
        },

        faqCategoryOptions() {
            return this.faqCategories.map(category => ({
                value: category.id,
                label: this.placeholder(category, 'name'),
            }));
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

        ...mapPropertyErrors('faq', [
            'question',
            'answer',
        ]),
    },

    watch: {
        faqId() {
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
            const faqId = this.faqId || this.$route.params.id;

            if (faqId && faqId !== 'create') {
                this.loadEntityData();
                return;
            }

            Shopware.Store.get('context').resetLanguageToDefault();
            this.faq = this.faqRepository.create();
            this.faq.active = false;
            this.faq.faqCategoryId = null;
            this.loadFaqCategories();
        },

        async loadEntityData() {
            this.isLoading = true;

            const faqId = this.faqId || this.$route.params.id;
            const criteria = new Criteria();
            criteria.addAssociation('faqCategory');
            criteria.addAssociation('translations');

            const [
                faqResponse,
                categoriesResponse,
            ] = await Promise.allSettled([
                this.faqRepository.get(faqId, Shopware.Context.api, criteria),
                this.loadFaqCategories(),
            ]);

            if (faqResponse && faqResponse.status === 'fulfilled') {
                this.faq = faqResponse.value;
            }

            if (faqResponse && faqResponse.status === 'rejected') {
                this.createNotificationError({
                    message: this.$tc('global.notification.notificationLoadingDataErrorMessage'),
                });
            }

            this.isLoading = false;
        },

        loadFaqCategories() {
            const criteria = new Criteria();
            criteria.addAssociation('translations');

            return this.faqCategoryRepository.search(criteria, Shopware.Context.api).then((categories) => {
                this.faqCategories = categories;
            });
        },

        abortOnLanguageChange() {
            return this.faqRepository.hasChanges(this.faq);
        },

        saveOnLanguageChange() {
            return this.onSave();
        },

        onChangeLanguage() {
            this.loadEntityData();
        },

        onSave() {
            this.isLoading = true;

            this.faqRepository
                .save(this.faq, Shopware.Context.api)
                .then(() => {
                    this.isLoading = false;
                    this.isSaveSuccessful = true;
                    const faqId = this.faqId || this.$route.params.id;
                    if (this.isCreate(faqId)) {
                        this.$router.push({
                            name: 'sw.faq.detail',
                            params: { id: this.faq.id },
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
            this.$router.push({ name: 'sw.faq.list' });
        },
    },
};
