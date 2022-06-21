/**
 * Theme: Prompt - Responsive Bootstrap 4 Landing UI Kit
 * Author: Coderthemes
 * Module/App: Documentation related Js
 */


!function($) {
    'use strict';

    var Doc = function () {
        this.$body = $('body'),
        this.$window = $(window)
    };

    Doc.prototype.init = function() {
        var entityMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
            '/': '&#x2F;',
            '`': '&#x60;',
            '=': '&#x3D;',
            '-': '&#45;'
          };

          function escapeHtml (string) {
            return String(string).replace(/[&<>"'`=\/]/g, function (s) {
              return entityMap[s];
            });
          }

          
        $(function () {
            $(".escape").each(function(i, e) {
                $(e).html(escapeHtml($(e).html()).trim());
            });
            
            // copy to clipboard
            if (window['ClipboardJS']) {
                var clipboard = new ClipboardJS('.btn-copy-clipboard');

                clipboard.on('success', function(e) {
                    var originalLabel = $(e.trigger).text();
                    $(e.trigger).text('Copied');
                    $(e.trigger).addClass('text-success');
                    setTimeout(function() {
                        $(e.trigger).text(originalLabel);
                        $(e.trigger).removeClass('text-success');
                    }, 3000);
                    e.clearSelection();
                });
            }

            // activate the side menu
            var pageUrl = window.location.href.split(/[?#]/)[0];
            $('.doc-nav-link').each(function() {
                if (this.href === pageUrl) {
                    $(this).addClass('active');
                }
            });
        });
    },

    $.Doc = new Doc, $.Doc.Constructor = Doc
}(window.jQuery),

//initializing main application module
function ($) {
    "use strict";
    $.Doc.init();
}(window.jQuery);

