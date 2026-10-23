/**
 * Guest wishlist page: lists the products saved in the browser, with Add to Cart and Remove.
 */
define([
    'jquery',
    'Magento_Customer/js/customer-data',
    'Magento_Wishlist/js/guest-storage',
    'mage/dataPost'
], function ($, customerData, storage) {
    'use strict';

    return function (config, element) {
        var $root = $(element),
            $list = $root.find('[data-role="wishlist-items"]'),
            $empty = $root.find('[data-role="wishlist-empty"]'),
            $loggedIn = $root.find('[data-role="wishlist-logged-in"]'),
            customer = customerData.get('customer');

        function renderItem(item) {
            var $image = $('<img>', {src: item.image, alt: item.name, loading: 'lazy'});

            return $('<li>', {'class': 'guest-wishlist__item'}).append(
                $('<a>', {'class': 'guest-wishlist__image', href: item.url}).append($image),
                $('<a>', {'class': 'guest-wishlist__name', href: item.url, text: item.name}),
                $('<span>', {'class': 'guest-wishlist__price', text: item.price}),
                $('<button>', {
                    type: 'button',
                    'class': 'guest-wishlist__tocart',
                    text: config.labels.addToCart
                }).on('click', function () {
                    $.mage.dataPost().postData({
                        action: config.addToCartUrl,
                        data: {product: item.id, qty: 1}
                    });
                }),
                $('<button>', {
                    type: 'button',
                    'class': 'guest-wishlist__remove',
                    text: config.labels.remove
                }).on('click', function () {
                    storage.remove(item.id);
                })
            );
        }

        function render() {
            var items = storage.all(),
                loggedIn = !!customer().firstname;

            $loggedIn.prop('hidden', !loggedIn);
            $empty.prop('hidden', loggedIn || items.length > 0);
            $list.empty().prop('hidden', loggedIn);

            if (!loggedIn) {
                $list.append(items.map(renderItem));
            }
        }

        customer.subscribe(render);
        $(document).on('guest-wishlist:change', render);
        render();
    };
});
