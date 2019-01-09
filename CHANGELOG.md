# Geolocator Changelog:

All notable changes to this project will be documented in this file. The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/) and this project adheres to [Semantic Versioning](http://semver.org).

## [2.1.5](https://github.com/onury/geolocator/compare/v2.1.3...v2.1.5) (2019-01-09)

### Fixed
- An issue where `locateByIP()` method would fail due to external service being shut down. Added a new (default) Geo-IP service provider to [GeoJS](https://www.geojs.io) with `HTTPS` support.
- An issue where XHR request handlers would not be invoked in IE9.

### Changed
- `getIP()` method now uses XHR request instead of JSONP, since CORS is supported by the service.
- Added ability fetch location-by-IP data via XHR. (Set `xhr` to `true` when passing a new Geo-IP source to `setGeoIPSource()` method.)
- Default value for `timeout` option is changed to `6000` for `.locate()` method.
- Improved minification and reduced library size.
- (Dev) Removed grunt in favour of npm scripts. Removed Jasmine in favour of Jest. 


## [2.1.3](https://github.com/onury/geolocator/compare/v2.1.1...v2.1.3) (2018-04-02)

### Fixed
- Changed default Geo-IP provider to [nekudo/shiny_geoip](https://github.com/nekudo/shiny_geoip). *(FreeGeoIP service is [shut down](https://github.com/apilayer/freegeoip#readme.))*. Fixes issue [#53](https://github.com/onury/geolocator/issues/53).
- An issue with Geo-IP schema, occurred when a function is used instead of a mapper object.

### Added
- Geo IP source: IPStack (requires a free API key). 
_Note that this is a [separate file](https://github.com/onury/geolocator/blob/master/src/geo-ip-sources/ipstack.js), you can include in your HTML. Or you can use a [different provider](https://github.com/onury/geolocator/tree/master/src/geo-ip-sources) if you like. See the [Caveats](https://github.com/onury/geolocator#caveats) section before you do so._


## [2.1.1](https://github.com/onury/geolocator/compare/v2.1.0...v2.1.1) (2017-03-11)

### Added
- Support for hybrid or sandboxed environments (such as Electron). Now, forcing the export mechanism to assign `geolocator` to `window` even if it's used via an `import` or `require` statement. i.e. this happens when used within babel/webpack bundled code or from within an electron app. See issues [#42](https://github.com/onury/geolocator/issues/42) and [#48](https://github.com/onury/geolocator/issues/48).

### Changed
- Minor revision, clean up.

## [2.1.0](https://github.com/onury/geolocator/compare/v2.0.0...v2.1.0) (2016-09-30)
Please read the [**API documentation**][api-docs].

### Added
- Ability to get static Google Maps (image) via `.getStaticMap()` method. [#34](https://github.com/onury/geolocator/issues/34). *Make sure you have enabled Google Static Maps API in Google Developers console.*
- Ability to style Google Maps. Either set global styles via `geolocator.config()` or corresponding methods such as `.createMap()` or `.getStaticMap()`.

### Changed
- Improved desired accuracy logic. Added `maximumWait:Number` and `onProgress:Function` options for `.locate()` method.
- Minor revisions, updated dev-dependencies.

### Fixed
- Changed Geo-IP provider to [FreeGeoIP](https://freegeoip.net). (Wikimedia has shutdown the geo service.) Fixes issue [#36](https://github.com/onury/geolocator/issues/36).
- Respecting countries with states, other than US. Fixes [#37](https://github.com/onury/geolocator/pull/37).

## [2.0.0](https://github.com/onury/geolocator/compare/v1.2.9...v2.0.0) (2016-06-25)
Please read the [**API documentation**][api-docs].

### Added
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
- Support multiple calls. Fixes issue [#24](https://github.com/onury/geolocator/issues/24).

### Changed
- **BREAKING**: Method signatures changed for `.locate()` and `.locateByIP()` methods.
- **BREAKING**: Most features make use of Google APIs. So you'll need a (single) Google API key to use them all. If you don't have a key, you can still use Geolocator like the previous versions, but with limited features.
- **BREAKING**: `geolocator.location` property is dropped. You can always access the result, via the second argument of each async method's callback. See documented examples.
- Better Geolocation accuracy. Fixes issue [#28](https://github.com/onury/geolocator/issues/28).
- Google Maps is no longer loaded by default. Depends on called methods or options.
- Now, we only support a single Geo-IP source (Wikimedia). Can be set/changed via `setGeoIPSource()` method.

### Fixed
- An issue with wikimedia IP lookup. Fixes [#32](https://github.com/onury/geolocator/issues/32).

---

## [1.2.9](https://github.com/onury/geolocator/compare/v1.2.8...v1.2.9)

### Added
- HTTPS secure connection support for IP geo-sources. _(Note: GeoPlugin does not support HTTPS. You should use FreeGeoIP or Wikimedia IP sources instead.)_. (Fixes [Issue #11](https://github.com/onury/geolocator/issues/11). PR: @iurisilvio)

## [1.2.8](https://github.com/onury/geolocator/compare/v1.2.6...v1.2.8)

### Added
- Created [NPM package][npm-package].
- Created Bower package.

### Changed
- Removed the `sensor` parameter from Goole Maps loader, since it's not required anymore.
- Bumped *Google Maps* version to `3.18`.

## [1.2.6](https://github.com/onury/geolocator/compare/v1.2.4...v1.2.6)

### Added
- FNew method: `isPositionError()`.

### Changed
- The recent `Error` or `PositionError` (HTML5) is passed to error callbacks instead of `String` error message. See updated documentation. Fixes issue [#7](https://github.com/onury/geolocator/issues/7). *(This shouldn't be a breaking-change but do test your app if you decide to upgrade.)*
- Updated example. (Enable/disable HTML5-to-IP fallback.)

## [1.2.4](https://github.com/onury/geolocator/compare/v1.2.1...v1.2.4)

### Changed
- Source scripts are now automatically removed from DOM after result is received.
- Changed default IP source to GeoPlugin (index:`1`); since FreeGeoIP is occasionally down these days.

### Fixed
- `errorCallback` would not be invoked if IP geo-source service is not available. Fixes issue [#6](https://github.com/onury/geolocator/issues/6).

## [1.2.1](https://github.com/onury/geolocator/compare/v1.2.0...v1.2.1)

### Added
- [License][license].

## [1.2.0](https://github.com/onury/geolocator/compare/v1.1.0...v1.2.0)

### Changed
- Code revisions, optimizations.
- Now loads the latest release version of *Google Maps* (`3.15`).

## [1.1.0](https://github.com/onury/geolocator/compare/v0.9.5...v1.1.0)

### Changed
- JSLint compliant code.
- Minor code revisions.

## 0.9.5

### Changed
- Google has deprecated `google.loader.ClientLocation` API. As a result; Google (Loader) is removed from IP-Geo Sources.
- Indexes changed for IP-Geo sources. New Indexes: FreeGeoIP (0), GeoPlugin (1), Wikimedia (2)


[api-docs]:https://onury.github.io/geolocator/?api=geolocator
[license]: https://github.com/onury/geolocator/blob/master/LICENSE
[npm-package]: https://www.npmjs.com/package/geolocator
