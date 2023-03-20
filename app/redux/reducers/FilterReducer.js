import { SAVE_CMS_PAGES_DATA } from '../actions/Content';
import { SAVE_CATEGORIES_DATA, SAVE_FILTER_DATA, SAVE_BRANDS_DATA, RESET_FILTER_DATA } from '../actions/Filter';

const initialState = {
    objFilter: {
        shouldShowProductsWithPrescription: false,
        shouldShowProductsInStock: false,
        arraySelectedBrandIDs: [],
        arraySelectedCategoryIDs: [],
    },
    arrayBrands: [],
    arrayCategories: [],
};

export function filterOperations(state = initialState, action) {
    switch (action.type) {
        case SAVE_BRANDS_DATA: {
            return Object.assign({}, state, {
                arrayBrands: action.value,
            });
        }
        case SAVE_CATEGORIES_DATA: {
            return Object.assign({}, state, {
                arrayCategories: action.value,
            });
        }
        case SAVE_FILTER_DATA: {
            return Object.assign({}, state, {
                objFilter: action.value,
            });
        }
        case RESET_FILTER_DATA: {
            return Object.assign({}, state, {
                objFilter: {
                    shouldShowProductsWithPrescription: false,
                    shouldShowProductsInStock: false,
                    arraySelectedBrandIDs: [],
                    arraySelectedCategoryIDs: [],
                },
            });
        }
        default:
            return state;
    }
}
