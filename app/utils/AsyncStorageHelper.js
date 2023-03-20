/* eslint-disable semi */
/* eslint-disable prettier/prettier */
// import { AsyncStorage } from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import { debugLog } from './EDConstants';

export function flushAllData(onSuccess, onFailure) {
  AsyncStorage.clear().then(
    success => onSuccess(success),
    err => onFailure(err)
  );
}

export function saveUserLoginDetails(details, onSuccess, onFailure) {
  AsyncStorage.setItem('userDetails', JSON.stringify(details)).then(onSuccess).catch(onFailure)
  // AsyncStorage.setItem('userDetails', JSON.stringify(details)).then(
  //   success => onSuccess(success),
  //   err => onFailure(err)
  // );
}

export function getUserLoginDetails(onSuccess, onFailure) {
  AsyncStorage.getItem('userDetails')
    .then(objDetails => onSuccess(JSON.parse(objDetails)))
    .catch(onFailure)
}

export function saveUserFCM(details, onSuccess, onFailure) {
  AsyncStorage.setItem("token", JSON.stringify(details)).then(
    success => onSuccess(success),
    err => onFailure(err)
  );
}

export function getUserFCM(onSuccess, onFailure) {
  AsyncStorage.getItem("token").then(
    res => {
      if (res != "" && res != null && res != undefined) {
        onSuccess(JSON.parse(res));
      } else {
        onFailure("Token Null");
      }
    },
    err => onFailure(err)
  );
}

export function setIsTermsAndConditionsAccepted(details, onSuccess, onFailure) {
  AsyncStorage.setItem("isTermsAndConditionsAccepted", JSON.stringify(details)).then(
    success => onSuccess(success),
    err => onFailure(err)
  );
}

export function getIsTermsAndConditionsAccepted(onSuccess, onFailure) {
  AsyncStorage.getItem('isTermsAndConditionsAccepted')
    .then(res => {
      if (res != "" && res != null && res != undefined) {
        onSuccess(JSON.parse(res));
      } else {
        onFailure("isTermsAndConditionsAccepted Null");
      }
    })
    .catch(onFailure)
}

export function clearLogin(onSuccess, onError) {
  AsyncStorage.removeItem('userDetails').then(
    response => {
      onSuccess(response);
    },
    error => {
      onError(error);
    }
  );
}

export function getUserToken(onSuccess, onFailure) {
  AsyncStorage.getItem('userDetails').then(
    res => {
      if (res != "" && res != null && res != undefined) {
        onSuccess(JSON.parse(res));
      } else {
        onFailure("Token Null");
      }
    },
    err => onFailure(err)
  );
}

export function saveCartData(details, onSuccess, onFailure) {

  AsyncStorage.setItem("cartList", JSON.stringify(details)).then(
    success => {

      onSuccess(success);
    },
    error => onFailure(error)
  );
}

export function clearCartData(onSuccess, onError) {
  AsyncStorage.removeItem("cartList").then(
    response => {
      onSuccess(response);
    },
    error => {
      onError(error);
    }
  );
}

export function getCartList(onSuccess, onCartNotFound, onFailure) {
  AsyncStorage.getItem("cartList").then(
    response => {
      if (response != "" && response != null && response != undefined) {

        onSuccess(JSON.parse(response));
      } else {
        onCartNotFound(response);
      }
    },
    error => {
      onFailure(error);
    }
  );
}

export function saveLanguage(lan, onSuccess, onFailure) {
  AsyncStorage.setItem("lan", JSON.stringify(lan)).then(
    success => {
      debugLog('SUCCESS SAVE LANGUAGE :: ', success)
      onSuccess(success);
    },
    error => {
      onFailure(error);
    }
  );
}

export function getLanguage(onSuccess, onFailure) {
  AsyncStorage.getItem("lan").then(
    res => {
      onSuccess(JSON.parse(res));
    },
    error => {
      onFailure("error");
    }
  );
}


export function saveSelectedStore(store, onSuccess, onFailure) {
  AsyncStorage.setItem("store", JSON.stringify(store)).then(
    success => onSuccess(success),
    err => onFailure(err)
  );
}

export function getSelectedStore(onSuccess, onFailure) {
  AsyncStorage.getItem("store").then(
    res => {
      if (res != "" && res != null && res != undefined) {
        onSuccess(JSON.parse(res));
      } else {
        onFailure("Store not found !");
      }
    },
    err => onFailure(err)
  );
}