/* global geolocator */

// Provider: geobytes.com
// See Usage Limits: http://geobytes.com/get-city-details-api

// example response to be mapped:
// {
//     geobytesforwarderfor: "",
//     geobytesremoteip: "176.123.22.33",
//     geobytesipaddress: "216.58.209.4",
//     geobytescertainty: "100",
//     geobytesinternet: "US",
//     geobytescountry: "United States",
//     geobytesregionlocationcode: "USWA",
//     geobytesregion: "Washington",
//     geobytescode: "WA",
//     geobyteslocationcode: "USWASEAT",
//     geobytescity: "Seattle",
//     geobytescityid: "11527",
//     geobytesfqcn: "Seattle, WA, United States",
//     geobyteslatitude: "47.601398",
//     geobyteslongitude: "-122.330002",
//     geobytescapital: "Washington, DC",
//     geobytestimezone: "-08:00",
//     geobytesnationalitysingular: "American",
//     geobytespopulation: "278058881",
//     geobytesnationalityplural: "Americans",
//     geobytesmapreference: "North America ",
//     geobytescurrency: "US Dollar",
//     geobytescurrencycode: "USD",
//     geobytestitle: "The United States"
// }

geolocator.setGeoIPSource({
    provider: 'geobytes',
    url: 'https://gd.geobytes.com/GetCityDetails',
    callbackParam: 'callback',
    schema: {
        ip: 'geobytesipaddress',
        coords: {
            latitude: 'geobyteslatitude',
            longitude: 'geobyteslongitude'
        },
        address: {
            city: 'geobytescity',
            state: 'geobytesregion',
            stateCode: 'geobytescode',
            postalCode: '',
            countryCode: 'geobytesinternet',
            country: 'geobytescountry',
            region: 'geobytesregion'
        }
    }
});
