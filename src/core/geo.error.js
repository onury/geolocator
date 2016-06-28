import utils from '../lib/utils';

/**
 * Geolocator Error class that provides a common type of error object for the
 * various APIs implemented in Geolocator. All callbacks of Geolocator will
 * include an instance of this object as the first argument; if the
 * corresponding operation fails. Also all thrown errors will be an instance of
 * this object.
 *
 * This object can be publicly accessed via `geolocator.Error`.
 *
 * @extends Error
 */
class GeoError { // extends Error (doesn't work with transpilers)

    /**
     * Costructs a new instance of `GeoError`.
     *
     * @param {String} [code="UNKNOWN_ERROR"]
     *        Any valid Geolocator Error code.
     *        See {@link #GeoError.Code|`GeoError.Code` enumeration} for
     *        possible values.
     * @param {String} [message]
     *        Error message. If omitted, this will be set to `code`.
     *
     * @returns {GeoError}
     *
     * @example
     * var GeoError = geolocator.Error,
     *     error = new GeoError(GeoError.Code.GEOLOCATION_NOT_SUPPORTED);
     * console.log(error.code); // "GEOLOCATION_NOT_SUPPORTED"
     * console.log(error instanceof GeoError); // true
     */
    constructor(code = GeoError.Code.UNKNOWN_ERROR, message) {
        message = message || String(code);

        /**
         *  Gets the name of the Error object.
         *  This always returns `"GeoError"`.
         *  @name GeoError#name
         *  @type {String}
         */
        Object.defineProperty(this, 'name', {
            enumerable: false,
            writable: false,
            value: 'GeoError' // this.constructor.name
        });

        /**
         *  Gets the error code set for this instance.
         *  This will return one of
         *  {@link #GeoError.Code|`GeoError.Code` enumeration}.
         *  @name GeoError#code
         *  @type {String}
         */
        Object.defineProperty(this, 'code', {
            enumerable: false,
            writable: true,
            value: code
        });

        /**
         *  Gets the error message set for this instance.
         *  If no message is set, this will return the error code value.
         *  @name GeoError#message
         *  @type {String}
         */
        Object.defineProperty(this, 'message', {
            enumerable: false,
            writable: true,
            value: message
        });

        if (Error.hasOwnProperty('captureStackTrace')) { // V8
            Error.captureStackTrace(this, this.constructor);
        } else {
            /**
             *  Gets the error stack for this instance.
             *  @name GeoError#stack
             *  @type {String}
             */
            Object.defineProperty(this, 'stack', {
                enumerable: false,
                writable: false,
                value: (new Error(message)).stack
            });
        }
    }

    /**
     * Creates a new instance of `GeoError` from the given value.
     *
     * @param {*} [err]
     *        Value to be transformed. This is used to determine the proper
     *        error code for the created instance. If an `Error` or `Object` is
     *        passed, its `message` property is checked if it matches any of the
     *        valid error codes. If omitted or no match is found, error code
     *        `GeoError.Code.UNKNOWN_ERROR` will be used as default.
     *
     * @returns {GeoError}
     *
     * @example
     * var GeoError = geolocator.Error,
     * 	   error = GeoError.create();
     * console.log(error.code); // "UNKNOWN_ERROR"
     * error = GeoError.create(GeoError.Code.GEOLOCATION_NOT_SUPPORTED);
     * console.log(error.code); // "GEOLOCATION_NOT_SUPPORTED"
     */
    static create(err) {
        if (err instanceof GeoError) {
            return err;
        }

        let code, msg;

        if (utils.isPositionError(err) && err.code) {
            switch (err.code) {
                case 1:
                    code = GeoError.Code.PERMISSION_DENIED;
                    break;
                case 2:
                    code = GeoError.Code.POSITION_UNAVAILABLE;
                    break;
                case 3:
                    code = GeoError.Code.TIMEOUT;
                    break;
                default:
                    code = GeoError.Code.UNKNOWN_ERROR;
                    break;
            }
            return new GeoError(code, err.message || '');
        }

        if (typeof err === 'string') {
            code = msg = err;
        } else if (typeof err === 'object') {
            code = err.code || err.message;
            msg = err.message || err.code;
        }
        if (code && GeoError.isValidErrorCode(code)) {
            return new GeoError(code, msg);
        }

        return new GeoError(GeoError.Code.UNKNOWN_ERROR, msg);
    }

    /**
     * Creates a new instance of `GeoError` from the given response object.
     * Since Geolocator implements various Google APIs, we might receive
     * responses if different structures. For example, some APIs return a
     * response object with a `status:String` property (such as the TimeZone
     * API) and some return responses with an `error:Object` property. This
     * method will determine the correct reason or message and return a
     * consistent error object.
     *
     * @param {Object|String} response
     *        Response (Object) or status (String) to be transformed.
     * @param {String} [message=null]
     *        Error message.
     *
     * @returns {GeoError}
     *          `GeoError` instance if response contains an error. Otherwise,
     *          returns `null`.
     *
     * @example
     * var error = geolocator.Error.fromResponse(googleResponse);
     * console.log(error.code); // "GOOGLE_KEY_INVALID"
     */
    static fromResponse(response, message = '') {
        // example Google Geolocation API response:
        // https://developers.google.com/maps/documentation/geolocation/intro#errors
        // {
        //      "error": {
        //          "errors": [
        //              {
        //                  "domain": "global",
        //                  "reason": "parseError",
        //                  "message": "Parse Error",
        //              }
        //          ],
        //      "code": 400,
        //      "message": "Parse Error"
        //      }
        // }
        // example Google TimeZone API response:
        // {
        //     "status": "REQUEST_DENIED"
        // }

        if (!response) return new GeoError(GeoError.Code.INVALID_RESPONSE);

        let errCode;

        if (utils.isString(response)) {
            errCode = errorCodeFromStatus(response);
            if (errCode) return new GeoError(errCode, message || response);
        }

        if (!utils.isObject(response)) return null;

        let errMsg = response.error_message
            || response.errorMessage
            || ((response.error && response.error.message) || '')
            || '';

        if (response.status) {
            errCode = errorCodeFromStatus(response.status);
            if (errCode) return new GeoError(errCode, errMsg || message || response.status);
        }

        if (response.error) {
            let reason = response.reason || response.error.reason;
            if (!reason) {
                let errors = response.error.errors;
                if (utils.isArray(errors) && errors.length > 0) {
                    reason = errors[0].reason; // get the first reason only
                    errMsg = errMsg || errors[0].message; // update errMsg
                }
            }
            errCode = errorCodeFromReason(reason) || GeoError.Code.UNKNOWN_ERROR;
            return new GeoError(errCode, errMsg || reason || message);
        }

        if (errMsg) {
            errCode = errorCodeFromStatus(errMsg) || GeoError.Code.UNKNOWN_ERROR;
            return new GeoError(errCode, errMsg || message);
        }

        return null;
    }

    /**
     *  Checks whether the given value is an instance of `GeoError`.
     *
     *  @param {*} err - Object to be checked.
     *
     *  @returns {Boolean}
     */
    static isGeoError(err) {
        return err instanceof GeoError;
    }

    /**
     *  Checks whether the given value is a valid Geolocator Error code.
     *
     *  @param {String} errorCode - Error code to be checked.
     *
     *  @returns {Boolean}
     */
    static isValidErrorCode(errorCode) {
        let prop;
        for (prop in GeoError.Code) {
            if (GeoError.Code.hasOwnProperty(prop)
                    && errorCode === GeoError.Code[prop]) {
                return true;
            }
        }
        return false;
    }
}

/**
 *  Gets the string representation of the error instance.
 *
 *  @returns {String}
 */
GeoError.prototype.toString = function () {
    var msg = this.code !== this.message ? ` (${this.message})` : '';
    return `${this.name}: ${this.code}${msg}`;
};

// `class x extends Error` doesn't work when using an ES6 transpiler, such as
// Babel, since subclasses must extend a class. With Babel 6, we need
// transform-builtin-extend plugin for this to work. So we're extending from
// Error the old way. Now, `err instanceof Error` also returns `true`.
if (typeof Object.setPrototypeOf === 'function') {
    Object.setPrototypeOf(GeoError.prototype, Error.prototype);
} else {
    GeoError.prototype = Object.create(Error.prototype);
}

// ---------------------------
// ERROR CODES
// ---------------------------

/**
 *  Enumerates Geolocator error codes.
 *  This enumeration combines Google API status (error) codes, HTML5 Geolocation
 *  position error codes and other Geolocator-specific error codes.
 *  @enum {String}
 */
GeoError.Code = {
    /**
     *  Indicates that HTML5 Geolocation API is not supported by the browser.
     *  @type {String}
     */
    GEOLOCATION_NOT_SUPPORTED: 'GEOLOCATION_NOT_SUPPORTED',
    /**
     *  Indicates that Geolocation-IP source is not set or invalid.
     *  @type {String}
     */
    INVALID_GEO_IP_SOURCE: 'INVALID_GEO_IP_SOURCE',
    /**
     *  The acquisition of the geolocation information failed because the
     *  page didn't have the permission to do it.
     *  @type {String}
     */
    PERMISSION_DENIED: 'PERMISSION_DENIED',
    /**
     *  The acquisition of the geolocation failed because at least one
     *  internal source of position returned an internal error.
     *  @type {String}
     */
    POSITION_UNAVAILABLE: 'POSITION_UNAVAILABLE',
    /**
     *  The time allowed to acquire the geolocation, defined by
     *  PositionOptions.timeout information was reached before
     *  the information was obtained.
     *  @type {String}
     */
    TIMEOUT: 'TIMEOUT',
    /**
     * Indicates that the request had one or more invalid parameters.
     * @type {String}
     */
    INVALID_PARAMETERS: 'INVALID_PARAMETERS',
    /**
     * Indicates that the service returned invalid response.
     * @type {String}
     */
    INVALID_RESPONSE: 'INVALID_RESPONSE',
    /**
     * Generally indicates that the query (address, components or latlng)
     * is missing.
     * @type {String}
     */
    INVALID_REQUEST: 'INVALID_REQUEST',
    /**
     * Indicates that the request was denied by the service.
     * This will generally occur because of a missing API key or because the request
     * is sent over HTTP instead of HTTPS.
     * @type {String}
     */
    REQUEST_DENIED: 'REQUEST_DENIED',
    /**
     * Indicates that the request has failed.
     * This will generally occur because of an XHR error.
     * @type {String}
     */
    REQUEST_FAILED: 'REQUEST_FAILED',
    /**
     * Indicates that Google API could not be loaded.
     * @type {String}
     */
    GOOGLE_API_FAILED: 'GOOGLE_API_FAILED',
    /**
     * Indicates that you are over your Google API quota.
     * @type {String}
     */
    OVER_QUERY_LIMIT: 'OVER_QUERY_LIMIT',
    /**
     * Indicates that you've exceeded the requests per second per user limit that
     * you configured in the Google Developers Console. This limit should be
     * configured to prevent a single or small group of users from exhausting your
     * daily quota, while still allowing reasonable access to all users.
     * @type {String}
     */
    USER_RATE_LIMIT_EXCEEDED: 'USER_RATE_LIMIT_EXCEEDED',
    /**
     * Indicates that you've exceeded your daily limit for Google API(s).
     * @type {String}
     */
    DAILY_LIMIT_EXCEEDED: 'DAILY_LIMIT_EXCEEDED',
    /**
     * Indicates that your Google API key is not valid. Please ensure that you've
     * included the entire key, and that you've either purchased the API or have
     * enabled billing and activated the API to obtain the free quota.
     * @type {String}
     */
    GOOGLE_KEY_INVALID: 'GOOGLE_KEY_INVALID',
    /**
     * Indicates that maximum number of elements limit is exceeded. For
     * example, for the Distance Matrix API; occurs when the product of
     * origins and destinations exceeds the per-query limit.
     * @type {String}
     */
    MAX_ELEMENTS_EXCEEDED: 'MAX_ELEMENTS_EXCEEDED',
    /**
     * Indicates that the request contained more than 25 origins,
     * or more than 25 destinations.
     * @type {String}
     */
    MAX_DIMENSIONS_EXCEEDED: 'MAX_DIMENSIONS_EXCEEDED',
    /**
     * Indicates that the request contained more than allowed waypoints.
     * @type {String}
     */
    MAX_WAYPOINTS_EXCEEDED: 'MAX_WAYPOINTS_EXCEEDED',
    /**
     * Indicates that the request body is not valid JSON.
     * @type {String}
     */
    PARSE_ERROR: 'PARSE_ERROR',
    /**
     * Indicates that the requested resource could not be found.
     * Note that this also covers `ZERO_RESULTS`.
     * @type {String}
     */
    NOT_FOUND: 'NOT_FOUND',
    /**
     * Indicates that an internal error (such as XHR cross-domain, etc) has occured.
     * @type {String}
     */
    INTERNAL_ERROR: 'INTERNAL_ERROR',
    /**
     * Indicates that an unknown error has occured.
     * @type {String}
     */
    UNKNOWN_ERROR: 'UNKNOWN_ERROR'
};

// ---------------------------
// HELPER METHODS
// ---------------------------

/**
 *  @private
 */
function errorCodeFromStatus(status) {
    if (!status) return GeoError.Code.INVALID_RESPONSE;
    if (status === 'OK') return null;
    if (status === 'ZERO_RESULTS') return GeoError.Code.NOT_FOUND;
    if (GeoError.Code.hasOwnProperty(status)) return status;
    return null;
}

/**
 *  Gets `GeoError.Code` from the given response error reason.
 *  @private
 *
 *  @param {String} reason
 *         Google response error reason.
 *
 *  @returns {String}
 */
function errorCodeFromReason(reason) {
    switch (reason) {
        case 'invalid':
            return GeoError.Code.INVALID_REQUEST;
        case 'dailyLimitExceeded':
            return GeoError.Code.DAILY_LIMIT_EXCEEDED;
        case 'keyInvalid':
            return GeoError.Code.GOOGLE_KEY_INVALID;
        case 'userRateLimitExceeded':
            return GeoError.Code.USER_RATE_LIMIT_EXCEEDED;
        case 'notFound':
            return GeoError.Code.NOT_FOUND;
        case 'parseError':
            return GeoError.Code.PARSE_ERROR;
        default:
            return null;
    }
}

// ---------------------------
// EXPORT
// ---------------------------

export default GeoError;
