import { PERMISSIONS, check, RESULTS, request } from 'react-native-permissions';
import { debugLog } from './EDConstants';
import { Platform } from 'react-native';

export async function requestLocationPermission(paramPermission,onSuccess, onFailure) {

    request(paramPermission)
        .then((result) => {
            console.log("RESULT FROM REQUESTLOCATIONPERMISSION",result)
            switch (result) {
                case RESULTS.UNAVAILABLE:
                    onFailure(RESULTS.UNAVAILABLE)
                    break;
                case RESULTS.DENIED:
                    onFailure(RESULTS.DENIED)
                    break;
                case RESULTS.GRANTED:
                    onSuccess()
                    break;
                case RESULTS.BLOCKED:
                    onFailure(RESULTS.BLOCKED)
                    break;
            }
        })
}

export async function checkLocationPermission(paramPermission, onSuccess, onFailure) {

    check(paramPermission)
        .then((result) => {
            switch (result) {
                case RESULTS.UNAVAILABLE:
                    requestLocationPermission(paramPermission, onSuccess, onFailure)
                    break;
                case RESULTS.DENIED:
                    requestLocationPermission(paramPermission, onSuccess, onFailure)
                    break;
                case RESULTS.GRANTED:
                    requestLocationPermission(paramPermission, onSuccess, onFailure)
                    break;
                case RESULTS.BLOCKED:
                    requestLocationPermission(paramPermission, onSuccess, onFailure)
                    break;
            }
        })
}