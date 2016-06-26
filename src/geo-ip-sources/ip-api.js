/* global geolocator */

// Provider: ip-api.com
// See Usage Limits: http://ip-api.com/docs/#usage_limits

// example response to be mapped:
// {
//     as: "AS5662 Turner Broadcasting",
//     city: "Atlanta",
//     country: "United States",
//     countryCode: "US",
//     isp: "Turner Broadcasting System",
//     lat: 33.749,
//     lon: -84.388,
//     org: "Turner Broadcasting",
//     query: "157.166.226.25",
//     region: "GA",
//     regionName: "Georgia",
//     status: "success",
//     timezone: "America/New_York",
//     zip: "30348"
// }

geolocator.setGeoIPSource({
    provider: 'ip-api.com',
    // https not supported
    url: 'http://ip-api.com/json',
    schema: {
        ip: 'query',
        coords: {
            latitude: 'lat',
            longitude: 'lon'
        },
        address: {
            city: 'city',
            state: 'regionName',
            stateCode: 'region',
            postalCode: 'zip',
            countryCode: 'countryCode',
            country: 'country',
            region: 'region'
        },
        timezone: {
            id: 'timezone'
        }
    }
});
