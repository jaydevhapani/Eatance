import React from 'react';
import {View, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import {strings} from '../locales/i18n';
import {
  saveUserDetailsInRedux,
  saveUserFCMInRedux,
  saveLanguageInRedux,
} from '../redux/actions/User';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {EDColors} from '../utils/EDColors';
import Validations from '../utils/Validations';
import {debugLog, funGetDate} from '../utils/EDConstants';
import EDThemeButton from '../components/EDThemeButton';
import {netStatus} from '../utils/NetworkStatusConnection';
import {editProfile} from '../utils/ServiceManager';
import {
  showNotImplementedAlert,
  showNoInternetAlert,
  showDialogue,
} from '../utils/EDAlert';
import BaseContainer from './BaseContainer';
import Metrics from '../utils/metrics';
import ProfileComponent from '../components/ProfileComponent';
import EDProfilePicture from '../components/EDProfilePicture';
import {saveUserLoginDetails, getUserToken} from '../utils/AsyncStorageHelper';
import {NavigationEvents} from 'react-navigation';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';

class EditProfileContainer extends React.Component {
  //#region LIFE CYCLE METHODS
  constructor(props) {
    super(props);
    this.validationsHelper = new Validations();
    this.avatarSource = undefined;
  }

  getUserProfile = () => {
    getUserToken(
      (success) => {
        this.props.saveUserDetailsInRedux(success);
      },
      () => {
        debugLog('FAILURE FETCHING DATA :::::');
      },
    );
  };

  render() {
    return (
      <BaseContainer
        title={strings('profileNew.title')}
        left={'arrow-back'}
        onLeft={this.buttonBackPressed}>
        <NavigationEvents onDidFocus={this.getUserProfile} />

        {/* KEYBOARD AVOIDING SCROLL VIEW */}
        <KeyboardAwareScrollView
          pointerEvents={this.state.isLoading ? 'none' : 'auto'}
          enableResetScrollToCoords={true}
          resetScrollToCoords={{x: 0, y: 0}}
          style={{flex: 1, backgroundColor: EDColors.offWhite}}
          bounces={false}
          keyboardShouldPersistTaps="always"
          behavior="padding"
          enabled>
          {/* PARENT CONTAINER */}
          <View
            pointerEvents={this.state.isLoading ? 'none' : 'auto'}
            style={styles.mainViewStyle}>
            {/* PROFILE IMAGE COMPONENT */}
            <EDProfilePicture
              imagePath={this.props.userDetails.image}
              onImageSelectionHandler={this.onImageSelectionHandler}
            />

            {/* TEXT INPUTS CONTAINER */}
            <View style={styles.textInputsContainer}>
              {/* EMAIL FIELD - UNEDITABLE */}
              <ProfileComponent
                placeholder={strings('profileNew.email')}
                identifier={'Email'}
                source={'email'}
                isText={true}
                text={this.state.objProfileDetails.Email}
                isHidden={false}
              />

              {/* PHONE NUMBER FIELD - UNEDITABLE */}
              <ProfileComponent
                source={'phone'}
                identifier={'PhoneNumber'}
                placeholder={strings('profileNew.phoneNumber')}
                isText={true}
                text={this.state.objProfileDetails.PhoneNumber}
                isHidden={false}
              />

              {/* FIRST NAME FIELD - EDITABLE */}
              <ProfileComponent
                isTouchable={true}
                placeholder={strings('profileNew.firstName')}
                identifier={'FirstName'}
                source={'person'}
                isText={false}
                text={this.state.objProfileDetails.FirstName}
                isHidden={true}
                onChangeValue={this.textFieldTextDidChangeHandler}
                onPress={this.buttonEditPressed}
              />

              {/* LAST NAME FIELD - EDITABLE */}
              <ProfileComponent
                isTouchable={true}
                identifier={'LastName'}
                placeholder={strings('profileNew.lastName')}
                source={'person'}
                isText={false}
                text={this.state.objProfileDetails.LastName}
                isHidden={true}
                onChangeValue={this.textFieldTextDidChangeHandler}
                onPress={this.buttonEditPressed}
              />

              {/* ADDRESS */}
              <ProfileComponent
                source={'my-location'}
                isText={true}
                identifier={'address'}
                placeholder={strings('profileNew.our')}
                text={strings('profileNew.our')}
                isHidden={true}
                onPress={this.navigateToAddressList}
              />

              {/* Date Of Birth */}
              {this.state.objProfileDetails.date_of_birth != undefined &&
              this.state.objProfileDetails.date_of_birth != null &&
              this.state.objProfileDetails.date_of_birth != '' ? (
                <ProfileComponent
                  identifier={'date_of_birth'}
                  placeholder={strings('profileNew.dob')}
                  source={'today'}
                  isText={true}
                  text={this.state.objProfileDetails.date_of_birth}
                  isHidden={true}
                  onPress={this.showDatePicker}
                />
              ) : null}

              {this.state.isDatePickerVisible == true ? (
                <DateTimePicker
                  isVisible={this.state.isDatePickerVisible}
                  mode={'date'}
                  date={new Date(this.state.objProfileDetails.date_of_birth)}
                  maximumDate={new Date(moment().subtract(18, 'years'))}
                  onConfirm={this._handleDatePicked}
                  onCancel={this.onCancel}
                />
              ) : null}

              {/* NOTIFICATION SETTINGS */}
              <ProfileComponent
                source={'notifications-active'}
                isText={true}
                placeholder={strings('profileNew.notification')}
                text={strings('profileNew.notification')}
                value={this.state.isNotificationAllowed}
                isNotification={true}
                onValueChange={this.didChangeNotificationSettings}
              />
            </View>

            {/* SAVE BUTTON */}
            <EDThemeButton
              label={strings('profileNew.save')}
              isLoading={this.state.isLoading}
              onPress={this.buttonSavePressed}
              isRadius={true}
            />
          </View>
        </KeyboardAwareScrollView>
      </BaseContainer>
    );
  }
  //#endregion

  //#region STATE
  state = {
    isLoading: false,
    objProfileDetails: this.props.userDetails,
    isNotificationAllowed: this.props.userDetails.notification === '1',
    isDatePickerVisible: false,
  };
  //#endregion

  //#region HELPER METHODS
  navigateToAddressList = () => {
    this.props.navigation.navigate('addressList', {isSelectAddress: false});
  };

  showDatePicker = () => {
    this.setState({isDatePickerVisible: true});
  };

  /**
   *
   * @param {The image response received from image picker} imageSource
   */
  onImageSelectionHandler = (imageSource) => {
    this.avatarSource = imageSource;
  };

  /**
   *
   * @param {Value of textfield whatever user type} value
   ** @param {Unique identifier for every text field} identifier
   */
  textFieldTextDidChangeHandler = (value, identifier) => {
    this.state.objProfileDetails[identifier] = value;
  };

  _handleDatePicked = (date, identifier) => {
    var datePicked = funGetDate(date);
    this.state.objProfileDetails.date_of_birth = moment(
      datePicked,
      'DD-MM-YYYY',
    ).format('YYYY-MM-DD');
    console.log(
      'STORED DATE::::::::',
      moment(datePicked, 'DD-MM-YYYY').format('YYYY-MM-DD'),
    );
    console.log('New DATE::::::::', this.state.objProfileDetails.date_of_birth);
    this.setState({isDatePickerVisible: false});
  };

  onCancel = () => {
    this.setState({isDatePickerVisible: false});
  };

  /**
   *
   * @param {Value of notification switch} value
   */
  didChangeNotificationSettings = () => {
    this.setState({isNotificationAllowed: !this.state.isNotificationAllowed});
  };
  //#endregion

  //#region BUTTON EVENTS
  /**
   *
   * @param {Checking all conditions and redirect to home screen on success}
   */
  buttonSavePressed = () => {
    console.log('bcajkbcajkbcajkc ::: ', this.state);
    if (
      this.validationsHelper.checkForEmpty(
        this.state.objProfileDetails.FirstName,
        strings('validationsNew.emptyFirstName'),
      ).length > 0
    ) {
      showDialogue(strings('validationsNew.emptyFirstName'));
      return;
    }
    if (
      this.validationsHelper.checkForEmpty(
        this.state.objProfileDetails.LastName,
        strings('validationsNew.emptyLastName'),
      ).length > 0
    ) {
      showDialogue(strings('validationsNew.emptyLastName'));
      return;
    }
    if (
      this.validationsHelper.checkForEmpty(
        this.state.objProfileDetails.date_of_birth == null
          ? ''
          : this.state.objProfileDetails.date_of_birth,
        strings('validationsNew.emptyDateOfBirth'),
      ).length > 0
    ) {
      showDialogue(strings('validationsNew.emptyDateOfBirth'));
      return;
    }

    // this.callEditProfileAPI();
  };

  /** BACK BUTTON EVENT */
  backButtonHandler = () => {
    this.props.navigation.goBack();
  };

  /** CHANGE PROFILE PICTURE EVENT */
  buttonChangeProfilePicturePressed = () => {
    showNotImplementedAlert();
  };

  /** EDIT BUTTON EVENT */
  buttonEditPressed = () => {
    this.secondTextInput.focus();
  };

  //#region NETWORK METHODS

  /**
   *
   * @param {The success response object} objSuccess
   */
  onEditProfileSuccess = (objSuccess) => {
    this.setState({isLoading: false});
    debugLog('OBJ SUCCESS CHANGE PASSWORD :: ' + JSON.stringify(objSuccess));
    if (
      objSuccess.data !== undefined &&
      objSuccess.data.profile !== undefined
    ) {
      this.props.saveUserDetailsInRedux(objSuccess.data.profile);
      saveUserLoginDetails(
        objSuccess.data.profile,
        (onSuccess) => debugLog('SUCCESS ASYNC STORE :: ', onSuccess),
        (onFailure) => debugLog('FAILURE ASYNC STORE :: ', onFailure),
      );
      console.log('ONSUCCESSEDITPROFILE::::::::', objSuccess.data.profile);
    }
    showDialogue(
      objSuccess.message || strings('profileNew.profileUpdate'),
      '',
      [],
      () => {
        this.props.navigation.goBack();
      },
    );
  };

  /**
   *
   * @param {The failure response object} objFailure
   */
  onEditProfileFailure = (objFailure) => {
    this.setState({isLoading: false});
    debugLog('OBJ FAILURE CHANGE PASSWORD :: ' + JSON.stringify(objFailure));
    showDialogue(objFailure.message);
  };

  /** REQUEST CHANGE PASSWORD */
  callEditProfileAPI = () => {
    netStatus((isConnected) => {
      if (isConnected) {
        let objEditProfileDetails = {
          user_id: this.state.objProfileDetails.UserID || 0,
          first_name: this.state.objProfileDetails.FirstName,
          last_name: this.state.objProfileDetails.LastName,
          language_slug: this.props.lan,
          image: this.avatarSource,
          notification: this.state.isNotificationAllowed ? '1' : '0',
          mobile_number: this.state.objProfileDetails.PhoneNumber,
          date_of_birth: this.state.objProfileDetails.date_of_birth,
        };

        this.setState({isLoading: true});
        editProfile(
          objEditProfileDetails,
          this.onEditProfileSuccess,
          this.onEditProfileFailure,
          this.props,
        );
      } else {
        showNoInternetAlert();
      }
    });
  };

  buttonBackPressed = () => {
    this.props.navigation.goBack();
  };
  //#endregion
}

//#region STYLES
const styles = StyleSheet.create({
  mainViewStyle: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: EDColors.offWhite,
  },
  touchableImageContainer: {
    alignSelf: 'center',
    marginVertical: 20,
  },
  profileImage: {
    borderWidth: 2,
    borderColor: EDColors.primary,
    width: Metrics.screenWidth * 0.25,
    height: Metrics.screenWidth * 0.25,
    borderRadius: (Metrics.screenWidth * 0.25) / 2,
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    backgroundColor: EDColors.primary,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInputsContainer: {
    backgroundColor: EDColors.white,
    borderRadius: 5,
    padding: 5,
    margin: 10,
    shadowOpacity: 0.25,
    shadowRadius: 5,
    shadowColor: EDColors.text,
    shadowOffset: {height: 0, width: 0},
  },
});
//#endregion

export default connect(
  (state) => {
    return {
      lan: state.userOperations.lan,
      userDetails: state.userOperations.userDetails || {},
    };
  },
  (dispatch) => {
    return {
      saveUserDetailsInRedux: (detailsToSave) => {
        dispatch(saveUserDetailsInRedux(detailsToSave));
      },
      saveToken: (token) => {
        dispatch(saveUserFCMInRedux(token));
      },
      saveLanguageRedux: (language) => {
        dispatch(saveLanguageInRedux(language));
      },
    };
  },
)(EditProfileContainer);
