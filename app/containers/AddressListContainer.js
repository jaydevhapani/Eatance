import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Linking,
  Platform,
  Text,
} from 'react-native';
import {
  getAddressList,
  checkOrderDelivered,
  deleteAddress,
  checkOrderDelivery
} from '../utils/ServiceManager';
import { netStatus } from '../utils/NetworkStatusConnection';
import AddressComponent from '../components/AddressComponent';
import {
  debugLog,
  RESPONSE_SUCCESS,
  isRTLCheck,
  getProportionalFontSize,
} from '../utils/EDConstants';
import { EDColors } from '../utils/EDColors';
import EDRTLText from '../components/EDRTLText';
import EDRTLView from '../components/EDRTLView';
import { strings } from '../locales/i18n';
import { EDFonts } from '../utils/EDFontConstants';
import EDButton from '../components/EDButton';
import { showDialogue, showNoInternetAlert } from '../utils/EDAlert';
import { NavigationEvents } from 'react-navigation';
import BaseContainer from './BaseContainer';
import Assets from '../assets';
import { connect } from 'react-redux';
import { changeCartButtonVisibility } from '../redux/actions/FloatingButton';
import { checkLocationPermission } from '../utils/LocationServices';
import { PERMISSIONS } from 'react-native-permissions';
import EDPlaceholderComponent from '../components/EDPlaceholderComponent';
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button';
import Metrics from '../utils/metrics';

class AddressListContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.arrayOrderTypes = [
      { label: strings('addressNew.pickUp'), value: 0 },
      { label: strings('addressNew.delivery'), value: 1 },
      // { label: strings('addressNew.midDelivery'), value: 2 },

    ];
    this.arrayAddresses = [];
    this.isSelect = this.props.navigation.state.params.isSelectAddress;
    this.strOnScreenTitle = '';
    this.strOnScreenMessage = '';
    // SELECT PAYMENT OPTION
    this.paymentArray = [
      {
        label: strings('payment.cashOn'),
        value: 0,
      },
    ];
  }

  addressComponentRender = (item, index) => {
    debugLog("itemr ;;;", item)
    return (
      <AddressComponent
        data={item}
        isSelected={true}
        isViewOnly={true}

      />
    );
  };

  // #render Componets
  render() {
    return (
      <BaseContainer
        title={
          this.isSelect
            ? strings('addressNew.selectionAddress')
            : strings('addressNew.ourAddress')
        }
        left={'arrow-back'}
        onLeft={this.navigateToBack}
        loading={this.state.isLoading}
        onConnectionChangeHandler={this.onConnectionChangeHandler}>
        <View
          pointerEvents={this.state.isLoading ? 'none' : 'auto'}
          style={style.mainContainerStyle}>
          <NavigationEvents onDidFocus={this.onDidFocusEvent} />
          {this.isSelect ? (
            <View>
              <EDRTLText
                style={style.txtStyle}
                title={strings('addressNew.selectAddress')}
              />
              <RadioGroup
                color={EDColors.primary || EDColors.text}
                onSelect={this.onDeliveryHandler}
                style={[
                  style.radioContainer,
                  // eslint-disable-next-line react-native/no-inline-styles
                  { flexDirection: isRTLCheck() ? 'row-reverse' : 'row' },
                ]}
                selectedIndex={this.state.isDeliveryStatus}>
                {this.arrayOrderTypes.map(index => {
                  return (
                    <RadioButton
                      // eslint-disable-next-line react-native/no-inline-styles
                      style={{
                        flexDirection: isRTLCheck() ? 'row-reverse' : 'row',
                        alignItems:"flex-start"
                      }}
                      key={index.label}
                      value={index.label}>
                      <Text style={style.deliveryStatusText}>
                        {index.label}
                      </Text>
                    </RadioButton>
                  );
                })}
              </RadioGroup>
            </View>
          ) : null}
          <EDRTLView style={style.addView}>
            <EDRTLText
              style={style.titleText}
              title={strings('addressNew.title')}
            />

            {/* ADD ADDRESS */}
            <EDButton
              label={strings('addressNew.changeAddress')}
              style={style.btnStyle}
              textStyle={style.btnText}
              onPress={this.buttonAddAddressPressed}
            />
          </EDRTLView>

          {/* ADDRESS LIST */}
          {this.arrayAddresses !== undefined &&
            this.arrayAddresses.length > 0 ? (
              // <View style={style.parentFlex}>
              //   <FlatList
              //     style={style.flatView}
              //     data={this.arrayAddresses}
              //     keyExtractor={(item, index) => item + index}
              //     renderItem={this.addressComponentRender}
              //   />

              // </View>
              this.addressComponentRender(this.arrayAddresses[0], 0)
            ) : this.strOnScreenTitle.length > 0 ? (

              <EDRTLText title={strings("addressNew.noAddress")} style={[style.txtStyle, { color: EDColors.error }]} />

            ) : null}

          {this.isSelect ? 
            <EDRTLText
              style={[style.txtStyle, { marginTop: 10 }]}
              title={strings('payment.selectPayment')}
            /> 
          : null }
          {/* PAYMENT SELECTION */}
          {this.isSelect ? 
            <RadioGroup
              color={EDColors.primary || EDColors.text}
              onSelect={this.onPaymentHandler}
              style={[
                style.radioGroupStyle,
                // eslint-disable-next-line react-native/no-inline-styles
                { flexDirection: isRTLCheck() ? 'row-reverse' : 'row' },
              ]}
              selectedIndex={this.state.isPaymentStatus}>
              {this.paymentArray.map(index => {
                return (
                  <RadioButton
                    style={[
                      style.radioViewContainer,
                      // eslint-disable-next-line react-native/no-inline-styles
                      { flexDirection: isRTLCheck() ? 'row' : 'row-reverse' },
                    ]}
                    key={index.label}
                    value={index.label}>
                    <Text style={style.paymentMethodTxt}>{index.label}</Text>
                  </RadioButton>
                );
              })}
            </RadioGroup>
          : null }

        </View>
        {this.arrayAddresses !== undefined &&
          this.arrayAddresses.length > 0 ?
          <EDButton
            label={strings('addressNew.continue')}
            style={style.buttonStyle}
            onPress={this.navigateToCheckout}
          /> : null}
      </BaseContainer>
    );
  }

  //#endregion

  //#region STATE

  state = {
    isLoading: false,
    isDeliveryStatus: 0,
    selectedIndex: 0,
    isPaymentStatus: 0,
  };

  //#region BUTTON EVENTS
  buttonAddAddressPressed = () => {
    // this.navigateToMap('', 3);
    this.props.navigation.navigate(this.isSelect ? "detailedAddressListFromCart" : 'detailedAddressList', {
      isSelectAddress: true,
    })
  };
  //#endregion

  //#region NETWORK METHODS
  onConnectionChangeHandler = isConnected => {
    if (isConnected) {
      this.fetchAddressList();
    }
  };

  /**
   *
   * @param {The success response object} objSuccess
   */
  onAddressListSuccess = objSuccess => {
    debugLog('OBJ SUCCESS ADDRESSLIST:: ' + JSON.stringify(objSuccess));
    if (
      objSuccess.data.address !== undefined &&
      objSuccess.data.address.length > 0
    ) {
      this.arrayAddresses = objSuccess.data.address;
    } else {
      this.arrayAddresses = [];
      this.strOnScreenTitle = strings('addressNew.noAddressTitle');
      this.strOnScreenMessage = strings('addressNew.noAddressMessage');
    }

    this.setState({ isLoading: false });
  };

  onOrderDeliverySuccess = objSuccess => {
    debugLog('OBJ SUCCESS DRIVER AVAILABLITY:: ' + JSON.stringify(objSuccess));
    if (objSuccess.data.status === RESPONSE_SUCCESS) {
      this.props.navigation.navigate('checkout', {
        delivery_status: 'Delivery',
        latitude: this.arrayAddresses[this.state.selectedIndex].latitude,
        longitude: this.arrayAddresses[this.state.selectedIndex].longitude,
        address_id: this.arrayAddresses[this.state.selectedIndex].address_id,
        objSelectedAddress: this.arrayAddresses[this.state.selectedIndex]
      });

      // this.props.navigation.navigate('checkout', {
      //   delivery_status: 'Delivery',
      //   latitude: this.arrayAddresses[this.state.selectedIndex].latitude,
      //   longitude: this.arrayAddresses[this.state.selectedIndex].longitude,
      //   address_id: this.arrayAddresses[this.state.selectedIndex].address_id,
      // });
    } else {
      debugLog('Fail response :::::::::: ', objSuccess);
      showDialogue(objSuccess.data.message);
    }
    this.setState({ isLoading: false });
  };

  onAddressDeleteSuccess = objSuccess => {
    debugLog('OBJ SUCCESS ADDRESSLIST:: ' + JSON.stringify(objSuccess));
    this.fetchAddressList();
  };

  addressSelectionAction = index => {
    console.log('Index::::::::::::: ', index);
    this.setState({ selectedIndex: index });
  };

  /**
   *
   * @param {The failure response object} objFailure
   */
  onAddressListFailure = objFailure => {
    debugLog('OBJ FAILURE ADDRESSLIST :: ', objFailure);
    this.arrayAddresses = [];
    this.strOnScreenTitle = objFailure.message;
    this.setState({ isLoading: false });
  }

  onOrderDeliveryFailure = objFailure => {
    this.setState({ isLoading: false });
    showDialogue(objFailure.data.message);
  };

  onAddressDeleteFailure = () => {
    this.setState({ isLoading: false });
  };

  /**
   *
   * @param {The call API for get Address List}
   */
  fetchAddressList = () => {
    this.setState({ isLoading: true });
    netStatus(isConnected => {
      if (isConnected) {
        let objaddressListParams = {
          user_id: this.props.UserID,
          language_slug: this.props.lan,
          showonly_main: 1
        };

        getAddressList(
          objaddressListParams,
          this.onAddressListSuccess,
          this.onAddressListFailure,
          this.props,
        );
      } else {
        // showNoInternetAlert();
        this.strOnScreenTitle = strings('generalNew.noInternetTitle');
        this.strOnScreenMessage = strings('generalNew.noInternet');
        this.setState({ isLoading: false });
      }
    });
  };

  /**
   *
   * @param {The call API for delete Address}
   */
  deleteAddress = address_id => {
    netStatus(isConnected => {
      if (isConnected) {
        let objaddressdeleteParams = {
          language_slug: this.props.lan,
          user_id: this.props.UserID,
          address_id: address_id,
        };
        this.setState({ isLoading: true });
        deleteAddress(
          objaddressdeleteParams,
          this.onAddressDeleteSuccess,
          this.onAddressDeleteFailure,
          this.props,
        );
      } else {
        showNoInternetAlert();
      }
    });
  };

  /**
   *
   * @param {The call API for Check Delivery available}
   */
  checkDeliveryAPI = () => {
    netStatus(isConnected => {
      if (isConnected) {
        let objcheckDeliveryListParams = {
          language_slug: this.props.lan,
          user_id: this.props.UserID,
          order_delivery: 'Delivery',
          users_latitude: this.arrayAddresses[this.state.selectedIndex].latitude,
          users_longitude: this.arrayAddresses[this.state.selectedIndex].longitude,
          store_id: this.props.objStoreDetails.store_id,
          user_km: '',
          driver_km: ''
        };
        this.setState({ isLoading: true });
        checkOrderDelivery(
          objcheckDeliveryListParams,
          this.onOrderDeliverySuccess,
          this.onOrderDeliveryFailure,
          this.props,
        );
      }
    });
  };

  //# NAVIGATE TO CHECKOUT PAGE
  navigateToCheckout = () => {
    if (this.isSelect) {
      // if (this.state.selectedIndex !== -1) {
      if (this.state.isDeliveryStatus === 0) {
        this.props.navigation.navigate('checkout', {
          delivery_status: 'PickUp',
          latitude: this.arrayAddresses[this.state.selectedIndex].latitude,
          longitude: this.arrayAddresses[this.state.selectedIndex].longitude,
          address_id: this.arrayAddresses[this.state.selectedIndex]
            .address_id,
        });
      } else {
        this.checkDeliveryAPI();
      }
      // } else {
      //   showDialogue(strings('generalNew.addressSelectionValidation'));
      // }
    } else {
      this.props.navigation.goBack();
    }
  };

  //# NAVIGATE TO MAP
  navigateToMap = (item, value) => {
    netStatus(isConnected => {
      if (isConnected) {
        var paramPermission =
          Platform.OS === 'ios'
            ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
            : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
        checkLocationPermission(
          paramPermission,
          () => {
            switch (value) {
              case 1:
                this.props.navigation.navigate(
                  this.isSelect ? 'addressMapFromCart' : 'addressMap',
                  {
                    value: 1,
                    address_id: item,
                  },
                );
                break;

              case 2:
                let editData = {
                  addressId: item.address_id,
                  addressLine2: item.landmark,
                  addressLine1: item.address,
                  latitude: item.latitude,
                  longitude: item.longitude,
                  city: item.city,
                  zipCode: item.zipcode,
                  is_main: item.is_main
                };
                this.props.navigation.navigate(
                  this.isSelect ? 'addressMapFromCart' : 'addressMap',
                  {
                    value: 2,
                    getdata: editData,
                  },
                );
                break;
              case 3:
                this.props.navigation.navigate(
                  this.isSelect ? 'addressMapFromCart' : 'addressMap',
                  {
                    value: 3,
                  },
                );
                break;
            }
          },
          () => {
            showDialogue(
              strings('generalNew.locationPermission'),
              '',
              [{ text: strings('buttonTitles.cancel') }],
              () => {
                Linking.openURL('app-settings:');
              },
            );
          },
        );
      } else {
        showNoInternetAlert();
      }
    });
  };

  deleteHandler = address_id => {
    showDialogue(
      strings('addressNew.deleteAddress'),
      '',
      [{ text: strings('buttonTitles.cancel') }],
      () => {
        this.deleteAddress(address_id);
      },
    );
  };

  onDeliveryHandler = option => {
    this.setState({ isDeliveryStatus: option });
  };

  navigateToBack = () => {
    this.props.navigation.goBack();
  };

  onDidFocusEvent = () => {
    this.fetchAddressList();
    // this.props.changeCartButtonVisibility({
    //   shouldShowFloatingButton: false,
    //   currentScreen: this.props,
    // });
  };
}

export default connect(
  state => {
    return {
      UserID: state.userOperations.userDetails.UserID,
      lan: state.userOperations.lan,
      objStoreDetails: state.contentOperations.objStoreDetails || {}
    };
  },
  dispatch => {
    return {
      changeCartButtonVisibility: data => {
        dispatch(changeCartButtonVisibility(data));
      },
    };
  },
)(AddressListContainer);

const style = StyleSheet.create({
  placeholderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: EDColors.offWhite,
  },
  parentFlex: { flex: 1 },
  radioContainer: { marginHorizontal: 10, backgroundColor: EDColors.transparent },
  titleText: {
    color: EDColors.primary,
    fontSize: getProportionalFontSize(20),
    fontFamily: EDFonts.regular,
    marginLeft: 5,
    flex: 1,
  },
  btnStyle: {
    flex: 1,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 0,
  },
  btnText: { color: EDColors.white },
  txtStyle: {
    // flex: 1,
    padding: 10,
    fontFamily: EDFonts.regular,
    // margin: 10,
    color: EDColors.primary,
    fontSize: getProportionalFontSize(18),
  },
  deliveryStatusText: {
    fontFamily: EDFonts.regular,
    fontSize: getProportionalFontSize(14),
    marginRight: 5,
    maxWidth : Metrics.screenWidth * .25,
    marginTop: 3
  },
  buttonStyle: {
    alignSelf: 'center',
    marginVertical: 20,
    paddingHorizontal: 50,
    borderRadius: 30,
  },
  addView: {
    alignItems: 'center',
    padding: 10,
  },
  flatView: {
    flex: 1,
  },
  mainContainerStyle: {
    flex: 1,
  },
  radioViewContainer: {
    width: Metrics.screenWidth * 0.95,
    padding: 15,
    justifyContent: 'space-between',
    borderColor: EDColors.shadow,
    borderWidth: 1,
    shadowOpacity: 0.25,
    shadowRadius: 5,
    shadowColor: EDColors.text,
    shadowOffset: { height: 0, width: 0 },
    backgroundColor: EDColors.white,
  },
  paymentMethodTxt: {
    fontFamily: EDFonts.regular,
    fontSize: getProportionalFontSize(14),
    color: EDColors.textAccount,
  },
  radioGroupStyle: {
    marginHorizontal: 10,
    backgroundColor: EDColors.white,
    marginTop: 10,
  },
});
