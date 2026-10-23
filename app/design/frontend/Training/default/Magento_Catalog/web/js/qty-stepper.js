define(['jquery'], function ($) {
    'use strict';

    return function (config, element) {
        var $input = $(element).find('input.qty');

        function step(delta) {
            var min = parseFloat($input.attr('min')) || 1,
                current = parseFloat($input.val()) || min;

            $input.val(Math.max(min, current + delta)).trigger('change');
        }

        $(element).on('click', '[data-role="qty-minus"]', function () {
            step(-1);
        });
        $(element).on('click', '[data-role="qty-plus"]', function () {
            step(1);
        });
    };
});
