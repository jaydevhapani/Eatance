import { TYPE_SAVE_LOGIN_DETAILS, TYPE_SAVE_LOGIN_FCM, TYPE_SAVE_LANGUAGE, TYPE_SAVE_TERMS_ACCEPTED_STATUS } from "../actions/User";

const initialStateUser = {
  // LOGIN DETAILS
  lan: "en",
  userDetails: {},
  isLoggedIn: false,
  isTermsAndConditionsAccepted: false
};

export function userOperations(state = initialStateUser, action) {
  switch (action.type) {
    case TYPE_SAVE_LOGIN_DETAILS: {
      return Object.assign({}, state, {
        userDetails: action.value,
        isLoggedIn:
          action.value !== undefined && action.value.Email !== undefined
      });
    }
    case TYPE_SAVE_LOGIN_FCM: {
      return Object.assign({}, state, {
        token: action.value
      });
    }
    case TYPE_SAVE_LANGUAGE: {
      return Object.assign({}, state, {
        lan: action.value
      });
    }

    case TYPE_SAVE_TERMS_ACCEPTED_STATUS: {
      return Object.assign({}, state, {
        isTermsAndConditionsAccepted: action.value
      });
    }

    // case SAVE_CART_COUNT: {
    //   return Object.assign({}, state, {
    //     cartCount: action.value
    //   });
    // }
    default:
      return state;
  }
}
