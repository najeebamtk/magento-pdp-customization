/**
 * Header heart with item count. Links guests to the browser wishlist page and customers to My Wishlist.
 * After a guest logs in, their browser items are added to the customer's real wishlist, then cleared.
 */
define([
    'jquery',
    'Magento_Customer/js/customer-data',
    'Magento_Wishlist/js/guest-storage',
    'mage/cookies'
], function ($, customerData, storage) {
    'use strict';

    return function (config, element) {
        var $link = $(element),
            $count = $link.find('[data-role="wishlist-count"]'),
            customer = customerData.get('customer'),
            wishlist = customerData.get('wishlist'),
            merging = false;

        function isLoggedIn() {
            return !!customer().firstname;
        }

        function render() {
            var count = isLoggedIn() ? parseInt(wishlist().counter, 10) || 0 : storage.all().length;

            $link.attr('href', isLoggedIn() ? config.customerUrl : config.guestUrl);
            $count.text(count).prop('hidden', count === 0);
        }

        function addToCustomerWishlist(item) {
            // keep going even if one product can't be added
            return $.post(config.addUrl, {
                product: item.id,
                'form_key': $.mage.cookies.get('form_key')
            }).then(null, function () {
                return $.Deferred().resolve();
            });
        }

        function mergeGuestItems() {
            var items = storage.all();

            if (merging || !items.length || !isLoggedIn()) {
                return;
            }
            merging = true;

            items.reduce(function (chain, item) {
                return chain.then(function () {
                    return addToCustomerWishlist(item);
                });
            }, $.Deferred().resolve()).always(function () {
                storage.clear();
                customerData.reload(['wishlist'], true);
                merging = false;
            });
        }

        customer.subscribe(function () {
            render();
            mergeGuestItems();
        });
        wishlist.subscribe(render);
        $(document).on('guest-wishlist:change', render);
        render();
        mergeGuestItems();
    };
});
