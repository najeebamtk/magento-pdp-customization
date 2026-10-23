/**
 * Heart button next to Add to Cart.
 * Guest: toggles the product in the browser wishlist. Logged in: Magento's normal "add to wishlist" post.
 */
define([
    'jquery',
    'Magento_Customer/js/customer-data',
    'Magento_Wishlist/js/guest-storage',
    'mage/dataPost'
], function ($, customerData, storage) {
    'use strict';

    return function (config, element) {
        var $button = $(element).find('[data-role="wishlist-toggle"]'),
            $note = $(element).find('[data-role="wishlist-note"]'),
            product = config.product,
            customer = customerData.get('customer'),
            wishlist = customerData.get('wishlist');

        function isLoggedIn() {
            return !!customer().firstname;
        }

        function inCustomerWishlist() {
            return (wishlist().items || []).some(function (item) {
                return String(item.product_id) === product.id;
            });
        }

        function render() {
            var active = isLoggedIn() ? inCustomerWishlist() : storage.has(product.id);

            $button.toggleClass('is-active', active)
                .attr('aria-pressed', active)
                .attr('title', active ? config.labels.remove : config.labels.add);
        }

        $button.on('click', function () {
            if (isLoggedIn()) {
                $.mage.dataPost().postData(config.addParams);

                return;
            }

            if (storage.has(product.id)) {
                storage.remove(product.id);
                $note.prop('hidden', true);
            } else {
                storage.add(product);
                $note.prop('hidden', false);
            }
        });

        customer.subscribe(render);
        wishlist.subscribe(render);
        $(document).on('guest-wishlist:change', render);
        render();
    };
});
