
## Change Log:

### v2.1.0 (2016-09-30)

- Feature: Get static Google Maps (image) via `.getStaticMap()` method. [#34](https://github.com/onury/geolocator/issues/34). *Make sure you have enabled Google Static Maps API in Google Developers console.*
- Feature: Ability to style Google Maps. Either set global styles via `geolocator.config()` or corresponding methods such as `.createMap()` or `.getStaticMap()`.
- Revision: Improved desired accuracy logic. Added `maximumWait:Number` and `onProgress:Function` options for `.locate()` method.
- Fix: Changed Geo-IP provider to [FreeGeoIP](https://freegeoip.net). (Wikimedia has shutdown the geo service.) Fixes issue [#36](https://github.com/onury/geolocator/issues/36).
- Fix: Respecting countries with states, other than US. Fixes [#37](https://github.com/onury/geolocator/pull/37).
- Minor revisions, updated dev-dependencies.

Please read the [**API documentation**][api-docs].

### v2.0.0 (2016-06-25)

- Improvement: Better Geolocation accuracy. Fixes issue [#28](https://github.com/onury/geolocator/issues/28).
- Feature: Watch geographic position.
- Feature: Locate by mobile information.
- Feature: Get timezone information. Fixes issue [#13](https://github.com/onury/geolocator/issues/13).
- Feature: Get distance matrix and duration information.
- Feature: Calculate distance between two geographic points.
- Feature: Various geographic conversion utilities.
- Feature: Get client IP.
- Feature: Fetched location includes country flag image (SVG) URL.
- Feature: Language support (depends on the service provider). Fixes issue [#20](https://github.com/onury/geolocator/issues/20).
- Feature: Universal module (CommonJS/Node/AMD..). Fixes issue [#16](https://github.com/onury/geolocator/issues/16).
- Revision: Google Maps is no longer loaded by default. Depends on called methods or options.
- Revision: Now, we only support a single Geo-IP source (Wikimedia). Can be set/changed via `setGeoIPSource()` method.
- Revision: Fix issue [#32](https://github.com/onury/geolocator/issues/32).
- Improvement: Support multiple calls. Fixes issue [#24](https://github.com/onury/geolocator/issues/24).

- **BREAKING CHANGES**:
    + Revision: Method signatures changed for `.locate()` and `.locateByIP()` methods.
    + Revision: Most features make use of Google APIs. So you'll need a (single) Google API key to use them all.
    If you don't have a key, you can still use Geolocator like the previous versions, but with limited features.
    + Revision: `geolocator.location` property is dropped. You can always access the result, via the second argument of each async method's callback. See documented examples.

Please read the [**API documentation**][api-docs].

---

**v1.2.9**
- Improvement: Added HTTPS secure connection support for IP geo-sources. _(Note: GeoPlugin does not support HTTPS. You should use FreeGeoIP or Wikimedia IP sources instead.)_. (Fixes [Issue #11](https://github.com/onury/geolocator/issues/11). PR: @iurisilvio)

**v1.2.8**
- Revision: Removed the `sensor` parameter from Goole Maps loader, since it's not required anymore.
- Revision: Bumped *Google Maps* version to `3.18`.
- Revision: Created [NPM package][npm-package].
- Revision: Created Bower package.

**v1.2.6**
- Revision: The recent `Error` or `PositionError` (HTML5) is passed to error callbacks instead of `String` error message. See updated documentation. Fixes issue [#7](https://github.com/onury/geolocator/issues/7). *(This shouldn't be a breaking-change but do test your app if you decide to upgrade.)*
- Feature: Added new method: `isPositionError()`.
- Updated example. (Enable/disable HTML5-to-IP fallback.)

**v1.2.4**
- Revision: Source scripts are now automatically removed from DOM after result is received.
- Bug-Fix: `errorCallback` would not be invoked if IP geo-source service is not available. Fixes issue [#6](https://github.com/onury/geolocator/issues/6).
- Revision: Changed default IP source to GeoPlugin (index:`1`); since FreeGeoIP is occasionally down these days.

**v1.2.1**
 - Added [License][license].

**v1.2.0**
 - Code optimizations.
 - Now loads the latest release version of *Google Maps* (`3.15`).

**v1.1.0**
 - JSLint compliant code.
 - Minor code revisions.

**v0.9.5**
 - Google has deprecated `google.loader.ClientLocation` API. As a result; Google (Loader) is removed from IP-Geo Sources.
 - Indexes changed for IP-Geo sources. New Indexes: FreeGeoIP (0), GeoPlugin (1), Wikimedia (2)


[api-docs]:https://onury.github.io/geolocator/?api=geolocator
[license]: https://github.com/onury/geolocator/blob/master/LICENSE
[npm-package]: https://www.npmjs.com/package/geolocator
