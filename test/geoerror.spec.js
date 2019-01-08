/* eslint no-console:1 */

'use strict';

const geolocator = require('../dist/geolocator');

describe('geolocator.Error', function () {
    let err;
    const GeoError = geolocator.Error;

    // beforeEach(function () {});
    // afterEach(function () {});

    test('GeoError', () => {
        err = new GeoError();
        expect(err instanceof Error).toEqual(true);
        expect(err instanceof GeoError).toEqual(true);
        expect(err.name).toEqual('GeoError');
        // expect(Object.prototype.toString.call(err)).toEqual('[object Object]');
        // expect(err.stack).toEqual(expect.any(String));
    });

    test('error code', () => {
        expect(err.code).toEqual(GeoError.Code.UNKNOWN_ERROR);
        err = new GeoError(GeoError.Code.INVALID_PARAMETERS);
        expect(err.code).toEqual(GeoError.Code.INVALID_PARAMETERS);
    });

});
