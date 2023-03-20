export const SAVE_BRANDS_DATA = "SAVE_BRANDS_DATA";
export const SAVE_CATEGORIES_DATA = "SAVE_CATEGORIES_DATA";
export const SAVE_FILTER_DATA = "SAVE_FILTER_DATA";
export const RESET_FILTER_DATA = "RESET_FILTER_DATA";

export function saveBrandsData(data) {
    return {
        type: SAVE_BRANDS_DATA,
        value: data
    };
}

export function saveCategoriesData(data) {
    return {
        type: SAVE_CATEGORIES_DATA,
        value: data
    };
}

export function saveFilterData(data) {
    return {
        type: SAVE_FILTER_DATA,
        value: data
    };
}

export function resetFilterData(data) {
    return {
        type: RESET_FILTER_DATA,
        value: data
    };
}
