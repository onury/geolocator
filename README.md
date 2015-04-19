## Geolocator Javascript Library

> Version: 1.2.9  
> Author: Onur Yıldırım © 2015  
> Source code licensed under the MIT License.  
> Please see the [Disclaimer and License][license].

### Features:

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

**Direct Download:**  
[Full Version][uncompressed] 13KB *(3.5KB gzipped)*, [Minified Version][compressed] 4KB *(1.8KB gzipped)*  

**Install via Bower**:
```shell
bower install geolocator
```

**Install via NPM**:
```shell
npm install geolocator
```


See a live [**demo here**][demo].  

[![Geolocator Example Screenshot][example-img]][demo]

### Usage:

Inside the `<head>` of your HTML:
```html
<script type="text/javascript" src="geolocator.js"></script>
<script type="text/javascript">
    //The callback function executed when the location is fetched successfully.
    function onGeoSuccess(location) {
        console.log(location);
    }
    //The callback function executed when the location could not be fetched.
    function onGeoError(error) {
        console.log(error);
    }

    window.onload = function () {
        //geolocator.locateByIP(onGeoSuccess, onGeoError, 2, 'map-canvas');
        var html5Options = { enableHighAccuracy: true, timeout: 6000, maximumAge: 0 };
        geolocator.locate(onGeoSuccess, onGeoError, true, html5Options, 'map-canvas');
    };
</script>
```

Also place the line below, inside your `<body>` if you want to dynamically draw a map (you should also pass the element ID to the corresponding method for the map to be drawn):
```html
<div id="map-canvas" style="width:600px;height:400px"></div>
```

geolocator.js provides 3 useful methods:

## Methods

### `geolocator.locate()`
Use this method to get the location via HTML5 geolocation.
```js
geolocator.locate( successCallback, [errorCallback], [fallbackToIP], [html5Options], [mapCanvasId] )
```

**Parameters:**

> - `successCallback`   *Function*
> A callback function to be executed when the location is successfully fetched. The recent `geolocator.location` object is passed to this callback, as the only argument.

> - `errorCallback`   *Function  (optional, default: `null`)*
> A callback function to be executed when the location could not be fetched due to an error. The recent `PositionError` object is passed to this callback, as the only argument.

> - `fallbackToIP`   *Boolean|Number (optional, default: `false`)*
> Specifies whether geolocator should fallback to IP geo-lookup when HTML5 geolocation is not supported, timeout expired, position is unavailable or permission rejected by the user. A positive integer value will indicate the index of the source ip-geo service (if the value is in range). Boolean `true` will set the default ip-geo service index which is `1` (GeoPlugin). Valid values: *`0` (use FreeGeoIP for ip-geo fallback), `1` or `true` (use GeoPlugin for ip-geo fallback), `2` (use Wikimedia for ip-geo fallback), `false` or `-1` or `null` or any other value (will disable ip-geo fallback)*

> - `html5Options`   *Object (optional, default: `null`)*
> HTML5 geolocation options. e.g. `{ enableHighAccuracy: true, timeout: 6000, maximumAge: 0 }`  
> Note: Set the `timeout` value to at least `5000` milliseconds; otherwise this may produce a timeout error (which will fallback to IP geo-lookups if enabled.)

> - `mapCanvasId`   *String (optional, default: `null`)*
> HTML element ID for the Google Maps canvas. If set to null, no map is drawn.

**Example:**
```js
var html5Options = { enableHighAccuracy: true, timeout: 6000, maximumAge: 0 };
geolocator.locate(onGeoSuccess, onGeoError, true, html5Options, 'map-canvas');
```

### `geolocator.locateByIP()`
Use this method to get the location from the user's IP.
```js
geolocator.locateByIP( successCallback, [errorCallback], [ipSourceIndex], [mapCanvasId] )
```

**Parameters:**

> - `successCallback`   *Function*
> A callback function to be executed when the location is successfully fetched.
> The recent `geolocator.location` object is passed to this callback, as the only argument.

> - `errorCallback`   *Function (optional, default: `null`)*
> A callback function to be executed when the location could not be fetched due to an error.
> The recent `Error` object is passed to this callback, as the only argument.

> - `ipGeoSourceIndex`   *Integer (optional, default: `0`)*
> Indicates the index of the IP geo-lookup service.
> Valid values: *`0` (FreeGeoIP), `1` (GeoPlugin), `2` (Wikimedia)*

> - `mapCanvasId`   *String (optional, default: `null`)*
> HTML element ID for the Google Maps canvas. If set to null, no map is drawn.

**Example:**
```js
geolocator.locateByIP(onGeoSuccess, onGeoError, 1, 'map-canvas');
```

### `geolocator.isPositionError()`
Checks whether the type of the given object is HTML5 `PositionError` and returns a `Boolean` value.
```js
geolocator.isPositionError( error )
```

**Parameters:**

> - `error`   *Object*
> Object to be checked.

##Properties

### `geolocator.location`   *Object*
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
        streetNumber: "285",
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

### Change Log:

**version 1.2.9**
- Improvement: Added HTTPS secure connection support for IP geo-sources. _(Note: GeoPlugin does not support HTTPS. You should use FreeGeoIP or Wikimedia IP sources instead.)_. (Fixes [Issue #11](https://github.com/onury/geolocator/issues/11). PR: @iurisilvio,)

**version 1.2.8**
- Revision: Removed the `sensor` parameter from Goole Maps loader, since it's not required anymore.
- Revision: Bumped *Google Maps* version to `3.18`.
- Revision: Created [NPM package][npm-package].
- Revision: Created Bower package.

**version 1.2.6**
- Revision: The recent `Error` or `PositionError` (HTML5) is passed to error callbacks instead of `String` error message. See updated documentation. Fixes issue [#7](https://github.com/onury/geolocator/issues/7). *(This shouldn't be a breaking-change but do test your app if you decide to upgrade.)*
- Feature: Added new method: `isPositionError()`.
- Updated example. (Enable/disable HTML5-to-IP fallback.)

**version 1.2.4**
- Revision: Source scripts are now automatically removed from DOM after result is received.
- Bug-Fix: `errorCallback` would not be invoked if IP geo-source service is not available. Fixes issue [#6](https://github.com/onury/geolocator/issues/6).
- Revision: Changed default IP source to GeoPlugin (index:`1`); since FreeGeoIP is occasionally down these days.

**version 1.2.1**
 - Added [License][license].

**version 1.2.0**
 - Code optimizations.
 - Now loads the latest release version of *Google Maps* (`3.15`).

**version 1.1.0**
 - JSLint compliant code.
 - Minor code revisions.

**version 0.9.5**
 - Google has deprecated `google.loader.ClientLocation` API. As a result; Google (Loader) is removed from IP-Geo Sources.
 - Indexes changed for IP-Geo sources. New Indexes: FreeGeoIP (0), GeoPlugin (1), Wikimedia (2)


 
[license]: https://github.com/onury/geolocator/blob/master/LICENSE
[uncompressed]: https://raw.github.com/onury/geolocator/master/src/geolocator.js
[compressed]: https://raw.github.com/onury/geolocator/master/src/geolocator.min.js
[demo]: http://rawgit.com/onury/geolocator/master/example/index.html
[example-img]: https://raw.github.com/onury/geolocator/master/screenshots/geolocator-example.jpg
[npm-package]: https://www.npmjs.com/package/geolocator
[npm-package]: https://www.npmjs.com/package/geolocator
