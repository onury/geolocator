/* eslint no-console:1 */
/* globals geolocator, googleKey */

'use strict';

describe('geolocator', function () {

    // NOTE: googleKey is not commited to the repo.
    // You should have a google-key.helper.js file within /test directory.
    // var googleKey = "YOUR-GOOGLE-API-KEY";

    var googleConf = {
            version: '3',
            key: googleKey
        },
        configEN = {
            language: 'en',
            google: googleConf
        },
        configTR = {
            language: 'tr',
            google: googleConf
        };

    // beforeEach(function () {});
    // afterEach(function () {});

    it('check global `geolocator`', function () {
        // Check global object
        expect(window.geolocator).toBe(geolocator);
        // Check methods
        expect(geolocator.locate).toEqual(jasmine.any(Function));
        expect(geolocator.locateByIP).toEqual(jasmine.any(Function));
        expect(geolocator.watch).toEqual(jasmine.any(Function));
        // Check storage
        expect(geolocator._).toEqual(jasmine.any(Object));
    });

    it('check config', function () {
        var conf = geolocator.config();
        expect(conf).toEqual(jasmine.any(Object));
        expect(conf.language).toEqual('en');
        conf = geolocator.config(configTR);
        expect(conf.language).toEqual(configTR.language);
        expect(conf.google.version).toEqual(configTR.google.version);
        // set back to English
        geolocator.config(configEN);
    });

    it('calcDistance()', function () {
        var options = {
            // London
            from: {
                latitude: 51.50853,
                longitude: -0.12574
            },
            // Paris
            to: {
                latitude: 48.85341,
                longitude: 2.3488
            },
            formula: geolocator.DistanceFormula.HAVERSINE,
            unitSystem: geolocator.UnitSystem.METRIC
        };

        var result = geolocator.calcDistance(options);
        expect(result).toEqual(jasmine.any(Number));
        expect(result).toBeGreaterThan(350);
        expect(result).toBeLessThan(380);
    });

    it('locate() should fail', function (done) {
        var options = {
            enableHighAccuracy: true,
            timeout: 6000,
            maximumAge: 0,
            addressLookup: true,
            timezone: false,
            fallbackToIP: false,
            map: null
        };

        // this should be tested in the browser
        geolocator.locate(options, function (err, location) {
            expect(err.code).toEqual('GEOLOCATION_NOT_SUPPORTED');
            done();
        });
    });

    it('locate() should fallback to IP', function (done) {
        var options = {
            enableHighAccuracy: false,
            timeout: 6000,
            maximumAge: 0,
            addressLookup: true,
            timezone: true,
            fallbackToIP: true,
            map: null
        };

        geolocator.locate(options, function (err, location) {
            if (!err) {
                expect(location.coords).toEqual(jasmine.any(Object));
                expect(location.coords.latitude).toEqual(jasmine.any(Number));
                expect(location.coords.longitude).toEqual(jasmine.any(Number));
                expect(location.coords.accuracy).toBeUndefined();
                expect(location.address).toEqual(jasmine.any(Object));
                expect(location.timezone).toEqual(jasmine.any(Object));
                expect(location.ip).toEqual(jasmine.any(String));
                expect(location.provider).toEqual('nekudo');
            }
            done();
        });
    });

    it('locateByIP()', function (done) {
        var options = {
            addressLookup: true,
            timezone: true,
            map: null
        };

        geolocator.locateByIP(options, function (err, location) {
            if (!err) {
                expect(location.coords).toEqual(jasmine.any(Object));
                expect(location.coords.latitude).toEqual(jasmine.any(Number));
                expect(location.coords.longitude).toEqual(jasmine.any(Number));
                expect(location.coords.accuracy).toBeUndefined();
                expect(location.address).toEqual(jasmine.any(Object));
                expect(location.flag).toEqual(jasmine.any(String));
                expect(location.ip).toEqual(jasmine.any(String));
                expect(location.provider).toEqual('nekudo');
            }
            done();
        });
    });

    it('locateByMobile()', function (done) {
        var options = {
            homeMobileCountryCode: 310,
            homeMobileNetworkCode: 410,
            carrier: 'Vodafone',
            radioType: geolocator.RadioType.GSM,
            fallbackToIP: true,
            addressLookup: false,
            timezone: false,
            map: null
        };

        geolocator.locateByMobile(options, function (err, location) {
            if (!err) {
                expect(location.coords).toEqual(jasmine.any(Object));
                expect(location.coords.latitude).toEqual(jasmine.any(Number));
                expect(location.coords.longitude).toEqual(jasmine.any(Number));
                expect(location.coords.accuracy).toEqual(jasmine.any(Number));
                expect(location.address).toBeUndefined();
                expect(location.timezone).toBeUndefined();
                expect(location.flag).toBeUndefined();
            }
            done();
        });
    });

    it('geocode()', function (done) {
        var options = {
            address: '1600 Amphitheatre Parkway, CA',
            map: null
        };

        geolocator.geocode(options, function (err, location) {
            if (!err) {
                expect(location.coords).toEqual(jasmine.any(Object));
                expect(location.coords.latitude).toEqual(jasmine.any(Number));
                expect(location.coords.longitude).toEqual(jasmine.any(Number));
                expect(location.coords.accuracy).toBeUndefined();
                expect(location.address).toEqual(jasmine.any(Object));
                expect(location.address.state).toEqual('California');
                expect(location.address.stateCode).toEqual('CA');
                expect(location.address.countryCode).toEqual('US');
                expect(location.formattedAddress).toEqual(jasmine.any(String));
                expect(location.type).toEqual(jasmine.any(String));
                expect(location.placeId).toEqual(jasmine.any(String));
                expect(location.flag).toEqual(jasmine.any(String));
            }
            done();
        });
    });

    it('getStaticMap() - sync and async', function (done) {
        // geolocator.config(configEN);
        var options = {
            center: {
                latitude: 40.714224,
                longitude: -73.961452
            },
            mapTypeId: geolocator.MapTypeId.ROADMAP,
            size: '600x300',
            scale: 1,
            zoom: 7,
            marker: '0xFFCC00',
            format: geolocator.ImageFormat.PNG
        };
        var url = geolocator.getStaticMap(options);
        expect(url).toEqual(jasmine.any(String));
        options.center = 'Los Angles, CA, US';
        url = geolocator.getStaticMap(options, function (err, mapURL) {
            expect(err).toEqual(null);
            if (!err) {
                expect(url).toBeUndefined();
                expect(mapURL).toEqual(jasmine.any(String));
                // console.log(mapURL);
            }
            done();
        });
    });

    it('reverseGeocode()', function (done) {
        var options = {
            latitude: 40.714224,
            longitude: -73.961452
        };

        geolocator.reverseGeocode(options, function (err, location) {
            if (!err) {
                expect(location.coords).toEqual(jasmine.any(Object));
                expect(location.coords.latitude).toEqual(jasmine.any(Number));
                expect(location.coords.longitude).toEqual(jasmine.any(Number));
                expect(location.coords.accuracy).toBeUndefined();
                expect(location.address).toEqual(jasmine.any(Object));
                expect(location.address.state).toEqual('New York');
                expect(location.address.stateCode).toEqual('NY');
                expect(location.address.countryCode).toEqual('US');
                expect(location.formattedAddress).toEqual(jasmine.any(String));
                expect(location.type).toEqual(jasmine.any(String));
                expect(location.placeId).toEqual(jasmine.any(String));
                expect(location.flag).toEqual(jasmine.any(String));
            }
            done();
        });
    });

    it('getTimeZone()', function (done) {
        var options = {
            latitude: 48.8534100,
            longitude: 2.3488000
        };
        geolocator.getTimeZone(options, function (err, timezone) {
            expect(err).toEqual(null);
            if (!err) {
                expect(timezone.id).toEqual('Europe/Paris');
                expect(timezone.name).toContain('Central European');
                expect(timezone.abbr).toEqual('CEST');
                expect(timezone.rawOffset).toEqual(3600);
            }
            done();
        });
    });

    it('getDistanceMatrix()', function (done) {
        var options = {
            origins: [
                {
                    latitude: 51.50853,
                    longitude: -0.12574
                }
            ],
            destinations: [
                {
                    latitude: 48.85341,
                    longitude: 2.3488
                }
            ],
            travelMode: geolocator.TravelMode.DRIVING,
            unitSystem: geolocator.UnitSystem.METRIC
        };
        geolocator.getDistanceMatrix(options, function (err, result) {
            expect(err).toEqual(null);
            if (!err) {
                expect(result).toEqual(jasmine.any(Array));
                expect(result.length).toEqual(1);
                var item = result[0];
                expect(item.from).toEqual(jasmine.any(String));
                expect(item.to).toEqual(jasmine.any(String));
                expect(item.distance.text).toEqual(jasmine.any(String));
                expect(item.distance.value).toEqual(jasmine.any(Number));
                expect(item.duration.text).toEqual(jasmine.any(String));
                expect(item.duration.value).toEqual(jasmine.any(Number));
            }
            done();
        });
    });

    it('getIP()', function (done) {
        geolocator.getIP(function (err, result) {
            expect(err).toEqual(null);
            if (!err) {
                expect(result.ip).toEqual(jasmine.any(String));
                expect(result.timestamp).toEqual(jasmine.any(Number));
            }
            done();
        });
    });

});
