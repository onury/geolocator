/* eslint no-console:1 */
/* globals geolocator:false */

'use strict';

describe('geolocator.Error', function () {
    var err,
        GeoError = geolocator.Error;

    // beforeEach(function () {});
    // afterEach(function () {});

    it('should check error', function () {
        err = new GeoError();
        expect(err instanceof Error).toEqual(true);
        expect(err instanceof GeoError).toEqual(true);
        expect(err.name).toEqual('GeoError');
        expect(Object.prototype.toString.call(err)).toEqual('[object Object]'); // ???
        // expect(err.stack).toEqual(jasmine.any(String));
    });

    it('should check error code', function () {
        expect(err.code).toEqual(GeoError.Code.UNKNOWN_ERROR);
        err = new GeoError(GeoError.Code.INVALID_PARAMETERS);
        expect(err.code).toEqual(GeoError.Code.INVALID_PARAMETERS);
    });

});
