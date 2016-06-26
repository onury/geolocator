import utils from '../lib/utils';
import fetch from '../lib/fetch';
import GeoError from './geo.error';

/**
 *  Helper methods.
 *
 *  @license MIT
 *  @copyright 2016, Onur Yıldırım (onur@cutepilot.com)
 *  @type {Object}
 *  @private
 */
const geoHelper = {

    toGoogleCoords(coords) {
        return {
            lat: coords.lat || coords.latitude,
            lng: coords.lng || coords.longitude
        };
    },

    fromGoogleCoords(coords) {
        return {
            latitude: coords.latitude || coords.lat,
            longitude: coords.longitude || coords.lng
        };
    },

    // used for distance matrix origins and destinations
    toPointList(arr) {
        arr = utils.isArray(arr) ? arr : [arr];
        return arr.map(o => {
            return utils.isString(o) ? o : geoHelper.toGoogleCoords(o);
        });
    },

    getGeocodeComps(comp) {
        return {
            route: comp.route,
            locality: comp.locality,
            administrative_area: comp.administrativeArea, // eslint-disable-line camelcase
            postal_code: comp.postalCode, // eslint-disable-line camelcase
            country: comp.country,
            region: comp.region
        };
    },

    // Geocode examples:
    // address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=API_KEY
    // address=Winnetka&bounds=34.172684,-118.604794|34.236144,-118.500938&key=API_KEY
    // address=santa+cruz&components=country:ES&key=API_KEY
    // components=administrative_area:TX|country:US&key=API_KEY
    // Reverse Geocode examples:
    // latlng=40.714224,-73.961452&key=API_KEY
    // place_id=ChIJd8BlQ2BZwokRAFUEcm_qrcA&key=API_KEY
    buildGeocodeParams(options, reverse) {
        let params = [],
            e = utils.encodeURI;

        if (reverse) {
            if (options.placeId) {
                params.push(`place_id=${options.placeId}`);
            } else if (options.latitude && options.longitude) {
                params.push(`latlng=${options.latitude},${options.longitude}`);
            }
        } else {
            if (options.address) {
                params.push(`address=${e(options.address)}`);
            }

            let geoComps = geoHelper.getGeocodeComps(options);
            geoComps = utils.params(geoComps, { operator: ':', separator: '|' });
            params.push(`components=${geoComps}`);

            let b = options.bounds;
            if (utils.isArray(b) && b.length === 4) {
                params.push(`bounds=${b[0]},${b[1]}|${b[2]},${b[3]}`);
            } else if (utils.isPlainObject(b) && Object.keys(b).length === 4) {
                params.push(`bounds=${b.southwestLat},${b.southwestLng}|${b.northeastLat},${b.northeastLng}`);
            }
        }

        params.push(`language=${options.language}`);
        params.push(`key=${options.key}`);
        return params.join('&');
    },

    // See https://developers.google.com/maps/documentation/geocoding/intro
    formatGeocodeResults(results) {
        if (!utils.isArray(results) || results.length <= 0) {
            return {
                location: null,
                address: null,
                formattedAddress: '',
                type: null, // locationType
                placeId: ''
            };
        }

        let i, c,
            o = {},
            data = results[0],
            comps = data.address_components;

        for (i = 0; i < comps.length; i += 1) {
            c = comps[i];
            if (c.types && c.types.length > 0) {
                o[c.types[0]] = c.long_name;
                o[c.types[0] + '_s'] = c.short_name;
            }
        }

        let isUS = o.country_s === 'US',
            geometry = data.geometry;
        return {
            coords: geometry && geometry.location ? {
                latitude: geometry.location.lat,
                longitude: geometry.location.lng
            } : null,
            address: {
                commonName: o.point_of_interest
                    || o.premise
                    || o.subpremise
                    || o.colloquial_area
                    || '',
                streetNumber: o.street_number || '',
                street: o.administrative_area_level_4
                    || o.administrative_area_level_3
                    || o.route
                    || '',
                route: o.route || '',
                neighborhood: o.neighborhood
                    || o.administrative_area_level_5
                    || o.administrative_area_level_4
                    || '',
                town: o.sublocality || o.administrative_area_level_2 || '',
                city: o.locality || o.administrative_area_level_1 || '',
                region: o.administrative_area_level_2
                    || o.administrative_area_level_1
                    || '',
                postalCode: o.postal_code || '',
                state: isUS
                    ? (o.administrative_area_level_1 || '')
                    : '',
                stateCode: isUS
                    ? (o.administrative_area_level_1_s || '')
                    : '',
                country: o.country || '',
                countryCode: o.country_s || ''
            },
            formattedAddress: data.formatted_address,
            type: geometry.location_type || '',
            placeId: data.place_id,
            timestamp: utils.time()
        };
    },

    geocode(xhrOpts, raw, callback) {
        // console.log(xhrOpts.url);
        fetch.xhr(xhrOpts, (err, xhr) => {
            let response = utils.safeJsonParse(xhr.responseText);
            if (response === null) {
                if (err === null) {
                    err = new GeoError(GeoError.Code.INVALID_RESPONSE);
                }
            } else if (response.status !== 'OK') {
                err = GeoError.fromGoogleResponse(response);
                response = null;
            } else {
                response = raw
                    ? response
                    : geoHelper.formatGeocodeResults(response.results);
            }
            callback(err, response);
        });
    },

    // See https://developers.google.com/maps/documentation/distance-matrix/intro
    // Raw Result Example:
    // {
    //    "destination_addresses" : [ "San Francisco, CA, USA", "Victoria, BC, Canada" ],
    //    "origin_addresses" : [ "Vancouver, BC, Canada", "Seattle, WA, USA" ],
    //    "rows" : [
    //       {
    //          "elements" : [
    //             {
    //                "distance" : { "text" : "1,704 km", "value" : 1704324 },
    //                "duration" : { "text" : "3 days 19 hours", "value" : 327061
    //                },
    //                "status" : "OK"
    //             },
    //             {
    //                "distance" : { "text" : "138 km", "value" : 138295 },
    //                "duration" : { "text" : "6 hours 44 mins", "value" : 24236 },
    //                "status" : "OK"
    //             }
    //          ]
    //       },
    //       {
    //          "elements" : [
    //             {
    //                "distance" : { "text" : "1,452 km", "value" : 1451623 },
    //                "duration" : { "text" : "3 days 4 hours", "value" : 275062 },
    //                "status" : "OK"
    //             },
    //             {
    //                "distance" : { "text" : "146 km", "value" : 146496 },
    //                "duration" : { "text" : "2 hours 52 mins", "value" : 10324 },
    //                "status" : "OK"
    //             }
    //          ]
    //       }
    //    ],
    //    "status" : "OK"
    // }
    // Formatted to:

    formatDistanceResults(results) {
        if (!utils.isPlainObject(results)) {
            return null;
        }

        let arr = [],
            origins = results.originAddresses,
            dests = results.destinationAddresses,
            rows = results.rows;

        // [
        //     {
        //          from: 'Vancouver, BC, Canada',
        //          to: 'San Francisco, CA, USA',
        //          distance: { value: 1704107, text: "1,704 km" },
        //          duration: { value: 327025, text: "3 days 19 hours" },
        //          fare: { currency: "USD", value: 6, text: "$6.00" }
        //     },
        //     ...
        // ]

        let e;
        origins.forEach((origin, oIndex) => {
            dests.forEach((dest, dIndex) => {
                e = rows[oIndex].elements[dIndex];
                arr.push({
                    from: origin,
                    to: dest,
                    distance: e.distance,
                    duration: e.duration,
                    fare: e.fare,
                    timestamp: utils.time()
                });
            });
        });

        return arr;
    }

};

export default geoHelper;
