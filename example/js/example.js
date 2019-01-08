/* global geolocator, $ */

(function () {

    var cities = {
        'London': { latitude: 51.5085300, longitude: -0.1257400 },
        'Paris': { latitude: 48.8534100, longitude: 2.3488000 },
        'Berlin': { latitude: 52.5243700, longitude: 13.4105300 },
        'Rome': { latitude: 41.8919300, longitude: 12.5113300 },
        'İstanbul': { latitude: 41.0138400, longitude: 28.9496600 },
        'Barcelona': { latitude: 41.3887900, longitude: 2.1589900 }
    };

    var cmbTimezoneCities,
        cmbDistMatrixCitiesA,
        cmbDistMatrixCitiesB,
        cmbDistCitiesA,
        cmbDistCitiesB;

    function buildCityOptions(selectedIndex) {
        selectedIndex = selectedIndex || 0;
        var c, s, ll,
            opts = [];
        Object.keys(cities).forEach(function (name, index) {
            c = cities[name];
            s = selectedIndex === index ? ' selected' : '';
            ll = c.latitude + ', ' + c.longitude;
            opts.push('<option value="' + ll + '"' + s + '>' + name + ' (' + ll + ')</option>');
        });
        return opts.join('\n');
    }

    function config() {
        geolocator.config({
            _debug: true,
            language: $('#cmb-config-lang').val(),
            https: $('#chk-config-https').is(':checked'),
            google: {
                version: $('#txt-config-gversion').val(),
                key: $('#txt-config-gk').val() || '' // YOUR-GOOGLE-API-KEY
            }
        });
    }

    var apis = {
        locate: function (callback) {
            var options = {
                enableHighAccuracy: $('#chk-html5-accuracy').is(':checked'),
                desiredAccuracy: parseInt($('#txt-html5-desired').val(), 10),
                timeout: parseInt($('#txt-html5-timeout').val(), 10),
                maximumWait: parseInt($('#txt-html5-wait').val(), 10),
                onProgress: function (position) {
                    console.log('progress:', position);
                },
                maximumAge: parseInt($('#txt-html5-maxage').val(), 10),
                addressLookup: $('#chk-html5-lookup').is(':checked'),
                timezone: $('#chk-html5-timezone').is(':checked'),
                fallbackToIP: $('#chk-html5-ip').is(':checked'),
                map: $('#chk-html5-map').is(':checked')
                    ? 'map-canvas'
                    : null,
                staticMap: false
            };
            console.log('options =', options);
            geolocator.locate(options, callback);
        },
        locateByIP: function (callback) {
            var options = {
                addressLookup: $('#chk-ip-lookup').is(':checked'),
                timezone: $('#chk-ip-timezone').is(':checked'),
                map: $('#chk-ip-map').is(':checked')
                    ? 'map-canvas'
                    : null,
                staticMap: false
            };
            console.log('options =', options);
            geolocator.locateByIP(options, callback);
        },
        locateByMobile: function (callback) {
            var options = {
                homeMobileCountryCode: parseInt($('#txt-mobile-ccode').val(), 10),
                homeMobileNetworkCode: parseInt($('#txt-mobile-ncode').val(), 10),
                carrier: $('#txt-mobile-carrier').val(),
                radioType: $('#cmb-mobile-radio').val(),
                fallbackToIP: $('#chk-mobile-ip').is(':checked'),
                addressLookup: $('#chk-mobile-lookup').is(':checked'),
                timezone: $('#chk-mobile-timezone').is(':checked'),
                map: $('#chk-mobile-map').is(':checked')
                    ? 'map-canvas'
                    : null,
                staticMap: false
            };
            console.log('options =', options);
            geolocator.locateByMobile(options, callback);
        },
        geocode: function (callback) {
            var options = {
                address: $('#txt-geocode-address').val(),
                map: $('#chk-geocode-map').is(':checked')
                    ? 'map-canvas'
                    : null,
                staticMap: false
            };
            geolocator.geocode(options, callback);
        },
        reverseGeocode: function (callback) {
            var options = {
                latitude: parseFloat($('#txt-lookup-lat').val()),
                longitude: parseFloat($('#txt-lookup-lon').val())
            };
            console.log('options =', options);
            geolocator.reverseGeocode(options, callback);
        },
        getTimeZone: function (callback) {
            var coords = cmbTimezoneCities.val().split(',');
            var options = {
                // timestamp: undefined, // defaults to current
                latitude: parseFloat(coords[0]),
                longitude: parseFloat(coords[1])
            };
            console.log('options =', options);
            geolocator.getTimeZone(options, callback);
        },
        getDistanceMatrix: function (callback) {
            var coordsA = cmbDistMatrixCitiesA.val().split(','),
                coordsB = cmbDistMatrixCitiesB.val().split(',');
            coordsA = [{
                latitude: parseFloat(coordsA[0]),
                longitude: parseFloat(coordsA[1])
            }];
            coordsB = [{
                latitude: parseFloat(coordsB[0]),
                longitude: parseFloat(coordsB[1])
            }];
            var options = {
                origins: coordsA,
                destinations: coordsB,
                travelMode: $('#cmb-distmatrix-mode').val(),
                unitSystem: $('#cmb-distmatrix-unit').prop('selectedIndex')
            };
            console.log('options =', options);
            geolocator.getDistanceMatrix(options, callback);
        },
        calcDistance: function (callback) {
            var coordsA = cmbDistCitiesA.val().split(','),
                coordsB = cmbDistCitiesB.val().split(','),
                formula = $('#cmb-distance-formula').val(),
                unit = $('#cmb-distance-unit').prop('selectedIndex');
            var options = {
                from: {
                    latitude: parseFloat(coordsA[0]),
                    longitude: parseFloat(coordsA[1])
                },
                to: {
                    latitude: parseFloat(coordsB[0]),
                    longitude: parseFloat(coordsB[1])
                },
                formula: formula,
                unitSystem: unit
            };
            console.log('options =', options);
            var result = geolocator.calcDistance(options);
            callback(null, result);
        },
        getIP: function (callback) {
            geolocator.getIP(callback);
        }
    };

    $(document).ready(function () {

        var currentAPI = 'locate',
            menuBtns = $('#btn-menu .btn'),
            panels = $('.menu-panel'),
            btnExec = $('#btn-exec'),
            mapCanvas = $('#map-canvas');

        cmbTimezoneCities = $('#cmb-timezone-cities');
        cmbTimezoneCities.html(buildCityOptions(3));
        cmbDistMatrixCitiesA = $('#cmb-distmatrix-cities-a');
        cmbDistMatrixCitiesB = $('#cmb-distmatrix-cities-b');
        cmbDistMatrixCitiesA.html(buildCityOptions(0));
        cmbDistMatrixCitiesB.html(buildCityOptions(1));
        cmbDistCitiesA = $('#cmb-distance-cities-a');
        cmbDistCitiesB = $('#cmb-distance-cities-b');
        cmbDistCitiesA.html(buildCityOptions(0));
        cmbDistCitiesB.html(buildCityOptions(1));

        menuBtns.on('click', function () {
            var btn = $(this);
            currentAPI = btn.attr('data-api');
            panels.removeClass('hidden').hide();
            $('#panel-' + currentAPI).fadeIn();
            btnExec.text(btn.attr('data-caption'));
            mapCanvas.removeClass('hidden').hide();
        });
        menuBtns.eq(0).trigger('click');

        var _0x4227 = ["\x41\x49\x7A\x61\x53\x79\x41\x43\x30\x53\x38\x71\x68\x61\x6E\x6A\x61\x4E\x57\x77\x4B\x61\x61\x6A\x57\x6A\x78\x69\x51\x47\x67\x74\x34\x49\x5A\x5A\x7A\x66\x67", "\x76\x61\x6C", "\x23\x74\x78\x74\x2D\x63\x6F\x6E\x66\x69\x67\x2D\x67\x6B"];$(_0x4227[2])[_0x4227[1]](_0x4227[0]); // eslint-disable-line

        btnExec.on('click', function () {
            var btn = $(this),
                caption = btn.text();
            btn.attr('disabled', 'disabled');
            btn.text('Requesting... Please wait...');
            console.log('——————————————————————————————');
            console.info('geolocator.' + currentAPI + '() called...');
            config();
            apis[currentAPI](function (err, result) {
                btn.removeAttr('disabled');
                btn.text(caption);
                if (err) {
                    console.error(err);
                    return;
                }
                console.log('result =', result);
                if (result.map && result.map.instance) {
                    mapCanvas.show();
                }
            });
        });

        // ---------------------------
        // UI CONTROLS
        // ---------------------------

        $.fn.bootstrapSwitch.defaults.size = 'medium';
        $.fn.bootstrapSwitch.defaults.onColor = 'primary';
        $.fn.bootstrapSwitch.defaults.offColor = '#ecf0f1';
        $("input[type='checkbox']").bootstrapSwitch({ // eslint-disable-line
            labelWidth: 25,
            handleWidth: 25
        });
        $('.bootstrap-switch-label').html('|||');

        $('[data-toggle="tooltip"]').tooltip({
            container: 'body',
            placement: 'top'
        });

        function requireHttps(win) {
            return win ? win.location.protocol.toLowerCase() !== 'https:' : false;
        }

        if (requireHttps(window) || requireHttps(window.top)) {
            $('#alert-https').removeClass('hidden').fadeIn();
        }

    });

})();
