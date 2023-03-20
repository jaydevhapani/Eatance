import { TYPE_SAVE_CHECKOUT_DETAILS, SAVE_CART_DATA, SAVE_PRODUCT_DATA } from "../actions/Checkout";
import { SAVE_CART_COUNT } from "../actions/Checkout";

const initalState = {
  checkoutDetail: {},
  cartDetails: {},
  cartCount: 0
};

export function checkoutDetailOperation(state = initalState, action) {
  switch (action.type) {
    case TYPE_SAVE_CHECKOUT_DETAILS: {
      return Object.assign({}, state, {
        checkoutDetail: action.value
      });
    }
    case SAVE_CART_COUNT: {
      return Object.assign({}, state, {
        cartCount: action.value
      });
    }
    case SAVE_CART_DATA: {
      return Object.assign({}, state, {
        cartDetails: action.value
      });
    }
    case SAVE_PRODUCT_DATA: {
      return Object.assign({}, state, {
        productDetails: action.value
      });
    }
    default:
      return state;
  }
}
