/**
 * Guest wishlist kept in the browser (localStorage). Every change fires "guest-wishlist:change" on document.
 */
define(['jquery'], function ($) {
    'use strict';

    var KEY = 'guest-wishlist';

    function read() {
        try {
            return JSON.parse(window.localStorage.getItem(KEY)) || [];
        } catch (e) {
            return [];
        }
    }

    function write(items) {
        try {
            window.localStorage.setItem(KEY, JSON.stringify(items));
        } catch (e) {
            // private mode / storage blocked: the list just isn't saved
        }
        $(document).trigger('guest-wishlist:change', [items]);
    }

    function without(id) {
        return read().filter(function (item) {
            return item.id !== id;
        });
    }

    return {
        all: read,

        has: function (id) {
            return without(id).length !== read().length;
        },

        add: function (product) {
            var items = without(product.id);

            items.unshift(product);
            write(items);
        },

        remove: function (id) {
            write(without(id));
        },

        clear: function () {
            write([]);
        }
    };
});
