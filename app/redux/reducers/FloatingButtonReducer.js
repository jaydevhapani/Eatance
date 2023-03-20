/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
/* eslint-disable comma-dangle */

import { TYPE_SHOW_FLOATING_BUTTONG, TYPE_HIDE_FLOATING_BUTTONG, CHANGE_CART_BUTTON_VISIBILITY } from '../actions/FloatingButton';

const initalState = {
    isFloatingButtonVisible: false,
    currentScreen: undefined
};

export function floatingButtonOperations(state = initalState, action) {
    switch (action.type) {
        case TYPE_SHOW_FLOATING_BUTTONG: {
            return Object.assign({}, state, {
                isFloatingButtonVisible: action.value.shouldShowFloatingButton,
                currentScreen: action.value.currentScreen
            });
        }
        case TYPE_HIDE_FLOATING_BUTTONG: {
            return Object.assign({}, state, {
                isFloatingButtonVisible: action.value.shouldShowFloatingButton,
                currentScreen: action.value.currentScreen
            });
        }
        case CHANGE_CART_BUTTON_VISIBILITY: {
            return Object.assign({}, state, {
                isFloatingButtonVisible: action.value.shouldShowFloatingButton,
                currentScreen: action.value.currentScreen
            });
        }
        default:
            return state;
    }
}
