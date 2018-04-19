// we don't mix import and module.exports in same file, so using require here.
const geolocator = require('./core/geolocator').geolocator;

// See https://github.com/onury/geolocator/issues/42
if (typeof window !== 'undefined'
        && typeof window.geolocator === 'undefined') {
    window.geolocator = geolocator;
}

// export default geolocator;
// http://stackoverflow.com/a/33683495/112731
module.exports = geolocator;
