const { Module } = Shopware;

/* eslint-disable sw-deprecation-rules/private-feature-declarations */
Shopware.Component.register('sw-faq-list', () => import('./page/sw-faq-list'));
Shopware.Component.register('sw-faq-detail', () => import('./page/sw-faq-detail'));
Shopware.Component.register('sw-faq-category-list', () => import('./page/sw-faq-category-list'));
Shopware.Component.register('sw-faq-category-detail', () => import('./page/sw-faq-category-detail'));
/* eslint-enable sw-deprecation-rules/private-feature-declarations */

import bsBA from './snippet/bs-BA.json';
import daDK from './snippet/da-DK.json';
import deDE from './snippet/de-DE.json';
import enGB from './snippet/en-GB.json';
import esES from './snippet/es-ES.json';
import nlNL from './snippet/nl-NL.json';

/**
 * @private
 */
Module.register('sw-faq', {
    type: 'core',
    name: 'FAQ Management',
    title: 'sw-faq.general.mainMenuItemGeneral',
    description: 'sw-faq.general.descriptionText',
    color: '#57D9A3',
    icon: 'regular-question-circle',
    routes: {
        index: {
            component: 'sw-faq-list',
            path: 'index',
        },
        list: {
            component: 'sw-faq-list',
            path: 'list',
        },
        detail: {
            component: 'sw-faq-detail',
            path: 'detail/:id',
            meta: {
                parentPath: 'sw.faq.index',
            },
            props: {
                default(route) {
                    return {
                        faqId: route.params.id,
                    };
                },
            },
        },
        create: {
            component: 'sw-faq-detail',
            path: 'create',
            meta: {
                parentPath: 'sw.faq.index',
            },
        },
        categoryList: {
            component: 'sw-faq-category-list',
            path: 'category/list',
        },
        categoryDetail: {
            component: 'sw-faq-category-detail',
            path: 'category/detail/:id',
            meta: {
                parentPath: 'sw.faq.categoryList',
            },
            props: {
                default(route) {
                    return {
                        categoryId: route.params.id,
                    };
                },
            },
        },
        categoryCreate: {
            component: 'sw-faq-category-detail',
            path: 'category/create',
            meta: {
                parentPath: 'sw.faq.categoryList',
            },
        },
    },
    navigation: [
        {
            id: 'sw-faq',
            label: 'sw-faq.general.mainMenuItemGeneral',
            color: '#57D9A3',
            path: 'sw.faq.index',
            icon: 'regular-question-circle',
            parent: 'sw-content',
            position: 100,
        },
    ],
    snippets: {
        'bs-BA': bsBA,
        'da-DK': daDK,
        'de-DE': deDE,
        'en-GB': enGB,
        'es-ES': esES,
        'nl-NL': nlNL,
    },
});
