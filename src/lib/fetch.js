import utils from './utils';

/**
 * Utility for making `XMLHttpRequest` and `JSONP` requests.
 * @copyright 2019, Onur Yıldırım <onur@cutepilot.com>
 */
class fetch {

    // https://html.spec.whatwg.org/multipage/scripting.html#script

    /**
     * Makes a JSONP (GET) request by injecting a script tag in the browser.
     * Note that using JSONP has some security implications. As JSONP is really
     * javascript, it can do everything else javascript can do, so you need to
     * trust the provider of the JSONP data.
     * @see https://en.wikipedia.org/wiki/JSONP
     * @memberof fetch
     *
     * @param {Object|String} options - Required. Either the URL string which
     *     will set other options to defaults or an options object with the
     *     following properties.
     *     @param {String} options.url
     *            Source URL to be called.
     *     @param {String} [options.type]
     *            The MIME type that identifies the scripting language of the
     *            code referenced within the script element.
     *            e.g. `"text/javascript"`
     *     @param {String} [options.charset]
     *            Indicates the character encoding of the external resource.
     *            e.g. `"utf-8"`.
     *     @param {Boolean} [options.async=true]
     *            Indicates whether or not to perform the operation
     *            asynchronously. See {@link http://caniuse.com/#feat=script-async|browser support}.
     *     @param {Boolean} [options.defer=false]
     *            Indicates whether the script should be executed when the page
     *            has finished parsing. See {@link http://caniuse.com/#feat=script-defer|browser support}.
     *     @param {String} [options.crossorigin]
     *            Indicates the CORS setting for the script element being
     *            injected. Note that this attribute is not widely supported.
     *            Valid values: `"anonymous"`, `"use-credentials"`.
     *            See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes|CORS settings}.
     *     @param {Number} [options.timeout=0]
     *            The number of milliseconds a request can take before
     *            automatically being terminated. `0` disables timeout.
     *     @param {Boolean} [options.clean=false]
     *            Whether to remove the loaded script from DOM when the
     *            operation ends. Note that the initial source might load
     *            additional sources which are not deteceted or removed. Only
     *            the initial source is removed.
     *     @param {Object} [options.params]
     *            Optional query parameters to be appended at the end of the URL.
     *            e.g. `{ key: "MY-KEY" }`
     *            You can also include the JSONP callback name parameter here
     *            but if you want the object to be passed to the callback
     *            argument of this method, use `options.callbackParam` to set
     *            the callback parameter.
     *     @param {String} [options.callbackParam]
     *            If the endpoint supports JSONP callbacks, you can set the
     *            callback parameter with this setting. This will enable a
     *            second `obj` argument in the callback of this method which is
     *            useful if the JSONP source invokes the callback with an
     *            argument.
     *     @param {String} [options.rootName]
     *            The name (or notation) of the object that the generated JSONP
     *            callback function should be assigned to. By default, this is
     *            the `window` object but you can set this to a custom object
     *            notation; for example, to prevent global namespace polution.
     *            Note that this root object has to be globally accessible for
     *            this to work. e.g. `"window.myObject"` (as string)
     * @param {Function} [callback]
     *        The callback function that will be executed when the script is
     *        loaded. This callback has the following signature:
     *        `function (err, obj) { ... }`. Note that the second argument
     *        `obj` will always be `undefined` if the source endpoint does not
     *        support JSONP callbacks or a callback param is not set explicitly
     *        via `options.callbackParam` (or if the source does not invoke the
     *        jsonp with an argument). However, the function will always execute
     *        when the script loads or an error occurs.
     *
     * @returns {void}
     *
     * @example
     * var opts1 = {
     * 	   url: 'some/api',
     * 	   callbackParam: 'jsonCallback',
     * 	   params: { key: 'MY-KEY' }
     * };
     * // This will load the following source:
     * // some/api?jsonCallback={auto-generated-fn-name}&key=MY-KEY
     * fetch.jsonp(opts1, function (err, obj) {
     * 	   console.log(obj); // some object
     * });
     *
     * var opts2 = {
     * 	   url: 'some/api',
     * 	   params: {
     * 		   key: 'MY-KEY',
     * 		   jsonCallback: 'my-fn-name'
     * 	   }
     * };
     * // This will load the following source:
     * // some/api?jsonCallback=my-fn-name&key=MY-KEY
     * fetch.jsonp(options, function (err, obj) {
     * 	   console.log(obj); // undefined
     * 	   // still executes, catch errors here
     * });
     * // JSON callback should be explicitly set.
     * window['my-fn-name'] = function (obj) {
     * 	   console.log(obj); // some object
     * };
     */
    static jsonp(options, callback) {
        let timeout;

        callback = utils.isFunction(callback)
            ? callback
            : utils.noop;

        if (utils.isString(options)) {
            options = { url: options };
        }

        if (utils.isPlainObject(options)) {
            options = utils.extend({
                // type: undefined,
                async: true,
                defer: false,
                // crossorigin: undefined,
                timeout: 0,
                params: {},
                // callbackParam: undefined,
                // rootName: undefined,
                clean: true
            }, options);
        } else {
            return callback(new Error('No options or target URL is provided.'));
        }

        if (utils.isString(options.url) === false || options.url.trim() === '') {
            return callback(new Error('No target URL is provided.'));
        }

        let script = document.createElement('script'),
            cbParamSet = utils.isString(options.callbackParam)
                && options.callbackParam.trim() !== '',
            cbFnName,
            root,
            rootNameSet = utils.isString(options.rootName)
                && options.rootName !== 'window'
                && options.rootName !== 'document'
                && options.rootName.trim() !== '';

        if (cbParamSet) {
            cbFnName = '_jsonp_' + utils.randomString(10);
            options.params[options.callbackParam] = rootNameSet
                ? `${options.rootName}.${cbFnName}`
                : cbFnName;
        }
        let query = utils.params(options.params) || '',
            qMark = options.url.indexOf('?') >= 0 ? '&' : '?',
            url = query ? `${options.url}${qMark}${query}` : options.url;
        // console.log(url);

        function execCb(err, timeUp, obj) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            if ((timeUp || options.clean) && script.parentNode) {
                script.parentNode.removeChild(script);
            }
            // delete the jsonp callback function
            if (rootNameSet) {
                delete root[cbFnName];
            }
            callback(err, obj);
        }

        if (cbFnName) {
            let fn = obj => {
                execCb(null, false, obj);
            };
            root = rootNameSet
                // ? window[options.rootName][cbFnName] = fn;
                ? utils.notateGlobalObj(options.rootName) // if rootName is dot-notation.
                : window;
            root[cbFnName] = fn;
        } else if (script.readyState) { // IE < 11
            script.onreadystatechange = () => {
                if (script.readyState === 'loaded'
                        || script.readyState === 'complete') {
                    script.onreadystatechange = null;
                    execCb(null);
                }
            };
        } else { // IE 11+
            script.onload = () => {
                execCb(null);
            };
        }

        script.onerror = error => {
            let errMsg = 'Could not load source at ' + utils.removeQuery(options.url);
            if (error) {
                errMsg += '\n' + (error.message || error);
            }
            execCb(new Error(errMsg));
        };

        if (options.type) {
            script.type = options.type;
        }
        if (options.charset) {
            script.charset = options.charset;
        }
        if (options.async) {
            script.async = true;
        }
        if (options.defer) {
            script.defer = true;
        }
        if (options.crossorigin) {
            script.crossorigin = options.crossorigin;
        }

        script.src = url;
        document.getElementsByTagName('head')[0].appendChild(script);

        // Timeout
        if (utils.isNumber(options.timeout) && options.timeout > 0) {
            timeout = setTimeout(() => {
                script.src = '';
                execCb(new Error('Operation timed out.'), true);
            }, options.timeout);
        }
    }

    /**
     * Makes an XMLHttpRequest with the given parameters.
     * Note that `"Access-Control-Allow-Origin"` header should be present on
     * the requested resource. Otherwise, the request will not be allowed.
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest|XMLHttpRequest}.
     * @memberof fetch
     *
     * @param {Object|String} options
     *        Either the URL string which will set other options to defaults or
     *        the full options object.
     *     @param {String} options.url
     *            Target URL to be called.
     *     @param {String} [options.method="GET"]
     *            HTTP method.
     *     @param {*} [options.data]
     *            Data to be sent with the request.
     *     @param {Number} [options.timeout]
     *            The number of milliseconds a request can take before
     *            automatically being terminated. `0` disables timeout.
     *     @param {Boolean} [options.withCredentials=false]
     *            Indicates whether or not cross-site Access-Control requests
     *            should be made using credentials such as cookies or
     *            authorization headers.
     *     @param {Boolean} [options.async=true]
     *            Indicating whether or not to perform the operation
     *            asynchronously. If this value is false, the `send()` method
     *            does not return until the response is received. If `true`,
     *            notification of a completed transaction is provided using
     *            event listeners. This must be `true` if the multipart
     *            attribute is `true`, or an exception will be thrown.
     *     @param {String} [options.mimeType]
     *            If set, overrides the MIME type returned by the server. This
     *            may be used, for example, to force a stream to be treated and
     *            parsed as `text/xml`, even if the server does not report it as
     *            such.
     *     @param {Object} [options.headers]
     *            Sets the HTTP request headers. Each key should be a header
     *            name with a value. e.g. `{ 'Content-Length': 50 }`. For
     *            security reasons, some headers cannot be set and can only be
     *            controlled by the user agent.
     *     @param {String} [options.username=""]
     *            User name to use for authentication purposes.
     *     @param {String} [options.password=""]
     *            Password to use for authentication purposes.
     * @param {Function} [callback]
     *        The callback function in the following signature:
     *        `function (err, xhr) { ... }`
     *        Note that `xhr` object is always passed regardless of an error.
     *
     * @returns {void}
     */
    static xhr(options, callback) {
        let xhr, err;
        let isXDR = false;

        if ('XMLHttpRequest' in window) {
            xhr = new XMLHttpRequest();
        } else if ('XDomainRequest' in window) { // IE9
            xhr = new XDomainRequest();
            isXDR = true;
        } else {
            throw new Error('XMLHttpRequest is not supported!');
        }

        let hasCallback = utils.isFunction(callback);
        callback = hasCallback
            ? callback
            : utils.noop;

        if (utils.isString(options)) options = { url: options };
        if (utils.isPlainObject(options)) {
            options = utils.extend({
                method: 'GET',
                data: undefined,
                async: true,
                timeout: 0, // no timeout
                withCredentials: false,
                mimeType: undefined,
                username: '',
                password: ''
            }, options);
        } else {
            callback(new Error('No options or target URL is provided.'));
        }

        if (utils.isString(options.url) === false) {
            callback(new Error('No target URL is provided.'));
        }

        options.username = String(options.username);
        options.password = String(options.password);
        options.method = options.method.toUpperCase();
        if (options.method !== 'POST' && options.method !== 'PUT') {
            options.data = undefined;
        }
        // console.log(JSON.stringify(options));

        function xError() {
            let crossDomain = xhr.status === 0
                ? '. Make sure you have permission if this is a cross-domain request.'
                : '';
            err = new Error(`The request returned status: ${xhr.status}${crossDomain}`);
            // console.log(xhr);
            callback(err, xhr);
        }

        if (hasCallback) {
            if (isXDR) { // IE9
                xhr.onload = () => {
                    callback(null, xhr);
                };
                xhr.onerror = xError;
            } else {
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === fetch.XHR_READY_STATE.DONE) {
                        if (xhr.status === 200) {
                            callback(null, xhr);
                        } else {
                            xError();
                        }
                    }
                };
            }

            if (utils.isNumber(options.timeout) && options.timeout > 0) {
                xhr.timeout = options.timeout;
                xhr.ontimeout = () => {
                    // xhr.abort();
                    err = new Error('The request had timed out.');
                    callback(err, xhr);
                };
            }
        }
        // console.log(options);
        xhr.open(options.method, options.url, options.async, options.username, options.password);

        // if this is XDomainRequest, it doesn't support setting custom headers;
        // or overriding the mime type.
        if (!isXDR) {
            if (utils.isPlainObject(options.headers)) {
                // xhr.setRequestHeader() method should be called after open(), but
                // before send().
                Object.keys(options.headers).forEach(key => {
                    let value = options.headers[key];
                    xhr.setRequestHeader(key, value);
                });
            }

            // xhr.overrideMimeType() method must be called before send().
            if (options.mimeType) {
                xhr.overrideMimeType(options.mimeType);
            }
        }

        xhr.send(options.data);
    }

    /**
     * Alias of `fetch.xhr()` with request method set to `"GET"` by default.
     * @memberof fetch
     *
     * @param {Object} options
     *        Either the URL string which will set other options to defaults or
     *        the full options object. See `fetch.xhr()` method options for
     *        details.
     * @param {Function} [callback]
     *        The callback function in the following signature:
     *        `function (err, xhr) { ... }`
     *        Note that `xhr` object is always passed regardless of an error.
     * @returns {void}
     */
    static get(options, callback) {
        return fetch.xhr(options, callback);
    }

    /**
     * Alias of `fetch.xhr()` with request method set to `"POST"` by default.
     * @memberof fetch
     *
     * @param {Object} options
     *        Either the URL string which will set other options to defaults or
     *        the full options object. See `fetch.xhr()` method options for
     *        details.
     * @param {Function} [callback]
     *        The callback function in the following signature:
     *        `function (err, xhr) { ... }`
     *        Note that `xhr` object is always passed regardless of an error.
     * @returns {void}
     */
    static post(options, callback) {
        return _xhr('POST', options, callback);
    }

    /**
     * Alias of `fetch.xhr()` with request method set to `"PUT"` by default.
     * @memberof fetch
     *
     * @param {Object} options
     *        Either the URL string which will set other options to defaults or
     *        the full options object. See `fetch.xhr()` method options for
     *        details.
     * @param {Function} [callback]
     *        The callback function in the following signature:
     *        `function (err, xhr) { ... }`
     *        Note that `xhr` object is always passed regardless of an error.
     * @returns {void}
     */
    static put(options, callback) {
        return _xhr('PUT', options, callback);
    }

    /**
     * Alias of `fetch.xhr()` with request method set to `"DELETE"` by default.
     * @memberof fetch
     *
     * @param {Object} options
     *        Either the URL string which will set other options to defaults or
     *        the full options object. See `fetch.xhr()` method options for
     *        details.
     * @param {Function} [callback]
     *        The callback function in the following signature:
     *        `function (err, xhr) { ... }`
     *        Note that `xhr` object is always passed regardless of an error.
     * @returns {void}
     */
    static delete(options, callback) {
        return _xhr('DELETE', options, callback);
    }
}

/**
 *  @private
 */
function _xhr(method, options, callback) {
    options = utils.isString(options)
        ? { url: options }
        : options || {};
    options.method = method;
    return fetch.xhr(options, callback);
}

/**
 * Enumerates `XMLHttpRequest` ready states.
 * Not to be confused with `script.readyState`.
 * @memberof fetch
 *
 * @enum {Number}
 */
fetch.XHR_READY_STATE = {
    /**
     * `xhr.open()` has not been called yet.
     * @type {Number}
     */
    UNSENT: 0,
    /**
     * `xhr.send()` has been called.
     * @type {Number}
     */
    OPENED: 1,
    /**
     * `xhr.send()` has been called, and headers and status are available.
     * @type {Number}
     */
    HEADERS_RECEIVED: 2,
    /**
     * Downloading; responseText holds partial data.
     * @type {Number}
     */
    LOADING: 3,
    /**
     * The operation is complete.
     * @type {Number}
     */
    DONE: 4
};

export default fetch;
