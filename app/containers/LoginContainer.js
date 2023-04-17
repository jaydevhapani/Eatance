import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import {strings} from '../locales/i18n';
import {
  saveUserDetailsInRedux,
  saveTermsAcceptedStatus,
} from '../redux/actions/User';
import {
  StackActions,
  NavigationActions,
  NavigationEvents,
} from 'react-navigation';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {EDFonts} from '../utils/EDFontConstants';
import {EDColors} from '../utils/EDColors';
import Validations from '../utils/Validations';
import EDRTLTextInput from '../components/EDRTLTextInput';
import {
  TextFieldTypes,
  debugLog,
  getProportionalFontSize,
  isRTLCheck,
} from '../utils/EDConstants';
import EDThemeButton from '../components/EDThemeButton';
import EDUnderlineButton from '../components/EDUnderlineButton';
import DeviceInfo from 'react-native-device-info';
import EDRTLText from '../components/EDRTLText';
import Metrics from '../utils/metrics';
import {netStatus} from '../utils/NetworkStatusConnection';
import {
  loginUser,
  updateTermsAndConditionsStatus,
} from '../utils/ServiceManager';
import {showNoInternetAlert, showDialogue} from '../utils/EDAlert';
import EDThemeHeader from '../components/EDThemeHeader';
import {
  saveUserLoginDetails,
  flushAllData,
  setIsTermsAndConditionsAccepted,
} from '../utils/AsyncStorageHelper';
import EDRTLView from '../components/EDRTLView';
import EDPopupView from '../components/EDPopupView';
import EDForgotPassword from '../components/EDForgotPassword';
import {changeCartButtonVisibility} from '../redux/actions/FloatingButton';
import EDWebViewComponent from '../components/EDWebViewComponent';

class LoginContainer extends React.Component {
  //#region LIFE CYCLE METHODS
  constructor(props) {
    super(props);
    this.validationsHelper = new Validations();
    this.isCheckOutContinue =
      this.props.navigation.state.params !== undefined &&
      this.props.navigation.state.params.isCheckout !== undefined
        ? this.props.navigation.state.params.isCheckout
        : false;
    this.objUserDetailsToSave = undefined;
  }

  componentDidMount() {
    this.props.saveTermsAndConditionsStatus(false);
  }

  render() {
    return (
      <KeyboardAwareScrollView
        enableResetScrollToCoords={true}
        // contentContainerStyle={{ flex: 1 }}
        resetScrollToCoords={{x: 0, y: 0}}
        style={styles.parentView}
        bounces={false}
        // keyboardShouldPersistTaps="always"
        behavior="padding"
        enabled>
        <View
          pointerEvents={this.state.isLoading ? 'none' : 'auto'}
          style={styles.parentView}>
          <NavigationEvents
            onDidFocus={this.onDidFocusLoginContainer}
            onWillFocus={this.onWillFocusLoginContainer}
          />

          {/* FORGOT PASSWORD DIALOGUE */}
          {this.renderForgotPasswordDialogue()}

          {/* T & C DIALOGUE */}
          {this.renderTermsAndConditionsDialogue()}

          <EDThemeHeader
            onLeftButtonPress={() => this.buttonBackPressed()}
            title={strings('login.signIn')}
          />

          <View
            pointerEvents={this.state.isLoading ? 'none' : 'auto'}
            style={styles.mainViewStyle}>
            <View style={styles.textFieldStyle}>
              {/* EMAIL INPUT */}
              <EDRTLTextInput
                type={TextFieldTypes.email}
                identifier={'email'}
                placeholder={strings('login.email')}
                onChangeText={this.textFieldTextDidChangeHandler}
                initialValue={this.state.objLoginDetails.email}
                errorFromScreen={
                  this.state.shouldPerformValidation
                    ? this.validationsHelper.validateEmail(
                        this.state.objLoginDetails.email,
                        strings('validationsNew.emptyEmail'),
                      )
                    : ''
                }
              />

              {/* PASSWORD INPUT */}
              <EDRTLTextInput
                type={TextFieldTypes.password}
                identifier={'password'}
                placeholder={strings('login.password')}
                onChangeText={this.textFieldTextDidChangeHandler}
                initialValue={this.state.objLoginDetails.password}
                errorFromScreen={
                  this.state.shouldPerformValidation
                    ? this.validationsHelper.checkForEmpty(
                        this.state.objLoginDetails.password,
                        strings('validationsNew.emptyPassword'),
                      )
                    : ''
                }
              />

              {/* FORGOT PASSWORD */}
              <EDUnderlineButton
                buttonStyle={styles.forgotPasswordButton}
                textStyle={styles.forgotPasswordText}
                onPress={this.buttonForgotPasswordPressed}
                label={strings('login.forgotPassword') + '?'}
              />

              {/* LOGIN BUTTON */}
              <EDThemeButton
                style={styles.signInButton}
                label={strings('login.signIn')}
                isLoading={this.state.isLoading}
                onPress={this.buttonLoginPressed}
                isRadius={true}
              />

              {/* DON'T HAVE AN ACCOUNT? */}
              <EDRTLView style={styles.noAccountContainer}>
                <EDRTLText
                  style={styles.noAccountText}
                  title={strings('login.noAccount')}
                />
                <EDUnderlineButton
                  buttonStyle={styles.signUpButton}
                  textStyle={styles.signUpText}
                  onPress={this.buttonSignUpPressed}
                  label={strings('login.signUp')}
                />
              </EDRTLView>
            </View>
            {/* BOTTOM CONTAINER */}
            <View style={styles.bottomContainer}>
              {/* VERSION NUMBER LABEL */}
              <Text style={styles.versionTextStyle}>
                v{DeviceInfo.getVersion()}
              </Text>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    );
  }

  onAcceptPressHandler = () => {
    this.updateTermsAndConditionsStatusOnServer();
  };

  onDismissTermsAndConditionsDialogue = () => {
    // this.props.saveUserDetailsInRedux(undefined)
    flushAllData(
      () => {},
      () => {},
    );

    this.setState({isTermsAndConditionsDialogueVisible: false});
  };

  /** RENDER T&C DIALOGUE */
  renderTermsAndConditionsDialogue = () => {
    return (
      <EDPopupView
        isLoading={this.state.isLoading}
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

  /** RENDER LOGOUT DIALOGUE */
  renderForgotPasswordDialogue = () => {
    return (
      <EDPopupView isModalVisible={this.state.shouldShowForgotPasswordDialogue}>
        <EDForgotPassword
          lan={this.props.lan}
          onDismissHandler={this.onDismissForgotPasswordHandler}
        />
      </EDPopupView>
    );
  };
  //#endregion

  //#region FORGOT PASSWORD BUTTON EVENTS
  onDismissForgotPasswordHandler = () => {
    this.setState({shouldShowForgotPasswordDialogue: false});
  };
  //#endregion

  //#region STATE
  state = {
    isLoading: false,
    shouldPerformValidation: false,
    objLoginDetails: {email: '', password: ''},
    shouldShowForgotPasswordDialogue: false,
    isTermsAndConditionsDialogueVisible: false,
  };
  //#endregion

  //#region TEXT CHANGE EVENTS
  /**
   *
   * @param {Value of textfield whatever user type} value
   ** @param {Unique identifier for every text field} identifier
   */
  textFieldTextDidChangeHandler = (value, identifier) => {
    this.state.objLoginDetails[identifier] = value.trim();
    this.setState({shouldPerformValidation: false});
  };
  //#endregion

  //#region BUTTON EVENTS
  /**
   *
   * @param {Checking all conditions and redirect to home screen on success}
   */
  buttonLoginPressed = () => {
    this.setState({shouldPerformValidation: true});
    if (
      this.validationsHelper.validateEmail(
        this.state.objLoginDetails.email.trim(),
        strings('validationsNew.emptyEmail'),
      ).length > 0 ||
      this.validationsHelper.checkForEmpty(
        this.state.objLoginDetails.password.trim(),
        strings('validationsNew.emptyPassword'),
      ).length > 0
    ) {
      return;
    }

    this.callLoginAPI();
  };

  navigateToNextScreen = () => {
    if (
      this.objUserDetailsToSave == undefined ||
      this.objUserDetailsToSave == null
    ) {
      showDialogue(strings('generalNew.generalWebServiceError'));
      return;
    }
    this.props.saveUserDetailsInRedux(this.objUserDetailsToSave);
    saveUserLoginDetails(
      this.objUserDetailsToSave,
      (onSuccess) => debugLog('SUCCESS ASYNC STORE :: ', onSuccess),
      (onFailure) => debugLog('FAILURE ASYNC STORE :: ', onFailure),
    );

    if (this.isCheckOutContinue === true) {
      this.buttonBackPressed();
    } else {
      this.props.navigation.dispatch(
        StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({routeName: 'main'})],
        }),
      );
    }
  };

  //#region NETWORK METHODS

  /**
   *
   * @param {The success response object} objSuccess
   */
  onLoginSuccess = (objSuccess) => {
    if (objSuccess.data !== undefined && objSuccess.data.login !== undefined) {
      var isTAndCAccepted = (objSuccess.data.login.tnc_status || '') == '1';
      this.props.saveTermsAndConditionsStatus(isTAndCAccepted);
      console.log("objSuccess.data.login :: => ", objSuccess.data.login)
      this.objUserDetailsToSave = objSuccess.data.login;

      this.setState({
        isLoading: false,
        isTermsAndConditionsDialogueVisible: !isTAndCAccepted,
      });

      if (isTAndCAccepted) {
        this.navigateToNextScreen();
      }
    }
  };

  /**
   *
   * @param {The success response object} objSuccess
   */
  onLoginFailure = (objFailure) => {
    this.setState({isLoading: false});
    showDialogue(objFailure.message, '', [], () => {
      this.state.objLoginDetails['email'] = '';
      this.state.objLoginDetails['password'] = '';
      this.setState({shouldPerformValidation: false});
    });
  };

  callLoginAPI = () => {
    netStatus((isConnected) => {
      if (isConnected) {
        let objLoginParams = {
          language_slug: this.props.lan,
          Email: this.state.objLoginDetails.email,
          Password: this.state.objLoginDetails.password,
        };
        this.setState({isLoading: true});
        loginUser(
          objLoginParams,
          this.onLoginSuccess,
          this.onLoginFailure,
          this.props,
        );
      } else {
        showNoInternetAlert();
      }
    });
  };
  /** UPDATE T & C STATUS API CALL */
  updateTermsAndConditionsStatusOnServer = () => {
    if (
      this.objUserDetailsToSave == undefined ||
      this.objUserDetailsToSave.UserID == undefined
    ) {
      this.setState({isTermsAndConditionsDialogueVisible: false});
      this.props.saveTermsAndConditionsStatus(true);
      this.props.navigation.navigate('register');
      return;
    }
    netStatus((status) => {
      if (status) {
        this.setState({isLoading: true});
        let paramsUpdateTAndCStatus = {
          language_slug: this.props.lan,
          user_id: this.objUserDetailsToSave.UserID,
          tnc_status: true,
        };
        this.setState({
          isLoading: true,
          isTermsAndConditionsDialogueVisible: false,
        });
        updateTermsAndConditionsStatus(
          paramsUpdateTAndCStatus,
          this.onSuccessTAndCUpdate,
          this.onFailureTAndCUpdate,
          this.props,
        );
      } else {
        showNoInternetAlert();
      }
    });
  };

  /**
   *
   * @param {The success response object parsed from CMS API response} objSuccess
   */
  onSuccessTAndCUpdate = (objSuccess) => {
    this.props.saveTermsAndConditionsStatus(true);
    setIsTermsAndConditionsAccepted(
      true,
      () => {},
      () => {},
    );
    this.setState({isLoading: false});
    this.navigateToNextScreen();
  };

  /**
   *
   * @param {The failure response object parsed from CMS API response} objFailure
   */
  onFailureTAndCUpdate = (objFailure) => {
    this.setState({isLoading: false});
    showDialogue(objFailure.message);
  };

  /**
   *
   * @param {Redirecting user to forgot screen on forgot button click}
   */
  buttonForgotPasswordPressed = () => {
    this.setState({shouldShowForgotPasswordDialogue: true});
  };

  /**
   *
   * @param {Redirecting user to sign up screen}
   */
  buttonSignUpPressed = () => {
    if (this.props.isTermsAndConditionsAccepted) {
      this.props.navigation.navigate('register');
    } else {
      this.setState({isTermsAndConditionsDialogueVisible: true});
    }

    // this.props.navigation.navigate('register');
  };

  buttonBackPressed() {
    console.log('kdbasjkdhbajksdhas');
    this.props.navigation.goBack();
  }
  //#endregion

  onDidFocusLoginContainer = () => {
    this.props.changeCartButtonVisibility({
      shouldShowFloatingButton: false,
      currentScreen: this.props,
    });
  };

  onWillFocusLoginContainer = () => {
    this.props.changeCartButtonVisibility({
      shouldShowFloatingButton: false,
      currentScreen: this.props,
    });
  };
}

//#region STYLES
const styles = StyleSheet.create({
  parentView: {flex: 1, backgroundColor: EDColors.white},
  mainViewStyle: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: EDColors.white,
  },
  textFieldStyle: {
    marginTop: 44,
    // backgroundColor: 'green',
  },
  forgotPasswordButton: {
    borderBottomColor: EDColors.text,
    alignSelf: 'flex-end',
    marginHorizontal: 20,
    marginVertical: 15,
  },
  forgotPasswordText: {
    color: EDColors.text,
    fontFamily: EDFonts.semiBold,
    fontSize: getProportionalFontSize(14),
  },
  signInButton: {
    width: Metrics.screenWidth - 40,
    backgroundColor: EDColors.primary,
    marginTop: 40,
  },
  // signInText: { color: EDColors.primary },
  bottomContainer: {
    justifyContent: 'flex-end',
    backgroundColor: EDColors.transparent,
  },
  noAccountContainer: {
    justifyContent: 'center',
    marginTop: 15,
    alignItems: 'center',
  },
  noAccountText: {
    color: EDColors.noAccount,
    fontFamily: EDFonts.regular,
    fontSize: getProportionalFontSize(14),
  },
  signUpButton: {borderBottomColor: EDColors.homeButtonColor},
  signUpText: {color: EDColors.homeButtonColor},
  versionTextStyle: {
    textAlign: 'center',
    fontFamily: EDFonts.regular,
    fontSize: getProportionalFontSize(14),
    color: EDColors.text,
    margin: 10,
    marginBottom: 20,
  },
});
//#endregion

export default connect(
  (state) => {
    return {
      lan: state.userOperations.lan,
      objStoreDetails: state.contentOperations.objStoreDetails,
      userDetails: state.userOperations.userDetails,
      isTermsAndConditionsAccepted:
        state.userOperations.isTermsAndConditionsAccepted,
    };
  },
  (dispatch) => {
    return {
      saveUserDetailsInRedux: (detailsToSave) => {
        dispatch(saveUserDetailsInRedux(detailsToSave));
      },
      changeCartButtonVisibility: (data) => {
        dispatch(changeCartButtonVisibility(data));
      },
      saveTermsAndConditionsStatus: (dataToSave) => {
        dispatch(saveTermsAcceptedStatus(dataToSave));
      },
    };
  },
)(LoginContainer);
