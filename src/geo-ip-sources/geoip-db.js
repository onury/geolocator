/* global geolocator */

// Provider: geoip-db.com

// example response to be mapped:
// {
//     country_code: "US",
//     country_name: "United States",
//     city: "Atlanta",
//     postal: "30303",
//     latitude: 33.748,
//     longitude: -84.3858,
//     IPv4: "172.98.93.163",
//     state: "Georgia"
// }

geolocator.setGeoIPSource({
    provider: 'geoip-db.com',
    url: 'https://geoip-db.com/json/',
    xhr: true,
    schema: {
        ip: 'ipv4',
        coords: {
            latitude: 'latitude',
            longitude: 'longitude'
        },
        address: {
            city: 'city',
            state: 'state',
            stateCode: '',
            postalCode: 'postal',
            countryCode: 'country_code',
            country: 'country_name',
            region: ''
        }
    }
});
