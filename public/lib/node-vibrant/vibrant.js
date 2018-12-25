function rgbToHsl(t, e, r) {
    (t /= 255), (e /= 255), (r /= 255);
    let i,
        a,
        n = Math.max(t, e, r),
        s = Math.min(t, e, r),
        o = (n + s) / 2;
    if (n === s) i = a = 0;
    else {
        let l = n - s;
        switch (((a = o > 0.5 ? l / (2 - n - s) : l / (n + s)), n)) {
            case t:
                i = (e - r) / l + (e < r ? 6 : 0);
                break;
            case e:
                i = (r - t) / l + 2;
                break;
            case r:
                i = (t - e) / l + 4;
        }
        i /= 6;
    }
    return [i, a, o];
}
function defer() {
    let t,
        e,
        r = new Promise((r, i) => {
            (t = r), (e = i);
        });
    return { resolve: t, reject: e, promise: r };
}
function rgbToHex(t, e, r) {
    return (
        '#' + ((1 << 24) + (t << 16) + (e << 8) + r).toString(16).slice(1, 7)
    );
}
function hslToRgb(t, e, r) {
    let i, a, n;
    function s(t, e, r) {
        return (
            r < 0 && (r += 1),
            r > 1 && (r -= 1),
            r < 1 / 6
                ? t + 6 * (e - t) * r
                : r < 0.5
                ? e
                : r < 2 / 3
                ? t + (e - t) * (2 / 3 - r) * 6
                : t
        );
    }
    if (0 === e) i = a = n = r;
    else {
        let o = r < 0.5 ? r * (1 + e) : r + e - r * e,
            l = 2 * r - o;
        (i = s(l, o, t + 1 / 3)), (a = s(l, o, t)), (n = s(l, o, t - 1 / 3));
    }
    return [255 * i, 255 * a, 255 * n];
}
class Swatch {
    static applyFilter(t, e) {
        return 'function' == typeof e
            ? t.filter(({ r: t, g: r, b: i }) => e(t, r, i, 255))
            : t;
    }
    get r() {
        return this._rgb[0];
    }
    get g() {
        return this._rgb[1];
    }
    get b() {
        return this._rgb[2];
    }
    getRgb() {
        return this._rgb;
    }
    getHsl() {
        if (!this._hsl) {
            let [t, e, r] = this._rgb;
            this._hsl = rgbToHsl(t, e, r);
        }
        return this._hsl;
    }
    getPopulation() {
        return this._population;
    }
    getHex() {
        if (!this._hex) {
            let [t, e, r] = this._rgb;
            this._hex = rgbToHex(t, e, r);
        }
        return this._hex;
    }
    getYiq() {
        if (!this._yiq) {
            let t = this._rgb;
            this._yiq = (299 * t[0] + 587 * t[1] + 114 * t[2]) / 1e3;
        }
        return this._yiq;
    }
    getTitleTextColor() {
        return this.getYiq() < 200 ? '#fff' : '#000';
    }
    getBodyTextColor() {
        return this.getYiq() < 150 ? '#fff' : '#000';
    }
    constructor(t, e) {
        (this._rgb = t), (this._population = e);
    }
}
class Builder$$1 {
    constructor(t, e = {}) {
        (this._src = t),
            (this._opts = e),
            (this._opts.filters = Vibrant.DefaultOpts.filters.slice(0));
    }
    maxColorCount(t) {
        return (this._opts.colorCount = t), this;
    }
    maxDimension(t) {
        return (this._opts.maxDimension = t), this;
    }
    addFilter(t) {
        return this._opts.filters.push(t), this;
    }
    removeFilter(t) {
        let e = this._opts.filters.indexOf(t);
        return e > 0 && this._opts.filters.splice(e), this;
    }
    clearFilters() {
        return (this._opts.filters = []), this;
    }
    quality(t) {
        return (this._opts.quality = t), this;
    }
    useImageClass(t) {
        return (this._opts.ImageClass = t), this;
    }
    useGenerator(t) {
        return (this._opts.generator = t), this;
    }
    useQuantizer(t) {
        return (this._opts.quantizer = t), this;
    }
    build() {
        return new Vibrant(this._src, this._opts);
    }
    getPalette(t) {
        return this.build().getPalette(t);
    }
    getSwatches(t) {
        return this.build().getPalette(t);
    }
}
const MAX_WORKER_COUNT = 5;
class WorkerPool {
    constructor() {
        (this._workers = []), (this._queue = []), (this._executing = {});
    }
    static get instance() {
        return (
            this._instance || (this._instance = new WorkerPool()),
            this._instance
        );
    }
    _findIdleWorker() {
        let t;
        return (
            0 === this._workers.length ||
            this._workers.length < MAX_WORKER_COUNT
                ? (((t = new Worker(
                      'lib/node-vibrant/worker.js',
                  )).id = this._workers.length),
                  (t.idle = !0),
                  this._workers.push(t),
                  (t.onmessage = this._onMessage.bind(this, t.id)))
                : (t = this._workers.find(t => t.idle)),
            t
        );
    }
    _enqueue(t, e) {
        let r = defer(),
            i = {
                id: WorkerPool._task_id++,
                payload: { pixels: t, opts: e },
                deferred: r,
            };
        return this._queue.push(i), this._tryDequeue(), r.promise;
    }
    _tryDequeue() {
        if (this._queue.length <= 0) return;
        let t = this._findIdleWorker();
        if (!t) return;
        let e = this._queue.shift();
        this._executing[e.id] = e;
        let { deferred: r, ...i } = e;
        const {
            ImageClass: a,
            combinedFilter: n,
            filters: s,
            generator: o,
            quantizer: l,
            ...u
        } = i.payload.opts;
        (i.payload.opts = u), t.postMessage(i), (t.idle = !1);
    }
    _onMessage(t, e) {
        let r = e.data;
        if (!r) return;
        let { id: i } = r,
            a = this._executing[i];
        switch (((this._executing[i] = void 0), r.type)) {
            case 'return':
                a.deferred.resolve(
                    r.payload.map(
                        ({ _rgb: t, _population: e }) => new Swatch(t, e),
                    ),
                );
                break;
            case 'error':
                a.deferred.reject(new Error(r.payload));
        }
        (this._workers[t].idle = !0), this._tryDequeue();
    }
    quantize(t, e) {
        return this._enqueue(t, e);
    }
}
WorkerPool._task_id = 0;
const quantizeInWorker = (t, e) => WorkerPool.instance.quantize(t, e),
    DefaultOpts = {
        targetDarkLuma: 0.26,
        maxDarkLuma: 0.45,
        minLightLuma: 0.55,
        targetLightLuma: 0.74,
        minNormalLuma: 0.3,
        targetNormalLuma: 0.5,
        maxNormalLuma: 0.7,
        targetMutesSaturation: 0.3,
        maxMutesSaturation: 0.4,
        targetVibrantSaturation: 1,
        minVibrantSaturation: 0.35,
        weightSaturation: 3,
        weightLuma: 6.5,
        weightPopulation: 0.5,
    };
function _findMaxPopulation(t) {
    let e = 0;
    return (
        t.forEach(t => {
            e = Math.max(e, t.getPopulation());
        }),
        e
    );
}
function _isAlreadySelected(t, e) {
    return (
        t.Vibrant === e ||
        t.DarkVibrant === e ||
        t.LightVibrant === e ||
        t.Muted === e ||
        t.DarkMuted === e ||
        t.LightMuted === e
    );
}
function _createComparisonValue(t, e, r, i, a, n, s) {
    function o(t, e) {
        return 1 - Math.abs(t - e);
    }
    return (function(...t) {
        let e = 0,
            r = 0;
        for (let i = 0; i < t.length; i += 2) {
            let a = t[i],
                n = t[i + 1];
            (e += a * n), (r += n);
        }
        return e / r;
    })(
        o(t, e),
        s.weightSaturation,
        o(r, i),
        s.weightLuma,
        a / n,
        s.weightPopulation,
    );
}
function _findColorVariation(t, e, r, i, a, n, s, o, l, u) {
    let h = null,
        g = 0;
    return (
        e.forEach(e => {
            let [, c, m] = e.getHsl();
            if (
                c >= o &&
                c <= l &&
                m >= a &&
                m <= n &&
                !_isAlreadySelected(t, e)
            ) {
                let t = _createComparisonValue(
                    c,
                    s,
                    m,
                    i,
                    e.getPopulation(),
                    r,
                    u,
                );
                (null === h || t > g) && ((h = e), (g = t));
            }
        }),
        h
    );
}
function _generateVariationColors(t, e, r) {
    let i = {};
    return (
        (i.Vibrant = _findColorVariation(
            i,
            t,
            e,
            r.targetNormalLuma,
            r.minNormalLuma,
            r.maxNormalLuma,
            r.targetVibrantSaturation,
            r.minVibrantSaturation,
            1,
            r,
        )),
        (i.LightVibrant = _findColorVariation(
            i,
            t,
            e,
            r.targetLightLuma,
            r.minLightLuma,
            1,
            r.targetVibrantSaturation,
            r.minVibrantSaturation,
            1,
            r,
        )),
        (i.DarkVibrant = _findColorVariation(
            i,
            t,
            e,
            r.targetDarkLuma,
            0,
            r.maxDarkLuma,
            r.targetVibrantSaturation,
            r.minVibrantSaturation,
            1,
            r,
        )),
        (i.Muted = _findColorVariation(
            i,
            t,
            e,
            r.targetNormalLuma,
            r.minNormalLuma,
            r.maxNormalLuma,
            r.targetMutesSaturation,
            0,
            r.maxMutesSaturation,
            r,
        )),
        (i.LightMuted = _findColorVariation(
            i,
            t,
            e,
            r.targetLightLuma,
            r.minLightLuma,
            1,
            r.targetMutesSaturation,
            0,
            r.maxMutesSaturation,
            r,
        )),
        (i.DarkMuted = _findColorVariation(
            i,
            t,
            e,
            r.targetDarkLuma,
            0,
            r.maxDarkLuma,
            r.targetMutesSaturation,
            0,
            r.maxMutesSaturation,
            r,
        )),
        i
    );
}
function _generateEmptySwatches(t, e, r) {
    if (
        null === t.Vibrant &&
        null === t.DarkVibrant &&
        null === t.LightVibrant
    ) {
        if (null === t.DarkVibrant && null !== t.DarkMuted) {
            let [e, i, a] = t.DarkMuted.getHsl();
            (a = r.targetDarkLuma),
                (t.DarkVibrant = new Swatch(hslToRgb(e, i, a), 0));
        }
        if (null === t.LightVibrant && null !== t.LightMuted) {
            let [e, i, a] = t.LightMuted.getHsl();
            (a = r.targetDarkLuma),
                (t.DarkVibrant = new Swatch(hslToRgb(e, i, a), 0));
        }
    }
    if (null === t.Vibrant && null !== t.DarkVibrant) {
        let [e, i, a] = t.DarkVibrant.getHsl();
        (a = r.targetNormalLuma),
            (t.Vibrant = new Swatch(hslToRgb(e, i, a), 0));
    } else if (null === t.Vibrant && null !== t.LightVibrant) {
        let [e, i, a] = t.LightVibrant.getHsl();
        (a = r.targetNormalLuma),
            (t.Vibrant = new Swatch(hslToRgb(e, i, a), 0));
    }
    if (null === t.DarkVibrant && null !== t.Vibrant) {
        let [e, i, a] = t.Vibrant.getHsl();
        (a = r.targetDarkLuma),
            (t.DarkVibrant = new Swatch(hslToRgb(e, i, a), 0));
    }
    if (null === t.LightVibrant && null !== t.Vibrant) {
        let [e, i, a] = t.Vibrant.getHsl();
        (a = r.targetLightLuma),
            (t.LightVibrant = new Swatch(hslToRgb(e, i, a), 0));
    }
    if (null === t.Muted && null !== t.Vibrant) {
        let [e, i, a] = t.Vibrant.getHsl();
        (a = r.targetMutesSaturation),
            (t.Muted = new Swatch(hslToRgb(e, i, a), 0));
    }
    if (null === t.DarkMuted && null !== t.DarkVibrant) {
        let [e, i, a] = t.DarkVibrant.getHsl();
        (a = r.targetMutesSaturation),
            (t.DarkMuted = new Swatch(hslToRgb(e, i, a), 0));
    }
    if (null === t.LightMuted && null !== t.LightVibrant) {
        let [e, i, a] = t.LightVibrant.getHsl();
        (a = r.targetMutesSaturation),
            (t.LightMuted = new Swatch(hslToRgb(e, i, a), 0));
    }
}
const DefaultGenerator = (t, e) => {
    e = Object.assign({}, DefaultOpts, e);
    let r = _findMaxPopulation(t),
        i = _generateVariationColors(t, r, e);
    return _generateEmptySwatches(i, r, e), i;
};
function defaultFilter(t, e, r, i) {
    return i >= 125 && !(t > 250 && e > 250 && r > 250);
}
function combineFilters(t) {
    return Array.isArray(t) && 0 !== t.length
        ? (e, r, i, a) => {
              if (0 === a) return !1;
              for (let n = 0; n < t.length; n++)
                  if (!t[n](e, r, i, a)) return !1;
              return !0;
          }
        : null;
}
class Vibrant {
    constructor(t, e) {
        (this._src = t),
            (this.opts = Object.assign({}, Vibrant.DefaultOpts, e)),
            (this.opts.combinedFilter = combineFilters(this.opts.filters));
    }
    static from(t) {
        return new Builder$$1(t);
    }
    _process(t, e) {
        let { quantizer: r, generator: i } = e;
        return (
            t.scaleDown(e),
            t
                .applyFilter(e.combinedFilter)
                .then(t => r(t.data, e))
                .then(t => Swatch.applyFilter(t, e.combinedFilter))
                .then(t => Promise.resolve(i(t)))
        );
    }
    palette() {
        return this.swatches();
    }
    swatches() {
        return this._palette;
    }
    getPalette(t) {
        let e = new this.opts.ImageClass();
        const r = e
            .load(this._src)
            .then(t => this._process(t, this.opts))
            .then(
                t => ((this._palette = t), e.remove(), t),
                t => {
                    throw (e.remove(), t);
                },
            );
        return t && r.then(e => t(null, e), e => t(e)), r;
    }
}
Vibrant.DefaultOpts = {
    colorCount: 64,
    quality: 5,
    generator: DefaultGenerator,
    ImageClass: null,
    quantizer: quantizeInWorker,
    filters: [defaultFilter],
};
class ImageBase {
    scaleDown(t) {
        let e = this.getWidth(),
            r = this.getHeight(),
            i = 1;
        if (t.maxDimension > 0) {
            let a = Math.max(e, r);
            a > t.maxDimension && (i = t.maxDimension / a);
        } else i = 1 / t.quality;
        i < 1 && this.resize(e * i, r * i, i);
    }
    applyFilter(t) {
        let e = this.getImageData();
        if ('function' == typeof t) {
            let r,
                i,
                a,
                n,
                s,
                o = e.data,
                l = o.length / 4;
            for (let e = 0; e < l; e++)
                t(
                    (i = o[(r = 4 * e) + 0]),
                    (a = o[r + 1]),
                    (n = o[r + 2]),
                    (s = o[r + 3]),
                ) || (o[r + 3] = 0);
        }
        return Promise.resolve(e);
    }
}
function isRelativeUrl(t) {
    let e = new URL(t, location.href);
    return (
        e.protocol === location.protocol &&
        e.host === location.host &&
        e.port === location.port
    );
}
function isSameOrigin(t, e) {
    let r = new URL(t),
        i = new URL(e);
    return (
        r.protocol === i.protocol &&
        r.hostname === i.hostname &&
        r.port === i.port
    );
}
class BrowserImage extends ImageBase {
    _initCanvas() {
        let t = this.image,
            e = (this._canvas = document.createElement('canvas')),
            r = (this._context = e.getContext('2d'));
        (e.className = 'vibrant-canvas'),
            (e.style.display = 'none'),
            (this._width = e.width = t.width),
            (this._height = e.height = t.height),
            r.drawImage(t, 0, 0),
            document.body.appendChild(e);
    }
    load(t) {
        let e = null,
            r = null;
        if ('string' == typeof t) (e = document.createElement('img')), (r = t);
        else {
            if (!(t instanceof HTMLImageElement))
                return Promise.reject(
                    new Error('Cannot load buffer as an image in browser'),
                );
            (e = t), (r = t.src);
        }
        return (
            (this.image = e),
            isRelativeUrl(r) ||
                isSameOrigin(window.location.href, r) ||
                (e.crossOrigin = 'anonymous'),
            'string' == typeof t && (e.src = r),
            new Promise((t, i) => {
                let a = () => {
                    this._initCanvas(), t(this);
                };
                e.complete
                    ? a()
                    : ((e.onload = a),
                      (e.onerror = t =>
                          i(new Error(`Fail to load image: ${r}`))));
            })
        );
    }
    clear() {
        this._context.clearRect(0, 0, this._width, this._height);
    }
    update(t) {
        this._context.putImageData(t, 0, 0);
    }
    getWidth() {
        return this._width;
    }
    getHeight() {
        return this._height;
    }
    resize(t, e, r) {
        let { _canvas: i, _context: a, image: n } = this;
        (this._width = i.width = t),
            (this._height = i.height = e),
            a.scale(r, r),
            a.drawImage(n, 0, 0);
    }
    getPixelCount() {
        return this._width * this._height;
    }
    getImageData() {
        return this._context.getImageData(0, 0, this._width, this._height);
    }
    remove() {
        this._canvas.parentNode.removeChild(this._canvas);
    }
}
Vibrant.DefaultOpts.ImageClass = BrowserImage;
export default Vibrant;
//# sourceMappingURL=vibrant.js.map
