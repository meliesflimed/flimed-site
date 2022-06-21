/**
 * Theme: Prompt - Responsive Bootstrap 4 Landing UI Kit
 * Author: Coderthemes
 * Module/App: Main Js
 */



//   export default isolde
  


 !function($) {
    'use strict';

    var Maps = function() {

    };

    Maps.prototype.createMarker = function(opts, markerData, latlng, icon, hoverIcon) {
        var marker = null;

        if (opts.useTextIcon) {
            marker = L.marker(latlng, {
                icon: icon,
                riseOnHover: true,
                opacity: 0,
                id: markerData.id,
            }).bindTooltip('<div id="custom-map-marker-' + markerData.id + '">' + markerData.label + '</div>', {
                direction: 'top',
                permanent: true,
                opacity: 1,
                interactive: true,
                className: 'custom-map-marker'
            }).on('mouseover', function (ev) {
                console.log($("#custom-map-marker-" + ev.target.options.id));
                $("#custom-map-marker-" + ev.target.options.id).parent().addClass('active');
            }).on('mouseout', function (ev) {
                $("#custom-map-marker-" + ev.target.options.id).parent().removeClass('active');
            })
        } else {
            marker = L.marker(latlng, {
                icon: icon,
                riseOnHover: true,
                id: markerData.id,
            }).on('mouseover', function (ev) {
                ev.target.setIcon(hoverIcon)
            }).on('mouseout', function (ev) {
                ev.target.setIcon(icon);
            })
        }

        if (opts.interactive) {
            marker.bindPopup(getMarkerPopup(markerData), {
                minwidth: 120,
                maxWidth: 320,
                className: 'custom-map-marker-popup'
            }).on('popupopen', function(e) {
                // we are using feather inside popup content
                feather.replace();
            });
        }
        return marker;
    },

    Maps.prototype.init = function() {
        var self = this;

        if (L) {
            $('[data-toggle="map"]').each(function () {
                try {
                    var opts = $.extend({
                        markerIconPath: '/assets/images/icons/map-marker.svg',
                        markerIconPathHover: '/assets/images/icons/map-marker-filled.svg',
                        useTextIcon: false,
                        zoom: 12,
                        scrollWheelZoom: false,
                        mapCenter: [39.74739, -105], // default
                        tileLayer: {
                            tiles: 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=sk.eyJ1IjoiY29kZXJ0aGVtZXMiLCJhIjoiY2s3dmgwbmFrMTkxdTNlbXJ2a3Z3eGEwcSJ9.wZqyynPHmm1EkNjjiH8lUw', subdomains: 'listing',
                            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
                                '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                                'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                            id: 'mapbox/streets-v11',
                        }
                    }, $(this).data('map'));

                    var isDraggingEnabled = false, isTapEnabled = false;
                    if ($(window).width() > 700) {
                        isDraggingEnabled = true;
                        isTapEnabled = true;
                    }

                    // creating new map
                    var map = L.map($(this).attr("id"), {
                        zoom: opts.zoom,
                        scrollWheelZoom: opts.scrollWheelZoom,
                        dragging: isDraggingEnabled,
                        tap: isTapEnabled
                    }).setView(opts.mapCenter, opts.zoom);

                    map.once('focus', function () {
                        map.scrollWheelZoom.enable();
                    });

                    L.tileLayer(opts.tileLayer.tiles, {
                        id: opts.tileLayer.id,
                        attribution: opts.tileLayer.attribution,
                        maxZoom: 18,
                        tileSize: 512,
                        zoomOffset: -1
                    }).addTo(map);

                    // icon
                    var icon = L.icon({
                        iconUrl: opts.markerIconPath,
                        iconSize: [36, 64]
                    });

                    var hoverIcon = L.icon({
                        iconUrl: opts.markerIconPathHover,
                        iconSize: [36, 64]
                    });

                    // check if geojson is enabled
                    if (opts.geojson) {
                        $.getJSON(opts.geojson).done(function (json) {
                            L.geoJSON(json, {
                                pointToLayer: function(feature, latlng) {
                                    return self.createMarker(opts, feature.properties, latlng, icon, hoverIcon);
                                }
                            }).addTo(map);
                        })
                        .fail(function (jqxhr, textStatus, error) {
                            console.log(error);
                        });
                    } else if (opts.markers && opts.markers.length) {
                        // creating markers
                        for (var markerIdx in opts.markers) {
                            var markerData = opts.markers[markerIdx];
                            var marker = self.createMarker(opts, markerData, markerData.location, icon, hoverIcon);
                            // add into map
                            marker.addTo(map);
                        }
                    }
                } catch (e) { }
            });
        }
    },
    $.Maps = new Maps, $.Maps.Constructor = Maps
}(window.jQuery),

function($) {
    'use strict';

    var App = function () {
        this.$body = $('body'),
        this.$window = $(window)
    };





    App.prototype.initComponents = function() {
        $(document).ready(function () {
            // Popovers
            $('[data-toggle="popover"]').popover();

            // Tooltip
            $('[data-toggle="tooltip"]').tooltip();

            // dropdown - toggle on hover
            $('.dropdown.hovered').hover(function(){
                $('.dropdown-toggle', this).trigger('click');
            });

            // Sticky
            if ($('.sticky-el').length) {
                new Sticky('.sticky-el');
            }

            // smooth scroll
            $('[data-toggle="smooth-scroll"]').on('click', function (event) {
                // Make sure this.hash has a value before overriding default behavior
                if (this.hash !== "") {
                    // Prevent default anchor click behavior
                    event.preventDefault();

                    // Store hash
                    var hash = this.hash;

                    // Using jQuery's animate() method to add smooth page scroll
                    // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
                    $('html, body').animate({
                        scrollTop: $(hash).offset().top - 120
                    }, 800, function () {

                        // Add hash (#) to URL when done scrolling (default click behavior)
                        // window.location.hash = hash;
                    });

                    return false;
                } // End if

            });

            // image gallery
            if ($.fn.magnificPopup) {
                $('[data-toggle="image-gallery"]').each(function(i, e) {
                    var opts = $.extend({
                        preloader: true,
                        mainClass: 'mfp-with-zoom', // this class is for CSS animation below
                        zoom: {
                            enabled: true,
                            duration: 300, // duration of the effect, in milliseconds
                            easing: 'ease-in-out', // CSS transition easing function
                            opener: function (openerElement) {
                                return openerElement.is('img') ? openerElement : openerElement.find('img');
                            }
                        },
                        closeMarkup: '<button title="%title%" type="button" class="mfp-close"></button>',

                        image: {
                            titleSrc: function (item) {
                                return $(item.el).data('title');
                            }
                        }
                    }, $(e).data());

                    if (opts['enableGallery']) {
                        opts['gallery'] = {
                            enabled: true,
                            navigateByImgClick: true,
                            preload: [1, 1]
                        };
                    }
                    $(e).magnificPopup(opts);
                });
            }

            // swiper
            if (Swiper) {
                $('[data-toggle="swiper"]').each(function () {
                    var swiperOpts = JSON.parse($(this).attr('data-swiper') ? $(this).attr('data-swiper') : '{}');
                    if (typeof(swiperOpts) === 'string')
                        swiperOpts = JSON.parse(swiperOpts);

                    var opts = $.extend({ init: true, loop: true }, swiperOpts);
                    new Swiper($(this)[0], opts);
                });
            }

            // filter
            $('[data-toggle="item-filter"]').each(function(i, e) {
                var targetIdentifier = $(this).data('targetContainer');
                var menuItems = $($(this).data('menuItem'));

                menuItems.on('click', function(e) {
                    menuItems.removeClass('active');
                    $(this).addClass('active');

                    var selectedClass = $(this).attr("data-rel");
                    $(targetIdentifier + " .filter-item").not("." + selectedClass).fadeOut(100).removeClass('');
                    $("." + selectedClass).fadeIn(500).addClass('');

                });
            });

            // maps
            $.Maps.init();

            // feather
            feather.replace();

            // back to top
            var btnTop = $('.btn-back-to-top');
            var stickyNavbar = $('[data-toggle="sticky"]');
            $(window).scroll(function () {
                if ($(this).scrollTop() > 50) {
                    btnTop.addClass('show');
                } else {
                    btnTop.removeClass('show');
                }

                if ($(this).scrollTop() > 240) {
                    stickyNavbar.addClass('navbar-sticky');
                } else {
                    stickyNavbar.removeClass('navbar-sticky');
                }
            });
            btnTop.on('click', function (e) {
                $('html,body').animate({ scrollTop: 0 }, 'slow'); return false;
            });

            // aos
            AOS.init({
                    // disable: true // if you would like to disable animation
                }
            );

            // counter
            $('[data-toggle="counter"]').each(function(i, e) {
                var counterData = $(this).data();

                var startVal = counterData.from ? counterData.from : null;
                var endVal = counterData.to ? counterData.to : null;
                var decimals = counterData.decimals ? counterData.decimals : null;
                var duration = counterData.duration ? counterData.duration : null;
                var options = counterData.options ? counterData.options : null;
                options['startVal'] = startVal;
                options['decimals'] = decimals;
                options['duration'] = duration;

                var counter = new countUp.CountUp(e, endVal, options);

                if (!counter.error) {
                    counter.start();
                    $(this).addClass('counted');
                }
            });

            // typed
            $('[data-toggle="typed"]').each(function(i, e) {
                var typedData = $(this).data();

                var typed = new Typed(e, {
                    strings: typedData.strings ? typedData.strings : [],
                    typeSpeed: 60,
                    backSpeed: 60,
                    backDelay: 1000,
                    loop: true
                });
            });
        });
    }

    App.prototype.initMasonry = function() {

        
        if(document.querySelector('.masonry')){
        new masonry({
            parent:  document.querySelector('.masonry'),
        });
    }
   
        // if(document.querySelector('masonry')){
        //     new masonry({
        //         parent:  document.querySelector('.masonry'),
        //     });
        // }
    }

    /**
     * Initilization
     */
    App.prototype.init = function () {
        // init components
        this.initComponents();
        this.initMasonry();
    },

    $.App = new App, $.App.Constructor = App
}(window.jQuery),

//initializing main application module
function ($) {
    "use strict";
    $.App.init();
}(window.jQuery);


/**
* Marker popup content
* @param {*} marker
*/
function getMarkerPopup(markerData) {
    var title = markerData.name ? '<h4 class="my-0"><a href="' + markerData.link + '">' + markerData.name + '</a></h4>' : '';
    var description = markerData.description ? '<p class="text-muted mt-1 mb-2 font-size-14">' + markerData.description + '</p>' : '';
    var image = markerData.image ? '<img src="' + markerData.image + '" alt="" class="card-img-top">' : '';
    var address = markerData.address ? '<p class="my-0 font-size-14"><i data-feather="map-pin" class="icon icon-xxs icon-dual mr-1"></i>' + markerData.address + '</p>' : '';

    var stars = '';
    if (markerData.rating) {
        stars = '<span>'
        for (var step = 1; step <= 5; step++) {
            if (step <= markerData.rating) {
                stars += '<i data-feather="star" class="icon icon-xs icon-fill-warning text-warning"></i>';
            } else {
                stars += '<i data-feather="star" class="icon icon-xs text-warning"></i>';
            }
        }
        stars += "</span>"
    }

    var content = '<div class="card m-0 p-0 overflow-hidden">' + image + '<div class="card-body"> <div class="">' + title + description + '</div>';
    content += '<div class="pt-2"><div class="row align-items-center"> <div class="col-auto"> '+ address + '</div>';
    content += '<div class="col text-right">' + stars + '</div></div></div></div></div>';
    return content;
}

// Popover
var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
  return new bootstrap.Popover(popoverTriggerEl)
})

// Tooltips
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})


// // Dropdown
//     document.querySelectorAll('[data-bs-toggle="dropdown"]').forEach(function (e) {
//         new bootstrap.Dropdown(e);
//     })

var dropdownTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="dropdown"]'))
var dropdownList = dropdownTriggerList.map(function (dropdownTriggerEl) {

    return new bootstrap.Dropdown(dropdownTriggerEl);
});



document.querySelectorAll('.navbar a').forEach(function(element) {


    var pageUrl = window.location.href.split(/[?#]/)[0];
    if (element.href == pageUrl || (!pageUrl.includes('html') && element.href.includes('index') &&  !element.href.includes('docs'))) {
        element.classList.add('active');

        var label = element.getAttribute('aria-labelledby');
        while (label != null) {
            var parent = document.getElementById(label);
            if (parent != null) {
                parent.classList.add('active');
                label = parent.getAttribute('aria-labelledby');
            } else {
                label = null;
            }
        }

    }

    element.addEventListener('click', function (e) {

        if (element.getAttribute('aria-labelledby') === "navbarPages" && element.classList.contains('dropdown-toggle')) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        }
        console.log(element);
    });
});
