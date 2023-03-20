export const TYPE_SAVE_CHECKOUT_DETAILS = "TYPE_SAVE_CHECKOUT_DETAILS";
export const SAVE_CART_COUNT = "SAVE_CART_COUNT";
export const SAVE_CART_DATA = "SAVE_CART_DATA";
export const SAVE_PRODUCT_DATA = "SAVE_PRODUCT_DATA";

export function saveCheckoutDetails(data) {
  return {
    type: TYPE_SAVE_CHECKOUT_DETAILS,
    value: data
  };
}

export function saveCartCount(data) {
  return {
    type: SAVE_CART_COUNT,
    value: data
  };
}

export function saveCartDataInRedux(data) {
  return {
    type: SAVE_CART_DATA,
    value: data
  };
}

export function saveProductDetailInRedux(data) {
  return {
    type: SAVE_PRODUCT_DATA,
    value: data
  };
}