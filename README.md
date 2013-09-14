## Geolocator Javascript Lib
Version: 1.1,   Author: Onur Yildirim © 2012, MIT License.

###Features:

 - HTML5 geolocation (by user permission)
 - Location by IP (Supported source services: FreeGeoIP, GeoPlugin, WikiMedia)
 - Reverse Geocoding (address lookup)
 - Full address information (street, town, neighborhood, region,
   country, country code, postal code, etc...)
 - Fallback mechanism (from HTML5-geolocation to IP-geo lookup)
 - Supports Google Loader (loads Google Maps dynamically)
 - Dynamically creates Google Maps (with marker, info window, auto-adjusted zoom)
 - Non-blocking script loading (external sources are loaded on the fly without interrupting page load)
 - No library/framework dependencies (such as jQuery, MooTools, etc...)

**Download:** [Full Version](https://raw.github.com/onury/geolocator/master/src/geolocator.js) (~15 kb), [Minified Version](https://raw.github.com/onury/geolocator/master/src/geolocator.min.js) (~5 kb)

![Geolocator Example Screenshot](https://raw.github.com/onury/geolocator/master/screenshots/geolocator-example.jpg)

###Usage:

Inside the `<head>` of your HTML:

    <script type="text/javascript" src="geolocator.js"></script>
    <script type="text/javascript">
        //The callback function executed when the location is fetched successfully.
        function onGeoSuccess(location) {
            console.log(location);
        }
        //The callback function executed when the location could not be fetched.
        function onGeoError(message) {
            console.log(message);
        }

        window.onload = function() {
            //geolocator.locateByIP(onGeoSuccess, onGeoError, 2, 'map_canvas');
            var html5Options = { enableHighAccuracy: true, timeout: 3000, maximumAge: 0 };
            geolocator.locate(onGeoSuccess, onGeoError, true, html5Options, 'map_canvas');
        }
    </script>

Also place the line below, inside your `<body>` if you want to dynamically draw a map (you should also pass the element ID to the corresponding method for the map to be drawn):

    <div id="map_canvas" style="width:600px;height:400px"></div>

geolocator.js provides 2 useful methods:

##Methods

###`geolocator.locate()`
Use this method to get the location via HTML5 geolocation.

    geolocator.locate( successCallback, [errorCallback], [fallbackToIP], [html5Options], [mapCanvasId] )

**Parameters:**

> - `successCallback`   *Function*
> &nbsp; A callback function to be executed when the location is successfully fetched.
> &nbsp; The recent `geolocator.location` object is passed to this callback, as the only argument.

> - `errorCallback`   *Function  (optional, default: `null`)*
> &nbsp; A callback function to be executed when the location could not be fetched due to an error.
> &nbsp; The recent error message `String` is passed to this callback, as the only argument.

> - `fallbackToIP`   *Boolean|Integer (optional, default: `false`)*
> &nbsp; Specifies whether geolocator should fallback to IP geo-lookup when HTML5 geolocation is not
> &nbsp; supported or rejected by the user. A positive `Integer` value will indicate the index of the source
> &nbsp; ip-geo service (if the value is in range). Boolean `true` will set the default ip-geo service index
> &nbsp; which is `0` (FreeGeoIP).
> &nbsp; Valid values: *`0` or `true` (use FreeGeoIP for ip-geo fallback),
> &nbsp; `1` (use GeoPlugin for ip-geo fallback), `2` (use Wikimedia for ip-geo fallback), `false` or `-1` or
> &nbsp; `null` or any other value (will disable ip-geo fallback)*

> - `html5Options`   *Object (optional, default: `null`)*
> &nbsp; HTML5 geolocation options.

> - `mapCanvasId`   *String (optional, default: `null`)*
> &nbsp; HTML element ID for the Google Maps canvas. If set to null, no map is drawn.

**Example:**

    var html5Options = { enableHighAccuracy: true, timeout: 3000, maximumAge: 0 };
    geolocator.locate(onGeoSuccess, onGeoError, true, html5Options, 'map_canvas');

###`geolocator.locateByIP()`
Use this method to get the location from the user's IP.

    geolocator.locateByIP( successCallback, [errorCallback], [ipSourceIndex], [mapCanvasId] )

**Parameters:**

> - `successCallback`   *Function*
> &nbsp; A callback function to be executed when the location is successfully fetched.
> &nbsp; The recent `geolocator.location` object is passed to this callback, as the only argument.

> - `errorCallback`   *Function (optional, default: `null`)*
> &nbsp; A callback function to be executed when the location could not be fetched due to an error.
> &nbsp; The recent error message `String` is passed to this callback, as the only argument.

> - `ipGeoSourceIndex`   *Integer (optional, default: `0`)*
> &nbsp; Indicates the index of the IP geo-lookup service.
> &nbsp; Valid values: *`0` (FreeGeoIP), `1` (GeoPlugin), `2` (Wikimedia)*

> - `mapCanvasId`   *String (optional, default: `null`)*
> &nbsp; HTML element ID for the Google Maps canvas. If set to null, no map is drawn.

**Example:**

    geolocator.locateByIP(onGeoSuccess, onGeoError, 0, 'map_canvas');

##Properties

###`geolocator.location`   *Object*
Provides the recent geo-location information.

**Example Output:**

    {
        address: {
            city: "New York",
            country: "United States",
            countryCode: "US",
            neighborhood: "Williamsburg",
            postalCode: "11211",
            region: "New York",
            street: "Bedford Avenue",
            street_number: "285",
            town: "Brooklyn"
            },
        coords: {
            accuracy: 65,
            altitude: null,
            altitudeAccuracy: null,
            heading: null,
            latitude: 40.714224,
            longitude: -73.961452,
            speed: null
            },
        map: {
            canvas: HTMLDivElement, //DOM element for the map
            map: Object, //google.maps.Map
            options: Object, //map options
            infoWindow: Object, //google.maps.InfoWindow
            marker: Object //google.maps.Marker
            },
        formattedAddress: "285 Bedford Avenue, Brooklyn, NY 11211, USA",
        ipGeoSource: null,
        timestamp: 1360582737790
    }

###Change Log:
**version 1.1**
 - JSLint compliant code.
 - Minor code revisions.
**version 0.95**
 - Google has deprecated `google.loader.ClientLocation` API. As a result; Google (Loader) is removed from IP-Geo Sources.
 - Indexes changed for IP-Geo sources. New Indexes: FreeGeoIP (0), GeoPlugin (1), Wikimedia (2)


  [1]: http://onuryildirim.com/files/geolocator.js
  [2]: http://onuryildirim.com/files/geolocator.min.js
