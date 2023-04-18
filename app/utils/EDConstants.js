/* eslint-disable comma-dangle */
/* eslint-disable prettier/prettier */
import Moment from 'moment';
import I18n from 'react-native-i18n';
import {strings} from '../locales/i18n';
import currencyFormatter from 'currency-formatter';

// API URL CONSTANTS
export const BASE_URL = 'https://epicwinesandspirits.africa/v2/Api/';

export const REGISTRATION_URL = BASE_URL + 'user_registration';
export const GET_STORES = BASE_URL + 'store_list';
export const LOGIN_URL = BASE_URL + 'user_login';
export const LOGOUT_URL = BASE_URL + 'logout';
export const CHECK_DRIVER_AVAILABILITY_URL =
  BASE_URL + 'check_driver_availability';
export const ADD_TO_CART = BASE_URL + 'add_to_cart';
export const GET_NOTIFICATION = BASE_URL + 'notification_list';
export const GET_BRANDS = BASE_URL + 'brands_with_pagination_list';
export const GET_CATEGORIES = BASE_URL + 'categories_with_pagination_list';
export const GET_PRODUCTS = BASE_URL + 'products_list';
export const GET_FILTER_VALUES = BASE_URL + 'filter_values';
export const ADD_REVIEW = BASE_URL + 'add_review';
export const GET_REVIEW = BASE_URL + 'reviews_with_pagination_list';
export const ADD_ORDER = BASE_URL + 'add_order';
export const CMS_PAGE = BASE_URL + 'cms_pages';
export const PROMO_CODE_LIST = BASE_URL + 'coupon_list';
export const GET_HOME_DATA = BASE_URL + 'home_page_details';
export const ADD_ADDRESS = BASE_URL + 'add_address';
export const GET_ADDRESS = BASE_URL + 'user_address';
export const DELETE_ADDRESS = BASE_URL + 'delete_address';
export const UPDATE_PROFILE = BASE_URL + 'user_edit_profile';
export const RESET_PASSWORD_REQ_URL = BASE_URL + 'user_change_password';
export const ORDER_LISTING = BASE_URL + 'order_detail';
export const FORGOT_PASSWORD = BASE_URL + 'user_forgot_password';
export const CHANGE_TOKEN = BASE_URL + 'change_token';
export const USER_LANGUAGE = BASE_URL + 'user_language';
export const DRIVER_TRACKING = BASE_URL + 'driver_tracking';
export const UPDATE_TERMS_AND_CONDITIONS_STATUS = BASE_URL + 'user_tnc_status';
export const ADD_ORDER_REVIEW = BASE_URL + 'add_OrderReview';
export const CHECK_ORDER_DELIVERY = BASE_URL + 'check_order_delivered';
export const WHATSP_NUMBER_API = BASE_URL + 'getWhatsappNumber';
export const GET_PAYMENT_POINT = BASE_URL + 'getOrderStatus';

export const INR_SIGN = '$';

// ALERT CONSTANTS
export const APP_NAME = 'Eatance Liquor';
export const DEFAULT_ALERT_TITLE = APP_NAME;
export const AlertButtons = {
  ok: strings('buttonTitles.okay'),
  cancel: strings('buttonTitles.cancel'),
  notNow: 'Not now',
  yes: strings('buttonTitles.yes'),
  no: strings('buttonTitles.no'),
};

// REQUESTS CONSTANTS
export const RequestKeys = {
  contentType: 'Content-Type',
  json: 'application/json',
  authorization: 'Authorization',
  bearer: 'Bearer',
};

// LANGUAGE CONSTANTS
export const arrayLanguages = [
  {code: 'en', title: 'English', key: 'en'},
  // { code: 'ar', title: 'عربى', key: 'ar' },
  {code: 'fr', title: 'Français', key: 'fr'},
];

// STORAGE CONSTANTS
export const StorageKeys = {
  user_details: 'UserDetails',
};

// REDUX CONSTANTS
export const ACCESS_TOKEN = 'ACCESS_TOKEN';
export const RESPONSE_FAIL = 0;
export const RESPONSE_SUCCESS = 1;
export const COUPON_ERROR = 2;
export const GOOGLE_API_KEY = 'AIzaSyAtOyCW-Bi9xOaoLAvg7RiBmvL6FoAhU1s';
export const STORE_ERROR = 3;

// NOTIFICATION_TYPE
export const ORDER_TYPE = 'orderNotification';
export const NOTIFICATION_TYPE = 'notification';
export const DEFAULT_TYPE = 'default';

// CMS PAGE
export const ABOUT_US = 'about-us';
export const CONTACT_US = 'contact-us';
export const PRIVACY_POLICY = 'privacy-policy';

export function funGetFrench_Curr(x, y, lan) {
  // var xValue = parseInt(x) * parseInt(y)
  let decimal;
  let thousand;

  if (lan == 'fr') {
    decimal = ',';
    thousand = '.';
  } else {
    decimal = '.';
    thousand = ',';
  }
  // return xValue
  if (y === undefined) {
    var zValue = parseFloat(y);
    return currencyFormatter.format(zValue, {
      symbol: '',
      decimal: '.',
      thousand: sym,
      precision: 2,
    });
  } else {
    var xValue = parseFloat(x) * parseFloat(y);

    return currencyFormatter.format(xValue, {
      symbol: '',
      decimal: decimal,
      thousand: thousand,
      precision: 2,
    });
  }
}

export function capiString(str) {
  var splitStr = str.split(' ');
  for (var i = 0; i < splitStr.length; i++) {
    // You do not need to check if i is larger than splitStr length, as your for does that for you
    // Assign it back to the array
    splitStr[i] =
      splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  // Directly return the joined string
  return splitStr.join(' ');
}

export function debugLog() {
  for (var i = 0; i < arguments.length; i++) {
    console.log(arguments[i]);
  }
}

export function isRTLCheck() {
  return I18n.currentLocale().indexOf('ar') === 0;
}

String.prototype.replaceAll = function (search, replacement) {
  var target = this;
  return target.split(search).join(replacement);
};

export function funGetDateStr(date, formats) {
  if (formats == undefined) {
    formats = 'MMM DD, YYYY hh:mm A';
  }
  // Moment.locale(I18n.currentLocale() || 'en');

  var d = new Date('' + date.replaceAll('-', '/'));

  return Moment(d).format(formats);
}

// TEXT FIELD TYPES
export const TextFieldTypes = {
  email: 'email',
  password: 'password',
  phone: 'phone',
  datePicker: 'datePicker',
  default: 'default',
  action: 'action',
  picker: 'picker',
  amount: 'amount',
  countryPicker: 'countryPicker',
};

export const funGetDate = (date) => {
  var d = new Date(date);
  return Moment(d).format('DD-MM-YYYY');
};

import {Dimensions, Platform} from 'react-native';
const {width, height} = Dimensions.get('window');

const guidelineBaseWidth = 360;
const guidelineBaseHeight = 760;
const scale = (size) => (width / guidelineBaseWidth) * size;
const verticalScale = (size) => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

// CHANGE FONT SIZE IN ANDROID
export function getProportionalFontSize(baseFontSize) {
  var intialFontSize = baseFontSize || 14;
  // if (Platform.OS === 'ios') {
  // heightPercentageToDP(fontSizeToReturn );
  // }
  var fontSizeToReturnModerate = moderateScale(intialFontSize);
  var fontSizeToReturnVertical = verticalScale(intialFontSize);
  return Platform.OS == 'ios'
    ? fontSizeToReturnModerate
    : fontSizeToReturnVertical;
}

export function isFilterApplied(objFilter) {
  if (objFilter === null || objFilter === undefined) {
    return false;
  }

  if (objFilter.shouldShowProductsWithPrescription) {
    return true;
  }

  if (objFilter.shouldShowProductsInStock) {
    return true;
  }

  if (
    objFilter.arraySelectedBrandIDs !== undefined &&
    objFilter.arraySelectedBrandIDs instanceof Array &&
    objFilter.arraySelectedBrandIDs.length > 0
  ) {
    return true;
  }

  if (
    objFilter.arraySelectedCategoryIDs !== undefined &&
    objFilter.arraySelectedCategoryIDs instanceof Array &&
    objFilter.arraySelectedCategoryIDs.length > 0
  ) {
    return true;
  }

  return false;
}

export const ProductsListType = {
  category: 'Category',
  brands: 'Brands',
  featuredProducts: 'Featured Products',
  other: 'Other',
};
