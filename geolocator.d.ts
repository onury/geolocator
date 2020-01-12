declare module "geolocator" {
  const GOOGLE_MAPS_API_BASE = '//maps.googleapis.com/maps/api';

  //#region Enums
  export enum REMOTE_URLS {
    IP = '//api.ipify.org',
    FLAG = '//cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.3.1/flags/4x3/',
    GOOGLE_MAPS_API = GOOGLE_MAPS_API_BASE + '/js',
    GOOGLE_SATATIC_MAP = GOOGLE_MAPS_API_BASE + '/staticmap',
    GOOGLE_GEOLOCATION = '//www.googleapis.com/geolocation/v1/geolocate',
    GOOGLE_GEOCODE = '//maps.googleapis.com/maps/api/geocode/json',
    GOOGLE_TIMEZONE = '//maps.googleapis.com/maps/api/timezone/json',
    GOOGLE_DISTANCE_MATRIX = '//maps.googleapis.com/maps/api/distancematrix/json'
  }

  export enum MAP_TYPE_ID {
    HYBRID = 'hybrid',
    ROADMAP = 'roadmap',
    SATELLITE = 'satellite',
    TERRAIN = 'terrain'
  }

  export enum LOCATION_TYPE {
    ROOFTOP = 'ROOFTOP',
    RANGE_INTERPOLATED = 'RANGE_INTERPOLATED',
    GEOMETRIC_CENTER = 'GEOMETRIC_CENTER',
    APPROXIMATE = 'APPROXIMATE'
  }

  export enum TRAVEL_MODE {
    DRIVING = 'DRIVING',
    WALKING = 'WALKING',
    BICYCLING = 'BICYCLING',
    TRANSIT = 'TRANSIT'
  }

  export enum UNIT_SYSTEM {
    METRIC = 0,
    IMPERIAL = 1
  }

  export enum RADIO_TYPE {
    LTE = 'lte',
    GSM = 'gsm',
    CDMA = 'cdma',
    WCDMA = 'wcdma'
  }

  export enum DISTANCE_FORMULA {
    HAVERSINE = 'haversine',
    PYTHAGOREAN = 'pythagorean'
  }

  export enum IMAGE_FORMAT {
    PNG = 'png',
    PNG_8 = 'png8',
    PNG_32 = 'png32',
    GIF = 'gif',
    JPG = 'jpg',
    JPG_BASELINE = 'jpg-baseline'
  }

  export enum GEOLOCATOR_ERROR_CODES {
    GEOLOCATION_NOT_SUPPORTED = 'GEOLOCATION_NOT_SUPPORTED',
    INVALID_GEO_IP_SOURCE = 'INVALID_GEO_IP_SOURCE',
    PERMISSION_DENIED = 'PERMISSION_DENIED',
    POSITION_UNAVAILABLE = 'POSITION_UNAVAILABLE',
    TIMEOUT = 'TIMEOUT',
    INVALID_PARAMETERS = 'INVALID_PARAMETERS',
    INVALID_RESPONSE = 'INVALID_RESPONSE',
    INVALID_REQUEST = 'INVALID_REQUEST',
    REQUEST_DENIED = 'REQUEST_DENIED',
    REQUEST_FAILED = 'REQUEST_FAILED',
    GOOGLE_API_FAILED = 'GOOGLE_API_FAILED',
    OVER_QUERY_LIMIT = 'OVER_QUERY_LIMIT',
    USER_RATE_LIMIT_EXCEEDED = 'USER_RATE_LIMIT_EXCEEDED',
    DAILY_LIMIT_EXCEEDED = 'DAILY_LIMIT_EXCEEDED',
    GOOGLE_KEY_INVALID = 'GOOGLE_KEY_INVALID',
    MAX_ELEMENTS_EXCEEDED = 'MAX_ELEMENTS_EXCEEDED',
    MAX_DIMENSIONS_EXCEEDED = 'MAX_DIMENSIONS_EXCEEDED',
    MAX_WAYPOINTS_EXCEEDED = 'MAX_WAYPOINTS_EXCEEDED',
    PARSE_ERROR = 'PARSE_ERROR',
    NOT_FOUND = 'NOT_FOUND',
    INTERNAL_ERROR = 'INTERNAL_ERROR',
    UNKNOWN_ERROR = 'UNKNOWN_ERROR'
  }

  //#endregion

  //#region EventArgs
  interface IWatcherChangeEventArgs {
    coords: IBrowserGeolocationAPICoors,
    timestamp: number
  }

  //#endregion

  //#region Type Definitions
  type HexOrPredefinedColor = string | 'red' | 'black' | 'brown' | 'green' | 'purple' | 'yellow' | 'blue' | 'gray' | 'orange' | 'white';
  type DestinationLike = string | ILatLng | Array<string> | Array<ILatLng> | Array<ILatLng | string>;
  //#endregion

  //#region Structs
  interface ILatLng {
    latitude: number,
    longitude: number
  }

  interface IGoogleMapsValueAndDescription {
    value: number,
    text: string
  }

  interface IMapData {
    element: HTMLElement,
    infoWindow?: any,
    instance: any,
    marker?: any,
    options: IMapOptions
  }

  interface ITimeZone {
    abbr: string,
    dstOffset: number,
    id: string,
    name: string,
    rawOffset: number
  }

  interface IBrowserGeolocationAPICoors {
    latitude: number,
    longitude: number,
    altitude: null | number,
    accuracy: number,
    altitudeAccuracy: null | number,
    heading: number | null;
    speed: null | number;
  }

  interface IAddressDetails {
    city: string,
    commonName: string,
    country: string,
    countryCode: string,
    neighborhood?: string,
    postalCode?: string,
    region?: string,
    route?: string,
    state?: string,
    stateCode?: string,
    street?: string,
    streetNumber?: string,
    town?: string
  }

  interface ILocation {
    address?: IAddressDetails,
    coords: IBrowserGeolocationAPICoors,
    flag?: string,
    formattedAddress: string,
    map: IMapData,
    placeId: string,
    staticMap: string,
    targetReached?: boolean,
    timestamp: number,
    timezone: ITimeZone,
    type: LOCATION_TYPE
  }

  interface ISize {
    width: number,
    height: number
  }

  interface IDistanceMatrixItem {
    from: string,
    to: string,
    distance: IGoogleMapsValueAndDescription,
    duration: IGoogleMapsValueAndDescription,
    fare?: any,
    timestamp: number
  }

  interface IIpQueryResult {
    ip: string,
    timestamp: number
  }

  //#endregion

  //#region Options
  interface IGeolocatorConfigGoogleOptions {
    version: string,
    key: string,
    styles: null | any
  }

  interface IGeolocatorConfigOptions {
    language?: string,
    https?: boolean,
    google?: IGeolocatorConfigGoogleOptions
  }

  interface IWatcherOptions {
    enableHighAccuracy?: boolean,
    timeout?: number,
    maximumAge?: number
  }

  interface IStaticMapOptions {
    center: string | ILatLng,
    mapTypeId?: MAP_TYPE_ID,
    size?: string | ISize,
    scale?: number,
    zoom?: number,
    format?: IMAGE_FORMAT,
    marker?: boolean | HexOrPredefinedColor,
    region?: string,
    styles: any
  }

  interface IGeocodeOptions {
    address: string,
    route?: string,
    locality?: string,
    administrativeArea?: string,
    postalCode?: string,
    country?: string,
    country?: string,
    bounds?: Array<number> | {
      southwestLat: number,
      southwestLng: number,
      northeastLat: number,
      northeastLng: number
    },
    map?: string | IMapOptions,
    staticMap?: boolean | IStaticMapOptions,
    raw?: boolean
  }

  interface ICalcDistanceOptions {
    from: ILatLng,
    to: ILatLng,
    formula?: DISTANCE_FORMULA,
    unitSystem?: UNIT_SYSTEM
  }

  interface IMapOptions {
    element: string | HTMLElement | Map<string, any>,
    center: ILatLng,
    mapTypeId?: MAP_TYPE_ID,
    title?: string,
    marker?: boolean,
    zoom?: number,
    styles?: any
  }

  interface IDistanceMatrixOptions {
    origins: DestinationLike,
    destinations: DestinationLike,
    travelMode?: TRAVEL_MODE,
    avoidFerries?: boolean,
    avoidHighways?: boolean,
    avoidTolls?: boolean,
    unitSystem?: UNIT_SYSTEM,
    region?: string,
    raw?: boolean
  }

  interface ITimeZoneQueryOptions {
    latitude: number,
    longitude: number,
    timestamp?: number
    raw?: boolean
  }

  interface ILocateOptions {
    enableHighAccuracy?: boolean,
    desiredAccuracy?: number,
    timeout?: number,
    maximumWait?: number,
    maximumAge?: number,
    onProgress?: Function,
    fallbackToIP?: boolean,
    addressLookup?: boolean,
    timezone?: boolean,
    map?: string | IMapOptions,
    staticMap?: boolean | IStaticMapOptions
  }

  interface ILocateByIPOptions {
    addressLookup?: boolean,
    timezone?: boolean,
    map?: string | IMapOptions,
    staticMap?: boolean | IStaticMapOptions
  }

  interface ILocateByMobileOptions {
    homeMobileCountryCode?: number,
    homeMobileNetworkCode?: number,
    radioType?: RADIO_TYPE,
    carrier?: string,
    fallbackToIP?: boolean,
    cellTowers?: Array<ICellTowerOptions>,
    wifiAccessPoints?: Array<IWifiAccessPointOptions>,
    addressLookup?: boolean,
    timezone?: boolean,
    map?: string | IMapOptions,
    staticMap?: boolean | IStaticMapOptions
    raw?: boolean
  }

  interface ICellTowerOptions {
    cellId: number,
    locationAreaCode: number,
    mobileCountryCode: number,
    mobileNetworkCode: number,
    age?: number,
    signalStrength?: number,
    timingAdvance?: number
  }

  interface IWifiAccessPointOptions {
    macAddress: string,
    signalStrength?: number,
    age?: number,
    channel?: number,
    signalToNoiseRatio?: number
  }

  interface IReverseGeocodeOptions {
    latitude: number,
    longitude: number,
    placeId?: string,
    map?: string | IMapOptions,
    staticMap?: boolean | IStaticMapOptions
    raw?: boolean
  }

  interface ISetGeoIPSourceOptions {
    provider?: string,
    url: string,
    callbackParam?: string,
    globalVar?: any,
    schema?: any
  }

  interface IWatchOptions extends IWatcherOptions {
    clearOnError?: boolean,
    target?: ILatLng,
    radius?: number,
    unitSystem?: UNIT_SYSTEM
  }
  //#endregion

  //#region Classes
  export class GeoError extends Error {
    public static Code: GEOLOCATOR_ERROR_CODES;

    constructor(code?: GEOLOCATOR_ERROR_CODES, message?: string);

    public static isGeoError(err: any): boolean;

    public static fromResponse(response: any, message?: string): null | GeoError;

    public static isValidErrorCode(errorCode: string): boolean;

    public static create(err: Error | GeoError): GeoError;
  }

  export class GeoWatcher {
    public isCleared: boolean;
    public cycle: number;
    public id: Function;

    constructor(onChange?: (watchChangeEvent: IWatcherChangeEventArgs) => void, onError?: (error: Error) => void, options?: IWatcherOptions);

    clear(delay: number): void;
    clear(callback: () => void): void;
    clear(delay: number, callback: () => void): void;
  }

  export default class geolocator {
    public static get Error(): GeoError;

    public static get MapTypeId(): MAP_TYPE_ID;

    public static get LocationType(): LOCATION_TYPE;

    public static get TravelMode(): TRAVEL_MODE;

    public static get UnitSystem(): UNIT_SYSTEM;

    public static get RadioType(): RADIO_TYPE;

    public static get DistanceFormula(): MAP_TYPE_ID;

    public static get ImageFormat(): IMAGE_FORMAT;


    public static calcDistance(options: ICalcDistanceOptions): number;

    public static config(config?: IGeolocatorConfigOptions): ICalcDistanceOptions;

    public static createMap(options: string | Map | HTMLElement | IMapOptions, callback: (error: Error, map: IMapData) => void): void;

    public static ensureGoogleLoaded(callback: (error?: Error) => void): void;
    public static ensureGoogleLoaded(key: string, callback: (error?: Error) => void): void;

    public static geocode(options: string | IGeocodeOptions, callback: (error?: Error, location: ILocation) => void): void;

    public static getDistanceMatrix(options: IDistanceMatrixOptions, callback: (error?: Error, result: Array<IDistanceMatrixItem>) => void): void;

    public static getIp(callback: (error?: Error, result: IIpQueryResult) => void): void;

    public static getStaticMap(options: IStaticMapOptions): string;
    public static getStaticMap(options: IStaticMapOptions, callback: (error?: Error | GeoError, url: string) => void): void;

    public static getTimeZone(options: ITimeZoneQueryOptions, callback: (error?: Error, timezoneData: ITimeZone) => void): void;

    public static isGeoError(object: any): boolean;

    public static isGeolocationSupported(): boolean;

    public static isGoogleLoaded(): boolean;

    public static isPositionError(object: any): boolean;

    public static kmToMi(km: number): number;

    public static miToKm(mi: number): number;

    public static decToDegMinSec(dec: number): string;
    public static decToDegMinSec(dec: number, isLng: boolean): string;

    public static degToRad(deg: number): number;

    public static radToDeg(rad: number): number;

    public static locate(callback: (error?: Error, location: ILocation) => void): void;
    public static locate(options: ILocateOptions,callback: (error?: Error, location: ILocation) => void): void;

    public static locateByIP(callback: (error?: Error, location: ILocation) => void): void;
    public static locateByIP(options: ILocateByIPOptions, callback: (error?: Error, location: ILocation) => void): void;

    public static locateByMobile(callback: (error?: Error, location: ILocation) => void): void;
    public static locateByMobile(options: ILocateByMobileOptions, callback: (error?: Error, location: ILocation) => void): void;

    public static reverseGeocode(options: IReverseGeocodeOptions, callback: (error?: Error, location: ILocation) => void): void;

    public static setGeoIPSource(options: ISetGeoIPSourceOptions): geolocator;

    public static watch(callback: (error?: Error, location: ILocation) => void): GeoWatcher;
    public static watch(options: IWatchOptions, callback: (error?: Error, location: ILocation) => void): GeoWatcher;
  }
  //#endregion
}
