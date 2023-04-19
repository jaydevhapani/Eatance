import React from 'react';
import {View, StyleSheet, SafeAreaView} from 'react-native';
import {connect} from 'react-redux';
import {
  ABOUT_US,
  debugLog,
  getProportionalFontSize,
} from '../utils/EDConstants';
import {showDialogue, showNoInternetAlert} from '../utils/EDAlert';
import {netStatus} from '../utils/NetworkStatusConnection';
import {strings} from '../locales/i18n';
import WebView from 'react-native-webview';
import {
  getCMSPageDetails,
  updateTermsAndConditionsStatus,
} from '../utils/ServiceManager';
import Metrics from '../utils/metrics';
import {NavigationEvents} from 'react-navigation';
import EDThemeHeader from '../components/EDThemeHeader';
import {EDColors} from '../utils/EDColors';
import EDProgressLoader from '../components/EDProgressLoader';
import EDPlaceholderComponent from '../components/EDPlaceholderComponent';
import {changeCartButtonVisibility} from '../redux/actions/FloatingButton';
import EDThemeButton from '../components/EDThemeButton';
import {saveTermsAcceptedStatus} from '../redux/actions/User';
import {setIsTermsAndConditionsAccepted} from '../utils/AsyncStorageHelper';

class CMSContainer extends React.Component {
  //#region LIFE CYCLE METHODS

  /** CONSTRUCTOR */
  constructor(props) {
    super(props);
    this.title = '';
    this.fontSize = getProportionalFontSize(14);
    this.meta =
      '<head><meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0"></head>';
    this.customStyle =
      this.meta +
      '<style>* {max-width: 100%;} body {font-size:' +
      this.fontSize +
      ';}</style>';
    this.cmsSlug = '';
  }

  /** STATE */
  state = {
    isLoading: false,
    objWebViewContent: undefined,
    strErrorMessage: '',
    forSignUp: this.props.navigation.state.params.routeParams.forSignUp,
  };

  /** COMPONENT DID MOUNT */
  componentDidMount() {
    // this.getCMSContent();
  }

  onWillFocusCMSContainer = () => {
    // SHOW FLOATING CART BUTTON
    this.props.changeCartButtonVisibility({
      shouldShowFloatingButton: true,
      currentScreen: this.props,
    });
  };

  onDidFocusCMSContainer = () => {
    this.getCMSContent();
    // SHOW FLOATING CART BUTTON
    this.props.changeCartButtonVisibility({
      shouldShowFloatingButton: true,
      currentScreen: this.props,
    });
  };

  /** BACK BUTTON EVENTS */
  buttonBackPressed = () => {
    this.props.navigation.goBack();
  };
  //#region NETWORK METHODS

  /** RENDER FUNCTION */
  render() {
    // SCREEN TITLE
    this.title =
      this.props.navigation.state.params !== undefined &&
      this.props.navigation.state.params.routeParams !== undefined
        ? this.props.navigation.state.params.routeParams.screenName
        : 'About Us';
    return (
      <View
        pointerEvents={this.state.isLoading ? 'none' : 'auto'}
        style={styles.mainContainer}>
        <NavigationEvents
          onWillFocus={this.onWillFocusCMSContainer}
          onDidFocus={this.onDidFocusCMSContainer}
        />

        {/* THEME HEADER */}
        {/* {this.state.forSignUp !== true ?  */}
        <EDThemeHeader
          icon={this.state.forSignUp !== true ? 'menu' : ''}
          onLeftButtonPress={
            this.state.forSignUp !== true
              ? this.buttonMenuPressed
              : this.buttonBackPressed
          }
          title={this.title}
        />
        {/* : null } */}

        {this.state.isLoading ? (
          <EDProgressLoader />
        ) : this.state.objWebViewContent !== undefined ? (
          <SafeAreaView style={{flex: 1, backgroundColor: EDColors.white}}>
            <WebView
              source={{
                html:
                  this.customStyle + this.state.objWebViewContent.description,
              }}
              containerStyle={{flex: 1}}
              width={Metrics.screenWidth - 40}
              startInLoadingState={true}
              style={[
                styles.webView,
                {flex: 1, paddingBottom: this.props.cartCount > 0 ? 80 : 0},
              ]}
              //hasIframe={true}
              scrollEnabled={true}
            />
            {console.log(
              'this.props.isTermsAndConditionsAccepted => :: ',
              this.props.isTermsAndConditionsAccepted,
            )}
            {this.cmsSlug == 'terms-and-conditions' && this.props.isLoggedIn ? (
              <EDThemeButton
                textStyle={{
                  margin: 0,
                  fontSize: getProportionalFontSize(14),
                  color: EDColors.black,
                }}
                style={{
                  marginBottom: 10,
                  width: '30%',
                  height: '8%',
                  backgroundColor: EDColors.secondary,
                  borderRadius: 5,
                }}
                label={
                  this.props.isTermsAndConditionsAccepted
                    ? strings('buttonTitles.agreed')
                    : strings('buttonTitles.agree')
                }
                activeOpacity={
                  this.props.isTermsAndConditionsAccepted ? 1 : 0.8
                }
                onPress={
                  this.props.isTermsAndConditionsAccepted
                    ? undefined
                    : this.buttonAgreePressed
                }
              />
            ) : null}
          </SafeAreaView>
        ) : this.state.strErrorMessage.length > 0 ? (
          <EDPlaceholderComponent title={this.state.strErrorMessage} />
        ) : null}
      </View>
    );
  }

  /** CHECK IF PROPS ARE BEING UPDATED OR NOT */
  shouldComponentUpdate(nextProps, nextState) {
    // debugLog('SHOULD UPDATE' + '\n\n' + 'THIS PROPS ::: ' + JSON.stringify(this.props) + '\n\n' + 'NEW PROPS ::: ' + JSON.stringify(nextProps) + '\n\n' + 'NEXT STATE ::: ' + JSON.stringify(nextState));
    if (
      nextProps.navigation.state.params !== undefined &&
      nextProps.navigation.state.params.routeParams !== undefined &&
      this.props.navigation.state.params !== undefined &&
      this.props.navigation.state.params.routeParams !== undefined &&
      this.props.navigation.state.params.routeParams.cmsSlug !==
        nextProps.navigation.state.params.routeParams.cmsSlug
    ) {
      this.getCMSContent();
    }
    return true;
  }

  //#endregion

  //#region NETWORK
  /** FETCH CMS CONTENT API CALL */
  getCMSContent() {
    netStatus((status) => {
      if (status) {
        this.setState({
          isLoading: true,
          webViewContent: '',
          strErrorMessage: '',
        });
        let paramsGetCMS = {
          language_slug: this.props.lan,
          cms_slug:
            this.props.navigation.state.params.routeParams.cmsSlug || ABOUT_US,
        };
        this.cmsSlug = paramsGetCMS.cms_slug;
        getCMSPageDetails(
          paramsGetCMS,
          this.onSuccessCMSPage,
          this.onFailureCMSPage,
          this.props,
        );
      } else {
        showNoInternetAlert();
      }
    });
  }

  /**
   *
   * @param {The success response object parsed from CMS API response} objSuccess
   */
  onSuccessCMSPage = (objSuccess) => {
    if (
      objSuccess.data !== undefined &&
      objSuccess.data.cmsData !== undefined &&
      objSuccess.data.cmsData.length > 0
    ) {
      var cmsData = objSuccess.data.cmsData[0];
      this.setState({
        isLoading: false,
        strErrorMessage: '',
        objWebViewContent: cmsData,
      });
    } else {
      this.setState({isLoading: false, strErrorMessage: objSuccess.message});
    }
  };

  /**
   *
   * @param {The failure response object parsed from CMS API response} objFailure
   */
  onFailureCMSPage = (objFailure) => {
    this.setState({
      objWebViewContent: undefined,
      isLoading: false,
      strErrorMessage: objFailure.message,
    });
    // showDialogue(objFailure.message);
  };

  /** UPDATE T & C STATUS API CALL */
  updateTermsAndConditionsStatusOnServer() {
    netStatus((status) => {
      if (status) {
        this.setState({isLoading: true});
        let paramsUpdateTAndCStatus = {
          language_slug: this.props.lan,
          user_id: this.props.userDetails.UserID,
          tnc_status: true,
        };
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
  }

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
  };

  /**
   *
   * @param {The failure response object parsed from CMS API response} objFailure
   */
  onFailureTAndCUpdate = (objFailure) => {
    this.setState({isLoading: false});
    showDialogue(objFailure.message);
  };
  //#endregion

  //#region BUTTON EVENTS
  /** MENU BUTTON EVENT */
  buttonMenuPressed = () => {
    this.props.navigation.openDrawer();
  };

  /** AGREE BUTTON EVENT */
  buttonAgreePressed = () => {
    this.updateTermsAndConditionsStatusOnServer();
  };
  //#endregion
}

//#region CONNECT METHOD
export default connect(
  (state) => {
    return {
      lan: state.userOperations.lan,
      isTermsAndConditionsAccepted:
        state.userOperations.isTermsAndConditionsAccepted,
      cartCount:
        state.checkoutReducer !== undefined
          ? state.checkoutReducer.cartCount
          : 0,
      userDetails: state.userOperations.userDetails,
      isLoggedIn: state.userOperations.isLoggedIn,
    };
  },
  (dispatch) => {
    return {
      changeCartButtonVisibility: (data) => {
        dispatch(changeCartButtonVisibility(data));
      },
      saveTermsAndConditionsStatus: (dataToSave) => {
        dispatch(saveTermsAcceptedStatus(dataToSave));
      },
    };
  },
)(CMSContainer);
//#endregion

//#region STYLES
export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: EDColors.white,
  },
  webView: {
    flex: 1,
    margin: 20,
    alignSelf: 'center',
    borderRadius: 5,
    alignItems: 'center',
  },
});
//#endregion
