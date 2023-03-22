/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {AppNavigator} from './app/components/RootNavigator';
import {createStore, combineReducers} from 'redux';
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
import firebase from '@react-native-firebase/app';
import {strings} from './app/locales/i18n';

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

  async componentDidMount() {
    this.createNotificationListeners();
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

  async createNotificationListeners() {
    /*
     * Triggered when a particular notification has been received in foreground
     * */
    this.notificationListener = firebase
      .notifications()
      .onNotification((notification) => {
        const {title, body, data} = notification;

        console.log('NOTIFICATION TYPE :::::::::::::::: ', notification);

        showDialogue(body || '', title || '', [], () => {
          if (data.screenType === 'order') {
            NavigationService.navigateToSpecificRoute('myOrders');
          } else if (data.screenType === 'noti') {
            NavigationService.navigateToSpecificRoute('notifications');
          } else if (data.screenType === 'delivery') {
            NavigationService.navigateToSpecificRoute('myOrders');
          }
        });
      });

    /*
     * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
     * */

    this.notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened((notificationOpen) => {
        const {data} = notificationOpen.notification;
        console.log(
          'NOTIFICATION OPEN TYPE :::::::::::::::: ',
          notificationOpen.notification,
        );
        if (data.screenType === 'order') {
          NavigationService.navigateToOrderPage('myOrders');
        } else if (data.screenType === 'noti') {
          NavigationService.navigateToOrderPage('notifications');
        } else if (data.screenType === 'delivery') {
          NavigationService.navigateToSpecificRoute('myOrders');
        }
      });

    /*
     * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
     * */
    const notificationOpen = await firebase
      .notifications()
      .getInitialNotification();
    if (notificationOpen) {
      const {data, notificationId} = notificationOpen.notification;

      const lastNotification = await AsyncStorage.getItem('lastNotification');
      console.log('NOTIFICATION DATA :::::::::::::::: ', data);
      if (lastNotification !== notificationId) {
        if (data.screenType === 'order') {
          this.isNotification = ORDER_TYPE;
          this.setState({isRefresh: this.state.isRefresh ? false : true});
          NavigationService.navigateToOrderPage('myOrders');
        } else if (data.screenType === 'noti') {
          this.isNotification = NOTIFICATION_TYPE;
          this.setState({isRefresh: this.state.isRefresh ? false : true});
        }
        await AsyncStorage.setItem('lastNotification', notificationId);
      }
    }
    /*
     * Triggered for data only payload in foreground
     * */
    this.messageListener = firebase.messaging().onMessage(() => {
      //process data message
    });

    if (this.isNotification == undefined) {
      this.isNotification = DEFAULT_TYPE;
      this.setState({isRefresh: this.state.isRefresh ? false : true});
    }
  }

  // async createNotificationListeners() {

  //   /*
  //    * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
  //    * */
  //   const notificationOpen = await firebase.messaging()
  //     .getInitialNotification();

  //   if (notificationOpen) {
  //     const {
  //       title,
  //       notification,
  //       data,
  //       messageId
  //     } = notificationOpen;

  //     console.log("Notification Data :::::: ", notificationOpen)
  //     const lastNotification = await AsyncStorage.getItem("lastNotification");
  //     console.log("NOTIFICATION DATA :::::::::::::::: ", data)
  //     if (lastNotification !== messageId) {
  //       if (data.screenType == "order") {
  //         this.isNotification = ORDER_TYPE;
  //         this.setState({ isRefresh: this.state.isRefresh ? false : true });
  //       } else if (data.screenType == "noti") {
  //         this.isNotification = NOTIFICATION_TYPE;
  //         this.setState({ isRefresh: this.state.isRefresh ? false : true });
  //       }
  //       await AsyncStorage.setItem("lastNotification", messageId);
  //     }
  //   }

  //   /*
  //    * Triggered when a particular notification has been received in foreground
  //    * */
  //   this.messageListener = firebase.messaging().onMessage(message => {
  //     console.log("Foreground Notification :::::::::::::::::: ", message)

  //     var notificationTitle = Platform.OS === 'ios'
  //       ? message.data !== undefined && message.data.notification !== undefined ? message.data.notification.title || APP_NAME : APP_NAME
  //       : message.notification !== undefined && message.notification.title !== undefined ? message.notification.title : APP_NAME

  //     var notificationBody = Platform.OS === 'ios'
  //       ? message.data !== undefined && message.data.notification !== undefined ? message.data.notification.body || '' : ''
  //       : message.notification !== undefined && message.notification.body !== undefined ? message.notification.body : ''

  //     var screenType = Platform.OS === 'ios'
  //       ? message.data !== undefined && message.data.screenType !== undefined ? message.data.screenType : ''
  //       : message.notification !== undefined && message.notification.data !== undefined ? message.notification.data.screenType || '' : ''
  //     //process data message
  //     if (screenType == "order") {
  //       showDialogue(notificationBody, notificationTitle, [],
  //         () => {
  //           NavigationService.navigateToOrderPage('myOrders')
  //         })
  //     }
  //     else if (screenType == 'noti') {
  //       showDialogue(notificationBody, notificationTitle, [],
  //         () => {
  //           NavigationService.navigateToOrderPage('notifications')
  //         })
  //     }
  //   });

  //   if (this.isNotification == undefined) {
  //     this.isNotification = DEFAULT_TYPE;
  //     this.setState({ isRefresh: this.state.isRefresh ? false : true });
  //   }
  // }
}
