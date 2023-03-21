import React from 'react';
import {View, TouchableOpacity, StyleSheet, Text, Image} from 'react-native';
import BaseContainer from './BaseContainer';
import {EDColors} from '../utils/EDColors';
import {EDFonts} from '../utils/EDFontConstants';
import EDRTLText from '../components/EDRTLText';
import {strings} from '../locales/i18n';
import Moment from 'moment';
import {
  isRTLCheck,
  debugLog,
  getProportionalFontSize,
  funGetFrench_Curr,
} from '../utils/EDConstants';
import {RadioButton, RadioGroup} from 'react-native-flexi-radio-button';
import {addOrder} from '../utils/ServiceManager';
import Metrics from '../utils/metrics';
import {netStatus} from '../utils/NetworkStatusConnection';
import {connect} from 'react-redux';
import {showDialogue, showNoInternetAlert} from '../utils/EDAlert';
import {clearCartData} from '../utils/AsyncStorageHelper';
import {saveCartDataInRedux, saveCartCount} from '../redux/actions/Checkout';
import CheckOutBottomComponent from '../components/CheckOutBottomComponent';
// import * as ImagePicker from 'react-native-image-picker';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const options = {
  noData: true,
  title: 'Take Picture',
  quality: 0.5,
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

class PaymentContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    // SELECT PAYMENT OPTION
    this.paymentArray = [
      {
        label: strings('payment.cashOn'),
        value: 0,
      },
    ];
  }

  prescriptionViewRender = () => {
    return (
      <View style={style.prescriptionView}>
        {this.state.prescriptionImageSource !== undefined ? (
          <Image
            style={[
              style.prescriptionImage,
              {
                marginTop: 0,
              },
            ]}
            source={{
              uri:
                this.state.prescriptionImageSource !== undefined &&
                this.state.prescriptionImageSource.uri !== undefined
                  ? this.state.prescriptionImageSource.uri
                  : '',
            }}
          />
        ) : null}

        {this.state.prescriptionImageSource == undefined ? (
          <TouchableOpacity
            style={{
              flexDirection: isRTLCheck() ? 'row-reverse' : 'row',
              marginTop:
                this.state.prescriptionImageSource !== undefined &&
                this.state.prescriptionImageSource.uri !== undefined
                  ? 20
                  : 0,
            }}
            onPress={this.buttonAddPrescriptionPressed}>
            <MaterialIcon
              size={20}
              color={EDColors.homeButtonColor}
              name={'note-add'}
            />
            <EDRTLText
              style={style.addPrescriptionText}
              title={
                this.state.prescriptionImageSource !== undefined &&
                this.state.prescriptionImageSource.uri !== undefined
                  ? strings('payment.updatePrescription')
                  : strings('payment.addPrescription')
              }
            />
          </TouchableOpacity>
        ) : null}
      </View>
    );
  };

  render() {
    return (
      <BaseContainer
        title={strings('payment.title')}
        left={'arrow-back'}
        onLeft={this.navigateToBack}
        loading={this.state.isLoading}>
        <View
          pointerEvents={this.state.isLoading ? 'none' : 'auto'}
          style={style.mainContainer}>
          <View
            pointerEvents={this.state.isLoading ? 'none' : 'auto'}
            style={style.mainContainer}>
            {/* PAYMENT SELECTION */}
            <RadioGroup
              color={EDColors.primary || EDColors.text}
              onSelect={this.onPaymentHandler}
              style={[
                style.radioGroupStyle,
                {flexDirection: isRTLCheck() ? 'row-reverse' : 'row'},
              ]}
              selectedIndex={this.state.isPaymentStatus}>
              {this.paymentArray.map((index) => {
                return (
                  <RadioButton
                    style={[
                      style.radioViewContainer,
                      {flexDirection: isRTLCheck() ? 'row' : 'row-reverse'},
                    ]}
                    key={index.label}
                    value={index.label}>
                    <Text style={style.txtStyle}>{index.label}</Text>
                  </RadioButton>
                );
              })}
            </RadioGroup>
            {/* PRESCRIPTION NOTE */}
            <EDRTLText
              style={style.prescriptionText}
              title={strings('payment.prescriptionInfo')}
              numberOfLines={3}
            />

            {/* PRESCRIPTION VIEW */}
            {this.prescriptionViewRender()}

            {this.state.prescriptionImageSource !== undefined ? (
              <TouchableOpacity
                style={{
                  alignSelf: 'center',
                  flexDirection: isRTLCheck() ? 'row-reverse' : 'row',
                  marginTop: 20,
                }}
                onPress={this.buttonAddPrescriptionPressed}>
                <MaterialIcon
                  size={20}
                  color={EDColors.homeButtonColor}
                  name={'note-add'}
                />
                {/* <Image style={style.addPrescriptionImage} source={Assets.prescription_Image} /> */}
                <EDRTLText
                  style={style.addPrescriptionText}
                  title={
                    this.state.prescriptionImageSource !== undefined &&
                    this.state.prescriptionImageSource.uri !== undefined
                      ? strings('payment.updatePrescription')
                      : strings('payment.addPrescription')
                  }
                />
              </TouchableOpacity>
            ) : null}
          </View>

          <CheckOutBottomComponent
            pointerEvents={this.state.isLoading ? 'none' : 'auto'}
            title={
              this.props.navigation.state.params.checkoutDetail !== undefined
                ? this.props.currencySymbol +
                  funGetFrench_Curr(
                    this.props.navigation.state.params.checkoutDetail.total,
                    1,
                    this.props.lan,
                  )
                : ''
            }
            onPress={this.placeOrderAction}
            label={strings('payment.checkout')}
          />
        </View>
      </BaseContainer>
    );
  }

  //#endregion

  //#region STATE
  state = {
    isLoading: false,
    value: 0,
    isPaymentStatus: 0,
    prescriptionImageSource: undefined,
  };

  componentDidMount() {}
  /**
   *
   * @param {Option of RadioGroup payment type} option
   */

  onPaymentHandler = (option) => {
    this.setState({isPaymentStatus: option});
  };

  /**
   *
   * @param {The success response object} objSuccess
   */
  onAddOrderSuccess = (objSuccess) => {
    clearCartData(
      () => {
        this.props.saveCartDataInRedux({});
        this.props.saveCartCount(0);
        this.props.navigation.navigate('thankYou');
        this.setState({
          isLoading: false,
        });
      },
      () => {
        this.setState({
          isLoading: false,
        });
      },
    );
  };

  /**
   *
   * @param {The success response object} objSuccess
   */
  onAddOrderFailure = (objFailure) => {
    this.setState({isLoading: false});
    showDialogue(objFailure.message);
  };

  /**
   *
   * @param {The call API for create a order}
   */

  addOrderData = () => {
    netStatus((isConnected) => {
      if (isConnected) {
        var objItems = {items: this.props.cartDetail.items};

        var objaddOrderParams =
          this.props.navigation.state.params.checkoutDetail;
        objaddOrderParams.items = objItems;
        objaddOrderParams.order_date = Moment(new Date()).format(
          'DD-MM-YYYY hh:mm A',
        );
        objaddOrderParams.image = this.state.prescriptionImageSource;

        this.setState({isLoading: true});
        addOrder(
          objaddOrderParams,
          this.onAddOrderSuccess,
          this.onAddOrderFailure,
          this.props,
        );
      } else {
        showNoInternetAlert();
      }
    });
  };

  // #NAVIGATION TO PLACE ORDER
  placeOrderAction = () => {
    if (this.state.isLoading) {
      return;
    }
    var repeatArray = this.props.cartDetail.items.filter((item) => {
      return item.prescription === '1';
    });

    this.state.prescriptionImageSource == undefined
      ? showDialogue(strings('payment.prescriptionMessage'))
      : this.addOrderData();
  };

  // #NAVIGATIO TO BACK CONTAINER
  navigateToBack = () => {
    this.props.navigation.goBack();
  };

  /** BUTTON EVENTS */
  buttonAddPrescriptionPressed = () => {
    launchImageLibrary(options, this.onImageSelectionHandler);
  };
  //#endregion

  //#region HELPER FUNCTIONS
  /**
   *
   * @param {The image response received from image picker} response
   */
  onImageSelectionHandler = (response) => {
    if (response.didCancel) {
      // debugLog('User cancelled image picker');
    } else if (response.error) {
      // debugLog('ImagePicker Error: ', response.error);
      showDialogue(response.error + '');
    } else if (response.customButton) {
      // debugLog('User tapped custom button: ', response.customButton);
    } else {
      this.setState({prescriptionImageSource: response});
    }
  };
}

export default connect(
  (state) => {
    return {
      cartDetail: state.checkoutReducer.cartDetails,
      currencySymbol: state.contentOperations.currencySymbol,
      lan: state.userOperations.lan,
    };
  },
  (dispatch) => {
    return {
      saveCartDataInRedux: (data) => {
        dispatch(saveCartDataInRedux(data));
      },
      saveCartCount: (data) => {
        dispatch(saveCartCount(data));
      },
    };
  },
)(PaymentContainer);

export const style = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: EDColors.offWhite,
    paddingTop: 10,
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
    shadowOffset: {height: 0, width: 0},
    backgroundColor: EDColors.white,
  },
  txtStyle: {
    fontFamily: EDFonts.regular,
    fontSize: getProportionalFontSize(14),
    color: EDColors.textAccount,
  },
  paymentSelectTxt: {
    marginTop: 10,
    padding: 15,
    backgroundColor: EDColors.white,
    fontFamily: EDFonts.bold,
    color: EDColors.primary,
    fontSize: getProportionalFontSize(20),
  },
  radioGroupStyle: {
    marginHorizontal: 10,
    backgroundColor: EDColors.white,
    marginTop: 10,
  },
  prescriptionText: {
    // flex:1,
    marginHorizontal: 15,
    marginTop: 20,
    marginBottom: 10,
    fontFamily: EDFonts.medium,
    paddingVertical: 15,
    color: EDColors.text,
    fontSize: getProportionalFontSize(14),
  },
  prescriptionImage: {
    width: '100%',
    height: Metrics.screenWidth * 0.45,
    borderRadius: 5,
    overflow: 'hidden',
  },
  addPrescriptionImage: {
    width: 20,
    height: 20,
    tintColor: EDColors.primary,
    marginHorizontal: 10,
  },
  addPrescriptionText: {
    color: EDColors.homeButtonColor,
    marginHorizontal: 5,
  },
  prescriptionView: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    // width: "95%",
    width: Metrics.screenWidth - 30,
    height: Metrics.screenWidth * 0.45,
    borderWidth: 1,
    backgroundColor: EDColors.white,
    borderColor: EDColors.shadow,
    borderRadius: 5,
    overflow: 'hidden',
  },
});
