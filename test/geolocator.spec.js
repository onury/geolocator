/* eslint no-console:0 */

'use strict';

const geolocator = require('../dist/geolocator');
const GOOGLE_KEY = require('./google-key.helper');

jest.setTimeout(10000);

describe('geolocator', () => {

    // NOTE: googleKey is not commited to the repo.
    // You should have a google-key.helper.js file within /test directory.
    // var googleKey = "YOUR-GOOGLE-API-KEY";

    const google = {
        version: '3',
        key: GOOGLE_KEY
    };
    const configEN = {
        language: 'en',
        google
    };
    const configTR = {
        language: 'tr',
        google
    };

    // beforeEach(() => {});
    // afterEach(() => {});

    test('global `geolocator`', () => {
        // Check global object
        expect(window.geolocator).toBe(geolocator);
        // Check methods
        expect(typeof geolocator.locate).toEqual('function');
        expect(typeof geolocator.locateByIP).toEqual('function');
        expect(typeof geolocator.watch).toEqual('function');
        // Check storage
        expect(geolocator._).toEqual(expect.any(Object));
    });

    test('config', () => {
        let conf = geolocator.config();
        expect(conf).toEqual(expect.any(Object));
        expect(conf.language).toEqual('en');
        conf = geolocator.config(configTR);
        expect(conf.language).toEqual(configTR.language);
        expect(conf.google.version).toEqual(configTR.google.version);
        // set back to English
        geolocator.config(configEN);
    });

    test('calcDistance()', () => {
        geolocator.config(configEN);
        const options = {
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

        const result = geolocator.calcDistance(options);
        expect(result).toEqual(expect.any(Number));
        expect(result).toBeGreaterThan(350);
        expect(result).toBeLessThan(380);
    });

    test('locate() » should fail', done => {
        try {
            geolocator.config(configEN);
            const options = {
                enableHighAccuracy: true,
                timeout: 6000,
                maximumAge: 0,
                addressLookup: true,
                timezone: false,
                fallbackToIP: false,
                map: null
            };

            // this should be tested in the browser
            geolocator.locate(options, (err, location) => {
                if (err) {
                    expect(err.code).toEqual('GEOLOCATION_NOT_SUPPORTED');
                    expect(location).toBeUndefined();
                    done();
                    return;
                }
                done.fail(err);
            });
        } catch (err) {
            done.fail(err);
        }
    });

    test('locate() » should fallback to IP', done => {
        try {
            geolocator.config(configEN);
            const options = {
                enableHighAccuracy: false,
                timeout: 6000,
                maximumAge: 0,
                addressLookup: true,
                timezone: true,
                fallbackToIP: true,
                map: null
            };

            geolocator.locate(options, (err, location) => {
                if (err) {
                    done.fail(err);
                    return;
                }
                expect(location.coords).toEqual(expect.any(Object));
                expect(location.coords.latitude).toEqual(expect.any(Number));
                expect(location.coords.longitude).toEqual(expect.any(Number));
                expect(location.coords.accuracy).toBeUndefined();
                expect(location.address).toEqual(expect.any(Object));
                expect(location.timezone).toEqual(expect.any(Object));
                expect(location.ip).toEqual(expect.any(String));
                expect(location.provider).toEqual('geojs.io');
                done();
            });
        } catch (err) {
            done.fail(err);
        }
    });

    test('locateByIP()', done => {
        try {
            geolocator.config(configEN);
            const options = {
                // addressLookup: true,
                // timezone: true,
                map: null
            };

            geolocator.locateByIP(options, (err, location) => {
                try {
                    if (err) return done.fail(err);

                    expect(location.coords).toEqual(expect.any(Object));
                    expect(location.coords.latitude).toEqual(expect.any(Number));
                    expect(location.coords.longitude).toEqual(expect.any(Number));
                    expect(location.coords.accuracy).toBeUndefined();
                    expect(location.address).toEqual(expect.any(Object));
                    expect(location.flag).toEqual(expect.any(String));
                    expect(location.ip).toEqual(expect.any(String));
                    expect(location.provider).toEqual('geojs.io');
                } catch (error) {
                    console.log(error.stack || error);
                    return done.fail(error);
                }
                done();
            });
        } catch (err) {
            done.fail(err);
        }
    });

    test('locateByMobile()', done => {
        try {
            geolocator.config(configEN);
            const options = {
                homeMobileCountryCode: 310,
                homeMobileNetworkCode: 410,
                carrier: 'Vodafone',
                radioType: geolocator.RadioType.GSM,
                fallbackToIP: true,
                addressLookup: false,
                timezone: false,
                map: null
            };

            geolocator.locateByMobile(options, (err, location) => {
                if (err) {
                    done.fail(err);
                    return;
                }
                expect(location.coords).toEqual(expect.any(Object));
                expect(location.coords.latitude).toEqual(expect.any(Number));
                expect(location.coords.longitude).toEqual(expect.any(Number));
                expect(location.coords.accuracy).toEqual(expect.any(Number));
                expect(location.address).toBeUndefined();
                expect(location.timezone).toBeUndefined();
                expect(location.flag).toBeUndefined();
                done();
            });
        } catch (err) {
            done.fail(err);
        }
    });

    test('geocode()', done => {
        try {
            geolocator.config(configEN);
            const options = {
                address: '1600 Amphitheatre Parkway, CA',
                map: null
            };

            geolocator.geocode(options, (err, location) => {
                if (err) {
                    done.fail(err);
                    return;
                }
                expect(location.coords).toEqual(expect.any(Object));
                expect(location.coords.latitude).toEqual(expect.any(Number));
                expect(location.coords.longitude).toEqual(expect.any(Number));
                expect(location.coords.accuracy).toBeUndefined();
                expect(location.address).toEqual(expect.any(Object));
                expect(location.address.state).toEqual('California');
                expect(location.address.stateCode).toEqual('CA');
                expect(location.address.countryCode).toEqual('US');
                expect(location.formattedAddress).toEqual(expect.any(String));
                expect(location.type).toEqual(expect.any(String));
                expect(location.placeId).toEqual(expect.any(String));
                expect(location.flag).toEqual(expect.any(String));
                done();
            });
        } catch (err) {
            done.fail(err);
        }
    });

    test('getStaticMap() » sync and async', done => {
        try {
            geolocator.config(configEN);
            const options = {
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
            let url = geolocator.getStaticMap(options);
            expect(url).toEqual(expect.any(String));
            options.center = 'Los Angles, CA, US';
            url = geolocator.getStaticMap(options, (err, mapURL) => {
                expect(err).toEqual(null);
                if (err) {
                    done.fail(err);
                    return;
                }
                expect(url).toBeUndefined();
                expect(mapURL).toEqual(expect.any(String));
                // console.log(mapURL);
                done();
            });
        } catch (err) {
            done.fail(err);
        }
    });

    test('reverseGeocode()', done => {
        try {
            geolocator.config(configEN);
            const options = {
                latitude: 40.714224,
                longitude: -73.961452
            };

            geolocator.reverseGeocode(options, (err, location) => {
                if (err) {
                    done.fail(err);
                    return;
                }
                expect(location.coords).toEqual(expect.any(Object));
                expect(location.coords.latitude).toEqual(expect.any(Number));
                expect(location.coords.longitude).toEqual(expect.any(Number));
                expect(location.coords.accuracy).toBeUndefined();
                expect(location.address).toEqual(expect.any(Object));
                expect(location.address.state).toEqual('New York');
                expect(location.address.stateCode).toEqual('NY');
                expect(location.address.countryCode).toEqual('US');
                expect(location.formattedAddress).toEqual(expect.any(String));
                expect(location.type).toEqual(expect.any(String));
                expect(location.placeId).toEqual(expect.any(String));
                expect(location.flag).toEqual(expect.any(String));
                done();
            });
        } catch (err) {
            done.fail(err);
        }
    });

    test('getTimeZone()', done => {
        try {
            geolocator.config(configEN);
            const options = {
                latitude: 48.8534100,
                longitude: 2.3488000
            };
            geolocator.getTimeZone(options, (err, timezone) => {
                expect(err).toEqual(null);
                if (err) {
                    done.fail(err);
                    return;
                }
                expect(timezone.id).toEqual('Europe/Paris');
                expect(timezone.name).toContain('Central European');
                expect(timezone.abbr).toEqual('CEST');
                expect(timezone.rawOffset).toEqual(3600);
                done();
            });
        } catch (err) {
            done.fail(err);
        }
    });

    test('getDistanceMatrix()', done => {
        try {
            geolocator.config(configEN);
            const options = {
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
            geolocator.getDistanceMatrix(options, (err, result) => {
                expect(err).toEqual(null);
                if (err) {
                    done.fail(err);
                    return;
                }
                expect(result).toEqual(expect.any(Array));
                expect(result.length).toEqual(1);
                const item = result[0];
                expect(item.from).toEqual(expect.any(String));
                expect(item.to).toEqual(expect.any(String));
                expect(item.distance.text).toEqual(expect.any(String));
                expect(item.distance.value).toEqual(expect.any(Number));
                expect(item.duration.text).toEqual(expect.any(String));
                expect(item.duration.value).toEqual(expect.any(Number));
                done();
            });
        } catch (err) {
            done.fail(err);
        }
    });

    test('getIP()', done => {
        try {
            geolocator.config(configEN);
            geolocator.getIP((err, result) => {
                expect(err).toEqual(null);
                if (err) {
                    done.fail(err);
                    return;
                }
                expect(result.ip).toEqual(expect.any(String));
                expect(result.timestamp).toEqual(expect.any(Number));
                done();
            });
        } catch (err) {
            done.fail(err);
        }
    });

});
