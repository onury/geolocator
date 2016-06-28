import utils from '../lib/utils';

class GeoWatcher {

    constructor(onChange, onError, options = {}) {
        this.isCleared = false;
        this.cycle = 0;
        this._timer = null;
        this.id = navigator.geolocation.watchPosition(
            pos => {
                this.cycle++;
                if (utils.isFunction(onChange)) onChange(pos);
            },
            err => {
                this.cycle++;
                if (utils.isFunction(onError)) onError(err);
                if (options.clearOnError) {
                    this.clear();
                }
            },
            options
        );
    }

    _clear() {
        navigator.geolocation.clearWatch(this.id);
        this.isCleared = true;
        this._timer = null;
    }

    clear(delay, callback) {
        let d = utils.isNumber(delay) ? delay : 0,
            cb = utils.isFunction(callback) ? callback
                : utils.isFunction(delay) ? delay : null;
        // clear any previous timeout
        if (this._timer) {
            clearTimeout(this._timer);
            this._timer = null;
        }
        // check if watcher is not cleared
        if (!this.isCleared) {
            if (d === 0) {
                this._clear();
                if (cb) cb();
                return;
            }
            this._timer = setTimeout(() => {
                this._clear();
                if (cb) cb();
            }, d);
        }
    }

}

// ---------------------------
// EXPORT
// ---------------------------

export default GeoWatcher;
