import React from 'react';
import {View, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import {strings} from '../locales/i18n';
import {
  saveUserDetailsInRedux,
  saveUserFCMInRedux,
  saveLanguageInRedux,
} from '../redux/actions/User';
import {NavigationEvents} from 'react-navigation';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {EDColors} from '../utils/EDColors';
import Validations from '../utils/Validations';
import EDRTLTextInput from '../components/EDRTLTextInput';
import {TextFieldTypes, debugLog} from '../utils/EDConstants';
import EDThemeButton from '../components/EDThemeButton';
import {netStatus} from '../utils/NetworkStatusConnection';
import {changePassword} from '../utils/ServiceManager';
import {
  showNotImplementedAlert,
  showNoInternetAlert,
  showDialogue,
} from '../utils/EDAlert';
import EDThemeHeader from '../components/EDThemeHeader';
import {saveUserLoginDetails} from '../utils/AsyncStorageHelper';
import Metrics from '../utils/metrics';
import {changeCartButtonVisibility} from '../redux/actions/FloatingButton';

class ChangePasswordContainer extends React.Component {
  //#region LIFE CYCLE METHODS
  constructor(props) {
    super(props);
    this.validationsHelper = new Validations();
  }

  render() {
    return (
      <KeyboardAwareScrollView
        pointerEvents={this.state.isLoading ? 'none' : 'auto'}
        enableResetScrollToCoords={true}
        resetScrollToCoords={{x: 0, y: 0}}
        style={styles.scrollContainer}
        bounces={false}
        keyboardShouldPersistTaps="always"
        behavior="padding"
        enabled>
        <View
          pointerEvents={this.state.isLoading ? 'none' : 'auto'}
          style={styles.mainViewStyle}>
          <NavigationEvents onWillFocus={this.onWillFocusEvent} />
          {/* THEMER HEADER */}
          <EDThemeHeader
            onLeftButtonPress={this.buttonBackPressed}
            title={strings('changePassword.title')}
          />

          {/* TEXT INPUTS CONTAINER */}
          <View style={styles.textInputsContainer}>
            {/* OLD PASSWORD INPUT */}
            <EDRTLTextInput
              type={TextFieldTypes.password}
              identifier={'oldPassword'}
              placeholder={strings('changePassword.old')}
              onChangeText={this.textFieldTextDidChangeHandler}
              initialValue={this.state.objChangePasswordDetails.oldPassword}
              errorFromScreen={
                this.state.shouldPerformValidation
                  ? this.validationsHelper.checkForEmpty(
                      this.state.objChangePasswordDetails.oldPassword,
                      strings('changePassword.oldPasswordMsg'),
                    )
                  : ''
              }
            />

            {/* NEW PASSWORD INPUT */}
            <EDRTLTextInput
              type={TextFieldTypes.password}
              identifier={'newPassword'}
              placeholder={strings('changePassword.new')}
              onChangeText={this.textFieldTextDidChangeHandler}
              initialValue={this.state.objChangePasswordDetails.newPassword}
              errorFromScreen={
                this.state.shouldPerformValidation
                  ? this.validationsHelper.validatePassword(
                      this.state.objChangePasswordDetails.newPassword,
                      strings('changePassword.NewPasswordMsg'),
                    )
                  : ''
              }
            />

            {/* CONFIRM PASSWORD INPUT */}
            <EDRTLTextInput
              type={TextFieldTypes.password}
              identifier={'confirmPassword'}
              placeholder={strings('changePassword.confirm')}
              onChangeText={this.textFieldTextDidChangeHandler}
              initialValue={this.state.objChangePasswordDetails.confirmPassword}
              errorFromScreen={
                this.state.shouldPerformValidation
                  ? this.validationsHelper.validateConfirmPassword(
                      this.state.objChangePasswordDetails.newPassword,
                      this.state.objChangePasswordDetails.confirmPassword,
                      strings('changePassword.passwordSameMsg'),
                    )
                  : ''
              }
            />

            {/* SAVE BUTTON */}
            <EDThemeButton
              style={styles.saveButton}
              label={strings('changePassword.save')}
              isLoading={this.state.isLoading}
              onPress={this.buttonSavePressed}
              isRadius={true}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    );
  }
  //#endregion

  //#region STATE
  state = {
    isLoading: false,
    shouldPerformValidation: false,
    isModalVisible: false,
    objChangePasswordDetails: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  };
  //#endregion

  //#region TEXT CHANGE EVENTS
  /**
   *
   * @param {Value of textfield whatever user type} value
   ** @param {Unique identifier for every text field} identifier
   */
  textFieldTextDidChangeHandler = (value, identifier) => {
    this.state.objChangePasswordDetails[identifier] = value;
    this.setState({shouldPerformValidation: false});
  };
  //#endregion

  //#region BUTTON EVENTS
  /**
   *
   * @param {Checking all conditions and redirect to home screen on success}
   */
  buttonSavePressed = () => {
    this.setState({shouldPerformValidation: true});
    if (
      this.validationsHelper.checkForEmpty(
        this.state.objChangePasswordDetails.oldPassword,
        strings('changePassword.oldPasswordMsg'),
      ).length > 0 ||
      this.validationsHelper.validatePassword(
        this.state.objChangePasswordDetails.newPassword,
        strings('changePassword.NewPasswordMsg'),
      ).length > 0 ||
      this.validationsHelper.validateConfirmPassword(
        this.state.objChangePasswordDetails.newPassword,
        this.state.objChangePasswordDetails.confirmPassword,
        strings('changePassword.NewPasswordMsg'),
      ).length > 0
    ) {
      return;
    }

    this.callChangePasswordAPI();
  };

  //#region NETWORK METHODS

  /**
   *
   * @param {The success response object} objSuccess
   */
  onChangePasswordSuccess = objSuccess => {
    this.setState({isLoading: false});
    debugLog('OBJ SUCCESS CHANGE PASSWORD :: ' + JSON.stringify(objSuccess));
    showDialogue(
      objSuccess.message || strings('changePassword.passwordSuccess'),
      '',
      [],
      () => {
        debugLog('SUCCESS ALERT OK');
        // this.props.navigation.navigate('home')
        this.props.navigation.goBack();
      },
    );
  };

  /**
   *
   * @param {The failure response object} objFailure
   */
  onChangePasswordFailure = objFailure => {
    this.setState({isLoading: false});
    debugLog('OBJ FAILURE CHANGE PASSWORD :: ' + JSON.stringify(objFailure));
    showDialogue(objFailure.message);
  };

  /** REQUEST CHANGE PASSWORD */
  callChangePasswordAPI = () => {
    netStatus(isConnected => {
      if (isConnected) {
        let objChangePasswordParams = {
          language_slug: this.props.lan,
          user_id: this.props.userDetails.UserID || 0,
          token: '' + this.props.userDetails.PhoneNumber,
          old_password: this.state.objChangePasswordDetails.oldPassword,
          password: this.state.objChangePasswordDetails.newPassword,
          confirm_password: this.state.objChangePasswordDetails.confirmPassword,
        };
        this.setState({isLoading: true});
        changePassword(
          objChangePasswordParams,
          this.onChangePasswordSuccess,
          this.onChangePasswordFailure,
          this.props,
        );
      } else {
        showNoInternetAlert();
      }
    });
  };

  okPressed = () => {
    var userLoggedIn = true;
    saveUserLoginDetails(
      userLoggedIn,
      () => {
        this.props.navigation.navigate('Home');
        // this.setState({isModalVisible: false})
      },
      () => {
        debugLog('Fail to store');
      },
    );
  };
  /**
   *
   * @param {Redirecting user to forgot screen on forgot button click}
   */
  buttonForgotPasswordPressed = () => {
    showNotImplementedAlert();
  };

  /**
   *
   * @param {Redirecting user to register screen on register button click}
   */
  buttonRegisterPressed = () => {
    this.props.navigation.navigate('registerContainer');
  };

  buttonBackPressed = () => {
    this.props.navigation.goBack();
  };
  //#endregion

  onWillFocusEvent = () => {
    this.props.changeCartButtonVisibility({
      shouldShowFloatingButton: true,
      currentScreen: this.props,
    });
  };
}

//#region STYLES
const styles = StyleSheet.create({
  saveButton: {
    width: Metrics.screenWidth - 40,
    backgroundColor: EDColors.primary,
    marginTop: 40,
  },
  scrollContainer: {flex: 1, backgroundColor: EDColors.white},
  mainViewStyle: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: EDColors.white,
  },
  textInputsContainer: {
    // backgroundColor: EDColors.titleBackground,
    marginVertical: 44,
  },
});
//#endregion

export default connect(
  state => {
    return {
      lan: state.userOperations.lan,
      userDetails: state.userOperations.userDetails || {},
    };
  },
  dispatch => {
    return {
      saveUserDetailsInRedux: detailsToSave => {
        dispatch(saveUserDetailsInRedux(detailsToSave));
      },
      saveToken: token => {
        dispatch(saveUserFCMInRedux(token));
      },
      saveLanguageRedux: language => {
        dispatch(saveLanguageInRedux(language));
      },
      changeCartButtonVisibility: data => {
        dispatch(changeCartButtonVisibility(data));
      },
    };
  },
)(ChangePasswordContainer);
