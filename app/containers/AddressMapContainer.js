import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  AppState,
  Platform,
  TouchableOpacity,
} from 'react-native';
import Metrics from '../utils/metrics';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {getCurrentLocation, getAddress} from '../utils/LocationServiceManager';
import {addAddress} from '../utils/ServiceManager';
import EDRTLTextInput from '../components/EDRTLTextInput';
import {
  TextFieldTypes,
  debugLog,
  isRTLCheck,
  getProportionalFontSize,
} from '../utils/EDConstants';
import {strings} from '../locales/i18n';
import {EDColors} from '../utils/EDColors';
import EDButton from '../components/EDButton';
import {showDialogue, showNoInternetAlert} from '../utils/EDAlert';
import {netStatus} from '../utils/NetworkStatusConnection';
import {connect} from 'react-redux';
import BaseContainer from './BaseContainer';
import Assets from '../assets';
import {NavigationEvents} from 'react-navigation';
import {changeCartButtonVisibility} from '../redux/actions/FloatingButton';
import Validations from '../utils/Validations';
import {Icon} from 'react-native-elements';
import EDRTLText from '../components/EDRTLText';
import {EDFonts} from '../utils/EDFontConstants';

let {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0022;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class AddressMapContainer extends React.Component {
  //#region LIFE CYCLE METHODS
  constructor(props) {
    super(props);
    this.city = '';
    this.zipCode = '';
    this.nav_value = this.props.navigation.state.params.value;
    this.address_id = '';
    this.validationsHelper = new Validations();
  }

  toggleMain = () => {
    if (this.state.is_main == '1') this.setState({is_main: '0'});
    else this.setState({is_main: '1'});
  };

  render() {
    return (
      <BaseContainer
        title={strings('addressNew.selectAddress')}
        left={'arrow-back'}
        onLeft={this.navigateToBack}
        loading={this.state.isLoading}>
        <View
          pointerEvents={this.state.isLoading ? 'none' : 'auto'}
          style={style.mainContainer}>
          <NavigationEvents onWillFocus={this.onWillFocusEvent} />
          <ScrollView style={style.mainContainer}>
            <View style={style.subContainer}>
              <MapView
                provider={Platform.OS === 'ios' ? null : PROVIDER_GOOGLE}
                zoomControlEnabled={true}
                zoomEnabled={true}
                showsUserLocation={true}
                zoom={100}
                style={style.mapView}
                region={this.state.region}
                onRegionChangeComplete={(region) => this.setState({region})}
                onPress={this.onMapChangeHandler}>
                <Marker
                  coordinate={{
                    latitude: this.state.latitude,
                    longitude: this.state.longitude,
                  }}
                />
              </MapView>
            </View>

            {/* ADDRESS LINE 1 */}
            <EDRTLTextInput
              defaultValue={this.state.objRegistrationDetails.strAddress1}
              identifier={'strAddress1'}
              type={TextFieldTypes.default}
              placeholder={strings('addressNew.line1')}
              onChangeText={this.textFieldTextDidChangeHandler}
              errorFromScreen={
                this.state.shouldPerformValidation
                  ? this.validationsHelper.checkForEmpty(
                      this.state.objRegistrationDetails.strAddress1,
                      strings('addressNew.emptyAddressLine1'),
                    )
                  : ''
              }
            />

            {/* ADDRESS LINE 2 */}
            <EDRTLTextInput
              editableBox={false}
              initialValue={this.state.strAddress2}
              textToDisplay={this.state.strAddress2}
              multiline={true}
              type={TextFieldTypes.default}
              placeholder={strings('addressNew.line2')}
              enablesReturnKeyAutomatically={true}
              errorFromScreen={
                this.state.shouldPerformValidation
                  ? this.validationsHelper.checkForEmpty(
                      this.state.strAddress2,
                      strings('addressNew.emptyAddressLine2'),
                    )
                  : ''
              }
            />
            <TouchableOpacity
              disabled={this.state.is_default}
              style={{
                alignItems: 'center',
                marginVertical: 10,
                marginHorizontal: 20,
                flexDirection: isRTLCheck() ? 'row-reverse' : 'row',
              }}
              onPress={this.toggleMain}>
              <Icon
                name={
                  this.state.is_main == '1'
                    ? 'check-box'
                    : 'check-box-outline-blank'
                }
                color={EDColors.primary}
                size={23}
              />
              <EDRTLText
                title={strings('addressNew.default')}
                style={style.default}
              />
            </TouchableOpacity>

            <EDButton
              style={style.btnStyle}
              textStyle={style.btnText}
              label={strings('addressNew.save')}
              onPress={this.onAddressSave}
            />
          </ScrollView>
        </View>
      </BaseContainer>
    );
  }

  //#endregion

  //#region STATE

  state = {
    isLoading: false,
    latitude: 0.0,
    longitude: 0.0,
    region: {
      latitude: 0.0,
      longitude: 0.0,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    },
    objRegistrationDetails: {strAddress1: ''},
    strAddress2: '',
    appState: AppState.currentState,
    shouldPerformValidation: false,
    is_main: '0',
    is_default: false,
    totalCount: this.props.navigation.state.params.totalCount,
  };
  //#endregion

  componentDidMount() {
    debugLog(
      'TOTAL COUNT :::::',
      this.props.navigation.state.params.totalCount,
    );
    if (this.state.totalCount == 0)
      this.setState({is_main: '1', is_default: true});
    AppState.addEventListener('change', this._handleAppStateChange);
    this.viewUpdate();
  }
  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      debugLog('App has come to the foreground!');
      debugLog('get back result successs');
      this.viewUpdate();
    }
    this.setState({appState: nextAppState});
  };

  viewUpdate = () => {
    if (this.nav_value !== 2) {
      if (this.props.navigation.state.params.address_id !== undefined) {
        this.address_id = this.props.navigation.state.params.address_id;
      }
      this.getCurrentAddressLocation();
    } else {
      let addressData = this.props.navigation.state.params.getdata;
      this.city = addressData.city;
      this.zipCode = addressData.zipCode;
      this.address_id = addressData.addressId;
      this.state.objRegistrationDetails.strAddress1 = addressData.addressLine1;
      this.state.is_main = addressData.is_main;

      this.setState({
        region: {
          latitude: Number(addressData.latitude),
          longitude: Number(addressData.longitude),
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        },
        latitude: Number(addressData.latitude),
        longitude: Number(addressData.longitude),
        strAddress2: addressData.addressLine2,
      });
    }
  };

  //#region TEXT CHANGE EVENTS
  /**
   *
   * @param {Value of textfield whatever user type} value
   ** @param {Unique identifier for every text field} identifier
   */

  textFieldTextDidChangeHandler = (value, identifier) => {
    if (this.state.shouldPerformValidation) {
      this.setState({shouldPerformValidation: false});
    }
    this.state.objRegistrationDetails[identifier] = value.trim();
  };

  onFailureGetAddress = (onFailure) => {
    debugLog('Address Fail:::::::: ', onFailure);
  };

  onMapChangeHandler = (e) => {
    debugLog('coordinat ::::::::: ', e.nativeEvent);
    this.setState({
      region: {
        latitude: e.nativeEvent.coordinate.latitude,
        longitude: e.nativeEvent.coordinate.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      latitude: e.nativeEvent.coordinate.latitude,
      longitude: e.nativeEvent.coordinate.longitude,
      isLoading: true,
    });
    getAddress(
      e.nativeEvent.coordinate.latitude,
      e.nativeEvent.coordinate.longitude,
      (onSucces) => {
        debugLog('address Location :::::::::: ', onSucces);
        this.city = onSucces.city;
        this.zipCode = onSucces.zipCode;
        this.setState({
          strAddress2: onSucces.strAddress,
          isLoading: false,
        });
      },
      this.onFailureGetAddress,
      this.props.googleMapsAPIKey,
    );
  };

  //#region BUTTON EVENTS
  /**
   *
   * @param {Checking all conditions and redirect to Map screen on success}
   */

  onAddressSave = () => {
    this.setState({shouldPerformValidation: true});
    if (
      this.state.strAddress2.trim() !== '' &&
      this.state.objRegistrationDetails.strAddress1.trim() !== ''
    ) {
      this.callAddAddressAPI();
    } else {
      // showDialogue(strings("addressNew.addressValidation"))
    }
  };

  /**
   *
   * @param {The success response object} objSuccess
   */
  onaddAddressSuccess = (objSuccess) => {
    debugLog('OBJ SUCCESS ADDRESS :: ' + JSON.stringify(objSuccess));
    this.props.navigation.goBack();
    this.setState({isLoading: false});
  };

  /**
   *
   * @param {The success response object} objSuccess
   */
  onaddAddressFailure = (objFailure) => {
    this.setState({isLoading: false});
    debugLog('OBJ FAILURE ADDRESS :: ', objFailure);
    showDialogue(objFailure.message);
  };

  callAddAddressAPI = () => {
    netStatus((isConnected) => {
      if (isConnected) {
        let objaddAddressParams = {
          language_slug: this.props.lan,
          address: this.state.objRegistrationDetails.strAddress1,
          landmark: this.state.strAddress2,
          latitude: this.state.latitude,
          longitude: this.state.longitude,
          city: this.city,
          zipcode: this.zipCode,
          user_id: this.props.UserID,
          address_id: this.address_id,
          is_main: this.state.is_main,
        };
        this.setState({isLoading: true});
        addAddress(
          objaddAddressParams,
          this.onaddAddressSuccess,
          this.onaddAddressFailure,
          this.props,
        );
      } else {
        showNoInternetAlert();
      }
    });
  };

  getCurrentAddressLocation = () => {
    console.log('LATITUDE_DELTA ::: ', LATITUDE_DELTA);
    console.log('LONGITUDE_DELTA ::: ', LONGITUDE_DELTA);
    this.setState({
      isLoading: true,
    });
    getCurrentLocation(
      (onSucces) => {
        this.city = onSucces.address.city;
        this.zipCode = onSucces.address.zipCode;
        this.setState({
          region: {
            latitude: onSucces.latitude,
            longitude: onSucces.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          },
          latitude: onSucces.latitude,
          longitude: onSucces.longitude,
          strAddress2: onSucces.address.strAddress,
          isLoading: false,
        });
      },
      (onFailure) => {
        debugLog('getLocation Fail ::::::::::: ', onFailure);
        this.setState({isLoading: false});
        // showDialogue(onFailure.message);
        showDialogue(strings('addressNew.turnOnGps'));
      },
      this.props.googleMapsAPIKey,
    );
  };
  navigateToBack = () => {
    this.props.navigation.goBack();
  };

  onWillFocusEvent = () => {
    // this.props.changeCartButtonVisibility({ shouldShowFloatingButton: false, currentScreen: this.props });
  };
}

export default connect(
  (state) => {
    return {
      UserID: state.userOperations.userDetails.UserID,
      lan: state.userOperations.lan,
      objStoreDetails: state.contentOperations.objStoreDetails || {},
      googleMapsAPIKey: state.contentOperations.googleMapsAPIKey || '',
    };
  },
  (dispatch) => {
    return {
      changeCartButtonVisibility: (data) => {
        dispatch(changeCartButtonVisibility(data));
      },
    };
  },
)(AddressMapContainer);

const style = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: EDColors.white,
  },
  mapView: {
    height: Metrics.screenHeight / 2.2,
    borderColor: EDColors.primary,
    borderWidth: 1,
  },
  subContainer: {
    height: Metrics.screenHeight / 2,
    padding: 20,
  },
  btnStyle: {
    paddingHorizontal: 40,
    alignSelf: 'center',
    marginTop: 10,
  },
  btnText: {textAlign: 'center'},
  default: {
    fontFamily: EDFonts.regular,
    fontSize: getProportionalFontSize(14),
    color: EDColors.primary,
    flex: 1,
    marginHorizontal: 5,
  },
});
