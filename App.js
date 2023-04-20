/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {AppNavigator} from './app/components/RootNavigator';
import {legacy_createStore as createStore, combineReducers} from 'redux';
import {Provider} from 'react-redux';
import {userOperations} from './app/redux/reducers/UserReducer';
import {navigationOperation} from './app/redux/reducers/NavigationReducer';
import {checkoutDetailOperation} from './app/redux/reducers/CheckoutReducer';
import {showDialogue} from './app/utils/EDAlert';
import {LogBox, Platform, View} from 'react-native';
import NavigationService from './NavigationService';
import {
  NOTIFICATION_TYPE,
  DEFAULT_TYPE,
  ORDER_TYPE,
} from './app/utils/EDConstants';
import KeyboardManager from 'react-native-keyboard-manager';
import AsyncStorage from '@react-native-community/async-storage';
import {contentOperations} from './app/redux/reducers/ContentReducer';
import EDFloatingButton from './app/components/EDFloatingButton';
import {floatingButtonOperations} from './app/redux/reducers/FloatingButtonReducer';
import {filterOperations} from './app/redux/reducers/FilterReducer';
// import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import {strings} from './app/locales/i18n';
import SplashScreen from 'react-native-splash-screen';

const rootReducer = combineReducers({
  userOperations: userOperations,
  navigationReducer: navigationOperation,
  checkoutReducer: checkoutDetailOperation,
  contentOperations: contentOperations,
  floatingButtonOperations: floatingButtonOperations,
  contentOperations: contentOperations,
  filterOperations: filterOperations,
});

const pharmaGlobalStore = createStore(rootReducer);
LogBox.ignoreAllLogs();

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.isNotification = undefined;
    this.unsubscribe = undefined;
  }

  state = {
    isRefresh: false,
  };

  render() {
    console.log('NOTIFICATION :::::::: ', this.isNotification);
    return (
      <Provider store={pharmaGlobalStore}>
        {this.isNotification != undefined ? (
          <View style={{flex: 1}}>
            <AppNavigator
              ref={(navigatorRef) => {
                NavigationService.setTopLevelNavigator(navigatorRef);
              }}
              screenProps={this.isNotification}
            />
            <EDFloatingButton />
          </View>
        ) : (
          <View style={{flex: 1}}>
            <AppNavigator
              ref={(navigatorRef) => {
                NavigationService.setTopLevelNavigator(navigatorRef);
              }}
              screenProps={this.isNotification}
            />
            <EDFloatingButton />
          </View>
        )}
      </Provider>
    );
  }

  componentDidMount() {
    SplashScreen.hide();
    //WHEN_NOTIFICATION_COME_FROM_BK
    this.createNotificationListeners();
    this.onMessageHandler();

    if (Platform.OS === 'ios') {
      KeyboardManager.setEnable(true);
      KeyboardManager.setEnableDebugging(false);
      KeyboardManager.setKeyboardDistanceFromTextField(20);
      KeyboardManager.setPreventShowingBottomBlankSpace(true);
      KeyboardManager.setEnableAutoToolbar(true);
      KeyboardManager.setToolbarDoneBarButtonItemText(
        strings('generalNew.done'),
      );
      KeyboardManager.setToolbarManageBehaviour(0);
      KeyboardManager.setToolbarPreviousNextButtonEnable(true);
      KeyboardManager.setShouldToolbarUsesTextFieldTintColor(true);
      KeyboardManager.setShouldShowToolbarPlaceholder(true);
      KeyboardManager.setOverrideKeyboardAppearance(true);
      KeyboardManager.setShouldResignOnTouchOutside(true);
    }
  }

  onMessageHandler() {
    this.unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log('FCM Message Data:', remoteMessage.data);
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  //STATE_WISE
  createNotificationListeners() {
    messaging().onNotificationOpenedApp(async (remoteMessage) => {
      console.log('onNotificationOpenedApp mess', remoteMessage);
    });
    messaging()
      .getInitialNotification()
      .then(async (remoteMessage) => {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage,
        );
      });

    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('Message handled in the background!', remoteMessage);
    });
  }
}
