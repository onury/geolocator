/* global geolocator */

// Provider: geoip-db.com

// example response to be mapped:
// {
//     organization_name: "Total Server Solutions L.L.C.",
//     region: "Georgia",
//     accuracy: 1000,
//     asn: 46562,
//     organization: "AS46562 Total Server Solutions L.L.C.",
//     timezone: "America/New_York",
//     longitude: "-84.3858",
//     country_code3: "USA",
//     area_code: "0",
//     ip: "172.98.93.163",
//     city: "Atlanta",
//     country: "United States",
//     continent_code: "NA",
//     country_code: "US",
//     latitude: "33.748"
// }

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
