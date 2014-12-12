## Geolocator Javascript Library
> Version: 1.2.4  
> Author: Onur Yildirim © 2012-2014.  
> Source code licensed under the MIT License.  
> Please see the [Disclaimer and License][license].

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
 - Browser Support: IE 9+, Chrome, Safari, Firefox, Opera...

**Download:** [Full Version](https://raw.github.com/onury/geolocator/master/src/geolocator.js) 12.4KB *(3.2KB gzipped)*, [Minified Version](https://raw.github.com/onury/geolocator/master/src/geolocator.min.js) 4KB *(1.6KB gzipped)*

![Geolocator Example Screenshot](https://raw.github.com/onury/geolocator/master/screenshots/geolocator-example.jpg)

###Usage:

Inside the `<head>` of your HTML:
```html
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
        //geolocator.locateByIP(onGeoSuccess, onGeoError, 2, 'map-canvas');
        var html5Options = { enableHighAccuracy: true, timeout: 3000, maximumAge: 0 };
        geolocator.locate(onGeoSuccess, onGeoError, true, html5Options, 'map-canvas');
    }
</script>
```

Also place the line below, inside your `<body>` if you want to dynamically draw a map (you should also pass the element ID to the corresponding method for the map to be drawn):
```html
<div id="map-canvas" style="width:600px;height:400px"></div>
```

geolocator.js provides 2 useful methods:

##Methods

###`geolocator.locate()`
Use this method to get the location via HTML5 geolocation.
```js
geolocator.locate( successCallback, [errorCallback], [fallbackToIP], [html5Options], [mapCanvasId] )
```

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
```js
var html5Options = { enableHighAccuracy: true, timeout: 3000, maximumAge: 0 };
geolocator.locate(onGeoSuccess, onGeoError, true, html5Options, 'map-canvas');
```

###`geolocator.locateByIP()`
Use this method to get the location from the user's IP.
```js
geolocator.locateByIP( successCallback, [errorCallback], [ipSourceIndex], [mapCanvasId] )
```

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
```js
geolocator.locateByIP(onGeoSuccess, onGeoError, 0, 'map-canvas');
```

##Properties

###`geolocator.location`   *Object*
Provides the recent geo-location information.

**Example Output:**
```js
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
```

###Change Log:

**version 1.2.3**
- Revision: Source scripts are now automatically removed from DOM after result is received.
- Bug-Fix: `errorCallback` would not be invoked if IP geo-source service is not available. Fixes #6.
- Revision: Changed default IP source to GeoPlugin (index:`1`); since FreeGeoIP is occasionally down these days.

**version 1.2.1**
 - Added [License][license].

**version 1.2.0**
 - Code optimizations.
 - Now loads the latest release version of *Google Maps* (3.15).

**version 1.1.0**
 - JSLint compliant code.
 - Minor code revisions.

**version 0.9.5**
 - Google has deprecated `google.loader.ClientLocation` API. As a result; Google (Loader) is removed from IP-Geo Sources.
 - Indexes changed for IP-Geo sources. New Indexes: FreeGeoIP (0), GeoPlugin (1), Wikimedia (2)


 
  [license]: https://github.com/onury/geolocator/blob/master/LICENSE
