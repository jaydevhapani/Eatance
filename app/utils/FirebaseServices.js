/* eslint-disable prettier/prettier */
import messaging from '@react-native-firebase/messaging';
// import firebase from '@react-native-firebase/app';
import {debugLog} from './EDConstants';

export const checkFirebasePermission = async (
  onSuccessTokenRequest,
  onFailureTokenRequest,
) => {
  requestPermission(
    (onSuccess) => {
      getToken(onSuccessTokenRequest, onFailureTokenRequest);
    },
    (onFailure) => {
      debugLog('GET ERROR FCM TOKEN ::::::::: ', onFailure);
      onFailureTokenRequest(onFailure);
    },
  );
};

const getToken = async (onSuccess, onFailure) => {
  var fcmToken = await messaging().getToken();
  console.log('fcmToken :::::: ', fcmToken);
  if (fcmToken !== '') {
    onSuccess(fcmToken);
  } else {
    onFailure(fcmToken);
  }
};

const requestPermission = async (onSuccessRequest, onFailureRequest) => {
  try {
    await messaging().requestPermission();
    // User has authorised
    debugLog('User has notification permissions enabled.');
    getToken(onSuccessRequest, onFailureRequest);
  } catch (error) {
    // User has rejected permissions
    onFailureRequest(error);
  }
};
