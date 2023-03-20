export const SAVE_CMS_PAGES_DATA = "SAVE_CMS_PAGES_DATA";
export const SAVE_CURRENCY_SYMBOL = "SAVE_CURRENCY_SYMBOL";
export const SAVE_STORE_DETAILS = "SAVE_STORE_DETAILS";
export const SAVE_GOOGLE_MAPS_API_KEY = "SAVE_GOOGLE_MAPS_API_KEY";
export const SAVE_STORES_COUNT = "SAVE_STORES_COUNT";

export function saveCMSPagesData(data) {
    return {
        type: SAVE_CMS_PAGES_DATA,
        value: data
    };
}

export function saveCurrencySymbol(data) {
    return {
        type: SAVE_CURRENCY_SYMBOL,
        value: data
    };
}

export function saveGoogleMapsApiKey(data) {
    return {
        type: SAVE_GOOGLE_MAPS_API_KEY,
        value: data
    };
}

export function saveStoreDetails(data) {
    return {
        type: SAVE_STORE_DETAILS,
        value: data
    };
}

export function saveStoresCountInRedux(data) {
    return {
        type: SAVE_STORES_COUNT,
        value: data
    };
}
