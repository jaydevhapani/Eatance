// import { NetInfo } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { debugLog } from "./EDConstants";

export const netStatus = (callback) => {
  NetInfo.fetch().then(state => {
    callback(state.isConnected);
  })
  // NetInfo.isConnected.fetch().then(isConnected => {
  //   callback(isConnected);
  // });


};
export const netStatusEvent = callback => {
  const unsubscribe = NetInfo.addEventListener(status => {
    debugLog("NETSTATUS ::::::::: ", status)
    if (status.isConnected) {
      callback(status);
    } else {
      unsubscribe;
    }
  });
};

export const removeNetStatusEvents = callback => {

  NetInfo.removeEventListener('removeEventListener', status => {
    debugLog("NETSTATUS CLOSE ::::::::: ", status)
    callback(status)
  })
}
