import React from 'react';
import {View, StyleSheet} from 'react-native';
import {EDColors} from '../utils/EDColors';
import {strings} from '../locales/i18n';
import EDRTLTextInput from './EDRTLTextInput';
import {TextFieldTypes, debugLog} from '../utils/EDConstants';
import EDThemeButton from './EDThemeButton';
import Validations from '../utils/Validations';
import {showDialogue, showNoInternetAlert} from '../utils/EDAlert';
import {netStatus} from '../utils/NetworkStatusConnection';
import {forgotPassword} from '../utils/ServiceManager';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import EDRTLView from './EDRTLView';

export default class EDForgotPassword extends React.Component {
  //#region LIFE CYCLE METHODS
  constructor(props) {
    super(props);
    this.validationsHelper = new Validations();
  }

  render() {
    return (
      <View
        style={styles.modalContainer}
        pointerEvents={this.state.isLoading ? 'none' : 'auto'}>
        <View style={styles.modalSubContainer}>
          <EDRTLView style={{alignItems: 'center', justifyContent: 'flex-end'}}>
            <MaterialIcon
              onPress={this.props.onDismissHandler}
              size={20}
              color={EDColors.homeButtonColor}
              name={'close'}
            />
          </EDRTLView>

          {/* EMAIL INPUT */}
          <EDRTLTextInput
            containerStyle={{marginTop: 0}}
            type={TextFieldTypes.email}
            identifier={'email'}
            autoFocus={true}
            placeholder={strings('login.email')}
            onChangeText={this.textFieldTextDidChangeHandler}
            errorFromScreen={
              this.state.shouldPerformValidation
                ? this.validationsHelper.validateEmail(
                    this.state.email,
                    strings('validationsNew.emptyEmail'),
                  )
                : ''
            }
          />

          <EDThemeButton
            label={strings('generalNew.submit')}
            isLoading={this.state.isLoading}
            onPress={this.onSubmitButtonHandler}
            isRadius={true}
          />
        </View>
      </View>
    );
  }

  state = {
    shouldPerformValidation: false,
    isLoading: false,
    email: '',
  };

  //#region TEXT CHANGE EVENTS
  textFieldTextDidChangeHandler = (newEmail) => {
    this.state.email = newEmail;
    this.setState({shouldPerformValidation: false});
  };
  //#endregion

  //#region BUTTON EVENTS
  onSubmitButtonHandler = () => {
    this.setState({shouldPerformValidation: true});
    if (
      this.validationsHelper.validateEmail(
        this.state.email.trim(),
        strings('validationsNew.emptyEmail'),
      ).length > 0
    ) {
      return;
    }

    this.callForgotPasswordAPI();
  };
  //#endregion

  //#region NETWORK
  /**
   *
   * @param {The success response object} objSuccess
   */
  onForgotPasswordSuccess = (objSuccess) => {
    this.setState({isLoading: false});
    showDialogue(objSuccess.message, '', [], () => {
      if (this.props.onDismissHandler !== undefined) {
        this.props.onDismissHandler();
      }
    });
  };

  /**
   *
   * @param {The success response object} objSuccess
   */
  onForgotPasswordFailure = (objFailure) => {
    this.setState({isLoading: false});
    showDialogue(objFailure.message);
  };

  callForgotPasswordAPI = () => {
    netStatus((isConnected) => {
      if (isConnected) {
        let objForgotPasswordParams = {
          language_slug: this.props.lan,
          Email: this.state.email,
        };
        this.setState({isLoading: true});
        forgotPassword(
          objForgotPasswordParams,
          this.onForgotPasswordSuccess,
          this.onForgotPasswordFailure,
          this.props,
        );
      } else {
        showNoInternetAlert();
      }
    });
  };
  //#endregion
}

//#region STYLES
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: EDColors.transparent,
  },
  modalSubContainer: {
    backgroundColor: EDColors.white,
    padding: 10,
    marginHorizontal: 20,
    borderRadius: 6,
    marginTop: 20,
    marginBottom: 20,
    paddingBottom: 20,
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
});
//#endregion
