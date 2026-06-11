# Erma FAQ

A Shopware 6 plugin for managing frequently asked questions in the administration and presenting them on the storefront via CMS elements.

## Requirements

- Shopware **6.7** or higher
- PHP **8.0** or higher

## Installation

1. Add the plugin to your Shopware project (for example as a Composer path repository or by copying it into `custom/plugins/ErmaFaq`).
2. Install and activate the plugin:

```bash
bin/console plugin:refresh
bin/console plugin:install --activate ErmaFaq
bin/console cache:clear
```

3. Build the administration and storefront assets:

```bash
bin/build-administration.sh
bin/build-storefront.sh
```

On plugin install, database migrations create the FAQ tables automatically.

## Features

### Administration module

The plugin adds **FAQ Management** under **Content** in the Shopware administration.

From there you can:

- **Manage FAQs** — create, edit, search, and delete FAQ entries
- **Manage categories** — organize FAQs into categories
- **Control visibility** — toggle each FAQ as active or inactive
- **Translate content** — question and answer fields are translatable per shopgit language

A typical workflow:

1. Create one or more **categories** (e.g. Shipping, Returns, Payment).
2. Create **FAQs** and assign them to a category.
3. Mark FAQs as **active** so they appear in the FAQ Listing CMS element.
4. Add a CMS element to a shopping experience to display the FAQs on the storefront.

### Data model

FAQs and categories are stored in the database using Shopware's Data Abstraction Layer (DAL).

| Entity | Fields |
|--------|--------|
| `faq_category` | Translatable **name** |
| `faq` | Translatable **question** and **answer**, **active** flag, optional **category** reference |

Only **active** FAQs are loaded for the FAQ Listing element. The simple FAQ element can also include inactive entries if you select them manually in the CMS config.

## CMS elements

Both elements are available under the **Erma** block category when editing a shopping experience.

### FAQ

A simple accordion element for displaying a curated list of questions.

**Configuration:**

- **Heading** — optional title above the accordion
- **FAQs** — pick one or more FAQs from the database (only active entries are offered in the selector)
- **Manual FAQ items** — add question/answer pairs directly in the CMS without creating database entries

Database FAQs and manual items are combined into a single accordion on the storefront. The first item is expanded by default.

**Use when:** you want a small, hand-picked FAQ section on a landing page or product page.

### FAQ Listing

A full FAQ page element with category navigation and client-side search.

**Configuration:** none — the element loads all active FAQs and all categories from the database automatically.

**Storefront behavior:**

- **Search** — filter FAQs by question text; selecting a result switches to the matching category and expands that FAQ
- **Category sidebar** — radio buttons to switch between topic sections
- **Accordion** — FAQs grouped under their category heading
- **Uncategorized** — FAQs without a category appear in a separate section

**Use when:** you need a dedicated FAQ or help page with browsing and search.

## Storefront

- FAQs are rendered as Bootstrap accordions.
- The FAQ Listing element uses a JavaScript plugin (`FaqListing`) for search and category switching.
- Styles are provided in the plugin's storefront SCSS (`_faq.scss`).

Storefront snippets for the listing element are available in **en**, **de**, **nl**, **bs**, **da**, and **es** under the `faq.listing` domain.

## Translations

| Area | Languages |
|------|-----------|
| Administration (FAQ module) | en-GB, de-DE, nl-NL, bs-BA, da-DK, es-ES |
| Administration (CMS elements) | en-GB, de-DE, nl-NL, bs-BA, da-DK, es-ES |
| Storefront (FAQ listing) | en, de, nl, bs, da, es |

FAQ and category content itself is translated through Shopware's standard entity translation system in the administration detail views.

## Uninstall

When uninstalling the plugin, choose whether to keep user data. If you opt to remove data, the plugin's database tables are dropped along with the uninstall.

## License

Proprietary — (c) Erma
