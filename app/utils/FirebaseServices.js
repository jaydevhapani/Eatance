/* eslint-disable prettier/prettier */
import firebase from "react-native-firebase";
// import messaging from "@react-native-firebase/messaging"
import { debugLog } from "./EDConstants";

export const checkFirebasePermission = async (onSuccessTokenRequest, onFailureTokenRequest) => {
    requestPermission(
        onSuccess => {
            getToken(onSuccessTokenRequest, onFailureTokenRequest)
        },
        onFailure => {
            debugLog("GET ERROR FCM TOKEN ::::::::: ", onFailure)
            onFailureTokenRequest(onFailure)
        }
    );
    // const authorizationStatus = await firebase.messaging().requestPermission();

    // if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED || authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL) {
    //     console.log('User has notification permissions enabled.');
    //     getToken(onSuccessTokenRequest, onFailureTokenRequest)
    // } else {
    //     console.log('User has notification permissions disabled');
    //     requestPermission(
    //         onSuccess => {
    //             onSuccessTokenRequest(onSuccess)
    //         },
    //         onFailure => {
    //             debugLog("GET ERROR FCM TOKEN ::::::::: ", onFailure)
    //             onFailureTokenRequest(onFailure)
    //         }
    //     );
    // }
}

const getToken = async (onSuccess, onFailure) => {
    var fcmToken = await firebase.messaging().getToken();

    if (fcmToken !== "") {
        onSuccess(fcmToken)
    } else {
        onFailure(fcmToken)
    }
}

const requestPermission = async (onSuccessRequest, onFailureRequest) => {
    try {
        await firebase.messaging().requestPermission();
        // User has authorised
        debugLog('User has notification permissions enabled.');
        getToken(onSuccessRequest, onFailureRequest)
    } catch (error) {
        // User has rejected permissions
        onFailureRequest(error)
    }
    // try {
    //     const authorizationStatus = await firebase.messaging().requestPermission({
    //         sound: true,
    //         badge: true,
    //         announcement: true,
    //         alert: true
    //     });

    //     if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED || authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL) {
    //         console.log('Permission status:', authorizationStatus);
    //         getToken(
    //             onSuccess => {
    //                 debugLog("GET FCM TOKEN :::::::::: ", onSuccess)
    //                 onSuccessRequest(onSuccess)
    //             },
    //             onFailure => {
    //                 onFailureRequest(onFailure)
    //             }
    //         );
    //     }

    // } catch (error) {
    //     onFailureRequest(error)
    // }
}

// import firebase from "@react-native-firebase/app";
// import messaging from "@react-native-firebase/messaging"
// import { debugLog } from "./EDConstants";

// export const checkFirebasePermission = async (onSuccessTokenRequest, onFailureTokenRequest) => {
//     const authorizationStatus = await firebase.messaging().requestPermission();

//     if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED || authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL) {
//         console.log('User has notification permissions enabled.');
//         getToken(onSuccessTokenRequest, onFailureTokenRequest)
//         // getToken(
//         //     onSuccess => {
//         //         debugLog("GET FCM TOKEN :::::::::: ", onSuccess)
//         //         onSuccessTokenRequest(onSuccess)
//         //     },
//         //     onFailure => {
//         //         onFailureTokenRequest(onFailure)
//         //     }
//         // );
//     } else {
//         console.log('User has notification permissions disabled');
//         requestPermission(
//             onSuccess => {
//                 onSuccessTokenRequest(onSuccess)
//             },
//             onFailure => {
//                 debugLog("GET ERROR FCM TOKEN ::::::::: ", onFailure)
//                 onFailureTokenRequest(onFailure)
//             }
//         );
//     }
// }

// const getToken = async (onSuccess, onFailure) => {
//     var fcmToken = await firebase.messaging().getToken();

//     if (fcmToken !== "") {
//         onSuccess(fcmToken)
//     } else {
//         onFailure(fcmToken)
//     }
// }

// const requestPermission = async (onSuccessRequest, onFailureRequest) => {
//     try {
//         const authorizationStatus = await firebase.messaging().requestPermission({
//             sound: true,
//             badge: true,
//             announcement: true,
//             alert: true
//         });

//         if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED || authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL) {
//             console.log('Permission status:', authorizationStatus);
//             getToken(
//                 onSuccess => {
//                     debugLog("GET FCM TOKEN :::::::::: ", onSuccess)
//                     onSuccessRequest(onSuccess)
//                 },
//                 onFailure => {
//                     onFailureRequest(onFailure)
//                 }
//             );
//         }

//     } catch (error) {
//         onFailureRequest(error)
//     }
// }
