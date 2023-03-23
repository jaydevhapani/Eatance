/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
/* eslint-disable semi */
import React from 'react';
import {connect} from 'react-redux';
import {
  saveUserDetailsInRedux,
  saveUserFCMInRedux,
  saveLanguageInRedux,
  saveTermsAcceptedStatus,
} from '../redux/actions/User';
import {
  View,
  Text,
  SafeAreaView,
  ImageBackground,
  Animated,
  StyleSheet,
  TouchableHighlight,
  StatusBar,
  Linking,
  Image,
} from 'react-native';
import {
  StackActions,
  NavigationActions,
  NavigationEvents,
} from 'react-navigation';
import Assets from '../assets';
import Metrics from '../utils/metrics';
import EDThemeButton from '../components/EDThemeButton';
import {EDColors} from '../utils/EDColors';
import {strings} from '../locales/i18n';
import EDRTLView from '../components/EDRTLView';
import EDUnderlineButton from '../components/EDUnderlineButton';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import I18n from 'react-native-i18n';
import EDRTLText from '../components/EDRTLText';
import {
  getUserLoginDetails,
  getLanguage,
  getCartList,
  getSelectedStore,
  getIsTermsAndConditionsAccepted,
  setIsTermsAndConditionsAccepted,
} from '../utils/AsyncStorageHelper';
import {
  debugLog,
  isRTLCheck,
  NOTIFICATION_TYPE,
  ORDER_TYPE,
} from '../utils/EDConstants';
import {saveCartDataInRedux} from '../redux/actions/Checkout';
import {netStatus} from '../utils/NetworkStatusConnection';
import {getCMSPageDetails} from '../utils/ServiceManager';
import {saveCMSPagesData, saveStoreDetails} from '../redux/actions/Content';
import {changeCartButtonVisibility} from '../redux/actions/FloatingButton';
import NavigationService from '../../NavigationService';
import {showDialogue} from '../utils/EDAlert';
import EDPopupView from '../components/EDPopupView';
import EDWebViewComponent from '../components/EDWebViewComponent';

var redirectType = '';

class SplashContainer extends React.Component {
  //#region LIFE CYCLE METHODS
  /** CONSTRUCTOR */
  constructor(props) {
    super(props);

    this.isTermsAndConditionsAccepted = false;
    redirectType = this.props.screenProps;

    this.state = {
      bounceValue: new Animated.Value(Metrics.screenHeight),
      isTermsAndConditionsDialogueVisible: false,
    };
  }

  /** COMPONENT DID MOUNT */
  componentDidMount() {
    this.props.changeCartButtonVisibility({
      shouldShowFloatingButton: false,
      currentScreen: this.props,
    });

    // CHECK IS TERMS & CONDITIONS ACCEPTED
    getIsTermsAndConditionsAccepted(
      (onSuccess) => {
        debugLog('SUCCESS IN FETCHING T&C ::: ' + onSuccess);
        this.isTermsAndConditionsAccepted = onSuccess;
        setIsTermsAndConditionsAccepted(
          false,
          () => {
            debugLog('Saved successfully');
          },
          () => {
            debugLog('failed');
          },
        );
        this.props.saveTermsAndConditionsStatus(false);
      },
      (error) => {
        debugLog('ERROR IN FETCHING T&C ::: ' + error);
      },
    );

    // MAINTAIN LANGUAGE SELECTION
    getLanguage(
      (languageSelected) => {
        var languageToSave = languageSelected || 'en';
        I18n.locale = languageToSave;
        this.props.saveLanguageRedux(languageToSave);

        // GET CMS PAGES
        this.getCMSDetails(languageToSave);
      },
      (_err) => {
        var languageToSave = 'en';
        I18n.locale = languageToSave;
        this.props.saveLanguageRedux(languageToSave);

        // GET CMS PAGES
        this.getCMSDetails(languageToSave);
      },
    );

    console.log('NAVIGATION TO HOME ::::::: ', redirectType);
    // CHECK FOR AUTO LOGIN
    getUserLoginDetails(this.onSuccessHandler, this.onErrorHandler);
    // CHECK FOR PERSISTENT CART
    this.getCartData();
  }

  onWillFocusSplashContainer = () => {
    this.props.changeCartButtonVisibility({
      shouldShowFloatingButton: false,
      currentScreen: this.props,
    });
  };

  onDidFocusSplashContainer = () => {
    this.props.changeCartButtonVisibility({
      shouldShowFloatingButton: false,
      currentScreen: this.props,
    });
  };

  onAcceptPressHandler = () => {
    this.setState({isTermsAndConditionsDialogueVisible: false});
    this.props.saveTermsAndConditionsStatus(true);
    setIsTermsAndConditionsAccepted(
      true,
      () => {},
      () => {},
    );
    this.props.navigation.navigate('register');
  };

  onDismissTermsAndConditionsDialogue = () => {
    this.setState({isTermsAndConditionsDialogueVisible: false});
  };

  renderTermsAndConditionsDialogue = () => {
    return (
      <EDPopupView
        isModalVisible={this.state.isTermsAndConditionsDialogueVisible}>
        <EDWebViewComponent
          cmsSlug={'terms-and-conditions'}
          lan={this.props.lan}
          onAcceptPressHandler={this.onAcceptPressHandler}
          onDismissHandler={this.onDismissTermsAndConditionsDialogue}
        />
      </EDPopupView>
    );
  };

  /** RENDER METHOD */
  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <NavigationEvents
          onWillFocus={this.onWillFocusSplashContainer}
          onDidFocus={this.onDidFocusSplashContainer}
        />

        {this.renderTermsAndConditionsDialogue()}

        <ImageBackground
          resizeMode={'cover'}
          style={{height: Metrics.actualScreenheight / 2}}
          source={Assets.bgSplash}
        />
        <Animated.View
          style={[
            styles.subView,
            {
              transform: [{translateY: this.state.bounceValue}],
              useNativeDriver: false,
            },
          ]}>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <EDThemeButton
              textStyle={{color: EDColors.black}}
              style={{backgroundColor: EDColors.secondary}}
              onPress={this._onPressSignIn}
              label={strings('splash.signIn')}
            />

            <EDThemeButton
              onPress={this._onPressSkip}
              isTransparent={true}
              label={strings('splash.skip')}
              style={styles.SkipButton}
              textStyle={{color: EDColors.black}}
            />

            <EDRTLView
              style={{
                justifyContent: 'center',
                marginTop: 25,
                alignItems: 'center',
              }}>
              <EDRTLText
                title={strings('splash.noAccount')}
                style={styles.TextStyle1}
              />
              <EDUnderlineButton
                onPress={this._onPressSignUp}
                label={strings('splash.signUp')}
                textStyle={styles.TextStyle}
                buttonStyle={{borderBottomColor: EDColors.black}}
              />
            </EDRTLView>
          </View>
        </Animated.View>
      </View>
    );
  }
  //#endregion

  //#region HELPER METHODS
  /** TOGGLE ANIMATION VIEW */
  _toggleSubview() {
    Animated.spring(this.state.bounceValue, {
      toValue: 0,
      velocity: 3,
      tension: 2,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }

  /** GET CART DETAILS */
  getCartData = () => {
    getCartList(
      (onSuccess) => this.props.saveCartDataInRedux(onSuccess),
      (noCartFound) => this.props.saveCartDataInRedux(noCartFound),
      (onFailure) => debugLog('Cart Data Fail ::::::::: ', onFailure),
    );
  };

  /** AUTO LOGIN SUCCESSS - ASYNC STORE */
  onSuccessHandler = (objLoginDetails) => {
    if (
      objLoginDetails === undefined ||
      objLoginDetails == null ||
      objLoginDetails.UserID === undefined ||
      objLoginDetails.UserID == null
    ) {
      this.onErrorHandler();
      return;
    }

    // SAVE USER DETAILS IN REDUX
    this.props.saveUserDetailsInRedux(objLoginDetails);
    if (redirectType == ORDER_TYPE) {
      redirectType = undefined;
      NavigationService.navigateToOrderPage('myOrders');
    } else if (redirectType == NOTIFICATION_TYPE) {
      redirectType = undefined;
      NavigationService.navigateToOrderPage('notifications');
    } else {
      // NAVIGATE TO HOME SCREEN
      setTimeout(() => {
        this.props.navigation.dispatch(
          StackActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({routeName: 'storesList'}),
              // NavigationActions.navigate({ routeName: isRTLCheck() ? 'mainRTL' : 'main' })
            ],
          }),
        );
      }, 3000);
    }
  };

  /** AUTO LOGIN FAILURE - ASYNC STORE */
  onErrorHandler = (errorGetUserDetails) => {
    debugLog('AUTO LOGIN FAILURE :: ', errorGetUserDetails);
    setTimeout(() => {
      this._toggleSubview();
    }, 3000);
  };

  /** CALL CMS API */
  getCMSDetails = (selectedLanguage) => {
    netStatus((isConnected) => {
      if (isConnected) {
        let objCMSParams = {
          language_slug: selectedLanguage,
        };
        getCMSPageDetails(
          objCMSParams,
          this.onSucessGetCMSDetails,
          this.onFailureGetCMSDetails,
        );
      }
    });
  };

  onSucessGetCMSDetails = (objCMSSuccessResponse) => {
    if (
      objCMSSuccessResponse.data !== undefined &&
      objCMSSuccessResponse.data.cmsData !== undefined
    ) {
      debugLog('SIDE MENU CMS :: ', objCMSSuccessResponse.data.cmsData);
      this.props.saveCMSDetails(objCMSSuccessResponse.data.cmsData);
    }
  };

  onFailureGetCMSDetails = (objCMSFailureResponse) => {};

  //#endregion

  //#region BUTTON EVENTS
  buttonTermsOfUsePressed = () => {
    this.openExternalWebPage();
  };

  buttonPrivacyPolicyPressed = () => {
    this.openExternalWebPage();
  };

  openExternalWebPage = () => {
    const strCallURL = 'https://eatanceapp.com/privacy-policy/';
    if (Linking.canOpenURL(strCallURL)) {
      Linking.openURL(strCallURL).catch((error) => {
        debugLog('ERROR :: ', error);
        // showDialogue('generalNew.canNotDial')
      });
    } else {
      // showDialogue('generalNew.canNotDial')
    }
  };

  /** SIGN IN BUTTON EVETN */
  _onPressSignIn = () => {
    this.props.navigation.navigate('login', {
      isCheckout: false,
    });
  };

  /** SKIP BUTTON EVENT */
  _onPressSkip = () => {
    // NAVITGATE USER TO STORES LIST ALWAYS
    this.props.saveTermsAndConditionsStatus(true);
    this.props.navigation.dispatch(
      StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({routeName: 'storesList'})],
      }),
    );

    // Fetched selected store from async storage
    // getSelectedStore(
    //   onSuccess => {
    //     console.log("On Selected STORE :::", onSuccess)
    //     if (onSuccess !== undefined || onSuccess !== null) {
    //       this.props.saveStoreDetailsInRedux(onSuccess)
    //       this.props.navigation.dispatch(
    //         StackActions.reset({
    //           index: 0,
    //           actions: [NavigationActions.navigate({ routeName: 'main' })],
    //         }),
    //       )
    //     }
    //   },
    //   onFailure => {
    //   debugLog("No saved store found ::::::: ", onFailure),
    //     this.props.navigation.dispatch(
    //       StackActions.reset({
    //         index: 0,
    //         actions: [NavigationActions.navigate({ routeName: 'storesList' })],
    //       }),
    //     )
    //   }
    // )
  };

  /** SIGN UP BUTTON EVENT */
  _onPressSignUp = () => {
    if (this.props.isTermsAndConditionsAccepted) {
      this.props.navigation.navigate('register');
    } else {
      this.setState({isTermsAndConditionsDialogueVisible: true});
    }
  };
  //#endregion
}

//#region STYLE SHEET
var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: Metrics.screenHeight * 0.5,
  },
  TextStyle: {
    color: 'blue',
    fontWeight: '600',
  },
  TextStyle1: {
    color: EDColors.black,
  },
  SkipButton: {
    borderColor: EDColors.black,
  },
});
//#endregion

//#region REDUX
export default connect(
  (state) => {
    return {
      lan: state.userOperations.lan,
      isTermsAndConditionsAccepted:
        state.userOperations.isTermsAndConditionsAccepted,
      objStoreDetails: state.contentOperations.objStoreDetails,
    };
  },
  (dispatch) => {
    return {
      saveUserDetailsInRedux: (detailsToSave) => {
        dispatch(saveUserDetailsInRedux(detailsToSave));
      },
      saveLanguageRedux: (language) => {
        dispatch(saveLanguageInRedux(language));
      },
      saveCartDataInRedux: (data) => {
        dispatch(saveCartDataInRedux(data));
      },
      saveCMSDetails: (cmsDetails) => {
        dispatch(saveCMSPagesData(cmsDetails));
      },
      changeCartButtonVisibility: (data) => {
        dispatch(changeCartButtonVisibility(data));
      },
      saveStoreDetailsInRedux: (dataToSave) => {
        dispatch(saveStoreDetails(dataToSave));
      },
      saveTermsAndConditionsStatus: (dataToSave) => {
        dispatch(saveTermsAcceptedStatus(dataToSave));
      },
    };
  },
)(SplashContainer);
//#endregion
