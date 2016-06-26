/* global geolocator */

// Provider: freegeoip.net

// example response to be mapped:
// {
//     ip: "216.58.209.4",
//     country_code: "US",
//     country_name: "United States",
//     region_code: "CA",
//     region_name: "California",
//     city: "Mountain View",
//     zip_code: "94043",
//     time_zone: "America/Los_Angeles",
//     latitude: 37.4192,
//     longitude: -122.0574,
//     metro_code: 807
// }

geolocator.setGeoIPSource({
    provider: 'freegeoip',
    url: 'https://freegeoip.net/json',
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
            postalCode: 'zip_code',
            countryCode: 'country_code',
            country: 'country_name',
            region: 'region_name'
        },
        timezone: {
            id: 'time_zone'
        }
    }
});
