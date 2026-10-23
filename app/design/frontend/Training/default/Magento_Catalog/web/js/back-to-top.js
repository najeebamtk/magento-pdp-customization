define(['jquery'], function ($) {
    'use strict';

    return function (config, element) {
        var $button = $(element),
            $window = $(window),
            offset = config.offset || 300;

        function toggle() {
            if ($window.scrollTop() > offset) {
                $button.fadeIn(200);
            } else {
                $button.fadeOut(200);
            }
        }

        toggle();
        $window.on('scroll', toggle);

        $button.on('click', function (event) {
            event.preventDefault();
            $('html, body').animate({scrollTop: 0}, config.duration || 500);
        });
    };
});
