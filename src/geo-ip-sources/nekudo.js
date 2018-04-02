/* global geolocator */

// Provider: nekudo

// example response to be mapped:
// {
//     "city": "Istanbul",
//     "country": {
//         "name": "Turkey",
//         "code": "TR"
//     },
//     "location": {
//         "accuracy_radius": 500,
//         "latitude": 40.9827,
//         "longitude": 28.7232,
//         "time_zone": "Europe\/Istanbul"
//     },
//     "ip": "217.131.87.104"
// }

geolocator.setGeoIPSource({
    provider: 'nekudo',
    url: 'https://geoip.nekudo.com/api',
    callbackParam: 'callback',
    schema: function (res) {
        var loc = res.location || {};
        var tz = (loc.time_zone || '').replace(/\\/g, '');
        return {
            ip: res.ip,
            coords: {
                latitude: loc.latitude,
                longitude: loc.longitude
            },
            address: {
                city: res.city,
                state: '',
                stateCode: '',
                postalCode: '',
                countryCode: res.country.code,
                country: res.country.name,
                region: ''
            },
            timezone: {
                id: tz
            }
        };
    }
});
