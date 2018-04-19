let _toString = Object.prototype.toString;

/**
 * Simple utility methods; internally used within Geolocator core;
 * made publically accessible.
 * @type {Object}
 * @readonly
 */
const utils = {

    noop() {},

    // ---------------------------
    // Validation
    // ---------------------------

    /**
     * Checks if the type of the given value is `String`.
     * @memberof utils
     *
     * @param {*} value - Value to be checked.
     * @returns {Boolean}
     */
    isString(value) {
        return typeof value === 'string';
    },

    isStringSet(value) {
        return typeof value === 'string' && value.trim().length > 0;
    },

    /**
     * Checks if the type of the given value is `Number`.
     * @memberof utils
     *
     * @param {*} value - Value to be checked.
     * @returns {Boolean}
     */
    isNumber(value) {
        return typeof value === 'number';
    },

    /**
     * Checks if the type of the given value is an `Object` or `Function`.
     * @memberof utils
     *
     * @param {*} value - Value to be checked.
     * @returns {Boolean}
     */
    isObject(value) {
        let type = typeof value;
        return Boolean(value) && (type === 'object' || type === 'function');
    },

    /**
     * Checks if the type of the given value is `Function`.
     * @memberof utils
     *
     * @param {*} value - Value to be checked.
     * @returns {Boolean}
     */
    isFunction(value) {
        return typeof value === 'function';
    },

    /**
     * Checks if the type of the given value is `Array`.
     * @memberof utils
     *
     * @param {*} value - Value to be checked.
     * @returns {Boolean}
     */
    isArray(value) {
        return Boolean(value) && _toString.call(value) === '[object Array]';
    },

    /**
     * Checks if the given object is a non-empty `Array`.
     * @memberof utils
     *
     * @param {*} array - Object to be checked.
     * @returns {Boolean}
     */
    isFilledArray(array) {
        return utils.isArray(array) && array.length > 0;
    },

    /**
     * Checks if the given value is a plain `Object`.
     * @memberof utils
     *
     * @param {*} value - Value to be checked.
     * @returns {Boolean}
     */
    isPlainObject(value) {
        return Boolean(value)
            && typeof value === 'object'
            && _toString.call(value) === '[object Object]';
    },

    /**
     * Checks if the given value is a `Date`.
     * @memberof utils
     *
     * @param {*} value - Value to be checked.
     * @returns {Boolean}
     */
    isDate(value) {
        return Boolean(value) && _toString.call(value) === '[object Date]';
    },

    /**
     * Checks if the given object is a DOM element.
     * @memberof utils
     *
     * @param {Object} object - Object to be checked.
     * @returns {Boolean}
     */
    isElement(object) {
        if (!object) return false;
        return object instanceof HTMLElement
            || (typeof object === 'object' && object.nodeType === 1);
    },

    /**
     * Checks if the given object is a DOM node.
     * @memberof utils
     *
     * @param {Object} object - Object to be checked.
     * @returns {Boolean}
     */
    isNode(object) {
        if (!object) return false;
        return object instanceof Node
            || (typeof object === 'object' && typeof object.nodeType === 'number');
    },

    /**
     * Checks if the given object is a jQuery instance.
     * This will still return `false` if the jQuery instance has no items.
     * @memberof utils
     *
     * @param {Object} object - Object to be checked.
     * @returns {Boolean}
     */
    isJQueryObject(object) {
        if (!object) return false;
        return ('jQuery' in window && object instanceof window.jQuery && Boolean(object[0]));
            // http://api.jquery.com/jquery-2/
            // || (typeof object === 'object' && Boolean(object.jquery));
    },

    /**
     * Checks if the type of the given value is an HTML5 `PositionError`.
     * @memberof utils
     *
     * @param {*} value - Value to be checked.
     * @returns {Boolean}
     */
    isPositionError(value) {
        return Boolean(value) && _toString.call(value) === '[object PositionError]';
    },

    /**
     * Checks if the given value is an instance of `Error` or HTML5 `PositionError`.
     * @memberof utils
     *
     * @param {*} value - Value to be checked.
     * @returns {Boolean}
     */
    isError(value) {
        return (value instanceof Error) || utils.isPositionError(value);
    },

    // ---------------------------
    // String
    // ---------------------------

    /**
     * Removes the query string portion from the given URL string.
     * @memberof utils
     *
     * @param {String} str - String to be processed.
     * @returns {String} - Returns the rest of the string.
     */
    removeQuery(str) {
        return str.replace(/\?.*$/, '');
    },

    /**
     * Removes the protocol portion from the given URL string.
     * @memberof utils
     *
     * @param {String} str - String to be processed.
     * @returns {String} - Returns the rest of the string.
     */
    removeProtocol(str) {
        return str.replace(/^(.*:)?\/\//, '');
    },

    /**
     * Sets the protocol of the given URL.
     * @memberof utils
     *
     * @param {String} url
     *        The URL to be modified.
     * @param {Boolean} [https]
     *        Specifies whether to set the protocol to HTTPS.
     *        If omitted, current page protocol will be used.
     *
     * @returns {String} - The modified URL string.
     */
    setProtocol(url, https) {
        let p;
        if (https === undefined || https === null) {
            p = window.location.protocol;
        } else {
            p = https ? 'https:' : 'http:';
        }
        url = utils.removeProtocol(url);
        return `${p}//${url}`;
    },

    /**
     * Removes both the leading and trailing dots from the given string.
     * @memberof utils
     *
     * @param {String} str - String to be processed.
     * @returns {String} - Returns the rest of the string.
     */
    trimDots(str) {
        return str.replace(/^\.+?(.*?)\.+?$/g, '$1');
    },

    /**
     * URL-Encodes the given string. Note that the encoding is done Google's
     * way; that is, spaces are replaced with `+` instead of `%20`.
     * @memberof utils
     *
     * @param {String} str - String to be processed.
     * @returns {String} - Returns the encoded string.
     */
    encodeURI(str) {
        return encodeURIComponent(str).replace(/%20/g, '+');
    },

    /**
     * URL-Decodes the given string. This is the reverse of `utils.encodeURI()`;
     * so pluses (`+`) are replaced with spaces.
     * @memberof utils
     *
     * @param {String} str - String to be processed.
     * @returns {String} - Returns the decoded string.
     */
    decodeURI(str) {
        return decodeURIComponent(str.replace(/\+/g, '%20'));
    },

    /**
     * Converts the given value to string.
     * `null` and `undefined` converts to empty string.
     * If value is a function, it's native `toString()` method is used.
     * Otherwise, value is coerced.
     * @memberof utils
     *
     * @param {*} value - String to be converted.
     * @returns {String} - Returns the result string.
     */
    toString(value) {
        if (value === null || value === undefined) return '';
        if (value.toString && utils.isFunction(value.toString)) {
            return value.toString();
        }
        return String(value);
    },

    /**
     * Generates a random string with the number of characters.
     * @memberof utils
     *
     * @param {Number} [len=1] - Length of the string.
     * @returns {String} - Returns a random string.
     */
    randomString(len) {
        if (!len || !utils.isNumber(len)) len = 1;
        len = -Math.abs(len);
        return Math.random().toString(36).slice(len);
    },

    /**
     * Gets the abbreviation of the given phrase.
     * @memberof utils
     *
     * @param {String} str
     *        String to abbreviate.
     * @param {Object} [options]
     *        Abbreviation options.
     *     @param {Boolean} [options.upper=true]
     *            Whether to convert to upper-case.
     *     @param {Boolean} [options.dots=true]
     *            Whether to add dots after each abbreviation.
     *
     * @returns {String} - Returns the abbreviation of the given phrase.
     */
    abbr(str, options) {
        options = utils.extend({
            upper: true,
            dots: true
        }, options);
        let d = options.dots ? '.' : '',
            s = str.match(/(\b\w)/gi).join(d) + d;
        return options.upper ? s.toUpperCase() : s;
    },

    /**
     * Builds URI parameters from the given object.
     * Note: This does not iterate deep objects.
     * @memberof utils
     *
     * @param {Object} obj - Object to be processed.
     * @param {Object} options - Parameterize options.
     *     @param {Boolean} [options.encode=true]
     *            Whether to encode URI components.
     *     @param {String} [options.operator="="]
     *     @param {String} [options.separator="&"]
     *     @param {Array} [options.include]
     *            Keys to be included in the output params. If defined,
     *            `options.exclude` is ignored.
     *     @param {Array} [options.exclude]
     *            Keys to be excluded from the output params.
     *
     * @returns {String} - URI parameters string.
     */
    params(obj, options) {
        if (!utils.isPlainObject(obj) || Object.keys(obj).length === 0) {
            return '';
        }

        options = utils.extend({
            encode: true,
            operator: '=',
            separator: '&',
            include: undefined,
            exclude: undefined
        }, options);

        let params = [],
            inc = utils.isArray(options.include) ? options.include : null,
            exc = !inc && utils.isArray(options.exclude) ? options.exclude : null;
        utils.forIn(obj, (value, key) => {
            if ((!inc || inc.indexOf(key) >= 0)
                    && (!exc || exc.indexOf(key) < 0)) {
                let v = utils.toString(value);
                v = options.encode ? utils.encodeURI(v) : v;
                let k = options.encode ? utils.encodeURI(key) : key;
                params.push(k + options.operator + v);
            }
        });

        return params.join(options.separator);
    },

    /**
     * Gets the object from the given object notation string.
     * @private
     *
     * @param {String} notation - Object notation.
     * @returns {*} - Any existing object.
     */
    notateGlobalObj(notation) {
        notation = utils.trimDots(notation);
        let levels = notation.split('.'),
            o = window;
        if (levels[0] === 'window' || levels[0] === 'document') {
            levels.shift();
        }
        levels.forEach(note => {
            o = o[note];
        });
        return o;
    },

    // ---------------------------
    // Object
    // ---------------------------

    /**
     * Iterates over own properties of an object invoking a callback for each
     * property.
     * @memberof utils
     *
     * @param {Object} obj
     *        Object to be processed.
     * @param {Function} callback
     *        Callback function with the following signature:
     *        `function (value, key, object) { ... }`.
     *        Explicitly returning `false` will exit the iteration early.
     * @returns {void}
     */
    forIn(obj, callback) {
        let k;
        for (k in obj) {
            // if (obj.hasOwnProperty(k)) {} // Do this inside callback if needed.
            if (callback(obj[k], k, obj) === false) break;
        }
    },

    /**
     * Extends the given object with the specified sources.
     * Right most source overwrites the previous.
     * NOTE: This is not a full implementation. Use with caution.
     * @memberof utils
     *
     * @param {Object} destination
     *        Destionation Object that will be extended and holds the default
     *        values.
     * @param {...Object} sources
     *        Source objects to be merged.
     *
     * @returns {Object} - Returns the extended object.
     */
    extend(destination, ...sources) {
        if (!utils.isObject(destination)) return {};
        let key, value;
        sources.forEach(source => {
            for (key in source) { // eslint-disable-line
                value = source[key];
                if (utils.isArray(value)) {
                    destination[key] = value.concat();
                } else if (utils.isDate(value)) {
                    destination[key] = new Date(value);
                } else if (utils.isFunction(value)) { // should be before object
                    destination[key] = value;
                } else if (utils.isObject(value)) {
                    destination[key] = utils.extend({}, value);
                } else {
                    destination[key] = value;
                }
            }
        });
        return destination;
    },

    /**
     * Clones the given object.
     * NOTE: This is not a full implementation. Use with caution.
     * @memberof utils
     *
     * @param {Object} obj
     *        Target Object to be cloned.
     * @param {Object|Array} [options]
     *        Clone options or array of keys to be cloned.
     *     @param {Array} [options.keys]
     *            Keys of the properties to be cloned.
     *     @param {Boolean} [options.own=true]
     *            Whether to clone own properties only. This is only effective
     *            if `keys` is not defined.
     *
     * @returns {Object} - Returns the cloned object.
     */
    clone(obj, options) {
        if (!obj) return {};

        if (utils.isArray(options)) {
            options = { keys: options };
        }
        options = utils.extend({
            keys: null,
            own: true
        }, options);

        let include,
            cloned = {};

        utils.forIn(obj, (value, key) => {
            include = options.keys
                ? options.keys.indexOf(key) >= 0
                : (options.own && obj.hasOwnProperty(key)) || !options.own;
            if (include) {
                if (utils.isObject(value)) {
                    cloned[key] = utils.clone(value, options);
                } else {
                    cloned[key] = value;
                }
            }
        });
        return cloned;
    },

    /**
     *  Maps the values of the given object to a schema to re-structure a new
     *  object.
     *  @memberof utils
     *
     *  @param {Object} obj
     *         Original object to be mapped.
     *  @param {Object} schema
     *         Schema to be used to map the object.
     *
     *  @returns {Object} - Mapped object.
     */
    mapToSchema(obj, schema) {
        let mapped = {};
        utils.forIn(schema, (value, key) => {
            if (utils.isPlainObject(value)) {
                mapped[key] = utils.mapToSchema(obj, value);
            } else {
                mapped[key] = obj[value];
            }
        });
        return mapped;
    },

    // ---------------------------
    // Misc
    // ---------------------------

    /**
     * Safely parses the given JSON `String` into an `Object`.
     * The only difference from `JSON.parse()` is that this method does not
     * throw for invalid input. Instead, returns `null`.
     * @memberof utils
     *
     * @param {String} str - JSON string to be parsed
     * @returns {Object|null} - Returns the parsed `Object` or `null` if the
     * input is invalid.
     */
    safeJsonParse(str) {
        let o = null;
        try {
            o = JSON.parse(str);
        } catch (e) {}
        return o;
    },

    /**
     * Gets a timestamp that is seconds or milliseconds since midnight,
     * January 1, 1970 UTC.
     * @memberof utils
     *
     * @param {Boolean} [seconds=false]
     *        Specifies whether seconds should be returned instead of
     *        milliseconds.
     *
     * @returns {Number} - Returns seconds or milliseconds since midnight,
     * January 1, 1970 UTC.
     */
    time(seconds) {
        let ts = Date.now();
        return seconds ? parseInt(ts / 1000, 10) : ts;
    }

};

export default utils;
