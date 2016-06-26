/* global geolocator */

// Provider: www.geoplugin.net

// example response to be mapped:
// {
//     geoplugin_request: "216.58.209.4",
//     geoplugin_status: 200,
//     geoplugin_credit: "Some of the returned data includes GeoLite data created by MaxMind, available from <a href=\'http://www.maxmind.com\'>http://www.maxmind.com</a>.",
//     geoplugin_city: "Mountain View",
//     geoplugin_region: "CA",
//     geoplugin_areaCode: "650",
//     geoplugin_dmaCode: "807",
//     geoplugin_countryCode: "US",
//     geoplugin_countryName: "United States",
//     geoplugin_continentCode: "NA",
//     geoplugin_latitude: "37.4192",
//     geoplugin_longitude: "-122.0574",
//     geoplugin_regionCode: "CA",
//     geoplugin_regionName: "California",
//     geoplugin_currencyCode: "USD",
//     geoplugin_currencySymbol: "&#36;",
//     geoplugin_currencySymbol_UTF8: "$",
//     geoplugin_currencyConverter: 1
// }

geolocator.setIPGeoSource({
    provider: 'geoplugin',
    // for HTTPS, requires a key and a different endpoint: ssl.geoplugin.net/json.gp
    url: 'http://www.geoplugin.net/json.gp',
    callbackParam: 'jsoncallback',
    schema: {
        ip: 'geoplugin_request',
        coords: {
            latitude: 'geoplugin_latitude',
            longitude: 'geoplugin_longitude'
        },
        address: {
            city: 'geoplugin_city',
            state: 'geoplugin_regionName',
            stateCode: 'geoplugin_regionCode',
            postalCode: '',
            countryCode: 'geoplugin_countryCode',
            country: 'geoplugin_countryName',
            region: 'geoplugin_region'
        }
    }
});
