import React from 'react';
import {View, StyleSheet} from 'react-native';
import Assets from '../assets';
import {strings} from '../locales/i18n';
import EDThemeHeader from '../components/EDThemeHeader';
import EDProgressLoader from '../components/EDProgressLoader';
import {EDColors} from '../utils/EDColors';
import EDAccountItem from '../components/EDAccountItem';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import EDPopupView from '../components/EDPopupView';
import EDConfirmationDialogue from '../components/EDConfirmationDialogue';
import {
  flushAllData,
  saveLanguage,
  setIsTermsAndConditionsAccepted,
} from '../utils/AsyncStorageHelper';
import {showNoInternetAlert, showDialogue} from '../utils/EDAlert';
import {logoutUser} from '../utils/ServiceManager';
import {netStatus} from '../utils/NetworkStatusConnection';
import {debugLog} from '../utils/EDConstants';
import {
  saveUserDetailsInRedux,
  saveLanguageInRedux,
  saveTermsAcceptedStatus,
} from '../redux/actions/User';
import {saveCartCount} from '../redux/actions/Checkout';
import {connect} from 'react-redux';
import {changeCartButtonVisibility} from '../redux/actions/FloatingButton';
import {NavigationEvents} from 'react-navigation';

class AccountContainer extends React.Component {
  //#region LIFE CYCLE METHODS

  /** CONSTRUCTOR */
  constructor(props) {
    super(props);
  }

  /** STATE */
  state = {
    isLoading: false,
    isLogout: false,
  };

  /** COMPONENT DID MOUNT */
  componentDidMount() {
    // SHOW FLOATING CART BUTTON
    this.props.changeCartButtonVisibility({
      shouldShowFloatingButton: true,
      currentScreen: this.props,
    });
  }

  onWillFocusAccountContainer = () => {
    this.props.changeCartButtonVisibility({
      shouldShowFloatingButton: true,
      currentScreen: this.props,
    });
  };

  /** RENDER FUNCTION */
  render() {
    return (
      <View
        pointerEvents={this.state.isLoading ? 'none' : 'auto'}
        style={styles.mainContainer}>
        <NavigationEvents onWillFocus={this.onWillFocusAccountContainer} />
        {this.state.isLoading ? <EDProgressLoader /> : null}
        {this.logoutDialogue()}
        <EDThemeHeader
          icon={'menu'}
          onLeftButtonPress={this.buttonMenuPressed}
          title={strings('accountsNew.title')}
        />
        <KeyboardAwareScrollView
          enableResetScrollToCoords={true}
          style={styles.mainContainer}
          keyboardShouldPersistTaps="always"
          behavior="padding"
          enabled>
          <View style={styles.childContainer}>
            {this.props.isLoggedIn ? (
              <View>
                <EDAccountItem
                  onPress={this.onPressHandler}
                  icon={Assets.edit_profile}
                  title={strings('accountsNew.editProfile')}
                />
                <EDAccountItem
                  onPress={this.onPressHandler}
                  icon={Assets.password_account}
                  title={strings('accountsNew.changePassword')}
                />
              </View>
            ) : null}
            <EDAccountItem
              isLoggedIn={this.props.isLoggedIn}
              onPress={this.onPressHandler}
              UserID={this.props.UserID}
              isForLanguage={true}
              icon={Assets.language}
              title={strings('accountsNew.language')}
            />
            {this.props.isLoggedIn ? (
              <EDAccountItem
                onPress={this.onPressHandler}
                icon={Assets.logout}
                title={strings('accountsNew.signout')}
              />
            ) : null}
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
  //#endregion

  /** RENDER LOGOUT DIALOGUE */
  logoutDialogue = () => {
    return (
      <EDPopupView isModalVisible={this.state.isLogout}>
        <EDConfirmationDialogue
          onYesClick={this.onYesClick}
          onNoClick={this.onNoClick}
          title={strings('accountsNew.logoutConfirm')}
        />
      </EDPopupView>
    );
  };
  //#endregion

  //#region BUTTON EVENTS
  /** MENU BUTTON EVENT */
  buttonMenuPressed = () => {
    this.props.navigation.openDrawer();
  };

  onPressHandler = (title) => {
    if (title === strings('accountsNew.editProfile')) {
      this.props.navigation.navigate('editProfile');
    } else if (title === strings('accountsNew.changePassword')) {
      this.props.navigation.navigate('changePassword');
    } else if (title === strings('accountsNew.signout')) {
      this.setState({isLogout: true});
    }
  };

  /** YES BUTTON TAP EVENT OF LOGOUT CONFIRMATION DIALOGUE */
  onYesClick = () => {
    // CALL LOGOUT API
    this.callLogoutAPI();
  };

  /** NO BUTTON TAP EVENT OF LOGOUT CONFIRMATION DIALOGUE */
  onNoClick = () => {
    // DISMISS LOGOUT DIALOGUE
    this.setState({isLogout: false, isLoading: false});
  };
  //#endregion

  //#region NETWORK
  /** LOGOUT API CALL */
  callLogoutAPI = () => {
    // CHECK INTERNET STATUS
    netStatus((isConnected) => {
      if (isConnected) {
        this.setState({isLogout: false, isLoading: true});
        // LOGOUT PARAMS
        const logoutParams = {
          user_id: this.props.userDetails.UserID,
          language_slug: this.props.lan,
        };
        // LOGOUT CALL
        logoutUser(
          logoutParams,
          this.onLogoutSuccess,
          this.onLogoutFailure,
          this.props,
        );
      } else {
        showNoInternetAlert();
      }
    });
  };

  /**
   *
   * @param {The success object returned in logout API response} _objSuccess
   */
  onLogoutSuccess = (_objSuccess) => {
    const selectedLanguage = this.props.lan;

    // DISMISS LOGOUT DIALOGUE
    this.setState({isLogout: false, isLoading: false});

    // CLEAR USER DETAILS IN REDUX
    this.props.saveUserDetailsInRedux({});
    this.props.saveLanguageRedux(selectedLanguage);
    this.props.saveTermsAndConditionsStatus(false);
    setIsTermsAndConditionsAccepted(
      false,
      () => {},
      () => {},
    );

    // CLEAR USER DETAILS FROM ASYNC STORE
    flushAllData(
      (_response) => {
        // SET CART COUNT TO 0 IN REDUX
        this.props.saveCartCount(0);

        // MAINTAIN THE SELECTED LANGUAGE IN ASYNC STORE
        saveLanguage(
          selectedLanguage,
          (_successSaveLanguage) => {},
          (_error) => {},
        );

        // TAKE THE USER TO INITIAL SCREEN
        this.props.navigation.popToTop();
        this.props.navigation.navigate('splash');
      },
      (_error) => {},
    );
  };

  /**
   *
   * @param {The failure response object returned in logout API} _objFailure
   */
  onLogoutFailure = (_objFailure) => {
    // DISMISS LOGOUT DIALOGUE
    this.setState({isLogout: false, isLoading: false});
    setTimeout(() => {
      showDialogue(_objFailure.message);
    }, 500);
  };
}

//#region STYLES
const styles = StyleSheet.create({
  mainContainer: {flex: 1, backgroundColor: EDColors.offWhite},
  childContainer: {margin: 20},
});
//#endregion

export default connect(
  (state) => {
    return {
      userDetails: state.userOperations.userDetails,
      UserID: state.userOperations.userDetails.UserID,
      isLoggedIn: state.userOperations.isLoggedIn,
      lan: state.userOperations.lan,
    };
  },
  (dispatch) => {
    return {
      saveUserDetailsInRedux: (detailsToSave) => {
        dispatch(saveUserDetailsInRedux(detailsToSave));
      },
      saveCartCount: (data) => {
        dispatch(saveCartCount(data));
      },
      changeCartButtonVisibility: (data) => {
        dispatch(changeCartButtonVisibility(data));
      },
      saveLanguageRedux: (language) => {
        dispatch(saveLanguageInRedux(language));
      },
      saveTermsAndConditionsStatus: (dataToSave) => {
        dispatch(saveTermsAcceptedStatus(dataToSave));
      },
    };
  },
)(AccountContainer);
