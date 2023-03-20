import React from 'react';
import { View, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import BaseContainer from './BaseContainer';
import Assets from '../assets';
import { funGetFrench_Curr, getProportionalFontSize, debugLog } from '../utils/EDConstants';
import { connect } from 'react-redux';
import { saveNavigationSelection } from '../redux/actions/Navigation';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { strings } from '../locales/i18n';
import { EDColors } from '../utils/EDColors';
import { showDialogue } from '../utils/EDAlert';
import { EDFonts } from '../utils/EDFontConstants';
import {
    calculateOrderArrivalTime,
    getLatestLocationOfDriver,
} from '../utils/ServiceManager';
import Metrics from '../utils/metrics';
import EDRTLText from '../components/EDRTLText';
import TextViewLeftImage from '../components/TextViewLeftImage';
import EDRTLView from '../components/EDRTLView';
import EDImage from '../components/EDImage';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import ProductsList from '../components/ProductsList';
import EDPopupView from '../components/EDPopupView';

const LATITUDE_DELTA = 0.015;
const LONGITUDE_DELTA =
    LATITUDE_DELTA * (Metrics.screenWidth / Metrics.screenHeight);
const DRIVER_TRACKING_INTERVAL_IN_SECONDS = 10;
var timer;

const capitalize = s => {
    if (typeof s !== 'string') {
        return '';
    }
    return s.charAt(0).toUpperCase() + s.slice(1);
};

class TrackOrderContainer extends React.Component {
    //#region LIFE CYCLE MEHTHODS
    /** CONSTRUCTOR */
    constructor(props) {
        super(props);
        this.objOrderDetails =
            this.props.navigation.state.params !== undefined &&
                this.props.navigation.state.params.orderToTrack !== undefined
                ? this.props.navigation.state.params.orderToTrack
                : {};
        this.deliveryLatitude = parseFloat(this.objOrderDetails.user_latitude || 0);
        this.deliveryLongitude = parseFloat(
            this.objOrderDetails.user_longitude || 0,
        );
        this.storeLatitude = parseFloat(this.objOrderDetails.resLat || 0);
        this.storeLongitude = parseFloat(this.objOrderDetails.resLong || 0);
    }

    /** COMPONENT DID MOUNT */
    componentDidMount() {
        {this.objOrderDetails.driver.latitude != null ? 
        this.state.driverLatitude = parseFloat(
            this.objOrderDetails.driver.latitude,
        ) : null }
        {this.objOrderDetails.driver.longitude != null ?
        this.state.driverLongitude = parseFloat(
            this.objOrderDetails.driver.longitude,
        ) : null }

        this.getOrderArrivalTime(
            this.deliveryLatitude,
            this.deliveryLongitude,
            this.state.driverLatitude == 0 && this.state.driverLatitude == "" && this.state.driverLatitude == null && this.state.driverLatitude == undefined
                ? this.storeLatitude
                : this.state.driverLatitude,
            this.state.driverLongitude == 0 && this.state.driverLongitude == "" && this.state.driverLongitude == null && this.state.driverLongitude == undefined
                ? this.storeLongitude
                : this.state.driverLongitude,
        );
        timer = setInterval(
            this.getDriverLocationUpdates,
            DRIVER_TRACKING_INTERVAL_IN_SECONDS * 1000,
        );
    }

    /** COMPONENT WILL UNMOUNT */
    componentWillUnmount() {
        clearInterval(timer);
    }

    //#endregion

    //#region STATE
    state = {
        isProductsListVisible: false,
        isLoading: false,
        isOrderedPickedUp: false,
        driverLatitude: 0.0,
        driverLongitude: 0.0,
        region: {
            latitude: 0,
            longitude: 0,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
        },
        distance: 0,
        coords: [],
    };
    //#endregion

    //#region NETWORK METHODS
    onSuccessGetLatestDriverLocation = objSuccess => {
        debugLog("DRIVER COORDINATES ::::::", objSuccess)
        if (objSuccess.data !== undefined && objSuccess.data.detail !== undefined) {
            var objDriverLocation = objSuccess.data.detail;
            this.getOrderArrivalTime(
                this.deliveryLatitude,
                this.deliveryLongitude,
                parseFloat(objDriverLocation.driverLatitude),
                parseFloat(objDriverLocation.driverLongitude),
            );
            if(objDriverLocation.driverLatitude != null && objDriverLocation.driverLongitude != null){
            this.setState({
                driverLatitude: parseFloat(objDriverLocation.driverLatitude),
                driverLongitude: parseFloat(objDriverLocation.driverLongitude),
            });
            }
        }
    };

    onFailureGetLatestDriverLocation = objFailure => {
        showDialogue(
            'Unable to get driver location :: ' + (objFailure.message || ''),
        );
    };

    /** GET DRIVER LOCATION EVERY DRIVER_TRACKING_INTERVAL_IN_SECONDS */
    getDriverLocationUpdates = () => {
        let paramsGetDriverLocation = {
            user_id: this.props.userDetails.UserID,
            order_id: this.objOrderDetails.order_id,
        };
        getLatestLocationOfDriver(
            paramsGetDriverLocation,
            this.onSuccessGetLatestDriverLocation,
            this.onFailureGetLatestDriverLocation,
            this.props,
        );
    };
    //#endregion

    /** CALCULATE ORDER ARRIVAL TIME */
    onSuccessCalculateOrderArrivalTime = objSuccess => {
        if (
            objSuccess.data !== undefined &&
            objSuccess.data.routes !== undefined &&
            objSuccess.data.routes instanceof Array
        ) {
            var arrayRoutes = objSuccess.data.routes || [];
            if (arrayRoutes.length > 0) {
                var legsArray = arrayRoutes[0].legs || [];

                // if (!this.state.isOrderedPickedUp) {
                if (legsArray.length > 0) {
                    this.setState({
                        isOrderedPickedUp: true,
                        isLoading: false,
                        distance: legsArray[0].duration.text,
                        coords: this.decode(arrayRoutes[0].overview_polyline.points),
                    });
                }
                // } else {
                //     if (legsArray.length > 0) {
                //         this.setState({
                //             distance: arrayRoutes[0].legs[0].duration.text
                //         })
                //     }
                // }
            }
        }
    };

    onFailureCalculateOrderArrivalTime = () => { };

    getOrderArrivalTime = (
        sourceLat,
        sourceLong,
        destinationLat,
        destinationLong,
    ) => {
        let objGetOrderArrivalTimeParams = {
            sourceLatitude: sourceLat,
            sourceLongitude: sourceLong,
            destinationLatitude: destinationLat,
            destinationLongitude: destinationLong,
        };
        calculateOrderArrivalTime(
            objGetOrderArrivalTimeParams,
            this.onSuccessCalculateOrderArrivalTime,
            this.onFailureCalculateOrderArrivalTime,
            this.props,
            this.props.googleMapsAPIKey,
        );
    };

    decode = (t, e) => {
        for (
            var n,
            o,
            u = 0,
            l = 0,
            r = 0,
            d = [],
            h = 0,
            i = 0,
            a = null,
            c = Math.pow(10, e || 5);
            u < t.length;

        ) {
            (a = null), (h = 0), (i = 0);
            do {
                (a = t.charCodeAt(u++) - 63), (i |= (31 & a) << h), (h += 5);
            } while (a >= 32);
            (n = 1 & i ? ~(i >> 1) : i >> 1), (h = i = 0);
            do {
                (a = t.charCodeAt(u++) - 63), (i |= (31 & a) << h), (h += 5);
            } while (a >= 32);
            (o = 1 & i ? ~(i >> 1) : i >> 1),
                (l += n),
                (r += o),
                d.push([l / c, r / c]);
        }
        return (d = d.map(function (t) {
            return { latitude: t[0], longitude: t[1] };
        }));
    };

    connectToCall = () => {
        if (
            this.objOrderDetails.driver.mobile_number == undefined ||
            this.objOrderDetails.driver.mobile_number == null ||
            this.objOrderDetails.driver.mobile_number.trim().length == 0
        ) {
            return;
        }

        if (
            this.objOrderDetails.driver.mobile_number !== undefined &&
            this.objOrderDetails.driver.mobile_number.trim().length > 0
        ) {
            const strCallURL = 'tel:' + this.objOrderDetails.driver.mobile_number;
            if (Linking.canOpenURL(strCallURL)) {
                Linking.openURL(strCallURL).catch(error => {
                    showDialogue('generalNew.canNotDial');
                });
            } else {
                showDialogue('generalNew.canNotDial');
            }
        }
    };

    renderOrderDetails() {
        return (
            <View style={styles.mainView}>
                <EDRTLText
                    title={strings('ordersNew.id') + this.objOrderDetails.order_id}
                    style={styles.orderNumber}
                />

                <EDRTLView style={styles.orderDetailsContainer}>
                    <View style={styles.orderDetailsChildContainer}>
                        {/* DRIVER NAME */}
                        {this.objOrderDetails.driver !== undefined ? (
                            <TextViewLeftImage
                                type={"font-awesome"}
                                imageStyle={styles.imageStyle}
                                style={styles.driverName}
                                image={"motorcycle"}
                                title={
                                    capitalize(
                                        (
                                            this.objOrderDetails.driver.first_name || ''
                                        ).toLowerCase(),
                                    ) + strings('orderDetailsNew.willDeliver')
                                }
                                lines={0}
                            />
                        ) : null}
                        {/* DISTANCE */}
                        <TextViewLeftImage
                            imageStyle={styles.imageStyle}
                            style={styles.driverName}
                            image={'timer'}
                            // image={Assets.time}
                            title={
                                strings('orderDetailsNew.arrivingIn') +
                                (this.state.distance || '')
                            }
                            lines={0}
                        />

                        {/* AMOUNT */}
                        <EDRTLText
                            title={
                                strings('orderDetailsNew.payAmount') +
                                this.objOrderDetails.currency_symbol +
                                funGetFrench_Curr(
                                    this.objOrderDetails.total,
                                    1,
                                    this.props.lan
                                )
                            }
                            style={styles.orderAmount}
                        />
                    </View>

                    <View style={styles.driverImageParentContainer}>
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={this.connectToCall}
                            style={styles.driverImageContainer}>
                            <EDImage
                                style={styles.driverImage}
                                source={
                                    this.objOrderDetails.driver !== undefined
                                        ? this.objOrderDetails.driver.image || ''
                                        : ''
                                }
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={this.connectToCall}
                            style={{
                                position: 'absolute',
                                height: 28,
                                width: 28,
                                right: 5,
                                bottom: 0,
                                backgroundColor: EDColors.primary,
                                borderRadius: 15,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                            <MaterialIcon size={20} color={EDColors.white} name="call" />
                        </TouchableOpacity>

                    </View>
                </EDRTLView>

            </View>
        );
    }

    render() {
        return (
            <BaseContainer
                title={strings('orderDetailsNew.title')}
                left={'arrow-back'}
                onLeft={this.buttonBackPressed}
                right={this.objOrderDetails !== undefined && this.objOrderDetails.items !== undefined ? 'shopping-cart' : undefined}
                onRight={this.buttonPharmaBagPressed}
                loading={this.state.isLoading}
                backgroundColor={EDColors.white}>
                {this.renderProductsList()}
                <View
                    pointerEvents={this.state.isLoading ? 'none' : 'auto'}
                    style={{ flex: 1, backgroundColor: EDColors.white }}>
                    <MapView
                        style={{
                            flex: 1,
                            width: Metrics.screenWidth - 40,
                            marginVertical: 10,
                            alignSelf: 'center',
                        }}
                        region={{
                            latitude: this.state.driverLatitude,
                            longitude: this.state.driverLongitude,
                            latitudeDelta: LATITUDE_DELTA,
                            longitudeDelta: LONGITUDE_DELTA,
                        }}>
                        {/* DESTINATION PIN */}
                        <Marker
                            coordinate={{
                                latitude: this.deliveryLatitude,
                                longitude: this.deliveryLongitude,
                            }}
                            pinColor={EDColors.primary}
                            image={Assets.destination}
                        />

                        {/* DRIVER PIN */}
                        {this.state.driverLatitude !== 0 && this.state.driverLatitude != null ? (
                            <Marker
                                coordinate={{
                                    latitude: this.state.driverLatitude,
                                    longitude: this.state.driverLongitude,
                                }}
                                pinColor={EDColors.primary}
                                image={Assets.driver}
                            />
                        ) : null}

                        {/* DRAW POLYLINE */}
                        {this.state.storeLatitude !== 0 ? (
                            <Polyline
                                coordinates={[...this.state.coords]}
                                strokeColor={EDColors.primary}
                                strokeWidth={2}
                                geodesic={true}
                            />
                        ) : null}

                        {/* STORE PIN */}
                        {this.storeLatitude !== 0 ? (
                            <Marker
                                coordinate={{
                                    latitude: this.storeLatitude,
                                    longitude: this.storeLongitude,
                                }}
                                image={Assets.store}
                                pinColor={EDColors.primary}
                            />
                        ) : null}
                    </MapView>
                    {this.renderOrderDetails()}
                </View>
            </BaseContainer>
        );
    }

    //#region BUTTON EVENTS
    /** BACK BUTTON EVENT */
    buttonBackPressed = () => {
        this.props.navigation.goBack();
    };

    buttonPharmaBagPressed = () => {
        this.setState({ isProductsListVisible: true });
    };
    //#endregion

    //#region HELPER METHODS
    renderProductsList = () => {
        return (
            <EDPopupView isModalVisible={this.state.isProductsListVisible}>
                <ProductsList
                    currencySymbol={this.props.currencySymbol}
                    orderDetails={this.objOrderDetails}
                    lan={this.props.lan}
                    dismissProductsListHandler={this.dismissProductsListHandler}
                />
            </EDPopupView>
        );
    };

    dismissProductsListHandler = () => {
        this.setState({ isProductsListVisible: false });
    };

    onDismissCancellationReasonDialogueHandler = reason => {
        this.setState({ isProductsListVisible: false });
        showDialogue(reason);
    };
    //#endregion
}

//#region STYLES
const styles = StyleSheet.create({
    mainView: {
        margin: 20,
        marginTop: 0,
        width: Metrics.screenWidth - 40,
        alignSelf: 'center',
        borderColor: EDColors.shadow,
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: EDColors.white,
        shadowOpacity: 0.25,
        shadowRadius: 5,
        shadowColor: EDColors.text,
        shadowOffset: { height: 0, width: 0 },
    },
    imageStyle: {
        // width: 30,
        height: 20,
        tintColor: EDColors.primary,
    },
    driverImage: {
        width: (Metrics.screenWidth - 40) * 0.25,
        height: (Metrics.screenWidth - 40) * 0.25,
        borderRadius: ((Metrics.screenWidth - 40) * 0.25) / 2,
        overflow: 'hidden',
    },
    driverImageParentContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        width: (Metrics.screenWidth - 40) * 0.25,
        height: (Metrics.screenWidth - 40) * 0.25,
        // borderColor: 'brown',
        // borderWidth: 1
    },
    driverImageContainer: {
        width: (Metrics.screenWidth - 40) * 0.25,
        height: (Metrics.screenWidth - 40) * 0.25,
        borderRadius: ((Metrics.screenWidth - 40) * 0.25) / 2,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        marginHorizontal: 5,
        backgroundColor: EDColors.offWhite,
        alignSelf: 'center',
    },
    orderNumber: {
        padding: 15,
        fontSize: getProportionalFontSize(16),
        fontFamily: EDFonts.bold,
        backgroundColor: EDColors.offWhite,
        color: EDColors.textAccount,
    },
    orderDetailsContainer: {
        // borderColor: 'red',
        // borderWidth: 1,
        paddingHorizontal: 10,
    },
    orderDetailsChildContainer: {
        flex: 1,
        marginHorizontal: 5,
        // borderColor: 'green',
        // borderWidth: 1
    },
    driverName: { marginVertical: 10 },
    orderAmount: {
        fontSize: getProportionalFontSize(14),
        fontFamily: EDFonts.bold,
        color: EDColors.textAccount,
        margin: 10,
    },
});
//#endregion

export default connect(
    state => {
        return {
            lan: state.userOperations.lan,
            titleSelected: state.navigationReducer.selectedItem,
            userDetails: state.userOperations.userDetails || {},
            token: state.userOperations.phoneNumberInRedux,
            currencySymbol: state.contentOperations.currencySymbol || '',
            googleMapsAPIKey: state.contentOperations.googleMapsAPIKey || '',
        };
    },
    dispatch => {
        return {
            saveNavigationSelection: dataToSave => {
                dispatch(saveNavigationSelection(dataToSave));
            },
        };
    },
)(TrackOrderContainer);
