import { SAVE_CMS_PAGES_DATA, SAVE_CURRENCY_SYMBOL, SAVE_STORE_DETAILS, SAVE_GOOGLE_MAPS_API_KEY, SAVE_STORES_COUNT } from "../actions/Content";

const initialState = {
    arrayCMSData: [],
    currencySymbol: '',
    objStoreDetails: undefined,
    googleMapsAPIKey: '',
    storesCount: 0,
}

export function contentOperations(state = initialState, action) {
    switch (action.type) {
        case SAVE_CMS_PAGES_DATA: {
            return Object.assign({}, state, {
                arrayCMSData: (action.value)
            });
        }

        case SAVE_CURRENCY_SYMBOL: {
            return Object.assign({}, state, {
                currencySymbol: (action.value)
            });
        }

        case SAVE_STORE_DETAILS: {
            return Object.assign({}, state, {
                objStoreDetails: (action.value)
            });
        }

        case SAVE_GOOGLE_MAPS_API_KEY: {
            return Object.assign({}, state, {
                googleMapsAPIKey: (action.value)
            });
        }

        case SAVE_STORES_COUNT: {
            return Object.assign({}, state, {
                storesCount: (action.value)
            });
        }

        default:
            return state;
    }
}