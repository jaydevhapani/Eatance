export const TYPE_HIDE_FLOATING_BUTTONG = "TYPE_HIDE_FLOATING_BUTTONG";
export const TYPE_SHOW_FLOATING_BUTTONG = "TYPE_SHOW_FLOATING_BUTTONG";
export const CHANGE_CART_BUTTON_VISIBILITY = "CHANGE_CART_BUTTON_VISIBILITY";

export function showFloatingButton(data) {
    return {
        type: TYPE_SHOW_FLOATING_BUTTONG,
        value: data
    };
}

export function hideFloatingButton(data) {
    return {
        type: TYPE_HIDE_FLOATING_BUTTONG,
        value: data
    };
}

export function changeCartButtonVisibility(data) {
    return {
        type: CHANGE_CART_BUTTON_VISIBILITY,
        value: data
    }
}