import Plugin from 'src/plugin-system/plugin.class';
import DomAccess from 'src/helper/dom-access.helper';

export default class FaqListingPlugin extends Plugin {
    static options = {
        /**
         * Selectors for finding elements
         */
        selectors: {
            categoryRadio: '.faq-listing-category-radio',
            categoryItem: '.faq-listing-category-item',
            categorySection: '.faq-listing-category-section',
            searchInput: '[data-faq-search-input]',
            searchDropdown: '[data-faq-search-dropdown]',
            searchResults: '[data-faq-search-results]',
            accordionButton: '.faq-accordion-button',
            accordionCollapse: '.accordion-collapse',
            searchResultItem: '.faq-listing-search-result-item',
        },
        
        /**
         * Data attributes
         */
        attributes: {
            categoryId: 'data-category-id',
            faqCategoryId: 'data-faq-category-id',
            faqCollapseId: 'data-faq-collapse-id',
            bsTarget: 'data-bs-target',
            ariaExpanded: 'aria-expanded',
        },
        
        /**
         * CSS classes
         */
        classes: {
            active: 'active',
            show: 'show',
            collapsed: 'collapsed',
            searchResultItem: 'faq-listing-search-result-item',
            searchResultNoResults: 'p-3 text-muted',
            searchResultItemWrapper: 'p-3 border-bottom cursor-pointer',
        },
        
        maxResults: 10,
    };

    init() {
        this.categoryRadios = DomAccess.querySelectorAll(this.el, this.options.selectors.categoryRadio);
        this.categoryItems = DomAccess.querySelectorAll(this.el, this.options.selectors.categoryItem);
        this.categorySections = DomAccess.querySelectorAll(this.el, this.options.selectors.categorySection);
        
        this.searchInput = DomAccess.querySelector(this.el, this.options.selectors.searchInput, false);
        this.searchDropdown = DomAccess.querySelector(this.el, this.options.selectors.searchDropdown, false);
        this.searchResults = DomAccess.querySelector(this.el, this.options.selectors.searchResults, false);
        
        this.allFaqs = this._collectAllFaqs();
        
        this._registerEvents();
        this._initDefaultState();
    }

    _registerEvents() {
        if (this.categoryRadios && this.categoryRadios.length > 0) {
            this.categoryRadios.forEach(radio => {
                radio.addEventListener('change', this._onCategoryChange.bind(this));
            });
        }
        
        if (this.searchInput) {
            this.searchInput.addEventListener('focus', this._onSearchFocus.bind(this));
            this.searchInput.addEventListener('input', this._onSearchInput.bind(this));
        }
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (event) => {
            if (this.searchDropdown && !this.searchDropdown.contains(event.target) && 
                this.searchInput && !this.searchInput.contains(event.target)) {
                this._hideSearchDropdown();
            }
        });
    }

    _initDefaultState() {
        // Find the first checked radio (should be the first category)
        const firstCheckedRadio = DomAccess.querySelector(
            this.el,
            `${this.options.selectors.categoryRadio}:checked`,
            false
        );
        if (firstCheckedRadio) {
            const categoryId = DomAccess.getAttribute(firstCheckedRadio, this.options.attributes.categoryId);
            this._showCategory(categoryId);
        }
    }

    _onCategoryChange(event) {
        const radio = event.currentTarget;
        const categoryId = DomAccess.getAttribute(radio, this.options.attributes.categoryId);
        
        // Update active label (parent of radio input)
        if (this.categoryItems && this.categoryItems.length > 0) {
            this.categoryItems.forEach(item => {
                item.classList.remove(this.options.classes.active);
            });
        }
        const label = radio.closest(this.options.selectors.categoryItem);
        if (label) {
            label.classList.add(this.options.classes.active);
        }
        
        // Show selected category section
        this._showCategory(categoryId);
    }

    _showCategory(categoryId) {
        // Hide all sections
        if (this.categorySections && this.categorySections.length > 0) {
            this.categorySections.forEach(section => {
                section.classList.remove(this.options.classes.active);
            });
        }
        
        // Show selected section
        const targetSection = DomAccess.querySelector(
            this.el,
            `${this.options.selectors.categorySection}[${this.options.attributes.categoryId}="${categoryId}"]`,
            false
        );
        
        if (targetSection) {
            targetSection.classList.add(this.options.classes.active);
        }
    }

    _collectAllFaqs() {
        const faqs = [];
        const accordionButtons = DomAccess.querySelectorAll(this.el, this.options.selectors.accordionButton);
        
        if (accordionButtons && accordionButtons.length > 0) {
            accordionButtons.forEach(button => {
                const collapseTarget = button.getAttribute(this.options.attributes.bsTarget);
                if (collapseTarget) {
                    const collapseId = collapseTarget.replace('#', '');
                    const collapse = DomAccess.querySelector(this.el, `#${collapseId}`, false);
                    const section = button.closest(this.options.selectors.categorySection);
                    const categoryId = section ? DomAccess.getAttribute(section, this.options.attributes.categoryId) : null;
                    
                    faqs.push({
                        question: button.textContent.trim(),
                        button: button,
                        collapseId: collapseId,
                        collapse: collapse,
                        categoryId: categoryId,
                    });
                }
            });
        }
        
        return faqs;
    }

    _onSearchFocus() {
        if (this.allFaqs.length > 0) {
            this._displaySearchResults(this.allFaqs.slice(0, this.options.maxResults), '');
        }
    }

    _onSearchInput(event) {
        const keyword = event.target.value.trim().toLowerCase();
        
        if (keyword.length === 0) {
            this._displaySearchResults(this.allFaqs.slice(0, this.options.maxResults), '');
            return;
        }
        
        const filtered = this.allFaqs.filter(faq => 
            faq.question.toLowerCase().includes(keyword)
        ).slice(0, this.options.maxResults);
        
        this._displaySearchResults(filtered, keyword);
    }

    _displaySearchResults(faqs, keyword) {
        if (!this.searchResults) return;
        
        if (faqs.length === 0) {
            this.searchResults.innerHTML = `<div class="${this.options.classes.searchResultNoResults}">No results found</div>`;
            this._showSearchDropdown();
            return;
        }
        
        this.searchResults.innerHTML = faqs.map(faq => {
            const highlightedQuestion = keyword 
                ? this._highlightKeyword(faq.question, keyword)
                : faq.question;
            
            return `
                <div class="${this.options.classes.searchResultItem} ${this.options.classes.searchResultItemWrapper}" 
                     ${this.options.attributes.faqCategoryId}="${faq.categoryId || ''}"
                     ${this.options.attributes.faqCollapseId}="${faq.collapseId || ''}">
                    ${highlightedQuestion}
                </div>
            `;
        }).join('');
        
        // Attach click handlers to results
        const resultItems = this.searchResults.querySelectorAll(this.options.selectors.searchResultItem);
        resultItems.forEach(item => {
            item.addEventListener('click', this._onSearchResultClick.bind(this));
        });
        
        this._showSearchDropdown();
    }

    _highlightKeyword(text, keyword) {
        const regex = new RegExp(`(${keyword})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    _onSearchResultClick(event) {
        const item = event.currentTarget;
        const categoryId = DomAccess.getAttribute(item, this.options.attributes.faqCategoryId);
        const collapseId = DomAccess.getAttribute(item, this.options.attributes.faqCollapseId);
        
        // Switch to the category
        if (categoryId) {
            const radio = DomAccess.querySelector(
                this.el,
                `${this.options.selectors.categoryRadio}[${this.options.attributes.categoryId}="${categoryId}"]`,
                false
            );
            if (radio) {
                radio.checked = true;
                radio.dispatchEvent(new Event('change'));
            }
        }
        
        // Expand the FAQ
        if (collapseId) {
            const collapse = DomAccess.querySelector(this.el, `#${collapseId}`, false);
            const button = collapse ? this.el.querySelector(`[${this.options.attributes.bsTarget}="#${collapseId}"]`) : null;
            
            if (collapse && button) {
                // Use Bootstrap's collapse API if available
                if (window.bootstrap && window.bootstrap.Collapse) {
                    const bsCollapse = new window.bootstrap.Collapse(collapse, { show: true });
                } else {
                    // Fallback: manually toggle classes
                    collapse.classList.add(this.options.classes.show);
                    button.classList.remove(this.options.classes.collapsed);
                    button.setAttribute(this.options.attributes.ariaExpanded, 'true');
                }
            }
        }
        
        this._hideSearchDropdown();
        if (this.searchInput) {
            this.searchInput.value = '';
        }
    }

    _showSearchDropdown() {
        if (this.searchDropdown) {
            this.searchDropdown.style.display = 'block';
        }
    }

    _hideSearchDropdown() {
        if (this.searchDropdown) {
            this.searchDropdown.style.display = 'none';
        }
    }
}
