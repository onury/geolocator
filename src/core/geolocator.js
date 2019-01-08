import utils from '../lib/utils';
import fetch from '../lib/fetch';
import geoHelper from './geo.helper';
import GeoError from './geo.error';
import GeoWatcher from './geo.watcher';
import enums from './enums';

/**
 *  Radius of earth in kilometers.
 *  @private
 *  @type {Number}
 */
const EARTH_RADIUS_KM = 6371;

/**
 *  Radius of earth in miles.
 *  @private
 *  @type {Number}
 */
const EARTH_RADIUS_MI = 3959;

/**
 *  Storage for Geolocator default configuration.
 *
 *  @readonly
 *  @private
 */
const defaultConfig = {
    language: 'en',
    https: true,
    google: {
        version: '3', // latest 3.x
        key: '',
        styles: null
    }
};

/**
 *  Geolocator library that provides methods for getting geo-location information,
 *  geocoding, address look-ups, distance & durations, timezone information and more...
 *  This library makes use of HTML5 position feautures, implements Google APIs
 *  and other services.
 *
 *  <b>Important Notes:</b>
 *
 *  Although some calls might work without a key, it is generally required by
 *  most {@link https://developers.google.com/maps/faq#using-google-maps-apis|Goolge APIs}
 *  (such as Time Zone API). To get a free (or premium) key,
 *  {@link https://developers.google.com/maps/documentation/javascript/|click here}.
 *  After getting a key, you can enable multiple APIs for it. Make sure you
 *  {@link https://console.developers.google.com|enable}
 *  all the APIs supported by Geolocator.
 *
 *  Note that browser API keys cannot have referer restrictions when used
 *  with some Google APIs.
 *
 *  Make sure your doctype is HTML5 and you're calling Geolocation APIs from an
 *  HTTPS page. Geolocation API is removed from unsecured origins in Chrome 50.
 *  Other browsers are expected to follow.
 *
 *  @license MIT
 *  @copyright 2019, Onur Yıldırım <onur@cutepilot.com>
 */
class geolocator {

    // ---------------------------
    // PROPERTIES
    // ---------------------------

    /**
     *  Geolocator Error class that provides a common type of error object for
     *  the various APIs implemented in Geolocator. All callbacks of Geolocator
     *  will include an instance of this object as the first argument; if the
     *  corresponding operation fails. Also all thrown errors will be an instance
     *  of this object.
     *
     *  This object also enumerates
     *  {@link ?api=geolocator-error#GeoError.Code|Geolocator Error codes}.
     *
     *  @see {@link ?api=geolocator-error|`GeoError` documentation}
     *  @type {GeoError}
     *  @readonly
     */
    static get Error() {
        return GeoError;
    }

    /**
     *  Documented separately in enums.js
     *  @private
     */
    static get MapTypeId() {
        return enums.MapTypeId;
    }

    /**
     *  Documented separately in enums.js
     *  @private
     */
    static get LocationType() {
        return enums.LocationType;
    }

    /**
     *  Documented separately in enums.js
     *  @private
     */
    static get TravelMode() {
        return enums.TravelMode;
    }

    /**
     *  Documented separately in enums.js
     *  @private
     */
    static get UnitSystem() {
        return enums.UnitSystem;
    }

    /**
     *  Documented separately in enums.js
     *  @private
     */
    static get RadioType() {
        return enums.RadioType;
    }

    /**
     *  Documented separately in enums.js
     *  @private
     */
    static get DistanceFormula() {
        return enums.DistanceFormula;
    }

    /**
     *  Documented separately in enums.js
     *  @private
     */
    static get ImageFormat() {
        return enums.ImageFormat;
    }

    // ---------------------------
    // STATIC METHODS
    // ---------------------------

    /**
     *  Sets or gets the geolocator configuration object.
     *  Make sure you configure Geolocator before calling other methods that
     *  require a Google API key.
     *
     *  @param {Object} [options]
     *         Configuration object. If omitted, this method returns the current
     *         configuration.
     *      @param {String} [options.language="en"]
     *             Language to be used for API requests that supports language
     *             configurations. This is generally used for Google APIs.
     *             See {@link https://developers.google.com/maps/faq#languagesupport|supported languages}.
     *      @param {Boolean} [options.https=true]
     *             As Google recommends; using HTTPS encryption makes your site
     *             more secure, and more resistant to snooping or tampering.
     *             If set to `true`, the API calls are made over HTTPS, at all
     *             times. Setting to `false` will switch to HTTP (even if the
     *             page is on HTTPS). And if set to `null`, current protocol will
     *             be used. Note that some APIs might not work with HTTP such as
     *             Google Maps TimeZone API.
     *      @param {Object} [options.google]
     *             Google specific options.
     *          @param {String} [options.google.version="3"]
     *                 Google Maps API version to be used (with
     *                 `geolocator.createMap()`) method. The default version
     *                 value is tested and works with Geolocator. You can set a
     *                 greater value or the latest version number and it should
     *                 work; but it's not guaranteed. Find out the
     *                 {@link https://developers.google.com/maps/documentation/javascript/versions|latest version here}.
     *          @param {String} [options.google.key=""]
     *                 API key to be used with Google API calls. Although some
     *                 calls might work without a key, it is generally required
     *                 by most Goolge APIs. To get a free (or premium) key,
     *                 {@link https://developers.google.com/maps/documentation/javascript/|click here}.
     *          @param {Array} [options.google.styles]
     *                 An array of objects to customize the presentation of the
     *                 Google base maps, changing the visual display of such
     *                 elements as roads, parks, and built-up areas.
     *                 See {@link https://developers.google.com/maps/documentation/javascript/styling|Styling Maps}.
     *
     *  @returns {Object} - Returns the current or updated configuration object.
     *
     *  @example
     *  geolocator.config({
     *      language: "en",
     *      google: {
     *          version: "3",
     *          key: "YOUR-GOOGLE-API-KEY"
     *      }
     *  });
     */
    static config(options) {
        if (options) {
            geolocator._.config = utils.extend(defaultConfig, options);
        }
        return geolocator._.config;
    }

    /**
     *  Gets a static map image URL which can be embeded via an `<img />` tag
     *  on the page.
     *
     *  Note that, if `options.center` is set to an address (instead of
     *  coordinates) and `options.marker` is also set; we will need to geocode
     *  that address to get center coordinates for the marker.
     *  In this case, you must use the `callback` parameter to get the async
     *  result. Otherwise, this method will directly return a `String`.
     *
     *  Make sure you have enabled Static Maps API (and Geocoding API if
     *  `marker` is enabled) in your Google Developers console.
     *
     *  For interactive map, see {@link #geolocator.createMap|`geolocator.createMap()` method}.
     *
     *  @see {@link https://developers.google.com/maps/documentation/static-maps/intro|Static Maps}
     *  @see {@link https://developers.google.com/maps/documentation/static-maps/usage-limits|Usage Limits}
     *
     *  @param {Object} options
     *         Static map options.
     *         @param {String|Object} options.center
     *                Defines the center of the map and the location.
     *                Either an address `String` or an coordinates `Object` with
     *                `latitude:Number` and `longitude:Number` properties.
     *         @param {String} [options.mapTypeId="roadmap"]
     *                Type of the map to be created.
     *                See {@link #geolocator.MapTypeId|`geolocator.MapTypeId` enumeration}
     *                for possible values.
     *         @param {String|Object} [options.size="600x300"]
     *                Defines the size (in pixels) of the returned image.
     *                Either a string in `widthxheight` format or an Object
     *                with `width:Number` and `height:Number` properties.
     *         @param {Number} [options.scale=1]
     *                Affects the number of pixels that are returned. scale=2
     *                returns twice as many pixels as scale=1 while retaining
     *                the same coverage area and level of detail (i.e. the
     *                contents of the map don't change). Accepted values are 1,
     *                2 and 4 (4 is only available to Google Maps APIs Premium
     *                Plan customers.)
     *         @param {Number} [options.zoom=9]
     *                Zoom level to be set for the map.
     *         @param {String} [options.format=png]
     *                Defines the format of the resulting image.
     *                See {@link #geolocator.ImageFormat|`geolocator.ImageFormat` enumeration}
     *                for possible values.
     *         @param {Boolean|String} [options.marker=true]
     *                Specifies whether to add a marker to the center of the map.
     *                You can define the color of the marker by passing a color
     *                `String` instead of a `Boolean`. Color can be a predefined
     *                color from the set `red` (default), `black`, `brown`,
     *                `green`, `purple`, `yellow`, `blue`, `gray`, `orange` and
     *                `white`; or a HEX 24-bit color (e.g. `"0xFF0000"`).
     *                Note that marker will not be visible if `center` is set to
     *                a `String` address and you don't use the callback.
     *         @param {String} [options.region]
     *                Defines the appropriate borders to display, based on
     *                geo-political sensitivities. Accepts a region code
     *                specified as a two-character ccTLD (top-level domain)
     *                value. e.g. `"us"`.
     *         @param {Array} [options.styles]
     *                An array of objects to customize the presentation of the
     *                Google base maps, changing the visual display of such
     *                elements as roads, parks, and built-up areas.
     *                This will default to the global styles set via
     *                {@link #geolocator.config|`geolocator.config()` method}, if any.
     *                See {@link https://developers.google.com/maps/documentation/javascript/styling|Styling Maps}.
     *
     *  @param {Function} [callback]
     *         Callback function to be executed when the static map URL is built.
     *         This takes 2 arguments: `function (err, url) { ... }`.
     *         If omitted, this method will directly return the static map
     *         image URL; but (if enabled) the marker will not be visible if
     *         `options.center` is set to an address `String` instead of a
     *         coordinates `Object`.
     *
     *  @returns {String|void}
     *           If a callback is passed, this will return `void`.
     *           Otherwise, a `String` that represents the URL of the static map.
     *
     *  @example
     *  // Async example (with address and marker)
     *  var options = {
     *      center: "Los Angles, CA, US",
     *      mapTypeId: geolocator.MapTypeId.ROADMAP,
     *      size: "600x300",
     *      scale: 1,
     *      zoom: 5,
     *      marker: "0xFFCC00",
     *      format: geolocator.ImageFormat.PNG
     *  };
     *  geolocator.getStaticMap(options, function (err, url) {
     *      if (!err) {
     *          document.getElementById('my-img').src = url;
     *      }
     *  });
     *
     *  @example
     *  // Sync example (with coordinates)
     *  var options = {
     *      center: {
     *          longitude: 34.0522342,
     *          latitude: -118.2436849
     *      },
     *      mapTypeId: geolocator.MapTypeId.ROADMAP,
     *      size: "600x300",
     *      scale: 1,
     *      zoom: 5,
     *      marker: "0xFFCC00",
     *      format: geolocator.ImageFormat.PNG
     *  };
     *  document.getElementById('my-img').src = geolocator.getStaticMap(options);
     */
    static getStaticMap(options, callback) {
        if (!utils.isPlainObject(options) || !options.center) {
            throw new GeoError(GeoError.Code.INVALID_PARAMETERS,
                'A center address or coordinates are required.');
        }

        if (utils.isString(options.center)) {
            return geolocator.geocode(options.center, (err, location) => {
                if (err) callback(err);
                options.center = location.coords;
                callback(null, geolocator.getStaticMap(options));
            });
        }

        let conf = geolocator._.config;
        let opts = utils.extend({
            mapTypeId: enums.MapTypeId.ROADMAP,
            size: {
                width: 600,
                height: 300
            },
            scale: 1, // 1 | 2 | (4 for business customers of google maps)
            zoom: 9,
            marker: 'red',
            format: enums.ImageFormat.PNG,
            language: conf.language || 'en',
            region: null
        }, options);

        let center = utils.isPlainObject(opts.center)
            ? `${opts.center.latitude},${opts.center.longitude}`
            : String(opts.center);

        let size = utils.isPlainObject(opts.size)
            ? `${opts.size.width}x${opts.size.height}`
            : String(opts.size);

        let url = enums.URL.GOOGLE_SATATIC_MAP // not using utils.setProtocol() here
            + `?center=${center}&maptype=${opts.mapTypeId}`
            + `&size=${size}&scale=${opts.scale}&zoom=${opts.zoom}`
            + `&format=${opts.format}&language=${opts.language}`;

        if (opts.marker) {
            let color = utils.isString(opts.marker) ? opts.marker : 'red';
            url += '&markers=' + encodeURIComponent(`color:${color}|${center}`);
        }
        if (opts.region) url += '&region=' + opts.region;
        if (conf.google.key) url += '&key=' + conf.google.key;

        let styles = getStyles(opts);
        if (styles) url += '&' + geoHelper.mapStylesToParams(styles);

        if (utils.isFunction(callback)) return callback(null, url);
        return url;
    }

    /**
     *  Creates an interactive Google Map within the given element.
     *  Make sure you have enabled Google Static Maps API in your Google Developers console.
     *  For static map, see {@link #geolocator.getStaticMap|`geolocator.getStaticMap()` method}.
     *  @see {@link https://developers.google.com/maps/documentation/javascript/reference|Google Maps JavaScript API}
     *  @see {@link https://developers.google.com/maps/documentation/javascript/usage|Usage Limits}
     *
     *  @param {Object|String|HTMLElement|Map} options
     *         Either map options object with the following properties or; the ID
     *         of a DOM element, or element itself which the map will be
     *         created within; or a previously created `google.maps.Map` instance.
     *         If a map instance is set, this only will apply the options without
     *         re-creating it.
     *      @param {String|HTMLElement|Map} options.element
     *             Either the ID of a DOM element or the element itself;
     *             which the map will be created within; or a previously created
     *             `google.maps.Map` instance. If a map instance is set, this
     *             only will apply the options without re-creating it.
     *      @param {Object} options.center
     *             Center coordinates for the map to be created.
     *          @param {Number} options.center.latitude
     *                 Latitude of the center point coordinates.
     *          @param {Number} options.center.longitude
     *                 Longitude of the center point coordinates.
     *      @param {String} [options.mapTypeId="roadmap"]
     *             Type of the map to be created.
     *             See {@link #geolocator.MapTypeId|`geolocator.MapTypeId` enumeration}
     *             for possible values.
     *      @param {String} [options.title]
     *             Title text to be displayed within an `InfoWindow`, when the
     *             marker is clicked. This only take effect if `marker` is
     *             enabled.
     *      @param {Boolean} [options.marker=true]
     *             Whether to place a marker at the given coordinates.
     *             If `title` is set, an `InfoWindow` will be opened when the
     *             marker is clicked.
     *      @param {Number} [options.zoom=9]
     *             Zoom level to be set for the map.
     *      @param {Array} [options.styles]
     *             An array of objects to customize the presentation of the
     *             Google base maps, changing the visual display of such
     *             elements as roads, parks, and built-up areas.
     *             This will default to the global styles set via
     *             {@link #geolocator.config|`geolocator.config` method}`, if any.
     *             See {@link https://developers.google.com/maps/documentation/javascript/styling|Styling Maps}.
     *
     *  @param {Function} callback
     *         Callback function to be executed when the map is created.
     *         This takes 2 arguments: `function (err, map) { ... }`.
     *         See {@link #geolocator~MapData|`geolocator~MapData` type} for details.
     *
     *  @returns {void}
     *
     *  @example
     *  var options = {
     *      element: "my-map",
     *      center: {
     *          latitude: 48.8534100,
     *          longitude: 2.3488000
     *  	},
     *  	marker: true,
     *  	title: "Paris, France",
     *  	zoom: 12
     *  };
     *  geolocator.createMap(options, function (err, map) {
     *      if (map && map.infoWindow) {
     *          map.infoWindow.open(map.instance, map.marker);
     *      }
     *  });
     */
    static createMap(options, callback) {
        // if options is not a plain object, consider element ID, `HTMLElement`,
        // `jQuery` instance or `google.maps.Map` instance.
        if (!utils.isPlainObject(options)) {
            options = { element: options };
        }

        options = utils.extend({
            element: null,
            mapTypeId: enums.MapTypeId.ROADMAP,
            title: undefined,
            marker: true,
            zoom: 9
        }, options);

        let e = options.element,
            elem;
        if (utils.isString(e)) {
            elem = document.getElementById(e);
        } else if (utils.isJQueryObject(e)) {
            elem = e[0];
        } else if (geolocator.isGoogleLoaded() && e instanceof google.maps.Map) {
            elem = e.getDiv();
        }

        if (!utils.isElement(elem) && !utils.isNode(elem)) {
            throw new GeoError(GeoError.Code.INVALID_PARAMETERS,
                'A valid DOM element or element ID is required to create a map.');
        }

        if (!utils.isPlainObject(options.center)
                || !utils.isNumber(options.center.latitude)
                || !utils.isNumber(options.center.longitude)) {
            throw new GeoError(GeoError.Code.INVALID_PARAMETERS,
                'Center coordinates are required to create a map.');
        }

        options.element = elem;

        let conf = geolocator._.config,
            key = conf.google.key;
        options.styles = getStyles(options);

        geolocator.ensureGoogleLoaded(key, err => {
            if (err) {
                throw new GeoError(GeoError.Code.GOOGLE_API_FAILED, String(err.message || err));
            }

            let mapData = configCreateMap(options);
            callback(null, mapData);
        });
    }

    /**
     *  Locates the user's location via HTML5 geolocation. This may
     *  require/prompt for user's permission. If the permission is granted we'll
     *  get the most accurate location information. Otherwise, we'll fallback to
     *  locating via user's IP (if enabled).
     *
     *  For better accuracy, Geolocator implements a different approach than the
     *  `getCurrentPosition` API; which generally triggers before the device's
     *  GPS hardware can provide anything accurate. Thanks to
     *  {@link https://github.com/gwilson/getAccurateCurrentPosition#background|Greg Wilson}
     *  for the idea.
     *
     *  Also note that HTML5 Geolocation feature no more allows insecure origins.
     *  See {@link https://goo.gl/rStTGz|this} for more details.
     *  This means if you don't call this method from an HTTPS page, it will
     *  fail. And if `options.fallbackToIP` is enabled, this will locate by IP.
     *
     *  @param {Object} [options]
     *         HTML5 geo-location settings with some additional options.
     *      @param {Boolean} [options.enableHighAccuracy=true]
     *             Specifies whether the device should provide the most accurate
     *             position it can. Note that setting this to `true` might
     *             consume more CPU and/or battery power; and result in slower
     *             response times.
     *      @param {Number} [options.desiredAccuracy=30]
     *             Minimum accuracy desired, in meters. Position will not be
     *             returned until this is met, before the timeout. This only
     *             takes effect if `enableHighAccuracy` is set to `true`.
     *      @param {Number} [options.timeout=5000]
     *             HTML5 position timeout setting in milliseconds. Setting this
     *             to `Infinity` means that Geolocator won't return until the
     *             position is available.
     *      @param {Number} [options.maximumWait=10000]
     *             Maximum time to wait (in milliseconds) for the desired
     *             accuracy (which should be greater than `timeout`).
     *             This only takes effect if `enableHighAccuracy` is set to
     *             `true`.
     *      @param {Number} [options.maximumAge=0]
     *             HTML5 position maximum age. Indicates the maximum age in
     *             milliseconds of a possible cached position that is acceptable
     *             to return. `0` means, the device cannot use a cached position
     *             and must attempt to retrieve the real current position. If set
     *             to `Infinity` the device must return a cached position
     *             regardless of its age. Note that if `enableHighAccuracy` is
     *             set to `true`, `maximumAge` will be forced to `0`.
     *      @param {Function} [options.onProgress]
     *             If `enableHighAccuracy` is set to `true`, you can use this
     *             callback to check the progress of the location accuracy;
     *             while waiting for the final, best accurate location.
     *      @param {Boolean} [options.fallbackToIP=false]
     *             Specifies whether to fallback to IP geolocation if the HTML5
     *             geolocation fails (e.g. user rejection).
     *      @param {Boolean} [options.addressLookup=false]
     *             Specifies whether to run a reverse-geocode operation for the
     *             fetched coordinates to retrieve detailed address information.
     *             Note that this means an additional request which requires a
     *             Google API key to be set in the Geolocator configuration.
     *             See {@link #geolocator.config|`geolocator.config()`}.
     *      @param {Boolean} [options.timezone=false]
     *             Specifies whether to also fetch the time zone information for
     *             the receieved coordinates. Note that this means an additional
     *             request which requires a Google API key to be set in the
     *             Geolocator configuration.
     *             See {@link #geolocator.config|`geolocator.config()`}.
     *      @param {String|MapOptions} [options.map]
     *             In order to create an interactive map from the fetched
     *             location coordinates; either set this to a
     *             {@link #geolocator~MapOptions|`MapOptions` object}
     *             or; the ID of a DOM element or DOM element itself which the
     *             map will be created within.
     *      @param {Boolean|Object} [options.staticMap=false]
     *             Set to `true` to get a static Google Map image URL (with
     *             default options); or pass a static map options object.
     *
     *  @param {Function} callback
     *         Callback function to be executed when the request completes.
     *         This takes 2 arguments: `function (err, location) { ... }`.
     *         See {@link #geolocator~Location|`geolocator~Location` type} for details.
     *
     *  @returns {void}
     *
     *  @example
     *  var options = {
     *      enableHighAccuracy: true,
     *      desiredAccuracy: 30,
     *      timeout: 5000,
     *      maximumWait: 10000,
     *      maximumAge: 0,
     *      fallbackToIP: true,
     *      addressLookup: true,
     *      timezone: true,
     *      map: "my-map",
     *      staticMap: true
     *  };
     *  geolocator.locate(options, function (err, location) {
     *      console.log(err || location);
     *  });
     *
     * @example
     *  // location result:
     *  {
     *      coords: {
     *          latitude: 37.4224764,
     *          longitude: -122.0842499,
     *          accuracy: 30,
     *          altitude: null,
     *          altitudeAccuracy: null,
     *          heading: null,
     *          speed: null
     *      },
     *      address: {
     *          commonName: "",
     *          street: "Amphitheatre Pkwy",
     *          route: "Amphitheatre Pkwy",
     *          streetNumber: "1600",
     *          neighborhood: "",
     *          town: "",
     *          city: "Mountain View",
     *          region: "Santa Clara County",
     *          state: "California",
     *          stateCode: "CA",
     *          postalCode: "94043",
     *          country: "United States",
     *          countryCode: "US"
     *      },
     *      formattedAddress: "1600 Amphitheatre Parkway, Mountain View, CA 94043, USA",
     *      type: "ROOFTOP",
     *      placeId: "ChIJ2eUgeAK6j4ARbn5u_wAGqWA",
     *      timezone: {
     *          id: "America/Los_Angeles",
     *          name: "Pacific Standard Time",
     *          abbr: "PST",
     *          dstOffset: 0,
     *          rawOffset: -28800
     *      },
     *      flag: "//cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.3.1/flags/4x3/us.svg",
     *      map: {
     *          element: HTMLElement,
     *          instance: Object, // google.maps.Map
     *          marker: Object, // google.maps.Marker
     *          infoWindow: Object, // google.maps.InfoWindow
     *          options: Object // map options
     *      },
     *      staticMap: "//maps.googleapis.com/maps/api/staticmap?center=37.4224764,-122.0842499&maptype=roadmap&size=600x300&scale=1&zoom=9&format=png&language=en&markers=color%3Ared%7C37.4224764%2C2-122.0842499&key=YOUR-GOOGLE-API-KEY",
     *      timestamp: 1456795956380
     *  }
     */
    static locate(options, callback) {
        options = utils.extend({
            enableHighAccuracy: true,
            timeout: 6000,
            maximumWait: 10000,
            maximumAge: 0,
            desiredAccuracy: 30,
            onProgress: utils.noop,
            fallbackToIP: false,
            addressLookup: false,
            timezone: false,
            map: undefined,
            staticMap: false
        }, options);

        // force disable cache if high-accuracy is enabled
        if (options.enableHighAccuracy) options.maximumAge = 0;
        // set a min value for timeout
        if (options.timeout < 1000) options.timeout = 1000;
        // max wait should not be less than timeout
        if (options.maximumWait < options.timeout) options.maximumWait = options.timeout;

        // check options and Google key
        checkGoogleKey(options);

        let cb = callbackMap(options, callback);

        function fallbackToIP(error) {
            if (options.fallbackToIP) {
                return geolocator.locateByIP(options, (err, location) => {
                    if (err) return cb(err, null);
                    return cb(null, location);
                });
            }
            cb(error, null);
        }
        function onPositionReceived(location) {
            fetchAddressAndTimezone(location, options, cb);
        }
        function onPositionError(err) {
            err = GeoError.create(err);
            fallbackToIP(err);
        }

        if (geolocator.isGeolocationSupported()) {
            if (options.enableHighAccuracy) {
                locateAccurate(options, onPositionReceived, onPositionError);
            } else {
                navigator.geolocation.getCurrentPosition(onPositionReceived, onPositionError, options);
            }
        } else {
            let err = new GeoError(GeoError.Code.GEOLOCATION_NOT_SUPPORTED);
            fallbackToIP(err);
        }
    }

    /**
     *  Returns a location and accuracy radius based on information about cell
     *  towers and WiFi nodes that the mobile client can detect; via the Google
     *  Maps Geolocation API.
     *  @see {@link https://developers.google.com/maps/documentation/geolocation/intro|Google Maps Geolocation API}
     *  @see {@link https://developers.google.com/maps/documentation/geolocation/usage-limits|Usage Limits}
     *
     *  @param {Object} [options]
     *         Geolocation options.
     *      @param {Number} [options.homeMobileCountryCode]
     *             The mobile country code (MCC) for the device's home network.
     *      @param {Number} [options.homeMobileNetworkCode]
     *             The mobile network code (MNC) for the device's home network.
     *      @param {String} [options.radioType]
     *             The mobile radio type.
     *             See {@link #geolocator.RadioType|`geolocator.RadioType` enumeration}
     *             for possible values. While this field is optional, it should
     *             be included if a value is available, for more accurate results.
     *      @param {string} [options.carrier]
     *             The carrier name. e.g. "Vodafone"
     *      @param {Boolean} [options.fallbackToIP=false]
     *             Specifies whether to fallback to IP geolocation if wifi and
     *             cell tower signals are not available. Note that the IP address
     *             in the request header may not be the IP of the device. Set
     *             `fallbackToIP` to `false` to disable fall back.
     *      @param {Array} [options.cellTowers]
     *             An array of cell tower objects.
     *             See {@link https://developers.google.com/maps/documentation/geolocation/intro#cell_tower_object|Cell tower objects} for details.
     *      @param {Array} [options.wifiAccessPoints]
     *             An array of WiFi access point objects.
     *             See {@link https://developers.google.com/maps/documentation/geolocation/intro#wifi_access_point_object|WiFi access point objects} for details.
     *      @param {Boolean} [options.addressLookup=false]
     *             Specifies whether to run a reverse-geocode operation for the
     *             fetched coordinates to retrieve detailed address information.
     *             Note that this means an additional request which requires a
     *             Google API key to be set in the Geolocator configuration.
     *             See {@link #geolocator.config|`geolocator.config()`}.
     *      @param {Boolean} [options.timezone=false]
     *             Specifies whether to also fetch the time zone information for
     *             the receieved coordinates. Note that this means an additional
     *             request which requires a Google API key to be set in the
     *             Geolocator configuration.
     *             See {@link #geolocator.config|`geolocator.config()`}.
     *      @param {String|MapOptions} [options.map]
     *             In order to create an interactive map from the fetched
     *             location coordinates; either set this to a
     *             {@link #geolocator~MapOptions|`MapOptions` object}
     *             or; the ID of a DOM element or DOM element itself which the
     *             map will be created within.
     *      @param {Boolean|Object} [options.staticMap=false]
     *             Set to `true` to get a static Google Map image URL (with
     *             default options); or pass a static map options object.
     *      @param {Boolean} [options.raw=false]
     *      	      Whether to return the raw Google API result.
     *  @param {Function} callback
     *         Callback function to be executed when the request completes.
     *         This takes 2 arguments: `function (err, location) { ... }`.
     *         See {@link #geolocator~Location|`geolocator~Location` type} for details.
     *
     *  @returns {void}
     *
     *  @example
     *  var options = {
     *      homeMobileCountryCode: 310,
     *      homeMobileNetworkCode: 410,
     *      carrier: 'Vodafone',
     *      radioType: geolocator.RadioType.GSM,
     *      fallbackToIP: true,
     *      addressLookup: false,
     *      timezone: false,
     *      map: "my-map",
     *      staticMap: false
     *  };
     *  geolocator.locateByMobile(options, function (err, location) {
     *      console.log(err || location);
     *  });
     */
    static locateByMobile(options, callback) {
        if (!utils.isPlainObject(options)) {
            throw new GeoError(GeoError.Code.INVALID_PARAMETERS);
        }

        let cb = callbackMap(options, callback);

        options = utils.extend({
            homeMobileCountryCode: undefined,
            homeMobileNetworkCode: undefined,
            radioType: undefined,
            carrier: undefined,
            fallbackToIP: false,
            cellTowers: undefined,
            wifiAccessPoints: undefined,
            addressLookup: false,
            timezone: false,
            map: undefined,
            raw: false
        }, options);

        options.considerIp = options.fallbackToIP;
        // check Google key
        checkGoogleKey();

        let conf = geolocator._.config,
            key = conf.google.key || '',
            url = utils.setProtocol(enums.URL.GOOGLE_GEOLOCATION, conf.https),
            xhrOpts = {
                url: `${url}?key=${key}`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(options)
            };
        // console.log(xhrOpts.data);

        fetch.post(xhrOpts, (err, xhr) => {
            let response = getXHRResponse(err, xhr);
            if (GeoError.isGeoError(response)) return cb(response, null);

            response = options.raw ? response : {
                coords: {
                    latitude: response.location.lat,
                    longitude: response.location.lng,
                    accuracy: response.accuracy
                },
                timestamp: utils.time()
            };

            fetchAddressAndTimezone(response, options, cb);

            // e.g. raw response
            // {
            //     "location": {
            //         "lat": 51.0,
            //         "lng": -0.1
            //     },
            //     "accuracy": 1200.4
            // }
        });
    }

    /**
     *  Locates the user's location by the client's IP.
     *
     *  This method uses a free lookup service, by default.
     *  In order to change the source provider, you can use
     *  {@link #geolocator.setGeoIPSource|`geolocator.setGeoIPSource()` method}.
     *
     *  @param {Object} [options]
     *         Locate options.
     *      @param {Boolean} [options.addressLookup=false]
     *             Specifies whether to run a reverse-geocode operation for the
     *             fetched coordinates to retrieve detailed address information.
     *             Since no precise address can be fetched from an IP addres; you
     *             should only enable this if the Geo-IP Source returns no useful
     *             address information other than coordinates. Also, note that
     *             this means an additional request which requires a Google API
     *             key to be set in the Geolocator configuration.
     *             See {@link #geolocator.config|`geolocator.config()`}.
     *      @param {Boolean} [options.timezone=false]
     *             Specifies whether to also fetch the time zone information for
     *             the receieved coordinates. Note that this means an additional
     *             request which requires a Google API key to be set in the
     *             Geolocator configuration.
     *             See {@link #geolocator.config|`geolocator.config()`}.
     *      @param {String|MapOptions} [options.map]
     *             In order to create an interactive map from the fetched
     *             location coordinates; either set this to a
     *             {@link #geolocator~MapOptions|`MapOptions` object}
     *             or; the ID of a DOM element or DOM element itself which the
     *             map will be created within.
     *      @param {Boolean|Object} [options.staticMap=false]
     *             Set to `true` to get a static Google Map image URL (with
     *             default options); or pass a static map options object.
     *  @param {Function} callback
     *         Callback function to be executed when the request completes.
     *         This takes 2 arguments: `function (err, location) { ... }`.
     *         See {@link #geolocator~Location|`geolocator~Location` type} for details.
     *
     *  @returns {void}
     *
     *  @example
     *  var options = {
     *  	addressLookup: true,
     *  	timezone: true,
     *  	map: "my-map",
     *  	staticMap: true
     *  };
     *  geolocator.locateByIP(options, function (err, location) {
     *  	console.log(err || location);
     *  });
     *
     *  @example
     *  // location result:
     *  {
     *      coords: {
     *          latitude: 41.0214,
     *          longitude: 28.9948,
     *      },
     *      address: {
     *          city: "Istanbul",
     *          region: "34",
     *          state: "34",
     *          country: "Turkey",
     *          countryCode: "TR"
     *      },
     *      formattedAddress: "Demirtaş, Tesviyeci Sk. No:7, 34134 Fatih/İstanbul, Turkey",
     *      type: "ROOFTOP",
     *      placeId: "ChIJ-ZRLfO25yhQRBi5YJxX80Q0",
     *      timezone: {
     *          id: "Europe/Istanbul",
     *          name: "Eastern European Summer Time",
     *          abbr: "EEST",
     *          dstOffset: 3600,
     *          rawOffset: 7200
     *      },
     *      flag: "//cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.3.1/flags/4x3/tr.svg",
     *      map: {
     *          element: HTMLElement,
     *          instance: Object, // google.maps.Map
     *          marker: Object, // google.maps.Marker
     *          infoWindow: Object, // google.maps.InfoWindow
     *          options: Object // map options
     *      },
     *      staticMap: "//maps.googleapis.com/maps/api/staticmap?center=41.0214,28.9948&maptype=roadmap&size=600x300&scale=1&zoom=9&format=png&language=en&markers=color%3Ared%7C41.0214%2C228.9948&key=YOUR-GOOGLE-API-KEY",
     *      provider: "geobytes",
     *      timestamp: 1466216325223
     *  }
     */
    static locateByIP(options, callback) {
        // passed source can be a string or object
        let source = geolocator._.geoIpSource;

        if (!utils.isPlainObject(source)) {
            throw new GeoError(
                GeoError.Code.INVALID_GEO_IP_SOURCE,
                'Please set a valid Geo-IP Source via geolocator.setGeoIPSource(options).'
            );
        }

        // check options and Google key
        checkGoogleKey(options || {});

        function updateResponse(response) {
            if (!response) {
                const err = new GeoError(GeoError.Code.INVALID_RESPONSE);
                return callback(err, null);
            }
            if (utils.isPlainObject(source.schema)) {
                response = utils.mapToSchema(response, source.schema);
            } else if (utils.isFunction(source.schema)) {
                response = source.schema(response);
            }
            response.provider = source.provider || 'unknown';
            setLocationURLs(response, options);
            if (response.coords) {
                response.coords.latitude = Number(response.coords.latitude);
                response.coords.longitude = Number(response.coords.longitude);
            }
            let cb = callbackMap(options, callback);
            fetchAddressAndTimezone(response, options, cb);
        }

        if (source.xhr) {
            let opts = {
                url: source.url,
                async: true
            };
            return fetch.get(opts, (err, xhr) => {
                const response = xhr.responseText ? JSON.parse(xhr.responseText) : null;
                if (err) return callback(GeoError.create(err), null);
                updateResponse(response);
            });

        }

        if (source.callbackParam || source.globalVar) {
            let jsonpOpts = {
                url: source.url,
                async: true,
                clean: true
                // params: {}
            };
            if (source.callbackParam) {
                jsonpOpts.callbackParam = source.callbackParam;
                jsonpOpts.rootName = 'geolocator._.cb';
            }
            return fetch.jsonp(jsonpOpts, (err, response) => {
                if (err) return callback(GeoError.create(err), null);
                if (source.globalVar) {
                    if (window[source.globalVar]) {
                        response = utils.clone(window[source.globalVar]);
                        delete window[source.globalVar];
                    } else {
                        response = null;
                    }
                }
                updateResponse(response);
            });
        }

        throw new GeoError(
            GeoError.Code.INVALID_GEO_IP_SOURCE,
            'Either xhr, callbackParam or globalVar should be set for Geo-IP source.'
        );
    }

    /**
     *  Sets the Geo-IP source to be used for fetching location information
     *  by user's IP; which is internally used by
     *  {@link #geolocator.locateByIP|`geolocator.locateByIP()` method}.
     *
     *  By default, Geolocator uses a free Geo-IP source provider.
     *  You can use this method to change this; or you can choose from
     *  ready-to-use
     *  {@link https://github.com/onury/geolocator/tree/master/src/geo-ip-sources|Geo-IP sources}.
     *
     *  @param {Object} options
     *         Geo-IP Source options.
     *      @param {String} [options.provider]
     *             Source or service provider's name.
     *      @param {String} options.url
     *             Source URL without the callback query parameter. The callback
     *             name (if supported) should be set via `options.callbackParam`.
     *             Also, make sure the service supports the protocol you use in
     *             the enums.URL. If it supports both HTTP and HTTPS, you can omit the
     *             protocol. In this case, it will be determined via Geolocator
     *             configuration.
     *             See {@link #geolocator.config|`geolocator.config()`}.
     *             NOTE: Do not forget to include your API key in the query
     *             parameters of the URL, if you have one.
     *      @param {String} [options.callbackParam]
     *             If JSON callback is supported, pass the name of the callback
     *             parameter, defined by the provider.
     *      @param {Object} [options.globalVar]
     *             Set this instead of `options.callbackParam` if the service
     *             does not support JSON callbacks, but weirdly set a global
     *             variable in the document. For example, if the response is
     *             `Geo = { lat, lng }`, you should set this to `"Geo"`.
     *      @param {Object} [options.schema]
     *             Schema object to be used to re-structure the response returned
     *             from the service. Set the response object's keys as values of
     *             a custom object to map the format to the `location` object.
     *             For example; if the service returns a response like
     *             `{ lat: 40.112233, lng: 10.112233, otherProp: 'hello' }`.
     *             Then you should set the following schema:
     *             `{ coords: { latitude: 'lat', longitude: 'lng' } }`.
     *
     *  @return {geolocator}
     */
    static setGeoIPSource(options) {
        if (!utils.isPlainObject(options)) {
            throw new GeoError(GeoError.Code.INVALID_PARAMETERS, 'Geo-IP source options is invalid.');
        }
        if (!utils.isStringSet(options.url)) {
            throw new GeoError(GeoError.Code.INVALID_PARAMETERS, 'Geo-IP source should have a valid URI.');
        }
        // if (!utils.isStringSet(options.callbackParam) && !utils.isStringSet(options.globalVar)) {
        //     throw new GeoError(GeoError.Code.INVALID_PARAMETERS, 'No \'callbackParam\' or \'globalVar\' is provided for the Geo-IP Source options.');
        // }
        geolocator._.geoIpSource = Object.freeze(options);
    }

    /**
     *  Registers a handler for watching the user's location via HTML5
     *  geolocation; that is triggered each time the position of the device
     *  changes. This may require/prompt for user's permission.
     *
     *  @param {Object} [options]
     *         HTML5 geo-location settings.
     *      @param {Boolean} [options.enableHighAccuracy=true]
     *             Specifies whether the device should provide the most accurate
     *             position it can. Note that setting this to `true` might consume
     *             more CPU and/or battery power; and result in slower response
     *             times.
     *      @param {Number} [options.timeout=6000]
     *             HTML5 position timeout setting in milliseconds. Setting this
     *             to `Infinity` means that Geolocator won't return until the
     *             position is available.
     *      @param {Number} [options.maximumAge=0]
     *             HTML5 position maximum age. Indicates the maximum age in
     *             milliseconds of a possible cached position that is acceptable
     *             to return. `0` means, the device cannot use a cached position
     *             and must attempt to retrieve the real current position. If set
     *             to `Infinity` the device must return a cached position
     *             regardless of its age.
     *      @param {Boolean} [options.clearOnError=false]
     *             Specifies whether to clear the watcher on first error so that
     *             it does not execute any more callbacks.
     *      @param {Object} [options.target]
     *             Object that defines the target location and settings; that
     *             when the location is reached, the watcher will auto-clear
     *             itself and invoke the callback.
     *      @param {Number} options.target.latitude
     *             The `latitude` of the target location.
     *      @param {Number} options.target.longitude
     *             The `longitude` of the target location.
     *      @param {Number} [options.target.radius=0.5]
     *             The radius, in other words; the minimum distance (in
     *             kilometers or miles) to the target point that should be
     *             reached.
     *      @param {Number} [options.target.unitSystem=0]
     *             Unit system to be used for target radius.
     *             See {@link #geolocator.UnitSystem|`geolocator.UnitSystem` enumeration}
     *             for possible values.
     *  @param {Function} callback
     *         Callback function to be executed when the request completes.
     *         This takes 2 arguments: `function (err, location) { ... }`.
     *         If `options.target` is set, `location` will also
     *         include a `targetReached:Boolean` property.
     *         See {@link #geolocator~Location|`geolocator~Location` type} for details.
     *
     *  @returns {GeoWatcher} - A watcher object that provides a
     *  `.clear(delay:Number, callback:Function)` method to clear the watcher
     *  when needed. Optional `delay` argument can be set (in milliseconds) to
     *  clear in a later time. Omitting this argument will clear the watcher
     *  immediately. You should always call this method, except if you've set up
     *  a target; which will auto-clear the watcher when reached.
     *
     *  @example
     *  // Watch my position for 5 minutes.
     *  var options = { enableHighAccuracy: true, timeout: 6000, maximumAge: 0 };
     *  var watcher = geolocator.watch(options, function (err, location) {
     *      console.log(err || location);
     *  });
     *  console.log(watcher.id); // ID of the watcher
     *  watcher.clear(300000); // clear after 5 minutes.
     *
     *  @example
     *  // Watch my position until I'm 350 meters near Disneyland Park.
     *  options.target = {
     *      latitude: 33.8120918,
     *      longitude: -117.9233569,
     *      radius: 0.35,
     *      unitSystem: geolocator.UnitSystem.METRIC
     *  };
     *  watcher = geolocator.watch(options, function (err, location) {
     *      if (err) {
     *          console.log(err);
     *          return;
     *      }
     *      if (location.targetReached) {
     *          console.log(watcher.isCleared); // true
     *          console.log(watcher.cycle); // 15 — target reached after 15 cycles
     *      } else {
     *          console.log(watcher.isCleared); // false — watcher is active.
     *      }
     *  });
     */
    static watch(options, callback) {
        if (!geolocator.isGeolocationSupported()) {
            callback(new GeoError(GeoError.Code.GEOLOCATION_NOT_SUPPORTED), null);
            return {};
        }

        let watcher, target;

        options = utils.extend({
            enableHighAccuracy: true,
            timeout: 6000,
            maximumAge: 0,
            clearOnError: false
        }, options);

        if (utils.isPlainObject(options.target)) {
            target = utils.extend({
                radius: 0.5,
                unitSystem: geolocator.UnitSystem.METRIC
            }, options.target);
        }

        function onPositionChanged(location) {
            let pos = utils.clone(location, { own: false });
            if (target) {
                let distance = geolocator.calcDistance({
                    from: location.coords,
                    to: target,
                    formula: geolocator.DistanceFormula.HAVERSINE,
                    unitSystem: target.unitSystem
                });
                pos.targetReached = distance <= target.radius;
                if (watcher && pos.targetReached) {
                    watcher.clear(() => {
                        return callback(null, pos);
                    });
                }
            }
            return callback(null, pos);
        }
        function onPositionError(err) {
            callback(GeoError.create(err), null);
        }
        return new GeoWatcher(onPositionChanged, onPositionError, options);
    }

    /**
     *  Converts a given address (or address components) into geographic
     *  coordinates (i.e. latitude, longitude); and gets detailed address
     *  information.
     *  @see {@link https://developers.google.com/maps/documentation/geocoding/intro|Google Maps Geocoding API}
     *  @see {@link https://developers.google.com/maps/documentation/geocoding/usage-limits|Usage Limits}
     *
     *  @param {String|Object} options
     *         Either the address to geocode or geocoding options with the
     *         following properties.
     *      @param {String} options.address
     *             The street address to geocode, in the format used by the
     *             national postal service of the country concerned. Additional
     *             address elements such as business names and unit, suite or
     *             floor numbers should be avoided. Note that any address
     *             component (route, locality, administrativeArea, postalCode and
     *             country) should be specified either in address or the
     *             corresponding property - not both. Doing so may result in
     *             `ZERO_RESULTS`.
     *      @param {String} [options.route]
     *      	      Long or short name of a route.
     *      @param {String} [options.locality]
     *      	      Locality and sublocality of the location.
     *      @param {String} [options.administrativeArea]
     *      	      Administrative area of the location.
     *      @param {String} [options.postalCode]
     *      	      Postal code of the location.
     *      @param {String} [options.country]
     *      	      A country name or a two letter ISO 3166-1 country code.
     *      @param {String} [options.region]
     *      	      The region code, specified as a ccTLD ("top-level domain")
     *      	      two-character value. e.g.: `"fr"` for France.
     *      @param {Array|Object} [options.bounds]
     *      	      The bounding box of the viewport within which to bias geocode
     *      	      results more prominently. e.g.:
     *      	      `[ southwestLat:Number, southwestLng:Number, northeastLat:Number, northeastLng:Number ]`
     *      @param {String|MapOptions} [options.map]
     *             In order to create an interactive map from the fetched
     *             location coordinates; either set this to a
     *             {@link #geolocator~MapOptions|`MapOptions` object}
     *             or; the ID of a DOM element or DOM element itself which the
     *             map will be created within.
     *      @param {Boolean|Object} [options.staticMap=false]
     *             Set to `true` to get a static Google Map image URL (with
     *             default options); or pass a static map options object.
     *      @param {Boolean} [options.raw=false]
     *      	      Whether to return the raw Google API result.
     *  @param {Function} callback
     *         Callback function to be executed when the request completes.
     *         This takes 2 arguments: `function (err, location) { ... }`.
     *         See {@link #geolocator~Location|`geolocator~Location` type} for details.
     *
     *  @returns {void}
     *
     *  @example
     *  var address = '1600 Amphitheatre Parkway, CA';
     *  geolocator.geocode(address, function (err, location) {
     *      console.log(err || location);
     *  });
     *
     *  @example
     *  // location result:
     *  {
     *      coords: {
     *          latitude: 37.4224764,
     *          longitude: -122.0842499
     *      },
     *      address: {
     *          commonName: "",
     *          street: "Amphitheatre Pkwy",
     *          route: "Amphitheatre Pkwy",
     *          streetNumber: "1600",
     *          neighborhood: "",
     *          town: "",
     *          city: "Mountain View",
     *          region: "Santa Clara County",
     *          state: "California",
     *          stateCode: "CA",
     *          postalCode: "94043",
     *          country: "United States",
     *          countryCode: "US"
     *      },
     *      formattedAddress: "1600 Amphitheatre Parkway, Mountain View, CA 94043, USA",
     *      type: "ROOFTOP",
     *      placeId: "ChIJ2eUgeAK6j4ARbn5u_wAGqWA",
     *      flag: "//cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.3.1/flags/4x3/us.svg",
     *      map: {
     *          element: HTMLElement,
     *          instance: Object, // google.maps.Map
     *          marker: Object, // google.maps.Marker
     *          infoWindow: Object, // google.maps.InfoWindow
     *          options: Object // map options
     *      },
     *      timestamp: 1456795956380
     *  }
     */
    static geocode(options, callback) {
        geocode(false, options, callback);
    }

    /**
     *  Converts the given geographic coordinates into a human-readable address
     *  information.
     *  @see {@link https://developers.google.com/maps/documentation/geocoding/intro#ReverseGeocoding|Google Maps (Reverse) Geocoding API}
     *  @see {@link https://developers.google.com/maps/documentation/geocoding/usage-limits|Usage Limits}
     *  @alias geolocator.addressLookup
     *
     *  @param {Object|String} options
     *         Either the `placeId` of the location or Reverse Geocoding options
     *         with the following properties.
     *      @param {Number} options.latitude
     *      Latitude of the target location.
     *      @param {Number} options.longitude
     *      Longitude of the target location.
     *      @param {String} [options.placeId]
     *             Required if `latitude` and `longitude` are omitted. The place
     *             ID of the place for which you wish to obtain the
     *             human-readable address. The place ID is a unique identifier
     *             that can be used with other Google APIs. Note that if
     *             `placeId` is set, `latitude` and `longitude` are ignored.
     *      @param {String|MapOptions} [options.map]
     *             In order to create an interactive map from the fetched
     *             location coordinates; either set this to a
     *             {@link #geolocator~MapOptions|`MapOptions` object}
     *             or; the ID of a DOM element or DOM element itself which the
     *             map will be created within.
     *      @param {Boolean|Object} [options.staticMap=false]
     *             Set to `true` to get a static Google Map image URL (with
     *             default options); or pass a static map options object.
     *      @param {Boolean} [options.raw=false]
     *             Whether to return the raw Google API result.
     *  @param {Function} callback
     *         Callback function to be executed when the request completes.
     *         This takes 2 arguments: `function (err, location) { ... }`
     *         See {@link #geolocator~Location|`geolocator~Location` type} for details.
     *
     *  @returns {void}
     *
     *  @example
     *  var coords = {
     *      latitude: 37.4224764,
     *      longitude: -122.0842499
     *  };
     *
     *  geolocator.reverseGeocode(coords, function (err, location) {
     *      console.log(err || location);
     *  });
     *
     *  @example
     *  // location result:
     *  {
     *      coords: {
     *          latitude: 37.4224764,
     *          longitude: -122.0842499
     *      },
     *      address: {
     *          commonName: "",
     *          street: "Amphitheatre Pkwy",
     *          route: "Amphitheatre Pkwy",
     *          streetNumber: "1600",
     *          neighborhood: "",
     *          town: "",
     *          city: "Mountain View",
     *          region: "Santa Clara County",
     *          state: "California",
     *          stateCode: "CA",
     *          postalCode: "94043",
     *          country: "United States",
     *          countryCode: "US"
     *      },
     *      formattedAddress: "1600 Amphitheatre Parkway, Mountain View, CA 94043, USA",
     *      type: "ROOFTOP",
     *      placeId: "ChIJ2eUgeAK6j4ARbn5u_wAGqWA",
     *      flag: "//cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.3.1/flags/4x3/us.svg",
     *      map: {
     *          element: HTMLElement,
     *          instance: Object, // google.maps.Map
     *          marker: Object, // google.maps.Marker
     *          infoWindow: Object, // google.maps.InfoWindow
     *          options: Object // map options
     *      },
     *      timestamp: 1456795956380
     *  }
     */
    static reverseGeocode(options, callback) {
        geocode(true, options, callback);
    }

    /**
     *  Alias for `geolocator.reverseGeocode`
     *  @private
     */
    static addressLookup(options, callback) {
        geolocator.reverseGeocode(options, callback);
    }

    /**
     *  Gets timezone information for the given coordinates.
     *  Note: Google Browser API keys cannot have referer restrictions when used with this API.
     *  @see {@link https://developers.google.com/maps/documentation/timezone/intro|Google Maps TimeZone API}
     *  @see {@link https://developers.google.com/maps/documentation/timezone/usage-limits|Usage Limits}
     *
     *  @param {Object} options
     *         Time zone options.
     *      @param {Number} options.latitude
     *             Latitude of location.
     *      @param {Number} options.longitude
     *             Longitude of location.
     *      @param {Number} [options.timestamp=Date.now()]
     *             Specifies the desired time as seconds since midnight, January
     *             1, 1970 UTC. This is used to determine whether or not Daylight
     *             Savings should be applied.
     *      @param {Boolean} [options.raw=false]
     *             Whether to return the raw Google API result.
     *  @param {Function} callback
     *         Callback function to be executed when the request completes, in
     *         the following signature: `function (err, timezone) { ... }`.
     *         See {@link #geolocator~TimeZone|`geolocator~TimeZone` type} for
     *         details.
     *
     *  @returns {void}
     *
     *  @example
     *  var options = {
     *      latitude: 48.8534100,
     *      longitude: 2.3488000
     *  };
     *  geolocator.getTimeZone(options, function (err, timezone) {
     *      console.log(err || timezone);
     *  });
     *
     *  @example
     *  // timezone result:
     *  {
     *      id: "Europe/Paris",
     *      name: "Central European Standard Time",
     *      abbr: "CEST",
     *      dstOffset: 0,
     *      rawOffset: 3600,
     *      timestamp: 1455733120
     *  }
     */
    static getTimeZone(options, callback) {
        if (!utils.isPlainObject(options)
                || !utils.isNumber(options.latitude)
                || !utils.isNumber(options.longitude)) {
            throw new GeoError(GeoError.Code.INVALID_PARAMETERS);
        }

        checkGoogleKey();

        let conf = geolocator._.config;
        options = utils.extend({
            key: conf.google.key || '',
            language: conf.language || 'en',
            timestamp: utils.time(true),
            raw: false
        }, options);

        let url = utils.setProtocol(enums.URL.GOOGLE_TIMEZONE, conf.https),
            xhrOpts = {
                url: `${url}?location=${options.latitude},${options.longitude}&timestamp=${options.timestamp}&language=${options.language}&key=${options.key}`
            };

        fetch.xhr(xhrOpts, (err, xhr) => {
            let response = getXHRResponse(err, xhr);
            if (GeoError.isGeoError(response)) return callback(response, null);

            response = options.raw ? response : {
                id: response.timeZoneId,
                name: response.timeZoneName,
                abbr: utils.abbr(response.timeZoneName, { dots: false }),
                dstOffset: response.dstOffset,
                rawOffset: response.rawOffset,
                timestamp: options.timestamp
            };
            callback(err, response);
        });
    }

    /**
     *  Gets the distance and duration values based on the recommended route
     *  between start and end points.
     *  @see {@link https://developers.google.com/maps/documentation/distance-matrix/intro|Google Maps Distance Matrix API}
     *  @see {@link https://developers.google.com/maps/documentation/distance-matrix/usage-limits|Usage Limits}
     *
     *  @param {Object} options
     *         Distance matrix options.
     *      @param {String|Object|Array} options.origins
     *             One or more addresses and/or an object of latitude/longitude
     *             values, from which to calculate distance and time. If you pass
     *             an address as a string, the service will geocode the string
     *             and convert it to a latitude/longitude coordinate to calculate
     *             distances. Following are valid examples:
     *  <pre><code>options.origins = 'London';
     *  options.origins = ['London', 'Paris'];
     *  options.origins = { latitude: 51.5085300, longitude: -0.1257400 };
     *  options.origins = [
     *      { latitude: 51.5085300, longitude: -0.1257400 },
     *      { latitude: 48.8534100, longitude: 2.3488000 }
     *  ];
     *  </code></pre>
     *      @param {String|Object|Array} options.destinations
     *             One or more addresses and/or an object of latitude/longitude
     *             values, from which to calculate distance and time. If you pass
     *             an address as a string, the service will geocode the string
     *             and convert it to a latitude/longitude coordinate to calculate
     *             distances.
     *      @param {String} [options.travelMode="DRIVING"]
     *             Type of routing requested.
     *             See {@link #geolocator.TravelMode|`geolocator.TravelMode` enumeration}
     *             for possible values.
     *      @param {Boolean} [options.avoidFerries]
     *             If true, instructs the Distance Matrix service to avoid
     *             ferries where possible.
     *      @param {Boolean} [options.avoidHighways]
     *             If true, instructs the Distance Matrix service to avoid
     *             highways where possible.
     *      @param {Boolean} [options.avoidTolls]
     *             If true, instructs the Distance Matrix service to avoid toll
     *             roads where possible.
     *      @param {Number} [options.unitSystem=0]
     *             Preferred unit system to use when displaying distance.
     *             See {@link #geolocator.UnitSystem|`geolocator.UnitSystem` enumeration}
     *             for possible values.
     *      @param {String} [options.region]
     *             Region code used as a bias for geocoding requests.
     *  @param {Boolean} [options.raw=false]
     *         Whether to return the raw Google API result.
     *  @param {Function} callback
     *         Callback function to be executed when the request completes,
     *         in the following signature: `function (err, result) { ... }`
     *
     *  @returns {void}
     *
     *  @example
     *  var options = {
     *      origins: [{ latitude: 51.5085300, longitude: -0.1257400 }],
     *      destinations: [{ latitude: 48.8534100, longitude: 2.3488000 }],
     *      travelMode: geolocator.TravelMode.DRIVING,
     *      unitSystem: geolocator.UnitSystem.METRIC
     *  };
     *  geolocator.getDistanceMatrix(options, function (err, result) {
     *      console.log(err || result);
     *  });
     *
     *  @example
     *  // result:
     *  [
     *  	{
     *  		from: "449 Duncannon St, London WC2R 0DZ, UK",
     *  		to: "1 Parvis Notre-Dame - Pl. Jean-Paul II, 75004 Paris-4E-Arrondissement, France",
     *  		distance: {
     *  			value: 475104,
     *  			text: "475 km"
     *  		},
     *  		duration: {
     *  			value: 20193,
     *  			text: "5 hours 37 mins"
     *  		},
     *  		fare: undefined,
     *  		timestamp: 1456795956380
     *  	}
     *  ]
     */
    static getDistanceMatrix(options, callback) {
        checkGoogleKey();

        let key = geolocator._.config.google.key;
        geolocator.ensureGoogleLoaded(key, err => {
            if (err) {
                throw new GeoError(GeoError.Code.GOOGLE_API_FAILED, String(err.message || err));
            }

            let o = options.origins || options.origin || options.from,
                d = options.destinations || options.destination || options.to;
            if (!utils.isPlainObject(options) || invalidOriginOrDest(o) || invalidOriginOrDest(d)) {
                throw new GeoError(GeoError.Code.INVALID_PARAMETERS);
            }
            options.origins = geoHelper.toPointList(o);
            options.destinations = geoHelper.toPointList(d);

            options = utils.extend({
                travelMode: google.maps.TravelMode.DRIVING,
                avoidFerries: undefined,
                avoidHighways: undefined,
                avoidTolls: undefined,
                unitSystem: google.maps.UnitSystem.METRIC
            }, options);

            let service = new google.maps.DistanceMatrixService();
            service.getDistanceMatrix(options, (response, status) => {
                let err = null;
                if (status !== google.maps.DistanceMatrixStatus.OK) {
                    err = GeoError.fromResponse(status)
                        || GeoError.fromResponse(response);
                    response = null;
                } else {
                    response = options.raw ? response : geoHelper.formatDistanceResults(response);
                }
                callback(err, response);
            });
        });
    }

    /**
     *  Calculates the distance between two geographic points.
     *
     *  @param {Object} options
     *         Calculation and display options.
     *      @param {Object} options.from
     *             Object containing the `latitude` and `longitude` of original
     *             location.
     *      @param {Object} options.to
     *             Object containing the `latitude` and `longitude` of destination.
     *      @param {String} [options.formula="haversine"]
     *             The algorithm or formula to calculate the distance.
     *             See {@link #geolocator.DistanceFormula|`geolocator.DistanceFormula` enumeration}.
     *      @param {Number} [options.unitSystem=0]
     *             Preferred unit system to use when displaying distance.
     *             See {@link #geolocator.UnitSystem|`geolocator.UnitSystem` enumeration}.
     *
     *  @returns {Number} - The calculated distance.
     *
     *  @example
     *  // Calculate distance from London to Paris.
     *  var result = geolocator.calcDistance({
     *      from: {
     *          latitude: 51.5085300,
     *          longitude: -0.1257400
     *      },
     *      to: {
     *          latitude: 48.8534100,
     *          longitude: 2.3488000
     *      },
     *      formula: geolocator.DistanceFormula.HAVERSINE,
     *      unitSystem: geolocator.UnitSystem.METRIC
     *  });
     *  // result: 366.41656039126093 (kilometers)
     */
    static calcDistance(options) {
        options = utils.extend({
            formula: geolocator.DistanceFormula.HAVERSINE,
            unitSystem: geolocator.UnitSystem.METRIC
        }, options);

        let from = options.from,
            to = options.to,
            radius = options.unitSystem === geolocator.UnitSystem.METRIC
                ? EARTH_RADIUS_KM : EARTH_RADIUS_MI;

        if (options.formula === geolocator.DistanceFormula.HAVERSINE) {
            let dLat = geolocator.degToRad(to.latitude - from.latitude),
                dLng = geolocator.degToRad(to.longitude - from.longitude),
                a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(geolocator.degToRad(from.latitude)) *
                    Math.cos(geolocator.degToRad(to.longitude)) *
                    Math.sin(dLng / 2) * Math.sin(dLng / 2),
                c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return radius * c;
        }
        // geolocator.DistanceFormula.PYTHAGOREAN
        let latA = geolocator.degToRad(from.latitude),
            latB = geolocator.degToRad(to.latitude),
            lngA = geolocator.degToRad(from.longitude),
            lngB = geolocator.degToRad(to.longitude),
            x = (lngB - lngA) * Math.cos((latA + latB) / 2),
            y = (latB - latA);
        return Math.sqrt(x * x + y * y) * radius;
    }

    /**
     *  Gets the current public IP of the client.
     *
     *  @param {Function} callback
     *         Callback function to be executed when the request completes, in
     *         the following signature: `function (err, result) { ... }`
     *
     *  @returns {void}
     *
     *  @example
     *  geolocator.getIP(function (err, result) {
     *      console.log(err || result);
     *  });
     *
     *  @example
     *  // result:
     *  {
     *      ip: "176.232.71.155",
     *      timestamp: 1457573683427
     *  }
     */
    static getIP(callback) {
        let conf = geolocator._.config;

        // ipify.org supports CORS, so we'll use XMLHttpRequest instead of a
        // JSONP request.
        let opts = {
            url: utils.setProtocol(enums.URL.IP, conf.https),
            async: true
        };
        return fetch.get(opts, (err, xhr) => {
            const response = xhr.responseText;
            if (err) {
                return callback(GeoError.create(err), null);
            }
            if (!response) {
                err = new GeoError(GeoError.Code.INVALID_RESPONSE);
                return callback(err, null);
            }
            callback(null, {
                ip: response,
                timestamp: utils.time()
            });
        });
        // let jsonpOpts = {
        //     url: utils.setProtocol(enums.URL.IP, conf.https),
        //     async: true,
        //     clean: true,
        //     params: {
        //         format: 'jsonp'
        //     },
        //     callbackParam: 'callback',
        //     rootName: 'geolocator._.cb'
        // };
        // return fetch.jsonp(jsonpOpts, (err, response) => {
        //     if (err) {
        //         return callback(GeoError.create(err), null);
        //     }
        //     if (!response) {
        //         err = new GeoError(GeoError.Code.INVALID_RESPONSE);
        //         return callback(err, null);
        //     }
        //     if (typeof response === 'object') response.timestamp = utils.time();
        //     callback(null, response);
        // });
    }

    /**
     *  Ensures Google Maps API is loaded. If not, this will load all of the
     *  main Javascript objects and symbols for use in the Maps API.
     *
     *  Note that, Google Maps API is loaded only when needed. For example,
     *  the DistanceMatrix API does not support Web Service requests and
     *  requires this API to be loaded. However, the TimeZone API requests are
     *  made throught the Web Service without requiring a `google` object
     *  within DOM.
     *
     *  Also note that this will not re-load the API if `google.maps` object
     *  already exists. In this case, the `callback` is still executed and
     *  no errors are passed.
     *
     *  You can use the following overload to omit the `key` argument altogether:
     *
     *  `geolocator.ensureGoogleLoaded(callback)`
     *
     *  @param {String} [key]
     *         Google API key.
     *  @param {Function} callback
     *         Callback function to be executed when the operation ends.
     *
     *  @returns {void}
     *
     *  @example
     *  geolocator.ensureGoogleLoaded(function (err) {
     *      if (err) return;
     *      console.log('google' in window); // true
     *  });
     */
    static ensureGoogleLoaded(key, callback) {
        let k;
        if (utils.isFunction(key)) {
            callback = key;
        } else {
            k = key;
        }
        if (!geolocator.isGoogleLoaded()) {
            let jsonpOpts = {
                url: enums.URL.GOOGLE_MAPS_API,
                async: true,
                callbackParam: 'callback',
                params: {
                    key: k || ''
                    // callback: ''
                },
                rootName: 'geolocator._.cb'
            };
            return fetch.jsonp(jsonpOpts, callback);
        }
        callback();
    }

    /**
     *  Checks whether the Google Maps API is loaded.
     *
     *  @returns {Boolean} - Returns `true` if already loaded.
     */
    static isGoogleLoaded() {
        return ('google' in window) && google.maps;
    }

    /**
     *  Checks whether the type of the given object is an HTML5 `PositionError`.
     *
     *  @param {*} obj - Object to be checked.
     *  @return {Boolean}
     */
    static isPositionError(obj) {
        return utils.isPositionError(obj);
    }

    /**
     *  Checks whether the given value is an instance of `GeoError`.
     *
     *  @param {*} obj - Object to be checked.
     *  @return {Boolean}
     */
    static isGeoError(obj) {
        return GeoError.isGeoError(obj);
    }

    /**
     *  Checks whether HTML5 Geolocation API is supported.
     *
     *  @return {Boolean}
     */
    static isGeolocationSupported() {
        return navigator && ('geolocation' in navigator);
    }

    /**
     *  Converts kilometers to miles.
     *
     *  @param {Number} km - Kilometers to be converted.
     *  @returns {Number} - Miles.
     */
    static kmToMi(km) {
        return km * 0.621371;
    }

    /**
     *  Converts miles to kilometers.
     *
     *  @param {Number} mi - Miles to be converted.
     *  @returns {Number} - Kilometers.
     */
    static miToKm(mi) {
        return mi / 0.621371;
    }

    /**
     *  Converts degrees to radians.
     *
     *  @param {Number} deg - Degrees to be converted.
     *  @returns {Number} - Radians.
     */
    static degToRad(degrees) {
        return degrees * (Math.PI / 180);
    }

    /**
     *  Converts radians to degrees.
     *
     *  @param {Number} rad - Radians to be converted.
     *  @returns {Number} - Degrees.
     */
    static radToDeg(radians) {
        return radians * (180 / Math.PI);
    }

    /**
     *  Converts decimal coordinates (either lat or lng) to degrees, minutes, seconds.
     *
     *  @param {Number} dec
     *         Decimals to be converted.
     *  @param {Boolean} [isLng=false]
     *         Indicates whether the given decimals is longitude.
     *
     *  @returns {String} - Degrees, minutes, seconds.
     */
    static decToDegMinSec(dec, isLng = false) {
        // Degrees Latitude must be in the range of -90. to 90.
        // Degrees Longitude must be in the range of -180 to 180.
        // +Latitude is North, -Latitude is South
        // +Longitude is East, -Longitude is West
        let sign = dec < 0 ? -1 : 1,
            sn = dec < 0 ? 'S' : 'N',
            we = dec < 0 ? 'W' : 'E',
            nsew = !isLng ? sn : we,
            absValue = Math.abs(Math.round(dec * 1000000.0));
        return ((Math.floor(absValue / 1000000) * sign) + '° ' + Math.floor(((absValue / 1000000) - Math.floor(absValue / 1000000)) * 60) + '\' ' +
                (Math.floor(((((absValue / 1000000) - Math.floor(absValue / 1000000)) * 60) - Math.floor(((absValue / 1000000) - Math.floor(absValue / 1000000)) * 60)) * 100000) * 60 / 100000) + '" ') + nsew;
    }

}

// ---------------------------
// HELPER METHODS
// ---------------------------

/**
 *  Used with distance matrix calls.
 *  @private
 */
function invalidOriginOrDest(value) {
    return !utils.isString(value)
        && !utils.isArray(value)
        && !utils.isPlainObject(value);
}

/**
 *  Check if XHR response is an error response and returns a `GeoError`.
 *  If not, returns the parsed response.
 *  @private
 *
 *  @param {Error} err
 *         XHR error.
 *  @param {Object} xhr
 *         XHR object to be checked.
 *
 *  @returns {GeoError|Object}
 */
function getXHRResponse(err, xhr) {
    if (err) return GeoError.create(err);
    if (!xhr) return new GeoError(GeoError.Code.REQUEST_FAILED);
    let response = utils.safeJsonParse(xhr.responseText);
    // Check if XHR response is an error response.
    // return response if not.
    return GeoError.fromResponse(response) || response;
}

/**
 *  Checks the given options and determines if Google key is required.
 *  Throws if key is required but not set or valid.
 *  @private
 *
 *  @param {Object} [options]
 *         Options to be checked. If `undefined`, directly checks Googke key.
 */
function checkGoogleKey(options) {
    if (!options || (options.addressLookup || options.timezone || options.map || options.staticMap)) {
        if (!geolocator._.config.google.key) {
            throw new GeoError(GeoError.Code.GOOGLE_KEY_INVALID, 'A Google API key is required but it\'s not set or valid.');
        }
    }
}

/**
 *  Checks and adds necessary properties to map options from the given location
 *  result object. This is used with methods that support `map` option; to
 *  create a map from the result coordinates; such as locate() method.
 *  @private
 *
 *  @param {Object|String} options
 *         Original options object.
 *  @param {Object} location
 *         Location result object.
 *
 *  @returns {Object} - Final map options object.
 */
function getMapOpts(mapOptions, location) {
    if (utils.isObject(mapOptions)) {
        mapOptions.center = location.coords;
    } else {
        mapOptions = {
            element: mapOptions,
            center: location.coords
        };
    }
    // this will enable infoWindow
    if (location.formattedAddress) {
        mapOptions.title = location.formattedAddress;
    }
    // if location has accuracy, (and zoom is not set) we can zoom in a bit more
    if (!mapOptions.zoom
            && location.coords
            && utils.isNumber(location.coords.accuracy)
            && location.coords.accuracy < 1500) {
        mapOptions.zoom = 15;
    }
    return mapOptions;
}

/**
 *  Checks the HTMLElement to see whether a previous map and related objects
 *  (marker, infoWindow) are created for it; by checking our private property
 *  `_geolocatorMapData`. If there is a map, this does not re-create it (which
 *  will break the map) but only re-adjust center, zoom and re-create the marker
 *  if needed. We use this approach bec. Google maps has no feature to destroy
 *  a map. This is considered a bug by Google developers.
 *  @private
 *
 *  @param {Object} options
 *         Options for creating a map.
 */
function configCreateMap(options) {
    let elem = options.element,
        // when geolocator creates a map, it will set a `_geolocatorMapData`
        // property on the element. So we can use this map instance later,
        // when the same HTMLElement is passed to create a map. So check if
        // we have it here.
        mapData = elem._geolocatorMapData,
        map = (mapData && mapData.instance) || null,
        marker = (mapData && mapData.marker) || null,
        infoWindow = (mapData && mapData.infoWindow) || null,
        center = new google.maps.LatLng(options.center.latitude, options.center.longitude),
        mapOptions = {
            mapTypeId: options.mapTypeId,
            center: center,
            zoom: options.zoom,
            styles: options.styles || null
        };

    // if we have a map, we'll just configure it. otherwise, we'll create
    // one.
    if (map) {
        map.setOptions(mapOptions);
    } else {
        map = new google.maps.Map(options.element, mapOptions);
    }

    // destroy marker and infoWindow if previously created for this element.
    if (infoWindow) infoWindow = null;
    if (marker && marker instanceof google.maps.Marker) {
        google.maps.event.clearInstanceListeners(marker);
        marker.setMap(null);
        marker = null;
    }

    // check the new options to see if we need to re-create a marker for
    // this.
    if (options.marker) {
        marker = new google.maps.Marker({
            position: mapOptions.center,
            map: map
        });
        if (options.title) {
            infoWindow = new google.maps.InfoWindow();
            infoWindow.setContent(options.title);
            // infoWindow.open(map, marker);
            google.maps.event.addListener(marker, 'click', () => {
                infoWindow.open(map, marker);
            });
        }
    }

    mapData = {
        element: elem,
        instance: map,
        marker: marker,
        infoWindow: infoWindow,
        options: mapOptions
    };
    // set the reference on the element for later use, if needed.
    elem._geolocatorMapData = mapData;
    return mapData;
}

/**
 *  Sets the `flag` and `staticMap` (if enabled) property of the given location.
 *  @private
 *
 *  @param {Object} location - Fetched location result.
 *  @param {Object} options - initial options.
 */
function setLocationURLs(location, options) {
    if (!location || !location.address) return;
    let cc,
        address = location.address;
    if (utils.isString(address.countryCode) && address.countryCode.length === 2) {
        cc = address.countryCode;
    } else if (utils.isString(address.country) && address.country.length === 2) {
        cc = address.country;
    }
    if (!cc) return;
    location.flag = enums.URL.FLAG + cc.toLowerCase() + '.svg';
    if (options.staticMap) {
        let opts = utils.isPlainObject(options.staticMap)
            ? utils.clone(options.staticMap)
            : {};
        opts.center = location.coords;
        location.staticMap = geolocator.getStaticMap(opts);
    }
}

/**
 *  Nests `createMap` callback within the given callback.
 *  @private
 *
 *  @param {Object} options
 *         Method options.
 *  @param {Function} callback
 *         Parent callback.
 *
 *  @returns {Function} - Nested callback.
 */
function callbackMap(options, callback) {
    return function cb(err, location) {
        if (err) return callback(GeoError.create(err), null);
        setLocationURLs(location, options);
        if (!options.map) return callback(null, location);
        options.map = getMapOpts(options.map, location);
        geolocator.createMap(options.map, (error, map) => {
            if (error) return callback(error, null);
            location.map = map;
            return callback(null, location);
        });
    };
}

/**
 *  Sends a geocode or reverse-geocode request with the given options.
 *  @private
 *
 *  @param {Boolean} reverse
 *         Whether to send reverse-geocode request.
 *  @param {Object} options
 *         Geocode options.
 *  @param {Function} callback
 *         Callback to be nested and executed with map callback.
 */
function geocode(reverse, options, callback) {
    checkGoogleKey();
    geoHelper.geocode(
        reverse,
        geolocator._.config,
        options,
        callbackMap(options, callback)
    );
}

/**
 *  Runs both an address and a timezone look-up for the given location.
 *  @private
 *
 *  @param {Object} location
 *         Location object.
 *  @param {Object} options
 *         Method options.
 *  @param {Function} callback
 *         Parent callback.
 */
function fetchAddressAndTimezone(location, options, callback) {
    let loc = utils.clone(location, { own: false });
    if (!options.addressLookup && !options.timezone) {
        return callback(null, loc);
    }
    function getTZ(cb) {
        geolocator.getTimeZone(loc.coords, (err, timezone) => {
            if (err) {
                return cb(err, null);
            }
            delete timezone.timestamp;
            loc.timezone = timezone;
            loc.timestamp = utils.time(); // update timestamp
            cb(null, loc);
        });
    }
    if (options.addressLookup) {
        geolocator.reverseGeocode(loc.coords, (err, result) => {
            if (err) return callback(err, null);
            loc = utils.extend({}, result, loc);
            loc.address = result.address;
            loc.timestamp = utils.time(); // update timestamp
            if (!options.timezone) {
                callback(err, loc);
            } else {
                getTZ(callback);
            }
        });
    } else if (options.timezone) {
        getTZ(callback);
    } else {
        callback(null, loc);
    }
}

/**
 *  Gets the position with better accuracy.
 *  See https://github.com/gwilson/getAccurateCurrentPosition#background
 *  @private
 *
 *  @param {Object} options
 *         Locate options.
 *  @param {Function} onPositionReceived
 *         Success callback.
 *  @param {Function} onPositionError
 *         Error callback.
 */
function locateAccurate(options, onPositionReceived, onPositionError) {
    let loc,
        watcher,
        onProgress = !utils.isFunction(options.onProgress)
            ? utils.noop
            : options.onProgress;

    function complete() {
        watcher = null;
        if (!loc) {
            onPositionError(new GeoError(GeoError.Code.POSITION_UNAVAILABLE));
        } else {
            onPositionReceived(loc);
        }
    }

    watcher = geolocator.watch(options, (err, location) => {
        if (!watcher) return;
        if (err) {
            return watcher.clear(() => {
                onPositionError(err);
            });
        }
        loc = location;
        // ignore the first event if not the only result; for more accuracy.
        if (watcher.cycle > 1 && loc.coords.accuracy <= options.desiredAccuracy) {
            watcher.clear(complete);
        } else {
            onProgress(loc);
        }
    });
    if (watcher) watcher.clear(options.maximumWait + 100, complete);
}

function getStyles(options) {
    let conf = geolocator._.config;
    return !utils.isFilledArray(options.styles)
        ? (utils.isFilledArray(conf.google.styles) ? conf.google.styles : null)
        : options.styles;
}

// ---------------------------
// INITIALIZE
// ---------------------------

/**
 *  @private
 *  @type {Object}
 */
geolocator._ = {
    config: utils.extend({}, defaultConfig),
    // Storage for global callbacks.
    cb: {}
};

// setting default Geo-IP source

geolocator.setGeoIPSource({
    provider: 'geojs.io',
    url: 'https://get.geojs.io/v1/ip/geo.json',
    xhr: true,
    schema: {
        ip: 'ip',
        coords: {
            latitude: 'latitude',
            longitude: 'longitude'
        },
        address: {
            city: 'city',
            state: 'region',
            stateCode: '',
            postalCode: '',
            countryCode: 'country_code',
            country: 'country',
            region: 'region'
        },
        timezone: {
            id: 'timezone'
        }
    }
});

// ---------------------------
// EXPORT
// ---------------------------

export { geolocator };

// ---------------------------
// ADDITIONAL DOCUMENTATION
// ---------------------------

/**
 *  `Coordinates` inner type that specifies the geographic position of the
 *  device. The position is expressed as a set of geographic coordinates
 *  together with information about heading and speed.
 *
 *  This is generally returned as part of the
 *  {@link ?api=geolocator#geolocator~Location|`Location` result object}.
 *
 *  @typedef geolocator~Coordinates
 *  @type Object
 *
 *  @property {Number} latitude
 *         Specifies the latitude estimate in decimal degrees. The value
 *         range is [-90.00, +90.00].
 *  @property {Number} longitude
 *         Specifies the longitude estimate in decimal degrees. The value
 *         range is [-180.00, +180.00].
 *  @property {Number} altitude
 *         Specifies the altitude estimate in meters above the WGS 84
 *         ellipsoid.
 *  @property {Number} accuracy
 *         Specifies the accuracy of the latitude and longitude estimates in
 *         meters.
 *  @property {Number} altitudeAccuracy
 *         Specifies the accuracy of the altitude estimate in meters.
 *  @property {Number} heading
 *         Specifies the device's current direction of movement in degrees
 *         counting clockwise relative to true north.
 *  @property {Number} speed
 *         Specifies the device's current ground speed in meters per second.
 */

/**
 *	`Address` inner type that specifies the address of the fetched location.
 *	The address is expressed as a set of political and locality components.
 *
 *  This is generally returned as part of the
 *  {@link ?api=geolocator#geolocator~Location|`Location` result object}.
 *
 *  @typedef geolocator~Address
 *  @type Object
 *
 *  @property {String} commonName
 *         Indicates a point of interest, a premise or colloquial area name for
 *         the fetched location, if any.
 *  @property {String} streetNumber
 *         Indicates the precise street number of the fetched location, if any.
 *  @property {String} street
 *         Indicates the street name of the fetched location, if any.
 *  @property {String} route
 *         Indicates the route name of the fetched location, if any.
 *  @property {String} neighborhood
 *         Indicates the neighborhood name of the fetched location, if any.
 *  @property {String} town
 *         Indictes the town of the fetched location, if any.
 *  @property {String} city
 *         Indicates the city of the fetched location.
 *  @property {String} region
 *         Indicates the political region name of the fetched location, if any.
 *  @property {String} postalCode
 *         Indicates the postal code of the fetched location, if any.
 *  @property {String} state
 *         Indicates the state of the fetched location, if any.
 *  @property {String} stateCode
 *         Indicates the state code of the fetched location, if any.
 *  @property {String} country
 *         Indicates the national political entity of the fetched location.
 *  @property {String} countryCode
 *         Indicates the ISO alpha-2 country code of the fetched location.
 */

/**
 *	`TimeZone` inner type that specifies time offset data for the fetched
 *	location on the surface of the earth.
 *
 *  This is generally returned as part of the
 *  {@link ?api=geolocator#geolocator~Location|`Location` result object}.
 *
 *  @typedef geolocator~TimeZone
 *  @type Object
 *
 *  @property {String} id
 *         The ID of the time zone, such as `"America/Los_Angeles"` or
 *         `"Australia/Sydney"`. These IDs are defined in the
 *         {@link http://www.iana.org/time-zones|IANA Time Zone Database},
 *         which is also available in searchable format in Wikipedia's
 *         {@link http://en.wikipedia.org/wiki/List_of_tz_database_time_zones|List of tz database time zones}.
 *  @property {String} name
 *         The long form name of the time zone. This field will be localized if
 *         the Geolocator `language` is configured. e.g. `"Pacific Daylight Time"`
 *         or `"Australian Eastern Daylight Time"`.
 *  @property {String} abbr
 *         The abbreviation of the time zone.
 *  @property {Number} dstOffset
 *         The offset for daylight-savings time in seconds. This will be zero
 *         if the time zone is not in Daylight Savings Time during the specified
 *         timestamp.
 *  @property {Number} rawOffset
 *         The offset from UTC (in seconds) for the given location. This does
 *         not take into effect daylight savings.
 */

/**
 *	`MapData` inner type that provides references to the components of a
 *	created Google Maps `Map` and the containing DOM element.
 *
 *  This is generally returned as part of the
 *  {@link ?api=geolocator#geolocator~Location|`Location` result object}.
 *
 *  @typedef geolocator~MapData
 *  @type Object
 *
 *  @property {HTMLElement} element
 *         DOM element which a (Google) map is created within.
 *  @property {google.maps.Map} instance
 *         Instance of a Google Maps `Map` object.
 *  @property {google.maps.Marker} marker
 *         Instance of a Google Maps `Marker` object, if any.
 *  @property {google.maps.InfoWindow} infoWindow
 *         Instance of a Google Maps `InfoWindow` object, if any.
 *  @property {Object} options
 *         Arbitrary object of applied map options.
 */

/**
 *	`Location` inner type that specifies geographic coordinates, address and
 *	time zone information for the fetched location.
 *
 *  This result object is passed to the callbacks of the corresponding
 *  asynchronous Geolocator methods (such as `.locate()` method), as the second
 *  argument. The contents of this object will differ for various  Geolocator
 *  methods, depending on the configured method options.
 *
 *  @typedef geolocator~Location
 *  @type Object
 *
 *  @property {Coordinates} coords
 *         Specifies the geographic location of the device. The location is
 *         expressed as a set of geographic coordinates together with
 *         information about heading and speed.
 *         See {@link #geolocator~Coordinates|`geolocator~Coordinates` type}
 *         for details.
 *  @property {Address} address
 *         Specifies the address of the fetched location. The address is
 *         expressed as a set of political and locality components.
 *         This property might be `undefined` if `addressLookup` option is not
 *         enabled for the corresponding method.
 *         See {@link #geolocator~Address|`geolocator~Address` type}
 *         for details.
 *  @property {String} formattedAddress
 *         The human-readable address of this location. Often this address is
 *         equivalent to the "postal address," which sometimes differs from
 *         country to country.
 *  @property {Boolean} targetReached
 *         Specifies whether the defined target coordinates is reached.
 *         This property is only available for
 *         {@link #geolocator.watch|`geolocator.watch()`} method when `target`
 *         option is defined.
 *  @property {String} type
 *         Type of the location. See
 *         {@link #geolcoator.LocationType|`geolcoator.LocationType` enumeration}
 *         for details.
 *  @property {String} placeId
 *         A unique identifier that can be used with other Google APIs.
 *  @property {String} flag
 *         URL of the country flag image, in SVG format. This property exists
 *         only if address information is available.
 *  @property {TimeZone} timezone
 *         Specifies time offset data for the fetched location on the surface of
 *         the earth. See {@link #geolocator~TimeZone|`geolocator~TimeZone` type}
 *         for details.
 *  @property {MapData} map
 *         Provides references to the components of a created Google Maps `Map`
 *         and the containing DOM element. See
 *         {@link #geolocator~MapData|`geolocator~MapData` type} for details.
 *  @property {String} staticMap
 *         URL of a static Google map image, for the location.
 *  @property {Number} timestamp
 *         Specifies the time when the location information was retrieved and
 *         the `Location` object created.
 */

/**
 *  `MapOptions` inner type that specifies options for the map to be created.
 *
 *  @typedef geolocator~MapOptions
 *  @type Object
 *
 *  @property {String|HTMLElement|Map} element
 *         Either the ID of a DOM element or the element itself;
 *         which the map will be created within; or a previously created
 *         `google.maps.Map` instance. If a map instance is set, this
 *         only will apply the options without re-creating it.
 *  @property {Object} center
 *         Center coordinates for the map to be created.
 *      @property {Number} center.latitude
 *             Latitude of the center point coordinates.
 *      @property {Number} center.longitude
 *             Longitude of the center point coordinates.
 *  @property {String} mapTypeId
 *         Type of the map to be created.
 *         See {@link #geolocator.MapTypeId|`geolocator.MapTypeId` enumeration}
 *         for possible values.
 *  @property {String} title
 *         Title text to be displayed within an `InfoWindow`, when the
 *         marker is clicked. This only take effect if `marker` is
 *         enabled.
 *  @property {Boolean} marker
 *         Whether to place a marker at the given coordinates.
 *         If `title` is set, an `InfoWindow` will be opened when the
 *         marker is clicked.
 *  @property {Number} zoom
 *             Zoom level to be set for the map.
 */
