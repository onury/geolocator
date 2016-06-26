# Geolocator v2

![bower](https://img.shields.io/bower/v/geolocator.svg)
![npm](https://img.shields.io/npm/v/geolocator.svg)
![release](https://img.shields.io/github/release/onury/geolocator.svg)
![license](http://img.shields.io/npm/l/perfy.svg)  

> © 2016, Onur Yıldırım (@onury)
> MIT License. Please see the [Disclaimer and License][license].

Geolocator.js is a utility for getting geo-location information, geocoding, address look-ups, distance & durations, timezone information and more...

## Features

 - HTML5 geolocation (by user permission) with **improved accuracy**.
 - Location by IP
 - Reverse Geocoding (address lookup)
 - Full address information (street, town, neighborhood, region, country, country code, postal code, etc...)
 - Fallback mechanism (from HTML5-geolocation to Geo-IP lookup)
 - **NEW**: Watch geographic position
 - **NEW**: Locate by mobile information
 - **NEW**: Get timezone information
 - **NEW**: Get distance matrix and duration information
 - **NEW**: Calculate distance between two geographic points
 - **NEW**: Various geographic conversion utilities
 - **NEW**: Get client IP
 - **NEW**: Fetched location includes country flag image (SVG) URL
 - **NEW**: Language support (depends on the service provider)
 - Supports Google Loader (loads Google APIs dynamically)
 - Dynamically creates Google Maps, **on demand** (with marker, info window, auto-adjusted zoom)
 - Non-blocking script loading (external sources are loaded on the fly without interrupting page load)
 - No library/framework dependencies (such as jQuery, etc...)
 - **NEW**: Universal module (CommonJS/Node/AMD..)
 - Small file size (9KB minified, gzipped)
 - Browser Support: IE 9+, Chrome, Safari, Firefox, Opera...

### Breaking Changes

If you're migrating from v1.x to v2, you should consider the following changes:

 - Geolocator **v2** is completely re-written from scratch; adding more features to it while keeping and improving the existing ones. So almost everything has changed, for good.
 - The most significant change is; we've got rid of separate callbacks for error and success. Now, we have Node-style, single callback for each async method; with `err` as the first argument. If it's a success, `err` will be `null`.
 - Most features make use of Google APIs. So you'll need a (single) Google API key to use them all. If you don't have a key, you can still use Geolocator like the previous versions, but with limited features.
 - `.location` property is dropped. You can always access the result, via the second argument of each async method's callback.
 - Geolocator now supports a single Geo-IP provider, Wikimedia. You can use `geolcoator.setGeoIPSource()` method to set a different Geo-IP source.
 - Read the [API documentation][api-docs] for details...

## Get Geolocator.js

Link or download via [**CDNJS**][cdnjs].  

Download full source code from [GitHub releases][releases].  

Install via **Bower**:
```
bower install geolocator
```

Install via **NPM**:
```
npm install geolocator
```

_If somehow you need the legacy version v1.2.9 and don't need the better. [Here][legacy-version] it is._

## Usage:

Example below, tries to get user's geo-location via HTML5 Geolocation and if user rejects, it will fallback to IP based geo-location.

Inside the `<head>` of your HTML:
```html
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/geolocator/2.0.0/geolocator.min.js"></script>
<script type="text/javascript">

    geolocator.config({
        language: "en",
        google: {
            version: "3",
            key: "YOUR-GOOGLE-API-KEY"
        }
    });

    window.onload = function () {
        var options = {
            enableHighAccuracy: true,
            timeout: 6000,
            maximumAge: 0,
            desiredAccuracy: 30,
            fallbackToIP: true, // fallback to IP if Geolocation fails or rejected
            addressLookup: true,
            timezone: true,
            map: "map-canvas"
        };
        geolocator.locate(options, function (err, location) {
            if (err) return console.log(err);
            console.log(location);
        });
    };

</script>
```

If you've enabled `map` option; include the following, inside the `<body>` of your HTML:
```html
<div id="map-canvas" style="width:600px;height:400px"></div>
```
Read [**API documentation**][api-docs] for lots of other features and examples.

## Important Notes

- Since Geolocation API is an HTML5 feature, make sure your `doctype` is HTML5 (e.g. `<!DOCTYPE html>`).
- Make sure you're calling Geolocation APIs (such as `geolocator.locate()` and `geolocator.watch()`) from a secure origin (i.e. an **HTTPS** page). In Chrome 50, Geolocation API is [removed][chrome-unsecure] from **unsecured origins**. Other browsers are expected to follow.
- Although some calls might work without a key, it is generally required by most Google APIs (such as Time Zone API). To get a free (or premium) key, [click here][google-docs]. After getting a key, you can enable multiple APIs for it. Make sure you [enable][google-console] all the APIs supported by Geolocator.
- On Firefox, callback is not fired for Geolocation, if user clicks "Not Now" instead of "Never". (bug [675533][bug-675533]).

## Under the Hood

Geolocator v2 is written in ES2015 (ES6), compiled with [Babel][babel], bundled with [Webpack][webpack] and documented with [Docma][docma].

## License

MIT. See the [Disclaimer and License][license].


[api-docs]:https://onury.github.io/geolocator/?api=geolocator
[license]: https://github.com/onury/geolocator/blob/master/LICENSE
[uncompressed]: https://raw.github.com/onury/geolocator/master/src/geolocator.js
[compressed]: https://raw.github.com/onury/geolocator/master/src/geolocator.min.js
[cdnjs]:https://cdnjs.com/libraries/geolocator
[demo]: http://rawgit.com/onury/geolocator/master/example/index.html
[example-img]: https://raw.github.com/onury/geolocator/master/screenshots/geolocator-example.jpg
[npm-package]: https://www.npmjs.com/package/geolocator
[releases]:https://github.com/onury/geolocator/releases
[legacy-version]:https://github.com/onury/geolocator/releases/tag/v1.2.9
[babel]:https://github.com/babel/babel
[webpack]:https://github.com/webpack/webpack
[docma]:https://github.com/onury/docma
[google-docs]:https://developers.google.com/maps/documentation/javascript
[google-console]:https://console.developers.google.com
[chrome-unsecure]:https://developers.google.com/web/updates/2016/04/geolocation-on-secure-contexts-only?hl=en
[bug-884921]:https://bugzilla.mozilla.org/show_bug.cgi?id=884921
[bug-675533]:https://bugzilla.mozilla.org/show_bug.cgi?id=675533
