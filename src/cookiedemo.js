window.onload = function() {
	var t0, t1;
    //The callback function executed when the location is fetched successfully.
    function onGeoSuccess(location) {
        t1 = performance.now();
        console.log('Location grabbed...');
        console.log(location);
        console.log("Call to geolocate took " + (t1 - t0) + " milliseconds.");
    }

    function geolocate() {
        t0 = performance.now();
        geolocator.locateByIP(onGeoSuccess, null, 2, null);
    }

    geolocate();
};
