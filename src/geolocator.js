/* 
 *  Geolocator Javascript Lib
 *  version:        0.92
 *  author:         Onur YILDIRIM
 *  contact:        onur@cutepilot.com
 *  project page:   https://github.com/onury/geolocator
 *  copyright:      © 2012. MIT License.
 */
var geolocator = (function() {

    /*-------- PRIVATE PROPERTIES & FIELDS --------*/

        /* Storage for the callback function to be executed when the location is successfully fetched. */
    var _onSuccess,
        /* Storage for the callback function to be executed when the location could not be fetched due to an error. */
        _onError,
        /* HTML element ID for the Google Maps. */
        _mapCanvasId,
        /* Google Maps URL. */
        _googleLoaderURL = 'https://www.google.com/jsapi',
        /* Google Maps URL. */
        _googleMapsURL = 'http://maps.googleapis.com/maps/api/js',
        /* Array of source services that provide location-by-IP information. */
        _ipGeoSources = [
            {url: _googleLoaderURL, cbParam: 'callback'}, // 0
            {url: 'http://freegeoip.net/json/', cbParam: 'callback'}, // 1
            {url: 'http://www.geoplugin.net/json.gp', cbParam: 'jsoncallback'}, // 2
            {url: 'http://geoiplookup.wikimedia.org/', cbParam: ''} // 3
            //,{url: 'http://j.maxmind.com/app/geoip.js', cbParam: ''} // Not implemented. Requires attribution. See http://dev.maxmind.com/geoip/javascript
        ],
        /* The index of the current IP source service. */
        _ipGeoSourceIndex = 0; // default (Google)

    /*-------- PRIVATE METHODS --------*/

    /*  Non-blocking method for loading scripts dynamically.
     */
    function _loadScript(url, callback, type) {
        var script = document.createElement('script');
        script.type = (typeof type === 'undefined') ? 'text/javascript' : type;

        if (callback) {
            if (script.readyState) {
                script.onreadystatechange = function() {
                    if (script.readyState == 'loaded' || script.readyState == 'complete') {
                        script.onreadystatechange = null;
                        callback();
                    }
                };
            } else {
                script.onload = function() { callback(); };
            }
        }

        script.src = url;
        //document.body.appendChild(script);
        document.getElementsByTagName('head')[0].appendChild(script);
    }

    /*  Loads Google Maps API and executes the callback function when done.
     */
    function _loadGoogleMaps(callback) {
        if (typeof google !== 'undefined' && typeof google.maps !== 'undefined') {
             if (callback) callback();
        }
        else {
            if (typeof google !== 'undefined' && typeof google.loader !== 'undefined') {
                 _loadMaps();
            }
            else {
                geolocator.__glcb = _loadMaps;
                _loadScript(_googleLoaderURL + '?callback=geolocator.__glcb');
            }
        }
        function _loadMaps() {
            if (geolocator.__glcb) delete geolocator.__glcb;
            google.load('maps', '3', {other_params: 'sensor=false', callback: callback});
        }
    }

    /*  Draws the map from the fetched geo information.
     */
    function _drawMap(elemId, mapOptions, infoContent) {
        var elem = document.getElementById(elemId);
        if (elem) {
            var map = new google.maps.Map(elem, mapOptions);
            var marker = new google.maps.Marker({
                position: mapOptions.center,
                map: map
            });
            var infowindow = new google.maps.InfoWindow();
            infowindow.setContent(infoContent);
            //infowindow.open(map, marker);
            google.maps.event.addListener(marker, 'click', function() {
                infowindow.open(map, marker);
            });
            geolocator.location.map = {
                canvas: elem,
                map: map,
                options: mapOptions,
                marker: marker,
                infoWindow: infowindow
            };
        }
        else {
            geolocator.location.map = null;
        }
    }

    /*  Runs a reverse-geo lookup for the specified lat-lon coords.
     */
    function _reverseGeoLookup(latlng, callback) {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({'latLng': latlng}, _onReverseGeo);
        function _onReverseGeo(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (callback) callback(results);
            }
        }
    }

    /*  Fetches additional details (from the reverse-geo result) for the address property of the location object.
     */
    function _fetchDetailsFromLookup(data) {
        if (data.length > 0) {
            geolocator.location.formattedAddress = data[0].formatted_address;
            var comps = data[0].address_components;
            for (var i = 0; i < comps.length; i++) {
                var comp = comps[i];
                if (comp.types.indexOf('route') >= 0) {
                    geolocator.location.address.street = comp.long_name;
                }
                else if (comp.types.indexOf('neighborhood') >= 0) {
                    geolocator.location.address.neighborhood = comp.long_name;
                }
                else if (comp.types.indexOf('sublocality') >= 0) {
                    geolocator.location.address.town = comp.long_name;
                }
                else if (comp.types.indexOf('locality') >= 0) {
                    geolocator.location.address.city = comp.long_name;
                }
                else if (comp.types.indexOf('administrative_area_level_1') >= 0) {
                    geolocator.location.address.region = comp.long_name;
                }
                else if (comp.types.indexOf('country') >= 0) {
                    geolocator.location.address.country = comp.long_name;
                    geolocator.location.address.countryCode = comp.short_name;
                }
                else if (comp.types.indexOf('postal_code') >= 0) {
                    geolocator.location.address.postalCode = comp.long_name;
                }
                else if (comp.types.indexOf('street_number') >= 0) {
                    geolocator.location.address.streetNumber = comp.long_name;
                }
            }
        }
    }

    /*  Finalizes the location object via reverse-geocoding and draws the map (if required).
     */
    function _finalize(coords) {
        var latlng = new google.maps.LatLng(coords.latitude, coords.longitude);
        _reverseGeoLookup(latlng, _onGeoLookup);
        function _onGeoLookup(data) {
            if (data.length > 0) {
                _fetchDetailsFromLookup(data);
            }
            
            var zoom = geolocator.location.ipGeoSource === null ? 14 : 7; //zoom out if we got the lcoation from IP.
            var mapOptions = {
              zoom: zoom,
              center: latlng,
              mapTypeId: 'roadmap'
            };
            _drawMap(_mapCanvasId, mapOptions, data[0].formatted_address);
            if (_onSuccess) _onSuccess.call(null, geolocator.location);
        }
    }

    /*  Gets the geo-position via HTML5 geolocation (if supported).
     */
    function _getPosition(fallbackToIP, html5Options)
    {
        geolocator.location = null;

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(_geoSuccess, _geoError, html5Options);
        }
        else { // not supported
            _fallback('geolocation is not supported.');
        }

        function _geoSuccess(position)
        {
            geolocator.location = {
                ipGeoSource: null,
                coords: position.coords,
                timestamp: (new Date()).getTime(), //overwrite timestamp (Safari-Mac and iOS devices use different epoch; so better use this).
                address: {}
            };
            _finalize(geolocator.location.coords);
        }

        function _geoError(error)
        {
            switch(error.code) 
            {
                case error.PERMISSION_DENIED:
                    break;
                case error.POSITION_UNAVAILABLE:
                    break;
                case error.TIMEOUT:
                    break;
                case error.UNKNOWN_ERROR:
                    break;
            }
            _fallback(error.message);
        }

        function _fallback(errMsg) {
            var ipsIndex = fallbackToIP === true ? 0 : (typeof fallbackToIP === 'number' ? fallbackToIP : -1);
            if (ipsIndex >= 0) {
                geolocator.locateByIP(_onSuccess, _onError, ipsIndex, _mapCanvasId);
            }
            else {
                if (_onError) _onError.call(null, errMsg);
            }
        }
    }

    /*  Loads the (jsonp) source. If the source does not support json-callbacks; 
     *  the callback is executed dynamically when the source is loaded completely.
     */
    function _loadIpGeoSource(source) {
        (typeof source.cbParam === 'undefined' || source.cbParam === null || source.cbParam === '') ? 
            _loadScript(source.url, _onGeoSourceCallback) : 
            _loadScript(source.url + '?' + source.cbParam + '=geolocator.__ipscb'); //ip source callback
    }

    /*  The callback that is executed when the location data is fetched from the source.
     */
    function _onGeoSourceCallback(data) {
        var _initialized = false;
        geolocator.location = null;
        delete geolocator.__ipscb;
        
        _loadGoogleMaps(_gLoadCallback);
        function _gLoadCallback() { 
            if (_ipGeoSourceIndex === 0) { // Google
                if (typeof google !== 'undefined' && typeof google.loader !== 'undefined' && 
                    typeof google.loader.ClientLocation !== 'undefined') {
                    _buildLocation(0, google.loader.ClientLocation);
                    _initialized = true;
                }
            } 
            else if (_ipGeoSourceIndex === 3) { // Wikimedia
                if (typeof window.Geo !== 'undefined') {
                    _buildLocation(_ipGeoSourceIndex, window.Geo);
                    delete window.Geo;
                    _initialized = true;
                }
            } 
            else {
                if (typeof data !== 'undefined') {
                    _buildLocation(_ipGeoSourceIndex, data);
                    _initialized = true;
                }
            }
            
            if (_initialized === true) {
                _finalize(geolocator.location.coords);
            }
            else {
                if (_onError) _onError('Could not get location.');
            }
        }
    }

    /*  Builds the location object from the source data.
     */
    function _buildLocation(sourceIndex, data) {
        switch(sourceIndex)
        {
            case 0: // Google
                geolocator.location = { 
                    coords: {
                        latitude: data.latitude,
                        longitude: data.longitude
                    },
                    address: {
                        city: data.address.city,
                        country: data.address.country,
                        countryCode: data.address.country_code,
                        region: data.address.region
                    }
                };
                break;
            case 1: // freegeoip
                geolocator.location = { 
                    coords: {
                        latitude: data.latitude,
                        longitude: data.longitude
                    },
                    address: {
                        city: data.city,
                        country: data.country_name,
                        countryCode: data.country_code,
                        region: data.region_name
                    }
                };
                break;
            case 2: // geoplugin
                geolocator.location = { 
                    coords: {
                        latitude: data.geoplugin_latitude,
                        longitude: data.geoplugin_longitude
                    },
                    address: {
                        city: data.geoplugin_city,
                        country: data.geoplugin_countryName,
                        countryCode: data.geoplugin_countryCode,
                        region: data.geoplugin_regionName
                    }
                };
                break;
            case 3: // Wikimedia
                geolocator.location = { 
                    coords: {
                        latitude: data.lat,
                        longitude: data.lon
                    },
                    address: {
                        city: data.city,
                        country: '',
                        countryCode: data.country,
                        region: ''
                    }
                };
                break;
        }
        if (geolocator.location) { 
            geolocator.location.coords.accuracy = null;
            geolocator.location.coords.altitude = null;
            geolocator.location.coords.altitudeAccuracy = null;
            geolocator.location.coords.heading = null;
            geolocator.location.coords.speed = null;
            geolocator.location.timestamp = new Date().getTime();
            geolocator.location.ipGeoSource = _ipGeoSources[sourceIndex];
            geolocator.location.ipGeoSource.data = data;
        }
    }

    return {

        /*-------- PUBLIC PROPERTIES --------*/

        /* The recent location information fetched as an object.
         */
        location: null,

        /*-------- PUBLIC METHODS --------*/

        /* Gets the geo-location by requesting user's permission.
         */
        locate: function(successCallback, errorCallback, fallbackToIP, html5Options, mapCanvasId) {
            _onSuccess = successCallback;
            _onError = errorCallback;
            _mapCanvasId = mapCanvasId;
            _loadGoogleMaps(_gLoadCallback);
            function _gLoadCallback() { _getPosition(fallbackToIP, html5Options); }
        },
        /* Gets the geo-location from the user's IP.
         */
        locateByIP: function(successCallback, errorCallback, sourceIndex, mapCanvasId) {
            _ipGeoSourceIndex = (typeof sourceIndex === 'undefined' || 
                (sourceIndex < 0 || sourceIndex >= _ipGeoSources.length)) ? 0 : sourceIndex;
            _onSuccess = successCallback;
            _onError = errorCallback;
            _mapCanvasId = mapCanvasId;
            geolocator.__ipscb = _onGeoSourceCallback;
            _loadIpGeoSource(_ipGeoSources[_ipGeoSourceIndex]);
        }
    };
})();