/* global geolocator */

// Provider: ipinfo.io
// See Usage Limits: http://ipinfo.io/pricing

// example response to be mapped:
// {
//     "ip": "8.8.8.8",
//     "hostname": "google-public-dns-a.google.com",
//     "city": "Mountain View",
//     "region": "California",
//     "country": "US",
//     "loc": "37.3860,-122.0838",
//     "org": "AS15169 Google Inc.",
//     "postal": "94040"
// }

geolocator.setGeoIPSource({
    provider: 'ipinfo.io',
    // https requires a key
    url: 'http://ipinfo.io',
    schema: function (res) {
        var coords = res.loc.split(',');
        return {
            ip: res.ip,
            coords: {
                latitude: parseFloat(coords[0]),
                longitude: parseFloat(coords[1])
            },
            address: {
                city: res.city,
                state: res.region,
                stateCode: null,
                postalCode: res.postal,
                countryCode: res.country,
                country: res.country,
                region: res.region
            }
        };
    }
});
