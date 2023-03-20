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
    getTimeSlots,
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
import StandardDeliveryComponent from '../components/StandardDeliveryComponent';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import EDDatePicker from '../components/EDDatePicker';
import EDDropdown from '../components/EDDropdown';
import CategorySelectionList from '../components/CategorySelectionList';
import CheckOutBottomComponent from '../components/CheckOutBottomComponent';
import { saveCartDataInRedux } from '../redux/actions/Checkout';
import { saveCartData } from '../utils/AsyncStorageHelper';

class ScheduleDeliveryContainer extends React.PureComponent {
    /** CONSTRUCTOR */
    constructor(props) {
        super(props);
        this.objSelectedAddress = this.props.navigation.state !== undefined && this.props.navigation.state.params !== undefined
            ? this.props.navigation.state.params.objSelectedAddress || undefined
            : undefined;
        this.latitudeToPass = this.props.navigation.state !== undefined && this.props.navigation.state.params !== undefined
            ? this.props.navigation.state.params.latitude || undefined
            : undefined;
        this.longitudeToPass = this.props.navigation.state !== undefined && this.props.navigation.state.params !== undefined
            ? this.props.navigation.state.params.longitude || undefined
            : undefined;
        this.addressIdToPass = this.props.navigation.state !== undefined && this.props.navigation.state.params !== undefined
            ? this.props.navigation.state.params.address_id || undefined
            : undefined;

        this.arrayTimeSlotsForPicker = [
            // {
            //     name: '10:00 AM - 01:00 PM',
            //     entity_id: 1,
            // },
            // {
            //     name: '02:00 PM - 04:00 PM',
            //     entity_id: 2,
            // },
            // {
            //     name: '06:00 PM - 08:00 PM',
            //     entity_id: 3,
            // },
        ];
        this.objCartDetails = this.props.cartDetail || {};
        this.objStoreDetails = this.props.objStoreDetails || {};
        this.strOnScreenTitle = '';
        this.strOnScreenSubtitle = '';
        this.objStandardTimeSlot = undefined;
    }

    /** NAVIGATION EVENTS METHODS */
    onDidFocusEvent = () => {
        debugLog('OBJ STORE DETAILS :: ', this.objStoreDetails);
        this.callTimeSlotsAPI();
    };

    // #render Componets
    render() {
        return (
            <BaseContainer
                title={strings('scheduleDeliveryNew.title')}
                left={'arrow-back'}
                onLeft={this.buttonBackPressed}
                loading={this.state.isLoading}
                onConnectionChangeHandler={this.onConnectionChangeHandler}>

                {this.strOnScreenTitle !== undefined && this.strOnScreenTitle.trim().length > 0
                    ? <View style={style.parentFlex}>
                        <EDPlaceholderComponent
                            title={this.strOnScreenTitle}
                            subTitle={this.strOnScreenSubtitle}
                        />
                    </View>
                    : null}


                <KeyboardAwareScrollView
                    enableResetScrollToCoords={true}
                    bounces={false}
                    keyboardShouldPersistTaps="always"
                    behavior="padding"
                >

                    {/* NAVIGATION EVENTS */}
                    <NavigationEvents onDidFocus={this.onDidFocusEvent} />

                    {/* PARENT CONTAINER */}
                    <View pointerEvents={this.state.isLoading ? 'none' : 'auto'}
                        style={style.mainContainerStyle}>

                        <View style={{}}>


                            {/* DELIVERY ADDRESS TEXT */}
                            <EDRTLText
                                style={style.txtStyle}
                                title={strings('scheduleDeliveryNew.deliveryAddress')} />

                            {/* SELECTED ADDRESS */}
                            {this.objSelectedAddress !== undefined
                                ? <AddressComponent
                                    isViewOnly={true}
                                    data={this.objSelectedAddress}
                                    isSelected={false} />
                                : null}

                            {/* STANDARD DELIVERY SLOT */}
                            {this.objStandardTimeSlot !== undefined ? <StandardDeliveryComponent title={this.objStandardTimeSlot.name} /> : null}

                            {/* WHEN TO DELIVER TEXT */}
                            <EDRTLText
                                style={style.txtStyle}
                                title={strings('scheduleDeliveryNew.whenToDeliver')} />

                            {/* DATE SELECTION */}
                            <EDDatePicker
                                onDateChange={this.onDateChange}
                                placeholder={strings('scheduleDeliveryNew.selectDate')}
                                minDate={new Date()}
                                initialValue={this.state.selectedDeliveryDate}
                                errorFromScreen={''}
                            />

                            {/* TIME-SLOT SELECTION */}
                            <EDRTLText
                                style={{ color: EDColors.text, flex: 1, margin: 10, marginBottom: 0 }}
                                title={strings('scheduleDeliveryNew.selectTime')} />

                            {/* CATEGORIES & SUB-CATEGORIES SELECTION LIST */}
                            <CategorySelectionList
                                arraySelectedCategoryIDs={[]}
                                isSingleSelection={true}
                                arrayCategories={this.arrayTimeSlotsForPicker}
                                onSelectionChangeHandler={this.onTimeSlotSelectionChange} />

                        </View>

                    </View>
                </KeyboardAwareScrollView>

                <CheckOutBottomComponent
                    style={style.bottomComponent}
                    onPress={this.buttonContinuePressed}
                    label={strings('cartNew.continue')}
                />

            </BaseContainer>
        );
    }

    //#endregion

    //#region STATE

    state = {
        isLoading: false,
        selectedDeliveryDate: new Date(),
        selectedTimeSlot: undefined
    };

    //#region HELPER METHODS
    onDateChange = (selectedDate, identifier) => {
        this.setState({ selectedDeliveryDate: selectedDate });
        this.objCartDetails.order_date = selectedDate;
        this.props.saveCartDataInRedux(this.objCartDetails);
        saveCartData(this.objCartDetails, () => { }, () => { });
    }

    /** arrSelectedSlots will contain an array of single time slot object selected by the user. If the selected one is deselected, then isSelected will be false */
    onTimeSlotSelectionChange = (arrSelectedSlots, isTimeSlotSelected) => {
        debugLog('TIME SLOT SELECTION DATA :: ', arrSelectedSlots);
        if (isTimeSlotSelected) {
            this.setState({ selectedTimeSlot: this.arrayTimeSlotsForPicker[arrSelectedSlots[0]] })
            this.objCartDetails.time_slot = this.arrayTimeSlotsForPicker[arrSelectedSlots[0]];
            this.props.saveCartDataInRedux(this.objCartDetails);
            saveCartData(this.objCartDetails, () => { }, () => { });
        } else {
            this.setState({ selectedTimeSlot: undefined })
            this.objCartDetails.time_slot = '';
            this.props.saveCartDataInRedux(this.objCartDetails);
            saveCartData(this.objCartDetails, () => { }, () => { });
        }
    }
    //#endregion

    //#region BUTTON EVENTS
    buttonBackPressed = () => {
        this.props.navigation.goBack();
    };

    buttonContinuePressed = () => {
        if (this.state.selectedDeliveryDate == undefined || this.state.selectedDeliveryDate == null) {
            showDialogue('Please select the delivery date');
            return;
        }

        if (this.state.selectedTimeSlot == undefined || this.state.selectedTimeSlot == null) {
            showDialogue('Please select the delivery time slot');
            return;
        }

        this.props.navigation.navigate('checkout', {
            delivery_status: 'Delivery',
            latitude: this.latitudeToPass,
            longitude: this.longitudeToPass,
            address_id: this.addressIdToPass,
            selectedDate: this.state.selectedDeliveryDate,
            selectedTimeSlot: this.state.selectedTimeSlot
        });
    }
    //#endregion

    //#region NETWORK METHODS
    onConnectionChangeHandler = isConnected => {
        if (isConnected) {
        }
    };

    /**
     *
     * @param {The success response object} objSuccess
     */
    onTimeSlotSuccess = objSuccess => {
        debugLog('onTimeSlotSuccess :: ', objSuccess);

        if (this.arrayTimeSlotsForPicker === undefined) {
            this.arrayTimeSlotsForPicker = [];
        }

        if (
            objSuccess.data.time_slots !== undefined &&
            objSuccess.data.time_slots.length > 0
        ) {
            var arrTimeSlots = objSuccess.data.time_slots;
            this.arrayTimeSlotsForPicker = arrTimeSlots.map((itemToIterate, index) => { return { entity_id: index, name: itemToIterate.time, standard_delivery: itemToIterate.standard_delivery } });

            var arrStandardTimeSlots = this.arrayTimeSlotsForPicker.filter(timeSlotToIterate => timeSlotToIterate.standard_delivery == '1');
            if (arrStandardTimeSlots instanceof Array && arrStandardTimeSlots !== undefined && arrStandardTimeSlots.length > 0) {
                this.objStandardTimeSlot = arrStandardTimeSlots[0];
            }
        }

        debugLog('this.arrayTimeSlotsForPicker :: ', this.arrayTimeSlotsForPicker);
        this.setState({ isLoading: false });
    };

    /**
     *
     * @param {The failure response object} objFailure
     */
    onTimeSlotFailure = objFailure => {
        this.strOnScreenTitle = objFailure.message;
        this.strOnScreenSubtitle = '';
        this.setState({ isLoading: false });
        debugLog('onTimeSlotFailure :: ' + JSON.stringify(objFailure));
    };

    /** REQUEST GET BRANDS */
    /**
     *
     * @param {Check if it is pull-to-refresh event call or normal call and show loader accordingly} isForRefresh
     */
    callTimeSlotsAPI = (isForRefresh = false) => {
        this.strOnScreenTitle = '';
        this.strOnScreenSubtitle = '';
        netStatus(isConnected => {
            if (isConnected) {
                let objGetTimeSlotsParams = {
                    language_slug: this.props.lan,
                    store_content_id: this.objStoreDetails.store_content_id
                };
                if (!isForRefresh) {
                    this.setState({ isLoading: true });
                }
                getTimeSlots(
                    objGetTimeSlotsParams,
                    this.onTimeSlotSuccess,
                    this.onTimeSlotFailure,
                    this.props,
                );
            } else {
                debugLog('HERE NO INTERNET');
                this.strOnScreenTitle = strings('generalNew.noInternetTitle');
                this.strOnScreenSubtitle = strings('generalNew.noInternet');
                this.setState({ isLoading: false });
            }
        });
    };
    //#endregion
}

export default connect(
    state => {
        return {
            UserID: state.userOperations.userDetails.UserID,
            lan: state.userOperations.lan,
            cartDetail: state.checkoutReducer.cartDetails || {},
            objStoreDetails: state.contentOperations.objStoreDetails,
        };
    },
    dispatch => {
        return {
            changeCartButtonVisibility: data => {
                dispatch(changeCartButtonVisibility(data));
            },
            saveCartDataInRedux: data => {
                dispatch(saveCartDataInRedux(data));
            },
        };
    },
)(ScheduleDeliveryContainer);

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
        fontFamily: EDFonts.semiBold,
        // margin: 10,
        color: EDColors.textAccount,
        fontSize: getProportionalFontSize(18),
    },
    deliveryStatusText: {
        fontFamily: EDFonts.regular,
        fontSize: getProportionalFontSize(14),
        marginRight: 5,
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
        padding: 5,
        flex: 1,
        justifyContent: 'flex-end',
    },
    bottomComponent: { justifyContent: 'center' },
});
