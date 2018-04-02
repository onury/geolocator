/* global geolocator */

// Provider: ipstack.com

// This requires a FREE API key.
// GET FREE KEY @ https://ipstack.com/signup/free

// example response to be mapped:
// {
//     "ip": "216.58.209.4",
//     "hostname": "sof01s12-in-f4.1e100.net",
//     "type": "ipv4",
//     "continent_code": "NA",
//     "continent_name": "North America",
//     "country_code": "US",
//     "country_name": "United States",
//     "region_code": "CA",
//     "region_name": "California",
//     "city": "Mountain View",
//     "zip": "94043",
//     "latitude": 37.419200000000004,
//     "longitude": -122.0574,
//     "location": {
//         "geoname_id": 5375480,
//         "capital": "Washington D.C.",
//         "languages": [
//             {
//                 "code": "en",
//                 "name": "English",
//                 "native": "English"
//             }
//         ],
//         "country_flag": "http:\/\/assets.ipstack.com\/flags\/us.svg",
//         "country_flag_emoji": "\ud83c\uddfa\ud83c\uddf8",
//         "country_flag_emoji_unicode": "U+1F1FA U+1F1F8",
//         "calling_code": "1",
//         "is_eu": false
//     }
// }

geolocator.setGeoIPSource({
    provider: 'ipstack',
    // https requires premium api key
    url: 'http://api.ipstack.com/check?access_key=', // ADD YOUR ACCESS KEY
    callbackParam: 'callback',
    schema: {
        ip: 'ip',
        coords: {
            latitude: 'latitude',
            longitude: 'longitude'
        },
        address: {
            city: 'city',
            state: 'region_name',
            stateCode: 'region_code',
            postalCode: 'zip',
            countryCode: 'country_code',
            country: 'country_name',
            region: 'region_name'
        }
    }
});
