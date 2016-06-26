/* global geolocator */

// Provider: wikimedia.org
// https://meta.wikimedia.org/wiki/Geo_IP_lookup

// example response to be mapped:
// Geo = {"city":"Los Angeles","country":"US","region":"CA","lat":"34.043800","lon":"-118.251198","IP":"155.94.227.165"}

geolocator.setGeoIPSource({
    provider: 'wikimedia',
    url: 'https://bits.wikimedia.org/geoiplookup',
    callbackParam: null,
    globalVar: 'Geo',
    schema: {
        ip: 'IP',
        coords: {
            latitude: 'lat',
            longitude: 'lon'
        },
        address: {
            city: 'city',
            state: 'region',
            postalCode: '',
            countryCode: 'country',
            country: 'country',
            region: 'region'
        }
    }
});
