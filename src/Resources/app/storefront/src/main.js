const PluginManager = window.PluginManager;

// FAQ Listing plugin
PluginManager.register('FaqListing', () => import('./js/faq-listing.plugin'), '[data-faq-listing]');
