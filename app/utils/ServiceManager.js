// /* eslint-disable no-trailing-spaces */
// /* eslint-disable semi */
// /* eslint-disable comma-dangle */
// /* eslint-disable prettier/prettier */
import {
  LOGIN_URL,
  debugLog,
  RequestKeys,
  RESET_PASSWORD_REQ_URL,
  LOGOUT_URL,
  CMS_PAGE,
  UPDATE_PROFILE,
  GET_NOTIFICATION,
  GET_HOME_DATA,
  ADD_REVIEW,
  GET_ADDRESS,
  ADD_TO_CART,
  ADD_ADDRESS,
  DELETE_ADDRESS,
  CHECK_DRIVER_AVAILABILITY_URL,
  FORGOT_PASSWORD,
  GET_FILTER_VALUES,
  PROMO_CODE_LIST,
  REGISTRATION_URL,
  ORDER_LISTING,
  CHANGE_TOKEN,
  ADD_ORDER,
  GET_REVIEW,
  GET_BRANDS,
  GET_PRODUCTS,
  GET_CATEGORIES,
  USER_LANGUAGE,
  DRIVER_TRACKING,
  GET_STORES,
  UPDATE_TERMS_AND_CONDITIONS_STATUS,
  ADD_ORDER_REVIEW,
  CHECK_ORDER_DELIVERY,
} from '../utils/EDConstants';
import {Platform} from 'react-native';
import {strings} from '../locales/i18n';
import {showDialogue} from './EDAlert';
import {clearLogin} from './AsyncStorageHelper';
import {StackActions, NavigationActions} from 'react-navigation';

import aes from 'crypto-js/aes';
import encHex from 'crypto-js/enc-hex';
import padZeroPadding from 'crypto-js/pad-zeropadding';

import base64 from 'base-64';

let key = encHex.parse('8f22549d6b7a809004f75a449208e91d');
let iv = encHex.parse('fbd60ee50fc76aacb291a2b5c80f347b');

const isEncryptionActive = true;
const RequestType = {
  post: 'POST',
  get: 'GET',
  patch: 'PATCH',
  put: 'PUT',
};

/**
 *
 * @param {Props of the screen from which the API is getting called} propsReceived
 * @param {Optional request url argument in case of any exception needed in future} requestString
 */
function getRequestHeader(propsReceived) {
  var objHeader = propsReceived
    ? {[RequestKeys.contentType]: RequestKeys.json}
    : {[RequestKeys.contentType]: RequestKeys.json};
  return objHeader;
}

/**
 *
 * @param {The input parameters for get stores request call} getStoresParams
 * @param {Callback function for handling success response} onSuccess
 * @param {Callback function for handling failure response} onFailure
 * @param {Props of the screen from which the API is getting called} propsFromContainer
 */
export function getStores(
  getStoresParams,
  onSuccess,
  onFailure,
  propsFromContainer,
) {
  callAPI(
    GET_STORES,
    getStoresParams,
    onSuccess,
    onFailure,
    RequestType.post,
    getRequestHeader(propsFromContainer),
    propsFromContainer,
  );
}

/**
 *
 * @param {The input parameters for login request call} loginParams
 * @param {Callback function for handling success response} onSuccess
 * @param {Callback function for handling failure response} onFailure
 * @param {Props of the screen from which the API is getting called} propsFromContainer
 */
export function loginUser(
  loginParams,
  onSuccess,
  onFailure,
  propsFromContainer,
) {
  callAPI(
    LOGIN_URL,
    loginParams,
    onSuccess,
    onFailure,
    RequestType.post,
    getRequestHeader(propsFromContainer),
    propsFromContainer,
  );
}

/**
 *
 * @param {The input parameters for sign up request call} signUpParams
 * @param {Callback function for handling success response} onSuccess
 * @param {Callback function for handling failure response} onFailure
 * @param {Props of the screen from which the API is getting called} propsFromContainer
 */
export function signUpUser(
  signUpParams,
  onSuccess,
  onFailure,
  propsFromContainer,
) {
  callAPIForFileUpload(
    REGISTRATION_URL,
    signUpParams,
    onSuccess,
    onFailure,
    RequestType.post,
    propsFromContainer,
  );
}

/**
 *
 * @param {The input parameters for forgot password request call} forgotPasswordParams
 * @param {Callback function for handling success response} onSuccess
 * @param {Callback function for handling failure response} onFailure
 * @param {Props of the screen from which the API is getting called} propsFromContainer
 */
export function forgotPassword(
  forgotPasswordParams,
  onSuccess,
  onFailure,
  propsFromContainer,
) {
  callAPI(
    FORGOT_PASSWORD,
    forgotPasswordParams,
    onSuccess,
    onFailure,
    RequestType.post,
    getRequestHeader(propsFromContainer),
    propsFromContainer,
  );
}

/**
 *
 * @param {The input parameters for logout request call} logoutParams
 * @param {Callback function for handling success response} onSuccess
 * @param {Callback function for handling failure response} onFailure
 * @param {Props of the screen from which the API is getting called} propsFromContainer
 */
export function logoutUser(
  logoutParams,
  onSuccess,
  onFailure,
  propsFromContainer,
) {
  debugLog('LOGOUT PARAMS ::: ' + JSON.stringify(logoutParams));
  callAPI(
    LOGOUT_URL,
    logoutParams,
    onSuccess,
    onFailure,
    RequestType.post,
    getRequestHeader(propsFromContainer),
    propsFromContainer,
  );
}

/**
 *
 * @param {The input parameters for change password request} changePassword
 * @param {Callback function for handling success response} onSuccess
 * @param {Callback function for handling failure response} onFailure
 * @param {Props of the screen from which the API is getting called} propsFromContainer
 */
export function changePassword(
  changePasswordParams,
  onSuccess,
  onFailure,
  propsFromContainer,
) {
  callAPI(
    RESET_PASSWORD_REQ_URL,
    changePasswordParams,
    onSuccess,
    onFailure,
    RequestType.post,
    getRequestHeader(propsFromContainer),
    propsFromContainer,
  );
}

/**
 *
 * @param {The input parameters for change password request} changePassword
 * @param {Callback function for handling success response} onSuccess
 * @param {Callback function for handling failure response} onFailure
 * @param {Props of the screen from which the API is getting called} propsFromContainer
 */
export function editProfile(
  editProfileParams,
  onSuccess,
  onFailure,
  propsFromContainer,
) {
  // callAPIForFileUpload(UPDATE_PROFILE_DRIVER, editProfileParams, onSuccess, onFailure, RequestType.post, { "Accept": "application/json", "Content-Type": "multipart/form-data" }, propsFromContainer);
  callAPIForFileUpload(
    UPDATE_PROFILE,
    editProfileParams,
    onSuccess,
    onFailure,
    RequestType.post,
    propsFromContainer,
  );
}

/**
 *
 * @param {The input parameters for get CMS page details request call} cmsPageParams
 * @param {Callback function for handling success response} onSuccess
 * @param {Callback function for handling failure response} onFailure
 * @param {Props of the screen from which the API is getting called} propsFromContainer
 */
export function getCMSPageDetails(
  cmsPageParams,
  onSuccess,
  onFailure,
  propsFromContainer,
) {
  callAPI(
    CMS_PAGE,
    cmsPageParams,
    onSuccess,
    onFailure,
    RequestType.post,
    getRequestHeader(propsFromContainer),
    propsFromContainer,
  );
}

/**
 *
 * @param {The input parameters for get notifications page details request call} notificationParams
 * @param {Callback function for handling success response} onSuccess
 * @param {Callback function for handling failure response} onFailure
 * @param {Props of the screen from which the API is getting called} propsFromContainer
 */
export function getNotifications(
  notificationParams,
  onSuccess,
  onFailure,
  propsFromContainer,
) {
  callAPI(
    GET_NOTIFICATION,
    notificationParams,
    onSuccess,
    onFailure,
    RequestType.post,
    getRequestHeader(propsFromContainer),
    propsFromContainer,
  );
}

/**
 *
 * @param {The input parameters for get brands page details request call} brandsParams
 * @param {Callback function for handling success response} onSuccess
 * @param {Callback function for handling failure response} onFailure
 * @param {Props of the screen from which the API is getting called} propsFromContainer
 */
export function getBrands(
  brandsParams,
  onSuccess,
  onFailure,
  propsFromContainer,
) {
  callAPI(
    GET_BRANDS,
    brandsParams,
    onSuccess,
    onFailure,
    RequestType.post,
    getRequestHeader(propsFromContainer),
    propsFromContainer,
  );
}

/**
 *
 * @param {The input parameters for get categories page details request call} categoriesParams
 * @param {Callback function for handling success response} onSuccess
 * @param {Callback function for handling failure response} onFailure
 * @param {Props of the screen from which the API is getting called} propsFromContainer
 */
export function getCategories(
  categoriesParams,
  onSuccess,
  onFailure,
  propsFromContainer,
) {
  callAPI(
    GET_CATEGORIES,
    categoriesParams,
    onSuccess,
    onFailure,
    RequestType.post,
    getRequestHeader(propsFromContainer),
    propsFromContainer,
  );
}

/**
 *
 * @param {The input parameters for get list of products request call} productsListParams
 * @param {Callback function for handling success response} onSuccess
 * @param {Callback function for handling failure response} onFailure
 * @param {Props of the screen from which the API is getting called} propsFromContainer
 */
export function getProducts(
  productsListParams,
  onSuccess,
  onFailure,
  propsFromContainer,
) {
  callAPI(
    GET_PRODUCTS,
    productsListParams,
    onSuccess,
    onFailure,
    RequestType.post,
    getRequestHeader(propsFromContainer),
    propsFromContainer,
  );
}

/**
 *
 * @param {The input parameters for get orders list request call} ordersListParams
 * @param {Callback function for handling success response} onSuccess
 * @param {Callback function for handling failure response} onFailure
 * @param {Props of the screen from which the API is getting called} propsFromContainer
 */
export function getOrders(
  ordersListParams,
  onSuccess,
  onFailure,
  propsFromContainer,
) {
  callAPI(
    ORDER_LISTING,
    ordersListParams,
    onSuccess,
    onFailure,
    RequestType.post,
    getRequestHeader(propsFromContainer),
    propsFromContainer,
  );
}

/**
 *
 * @param {The input parameters for get CMS page details request call} notificationParams
 * @param {Callback function for handling success response} onSuccess
 * @param {Callback function for handling failure response} onFailure
 * @param {Props of the screen from which the API is getting called} propsFromContainer
 */
export function getFilterValues(
  filterValuesParams,
  onSuccess,
  onFailure,
  propsFromContainer,
) {
  callAPI(
    GET_FILTER_VALUES,
    filterValuesParams,
    onSuccess,
    onFailure,
    RequestType.post,
    getRequestHeader(propsFromContainer),
    propsFromContainer,
  );
}

/**
 *
 * @param {The input parameters for get home page details request call} homeParams
 * @param {Callback function for handling success response} onSuccess
 * @param {Callback function for handling failure response} onFailure
 * @param {Props of the screen from which the API is getting called} propsFromContainer
 */
export function fetchHomeScreenDetails(
  homeParams,
  onSuccess,
  onFailure,
  propsFromContainer,
) {
  callAPI(
    GET_HOME_DATA,
    homeParams,
    onSuccess,
    onFailure,
    RequestType.post,
    getRequestHeader(propsFromContainer),
    propsFromContainer,
  );
}

/**
 *
 * @param {The input parameters for add review request call} addReviewParams
 * @param {Callback function for handling success response} onSuccess
 * @param {Callback function for handling failure response} onFailure
 * @param {Props of the screen from which the API is getting called} propsFromContainer
 */
export function reviewAdd(
  reviewParams,
  onSuccess,
  onFailure,
  propsFromContainer,
) {
  callAPI(
    ADD_REVIEW,
    reviewParams,
    onSuccess,
    onFailure,
    RequestType.post,
    getRequestHeader(propsFromContainer),
    propsFromContainer,
  );
}

/**
 *
 * @param {The input parameters for add review request call} addReviewParams
 * @param {Callback function for handling success response} onSuccess
 * @param {Callback function for handling failure response} onFailure
 * @param {Props of the screen from which the API is getting called} propsFromContainer
 */
export function fetchReview(
  reviewParams,
  onSuccess,
  onFailure,
  propsFromContainer,
) {
  callAPI(
    GET_REVIEW,
    reviewParams,
    onSuccess,
    onFailure,
    RequestType.post,
    getRequestHeader(propsFromContainer),
    propsFromContainer,
  );
}

/**
 *
 * @param {The input parameters for get address list request call} addressListParams
 * @param {Callback function for handling success response} onSuccess
 * @param {Callback function for handling failure response} onFailure
 * @param {Props of the screen from which the API is getting called} propsFromContainer
 */
export function getAddressList(
  addressParams,
  onSuccess,
  onFailure,
  propsFromContainer,
) {
  callAPI(
    GET_ADDRESS,
    addressParams,
    onSuccess,
    onFailure,
    RequestType.post,
    getRequestHeader(propsFromContainer),
    propsFromContainer,
  );
}

/**
 *
 * @param {The input parameters for check order delivery request call} checkOrderDeliveryParams
 * @param {Callback function for handling success response} onSuccess
 * @param {Callback function for handling failure response} onFailure
 * @param {Props of the screen from which the API is getting called} propsFromContainer
 */
export function checkOrderDelivered(
  orderDeliverdParams,
  onSuccess,
  onFailure,
  propsFromContainer,
) {
  callAPI(
    CHECK_DRIVER_AVAILABILITY_URL,
    orderDeliverdParams,
    onSuccess,
    onFailure,
    RequestType.post,
    getRequestHeader(propsFromContainer),
    propsFromContainer,
  );
}

/**
 *
 * @param {The input parameters for check order delivery request call} checkOrderDeliveryParams
 * @param {Callback function for handling success response} onSuccess
 * @param {Callback function for handling failure response} onFailure
 * @param {Props of the screen from which the API is getting called} propsFromContainer
 */
export function checkOrderDelivery(
  orderDeliverdParams,
  onSuccess,
  onFailure,
  propsFromContainer,
) {
  callAPI(
    CHECK_ORDER_DELIVERY,
    orderDeliverdParams,
    onSuccess,
    onFailure,
    RequestType.post,
    getRequestHeader(propsFromContainer),
    propsFromContainer,
  );
}

/**
 *
 * @param {The input parameters for add To Cart request call} addToCartParams
 * @param {Callback function for handling success response} onSuccess
 * @param {Callback function for handling failure response} onFailure
 * @param {Props of the screen from which the API is getting called} propsFromContainer
 */
export function addToCart(
  addcartParams,
  onSuccess,
  onFailure,
  propsFromContainer,
) {
  callAPI(
    ADD_TO_CART,
    addcartParams,
    onSuccess,
    onFailure,
    RequestType.post,
    getRequestHeader(propsFromContainer),
    propsFromContainer,
  );
}

/**
 *
 * @param {The input parameters for add orders request call} addOrdersParams
 * @param {Callback function for handling success response} onSuccess
 * @param {Callback function for handling failure response} onFailure
 * @param {Props of the screen from which the API is getting called} propsFromContainer
 */
export function addOrder(
  addOrderParams,
  onSuccess,
  onFailure,
  propsFromContainer,
) {
  callAPIForFileUpload(
    ADD_ORDER,
    addOrderParams,
    onSuccess,
    onFailure,
    RequestType.post,
    propsFromContainer,
  );
}

/**
 *
 * @param {The input parameters for add address request call} addAddressParams
 * @param {Callback function for handling success response} onSuccess
 * @param {Callback function for handling failure response} onFailure
 * @param {Props of the screen from which the API is getting called} propsFromContainer
 */
export function addAddress(
  addAddressParams,
  onSuccess,
  onFailure,
  propsFromContainer,
) {
  callAPI(
    ADD_ADDRESS,
    addAddressParams,
    onSuccess,
    onFailure,
    RequestType.post,
    getRequestHeader(propsFromContainer),
    propsFromContainer,
  );
}

/**
 *
 * @param {The input parameters for delete address request call} deleteAddressParams
 * @param {Callback function for handling success response} onSuccess
 * @param {Callback function for handling failure response} onFailure
 * @param {Props of the screen from which the API is getting called} propsFromContainer
 */
export function deleteAddress(
  deleteAddressParams,
  onSuccess,
  onFailure,
  propsFromContainer,
) {
  callAPI(
    DELETE_ADDRESS,
    deleteAddressParams,
    onSuccess,
    onFailure,
    RequestType.post,
    getRequestHeader(propsFromContainer),
    propsFromContainer,
  );
}

/**
 *
 * @param {The input parameters for get promoCode request call} getPromoCodeParams
 * @param {Callback function for handling success response} onSuccess
 * @param {Callback function for handling failure response} onFailure
 * @param {Props of the screen from which the API is getting called} propsFromContainer
 */
export function getPromocode(
  promoCodeParams,
  onSuccess,
  onFailure,
  propsFromContainer,
) {
  callAPI(
    PROMO_CODE_LIST,
    promoCodeParams,
    onSuccess,
    onFailure,
    RequestType.post,
    getRequestHeader(propsFromContainer),
    propsFromContainer,
  );
}
/**
 *
 * @param {The input parameters for change token request call} changeTokenParams
 * @param {Callback function for handling success response} onSuccess
 * @param {Callback function for handling failure response} onFailure
 * @param {Props of the screen from which the API is getting called} propsFromContainer
 */
export function changeToken(
  changeTokenParams,
  onSuccess,
  onFailure,
  propsFromContainer,
) {
  callAPI(
    CHANGE_TOKEN,
    changeTokenParams,
    onSuccess,
    onFailure,
    RequestType.post,
    getRequestHeader(propsFromContainer),
    propsFromContainer,
  );
}

/**
 *
 * @param {The input parameters for change user language request call} userLanguageParams
 * @param {Callback function for handling success response} onSuccess
 * @param {Callback function for handling failure response} onFailure
 * @param {Props of the screen from which the API is getting called} propsFromContainer
 */
export function userLanguage(
  userLanguageParams,
  onSuccess,
  onFailure,
  propsFromContainer,
) {
  callAPI(
    USER_LANGUAGE,
    userLanguageParams,
    onSuccess,
    onFailure,
    RequestType.post,
    getRequestHeader(propsFromContainer),
    propsFromContainer,
  );
}

/**
 *
 * @param {The input parameters for change user language request call} addOrderReviewParams
 * @param {Callback function for handling success response} onSuccess
 * @param {Callback function for handling failure response} onFailure
 * @param {Props of the screen from which the API is getting called} propsFromContainer
 */
export function addOrderReview(
  addOrderParams,
  onSuccess,
  onFailure,
  propsFromContainer,
) {
  callAPI(
    ADD_ORDER_REVIEW,
    addOrderParams,
    onSuccess,
    onFailure,
    RequestType.post,
    getRequestHeader(propsFromContainer),
    propsFromContainer,
  );
}

/**
 *
 * @param {The input parameters for polyLine request call} polyLineParams
 * @param {Callback function for handling success response} onSuccess
 * @param {Callback function for handling failure response} onFailure
 * @param {Props of the screen from which the API is getting called} propsFromContainer
 */
export function calculateOrderArrivalTime(
  userPolyLineParams,
  onSuccess,
  onFailure,
  propsFromContainer,
  googleMapsAPIKey,
) {
  if (googleMapsAPIKey == undefined || googleMapsAPIKey == null) {
    showDialogue('Please configure Google Maps API Key');
    onFailure({
      data: {},
      message: strings('generalNew.generalWebServiceError'),
    });
    return;
  }

  let urlToCall = `https://maps.googleapis.com/maps/api/directions/json?origin=${[
    userPolyLineParams.sourceLatitude,
    userPolyLineParams.sourceLongitude,
  ]}&destination=${[
    userPolyLineParams.destinationLatitude,
    userPolyLineParams.destinationLongitude,
  ]}&key=${googleMapsAPIKey}`;
  callAPI(
    urlToCall,
    {},
    onSuccess,
    onFailure,
    RequestType.get,
    getRequestHeader(propsFromContainer),
    propsFromContainer,
  );
}

/**
 *
 * @param {The input parameters for polyLine request call} polyLineParams
 * @param {Callback function for handling success response} onSuccess
 * @param {Callback function for handling failure response} onFailure
 * @param {Props of the screen from which the API is getting called} propsFromContainer
 */
export function getLatestLocationOfDriver(
  userPolyLineParams,
  onSuccess,
  onFailure,
  propsFromContainer,
) {
  callAPI(
    DRIVER_TRACKING,
    userPolyLineParams,
    onSuccess,
    onFailure,
    RequestType.post,
    getRequestHeader(propsFromContainer),
    propsFromContainer,
  );
}

/**
 *
 * @param {The input parameters for T&C request call} termsAndConditionsParams
 * @param {Callback function for handling success response} onSuccess
 * @param {Callback function for handling failure response} onFailure
 * @param {Props of the screen from which the API is getting called} propsFromContainer
 */
export function updateTermsAndConditionsStatus(
  termsAndConditionsParams,
  onSuccess,
  onFailure,
  propsFromContainer,
) {
  debugLog(
    'termsAndConditionsParams :: ' + JSON.stringify(termsAndConditionsParams),
  );
  callAPI(
    UPDATE_TERMS_AND_CONDITIONS_STATUS,
    termsAndConditionsParams,
    onSuccess,
    onFailure,
    RequestType.post,
    getRequestHeader(propsFromContainer),
    propsFromContainer,
  );
}

/**
 * Genric function to make api calls with method post
 * @param {apiPost} url  API end point to call
 * @param {apiPost} responseSuccess  Call-back function to get success response from api call
 * @param {apiPost} responseErr  Call-back function to get error response from api call
 * @param {apiPost} requestHeader  Request header to be send to api
 * @param {apiPost} body data to be send through api
 */
async function callAPI(
  url,
  body,
  responseSuccess,
  responseErr,
  methodType = RequestType.post,
  requestHeader = {'Content-Type': 'application/json'},
  propsFromContainer,
) {
  let encryptedData = aes
    .encrypt(JSON.stringify(body), key, {
      iv: iv,
      padding: padZeroPadding,
    })
    .toString();

  var finalParams = {
    encryptedData: encryptedData,
    isEncryptionActive: true,
  };

  var params =
    methodType === RequestType.post
      ? {
          method: methodType,
          headers: requestHeader,
          body: isEncryptionActive
            ? propsFromContainer !== undefined &&
              propsFromContainer.body_stringify == false
              ? body
              : propsFromContainer !== undefined &&
                propsFromContainer.forOrder == true
              ? JSON.stringify(body)
              : JSON.stringify(finalParams)
            : JSON.stringify(body),
        }
      : {
          method: methodType,
          headers: requestHeader,
        };
  debugLog('PROPRS :::::::::::::::: ', propsFromContainer);
  debugLog('===== URL =====', url);
  debugLog('===== Body =====', JSON.stringify(params));
  debugLog('===== NON ENCRYPTED Body =====', body);

  fetch(url, params)
    .then(errorHandler)
    .then((response) => {
      debugLog('::: RESPONSE HERE :::', response);
      // debugLog('::: RESPONSE JSON :::', response.json())
      return response.json();
    })
    .then((encrypted_json) => {
      debugLog('Encrypted response :::::', encrypted_json);

      let json = undefined;
      if (encrypted_json.isEncryptionActive == true)
        json = JSON.parse(base64.decode(encrypted_json.encryptedResponse));
      else json = encrypted_json;

      debugLog('json', json);
      if (json.status === 1) {
        responseSuccess({data: json || {}, message: json.message || ''});
      } else if (json.status === 'OK') {
        responseSuccess({data: json || {}, message: json.message || ''});
      } else if (json.status === 2) {
        responseErr({
          data: json || {},
          message: json.message || strings('generalNew.generalWebServiceError'),
        });
      } else if (json.status === 'CREATED' || json.status === 'COMPLETED') {
        responseSuccess(json);
      } else if (json.status === 1000 || json.status === -1) {
        if (!url.match(/login/)) {
          showDialogue(
            json.message !== undefined && json.message.trim().length > 0
              ? json.message
              : strings('generalNew.generalWebServiceError'),
            '',
            [],
            () => {
              clearLogin(
                (_response) => {
                  // TAKE THE USER TO INITIAL SCREEN
                  if (
                    propsFromContainer !== undefined &&
                    propsFromContainer.navigation !== undefined
                  ) {
                    propsFromContainer.navigation.dispatch(
                      StackActions.reset({
                        index: 0,
                        actions: [
                          NavigationActions.navigate({routeName: 'splash'}),
                        ],
                      }),
                    );
                  }
                },
                (_error) => {},
              );
            },
          );
        } else {
          responseErr({
            data: json || {},
            message:
              json.message || strings('generalNew.generalWebServiceError'),
          });
        }
      } else {
        responseErr({
          data: json || {},
          message: json.message || strings('generalNew.generalWebServiceError'),
        });
      }
    })
    .catch((err) => {
      debugLog('ERROR HERE :: ', err);
      // if (err instanceof SyntaxError) {
      return responseErr({
        name: err.name,
        message: strings('generalNew.generalWebServiceError'),
      });
      // } else {
      //   return responseErr(err)
      // }
    });
}

var printError = function (error, explicit) {
  debugLog(
    `[${explicit ? 'EXPLICIT' : 'INEXPLICIT'}] ${error.name}: ${error.message}`,
  );
};

/**
 * Genric function to make api calls with method post
 * @param {apiPost} url  API end point to call
 * @param {apiPost} body  Parameters for form-data request
 * @param {apiPost} responseSuccess  Call-back function to get success response from api call
 * @param {apiPost} responseErr  Call-back function to get error response from api call
 * @param {apiPost} requestHeader  Request header to be send to api
 */
async function callAPIForFileUpload(
  url,
  body,
  responseSuccess,
  responseErr,
  methodType = RequestType.post,
  propsFromContainer,
) {
  const formdata = new FormData();

  if (isEncryptionActive)
    Object.keys(body || {}).map((keyToCheck) => {
      if (keyToCheck !== 'image') {
        if (keyToCheck === 'items') {
          let items = body[keyToCheck];
          delete body[keyToCheck];
          body[keyToCheck] = JSON.stringify(items);
        }
      }
    });
  else
    Object.keys(body || {}).map((keyToCheck) => {
      if (keyToCheck !== 'image') {
        if (keyToCheck === 'items') {
          formdata.append(keyToCheck, JSON.stringify(body[keyToCheck]));
        } else {
          formdata.append(keyToCheck, body[keyToCheck]);
        }
      }
    });

  debugLog(' ::: formdata :::: ' + JSON.stringify(formdata));

  if (
    body.image !== undefined &&
    body.image.uri !== undefined &&
    body.image.uri !== null
  ) {
    const imageDetails = body.image;
    const uriParts = imageDetails.fileName
      ? imageDetails.fileName.split('.')
      : imageDetails.uri.split('.');
    const strURIToUse =
      Platform.OS === 'ios'
        ? imageDetails.uri.replace('file:/', '')
        : imageDetails.uri;
    // const strURIToUse = Platform.OS === 'ios' ? imageDetails.uri : imageDetails.uri

    const finalImageDetails = {
      uri: strURIToUse,
      name:
        imageDetails.fileName ||
        Math.round(new Date().getTime() / 1000) +
          '.' +
          uriParts[uriParts.length - 1],
      type: `image/${uriParts[uriParts.length - 1]}`,
    };

    var strImageKeyName = url.includes(ADD_ORDER)
      ? 'prescription_image'
      : url.includes(REGISTRATION_URL)
      ? 'Image'
      : 'image';
    formdata.append(strImageKeyName, finalImageDetails);
    if (isEncryptionActive) delete body['image'];
    debugLog(' ::: IMAGE URI 12345 :::: ' + JSON.stringify(finalImageDetails));
  }

  let encryptedData = aes
    .encrypt(JSON.stringify(body), key, {
      iv: iv,
      padding: padZeroPadding,
    })
    .toString();

  if (isEncryptionActive) {
    formdata.append('encryptedData', encryptedData);
    formdata.append('isEncryptionActive', true);
  }
  console.log('formdata => ', formdata);
  const finalParams = {
    method: methodType,
    body: formdata,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
  };
  debugLog(' ::: url :::: ' + url);
  debugLog('NO ENCRYPTED BODY :::::', body);
  debugLog(' ::: finalParams :::: ' + JSON.stringify(finalParams));

  fetch(url, finalParams)
    .then(errorHandler)
    .then((response) => response.json())
    .then((encrypted_json) => {
      debugLog('Encrypted response :::::', encrypted_json);

      let json = undefined;
      if (encrypted_json.isEncryptionActive == true)
        json = JSON.parse(base64.decode(encrypted_json.encryptedResponse));
      else json = encrypted_json;

      // console.log('][][][][][][]', JSON.parse(base64.decode(encrypted_json.encryptedResponse)))

      debugLog('json123', json);
      if (json.status === 1) {
        responseSuccess({data: json || {}, message: json.message || ''});
      } else if (json.status === 1000) {
        showDialogue(json.message, '', [], () => {
          clearLogin(
            (_response) => {
              // TAKE THE USER TO INITIAL SCREEN
              propsFromContainer.navigation.dispatch(
                StackActions.reset({
                  index: 0,
                  actions: [NavigationActions.navigate({routeName: 'splash'})],
                }),
              );
            },
            (_error) => {},
          );
        });
      } else {
        responseErr({
          data: json || {},
          message: json.message || strings('generalNew.generalWebServiceError'),
        });
      }
    })
    .catch((err) => {
      debugLog('ERROR HERE true:: ', printError(err, true));
      debugLog('ERROR HERE false:: ', printError(err, false));
      if (err == undefined) {
      } else if (err instanceof SyntaxError) {
        return responseErr({
          name: err.name,
          message: strings('generalNew.generalWebServiceError'),
        });
      } else {
        return responseErr(err);
      }
    });
}

/**
 *
 * @param {errorHandler} response Generic function to handle error occur in api
 */
const errorHandler = (response) => {
  if (
    (response.status >= 200 && response.status < 300) ||
    response.status === 401 ||
    response.status === 400
  ) {
    // if ((response.status >= 200 && response.status < 300)) {
    // debugLog("RESPONSE ERROR HEADERS ==>>", response.headers)
    // debugLog("RESPONSE ERROR HEADERS Authorization ==>>", response.headers.get('Authorization'))

    if (response.status === 204) {
      response.body = {success: 'Saved'};
    }
    return Promise.resolve(response);
  } else {
    var errorMessage =
      response.error != undefined && response.error.message != undefined
        ? response.error.message
        : strings('generalNew.generalWebServiceError');
    var error = new Error(errorMessage);
    error.response = response;
    debugLog('error else', response.json());
    return Promise.reject(error);
  }
};
