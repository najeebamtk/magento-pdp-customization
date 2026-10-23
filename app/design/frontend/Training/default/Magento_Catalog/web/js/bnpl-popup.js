define(['jquery'], function ($) {
    'use strict';

    /**
     * Opens the tabby / tamara info popups. The popups are moved to <body> so the
     * sticky info column (its own stacking context) and the sticky header can't cover them.
     */
    return function (config, element) {
        var $root = $(element),
            $popups = $root.find('[data-bnpl-popup]').appendTo('body'),
            $body = $('body'),
            $lastTrigger = $();

        function close() {
            $popups.attr('hidden', true);
            $body.removeClass('tpdp-popup-open');
            $lastTrigger.trigger('focus');
        }

        function open(name, $trigger) {
            var $popup = $popups.filter('[data-bnpl-popup="' + name + '"]');

            $lastTrigger = $trigger;
            $popup.removeAttr('hidden');
            $body.addClass('tpdp-popup-open');
            $popup.find('.tpdp-popup__dialog').scrollTop(0);
            $popup.find('.tpdp-popup__close').trigger('focus');
        }

        $root.on('click', '[data-bnpl-open]', function (event) {
            event.preventDefault();
            open($(this).data('bnpl-open'), $(this));
        });

        $popups.on('click', '[data-bnpl-close]', function (event) {
            event.preventDefault();
            close();
        });

        $(document).on('keydown', function (event) {
            if (event.key === 'Escape' && $popups.filter(':not([hidden])').length) {
                close();
            }
        });
    };
});
