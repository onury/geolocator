const GOOGLE_MAPS_API_BASE = '//maps.googleapis.com/maps/api';

/**
 * This file only includes partial documentation about `geolocator` enumerations.
 * Note that these enumerations are mostly an aggregation of
 * {@link https://developers.google.com/maps/documentation/javascript|Google Maps API} constants.
 *
 * @private
 * @readonly
 */
const enums = Object.freeze({
    /**
     * Enumerates API endpoints used within Geolocator core.
     *
     * @enum {String}
     * @readonly
     * @private
     */
    URL: {
        /**
         *  Public IP retrieval (free) service.
         *  @type {String}
         *  @private
         */
        IP: '//api.ipify.org',
        /**
         *  Country SVG flags.
         *  e.g. <url>/tr.svg for Turkey flag.
         *  @type {String}
         *  @private
         */
        FLAG: '//cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.3.1/flags/4x3/',
        /**
         * Google Maps API bootstrap endpoint that loads all of the main
         * Javascript objects and symbols for use in the Maps API.
         * Some Maps API features are also available in self-contained
         * libraries which are not loaded unless you specifically request them.
         * See {@link https://developers.google.com/maps/documentation/javascript/libraries|details}.
         * @type {String}
         * @private
         */
        GOOGLE_MAPS_API: GOOGLE_MAPS_API_BASE + '/js',
        /**
         * Google Maps API Static Map endpoint.
         * @type {String}
         * @private
         */
        GOOGLE_SATATIC_MAP: GOOGLE_MAPS_API_BASE + '/staticmap',
        /**
         * Google Geolocation API endpoint.
         * @type {String}
         * @private
         */
        GOOGLE_GEOLOCATION: '//www.googleapis.com/geolocation/v1/geolocate',
        /**
         * Google Geocode API endpoint.
         * @type {String}
         * @private
         */
        GOOGLE_GEOCODE: '//maps.googleapis.com/maps/api/geocode/json',
        /**
         * Google TimeZone API endpoint.
         * @type {String}
         * @private
         */
        GOOGLE_TIMEZONE: '//maps.googleapis.com/maps/api/timezone/json',
        /**
         * Google Distance Matrix API endpoint.
         * @type {String}
         * @private
         */
        GOOGLE_DISTANCE_MATRIX: '//maps.googleapis.com/maps/api/distancematrix/json'
    },
    /**
     * Enumerates Google map types.
     * @memberof! geolocator
     *
     * @enum {String}
     * @readonly
     */
    MapTypeId: {
        /**
         * Map type that displays a transparent layer of major streets on
         * satellite images.
         * @type {String}
         */
        HYBRID: 'hybrid',
        /**
         * Map type that displays a normal street map.
         * @type {String}
         */
        ROADMAP: 'roadmap',
        /**
         * Map type that displays satellite images.
         * @type {String}
         */
        SATELLITE: 'satellite',
        /**
         * Map type displays maps with physical features such as terrain and
         * vegetation.
         * @type {String}
         */
        TERRAIN: 'terrain'
    },
    /**
     * Enumerates Google location types.
     * @memberof! geolocator
     *
     * @enum {String}
     * @readonly
     */
    LocationType: {
        /**
         * Indicates that the returned result is a precise geocode for which
         * we have location information accurate down to street address
         * precision.
         * @type {String}
         */
        ROOFTOP: 'ROOFTOP',
        /**
         * Indicates that the returned result reflects an approximation
         * (usually on a road) interpolated between two precise points (such as
         * intersections). Interpolated results are generally returned when
         * rooftop geocodes are unavailable for a street address.
         * @type {String}
         */
        RANGE_INTERPOLATED: 'RANGE_INTERPOLATED',
        /**
         * Indicates that the returned result is the geometric center of a
         * result such as a polyline (for example, a street) or polygon
         * (region).
         * @type {String}
         */
        GEOMETRIC_CENTER: 'GEOMETRIC_CENTER',
        /**
         * Indicates that the returned result is approximate.
         * @type {String}
         */
        APPROXIMATE: 'APPROXIMATE'
    },
    /**
     * Enumerates Google travel modes.
     * @memberof! geolocator
     *
     * @enum {String}
     * @readonly
     */
    TravelMode: {
        /**
         * Indicates distance calculation using the road network.
         * @type {String}
         */
        DRIVING: 'DRIVING',
        /**
         * Requests distance calculation for walking via pedestrian paths &
         * sidewalks (where available).
         * @type {String}
         */
        WALKING: 'WALKING',
        /**
         * Requests distance calculation for bicycling via bicycle paths &
         * preferred streets (where available).
         * @type {String}
         */
        BICYCLING: 'BICYCLING',
        /**
         * Requests distance calculation via public transit routes (where
         * available). This value may only be specified if the request includes
         * an API key or a Google Maps APIs Premium Plan client ID. If you set
         * the mode to transit you can optionally specify either a
         * `departureTime` or an `arrivalTime`. If neither time is specified,
         * the `departureTime` defaults to now (that is, the departure time defaults
         * to the current time). You can also optionally include a `transitMode`
         * and/or a `transitRoutingPreference`.
         * @type {String}
         */
        TRANSIT: 'TRANSIT'
    },
    // /**
    //  * Enumerates Google route restrictions.
    //  * @memberof! geolocator
    //  *
    //  * @enum {String}
    //  * @readonly
    //  */
    // RouteRestriction: {
    //     TOLLS: 'tolls',
    //     HIGHWAYS: 'highways',
    //     FERRIES: 'ferries',
    //     INDOOR: 'indoor'
    // },
    /**
     * Enumerates Google unit systems.
     * @memberof! geolocator
     *
     * @enum {Number}
     * @readonly
     */
    UnitSystem: {
        /**
         * Distances in kilometers and meters.
         * @type {Number}
         */
        METRIC: 0,
        /**
         * Distances defined in miles and feet.
         * @type {Number}
         */
        IMPERIAL: 1
    },
    /**
     * Enumerates mobile radio types.
     * @memberof! geolocator
     *
     * @enum {String}
     * @readonly
     */
    RadioType: {
        /**
         * LTE (Long-Term Evolution) mobile radio type.
         * @type {String}
         */
        LTE: 'lte',
        /**
         * GSM (Global System for Mobile Communications) mobile radio type.
         * @type {String}
         */
        GSM: 'gsm',
        /**
         * CDMA (Code division multiple access) mobile radio access technology.
         * @type {String}
         */
        CDMA: 'cdma',
        /**
         * Wideband CDMA mobile radio access technology.
         * @type {String}
         */
        WCDMA: 'wcdma'
    },
    /**
     * Enumerates formulas/algorithms for calculating the distance between two
     * lat/lng points.
     * @memberof! geolocator
     *
     * @readonly
     * @enum {String}
     *
     * @todo {@link https://en.wikipedia.org/wiki/Vincenty%27s_formulae|Vincenty's Formula}
     */
    DistanceFormula: {
        /**
         * Haversine formula for calculating the distance between two lat/lng points
         * by relating the sides and angles of spherical triangles.
         * @see {@link http://en.wikipedia.org/wiki/Haversine_formula|Haversine_formula}.
         * @type {String}
         */
        HAVERSINE: 'haversine',
        /**
         * Formula based on the Pythagoras Theorem for calculating the
         * distance between two lat/lng points on a Equirectangular projection
         * to account for curvature of the longitude lines.
         * @see {@link https://en.wikipedia.org/wiki/Pythagorean_theorem|Pythagorean_theorem}
         * @type {String}
         */
        PYTHAGOREAN: 'pythagorean'
    },
    /**
     *  Enumerates the image formats used for getting static Google Map images.
     *  @memberof! geolocator
     *
     *  @readonly
     *  @enum {String}
     */
    ImageFormat: {
        /**
         *  Specifies the PNG image format.
         *  Same as `PNG_8`.
         *  @type {String}
         */
        PNG: 'png',
        /**
         *  Specifies the 8-bit PNG image format.
         *  Same as `PNG`.
         *  @type {String}
         */
        PNG_8: 'png8',
        /**
         *  Specifies the 32-bit PNG image format.
         *  @type {String}
         */
        PNG_32: 'png32',
        /**
         *  Specifies the GIF image format.
         *  @type {String}
         */
        GIF: 'gif',
        /**
         *  Specifies the JPEG compressed image format.
         *  @type {String}
         */
        JPG: 'jpg',
        /**
         *  Specifies a non-progressive JPEG compression image format.
         *  @type {String}
         */
        JPG_BASELINE: 'jpg-baseline'
    }
});

export default enums;
