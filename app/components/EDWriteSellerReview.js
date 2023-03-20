/* eslint-disable react-native/no-inline-styles */
/* eslint-disable semi */
/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import { EDColors } from '../utils/EDColors'
import { EDFonts } from '../utils/EDFontConstants'
import { strings } from '../locales/i18n';
import { getProportionalFontSize, isRTLCheck, TextFieldTypes } from '../utils/EDConstants';
import { View, StyleSheet, Platform, Image, ScrollView } from 'react-native';
import EDRTLText from './EDRTLText';
import EDRTLView from './EDRTLView';
import Metrics from '../utils/metrics';
import { Icon } from 'react-native-elements'
import StarRating from "react-native-star-rating";
import EDRTLTextInput from './EDRTLTextInput';
import EDThemeButton from './EDThemeButton';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { showNoInternetAlert, showDialogue } from '../utils/EDAlert';
import Validations from '../utils/Validations';
import { netStatus } from '../utils/NetworkStatusConnection'
import { addOrderReview } from '../utils/ServiceManager';
import Assets from '../assets';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';


export default class EDWriteSellerReview extends Component {

    /** CONSTRUCTOR */
    constructor(props) {
        super(props);
        this.validationsHelper = new Validations()
    }

    state = {
        selectedOrderRating: 0,
        selectedQualityRating: 1,
        selectedDriverRating: 0,
        shouldPerformValidation: false,
        isLoading: false,
        objReviewDetails: { orderRemarks: '', driverRemarks: '' },
        deliveryFlag : this.props.delivery_flag || 'pickup',
        store_id: this.props.store_id,
        user_id: this.props.user_id,
        driver_id: this.props.driver_id,
        order_id: this.props.order_id
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
                <View pointerEvents={this.state.isLoading ? 'none' : 'auto'} style={styles.parentContainer}>
                    <EDRTLView style={{ justifyContent: 'space-between', marginTop: 10, paddingBottm: getStatusBarHeight() }}>
                        <EDRTLText
                            style={styles.whatIsYourRating}
                            title={strings('reviewsNew.howDoYouRate')} />
                        <Icon onPress={this.props.dismissWriteReviewDialogueHandler} containerStyle={{ marginHorizontal: 5 }} type={'material'} size={25} name={'close'} color={EDColors.black} />
                    </EDRTLView>
                        
                    {/* ORDER DETAILS */}
                    <EDRTLView style={{  }}>
                        <EDRTLView style = {[styles.imageContainer, { flex: 2.5 }]} >
                                <Image style={styles.orderImageView}
                                       source={this.props.store_image !== '' &&
                                           this.props.store_image !== undefined &&
                                           this.props.store_image !== null
                                           ? { uri: this.props.store_image }
                                           : Assets.logo_pin_transparent}
                                />
                        </EDRTLView>
                        <EDRTLView style = {{flexDirection : 'column', flex : 7.5}}>
                            <EDRTLView>
                                <EDRTLText 
                                    style={[styles.ratingItem, { marginRight: 0, color: EDColors.black, marginLeft: 0 }]}
                                    title={strings('reviewsNew.orderID')}
                                />
                                <EDRTLText
                                    style={[styles.ratingItem, { marginLeft: 0, color: EDColors.black }]}
                                    title={this.props.order_id}
                                />
                            </EDRTLView>
                            <EDRTLView style={{marginTop : -15}} >
                                <EDRTLText
                                    style={[styles.ratingItem, { marginLeft: 0, color: EDColors.grey , marginRight : 45, fontSize: getProportionalFontSize(14), fontFamily: EDFonts.regular }]}
                                    title={this.props.store_name}
                                />
                            </EDRTLView>
                            <EDRTLView style={{marginTop : -15}}>
                                <EDRTLText
                                    style={[styles.ratingItem, { marginLeft: 0, color: EDColors.primary, marginRight: 0, fontSize: getProportionalFontSize(14) }]}
                                    title={this.props.currency_symbol}
                                />
                                <EDRTLText
                                    style={[styles.ratingItem, { marginLeft: 0, color: EDColors.primary, fontSize: getProportionalFontSize(14) }]}
                                    title={this.props.amount}
                                />
                            </EDRTLView>
                        </EDRTLView>
                    </EDRTLView>
            
                    {/* ORDER RATING */}
                    <EDRTLView style={{ justifyContent: 'space-between', marginTop : 5 }}>
                        <EDRTLText
                            style={styles.ratingItem}
                            title={strings('reviewsNew.rateOrder')} />
                        <StarRating
                            containerStyle={{ alignItems: 'center', justifyContent: 'center' }}
                            starStyle={{}}
                            starSize={getProportionalFontSize(20)}
                            emptyStar={'star'}
                            fullStar={'star'}
                            halfStar={'star-half'}
                            iconSet={'MaterialIcons'}
                            maxStars={5}
                            rating={this.state.selectedOrderRating}
                            emptyStarColor={EDColors.text}
                            reversed={isRTLCheck()}
                            selectedStar={this.onOrderRatingChangeHandler}
                            animation='swing'
                            halfStarEnabled={false}
                            fullStarColor={EDColors.primary} />
                    </EDRTLView>
            
            
                    {/* ORDER REMARKS INPUT */}
                    <EDRTLTextInput
                        containerStyle={{marginHorizontal : -15, marginTop : -10 }}
                        elevation={Platform.OS == "android" ? 1 : 0}
                        type={TextFieldTypes.default}
                        identifier={'orderRemarks'}
                        isMandatory={true}
                        maxLength={40}
                        placeholder={strings('reviewsNew.orderRemarks')}
                        onChangeText={this.textFieldTextDidChangeHandler}
                        errorFromScreen={this.state.shouldPerformValidation
                            ? this.validationsHelper.checkForEmpty(
                                this.state.objReviewDetails.orderRemarks,
                                strings('validationsNew.requiredField'),
                            )
                            : ''
                        }
                    />
    
                    {/* DRIVER DETAILS */}
                    { this.state.deliveryFlag == 'delivery' ? 
                    <EDRTLView style={{ marginTop : 10 }}>
                        <EDRTLView style = {[styles.imageContainer, { flex: 2.5, }]} >
                                <Image style={styles.orderImageView}
                                       source={this.props.driver_image !== '' &&
                                           this.props.driver_image !== undefined &&
                                           this.props.driver_image !== null
                                           ? { uri: this.props.driver_image }
                                           : Assets.logo_pin_transparent}
                                />
                        </EDRTLView>
                        <EDRTLView style = {{flexDirection : 'column', flex : 7.5, alignSelf: 'center'}}>
                            <EDRTLView style={{ marginTop : 10 }} >
                                <EDRTLText
                                    style={[styles.ratingItem, { marginLeft: 0, color: EDColors.black , marginRight : 45,}]}
                                    title={this.props.driver_name}
                                />
                            </EDRTLView>
                        </EDRTLView>
                    </EDRTLView> 
                    : null}
                    
                    {/* DRIVER RATING */}
                    { this.state.deliveryFlag == 'delivery' ? 
                    <EDRTLView style={{ justifyContent: 'space-between', marginTop: -10 }}>
                        <EDRTLText
                            style={[styles.ratingItem, { marginTop : 25 } ]}
                            title={strings('reviewsNew.rateDriver')} />
                        <StarRating
                            containerStyle={{ alignItems: 'center', justifyContent: 'center', marginTop : 20 }}
                            starStyle={{}}
                            starSize={getProportionalFontSize(20)}
                            emptyStar={'star'}
                            fullStar={'star'}
                            halfStar={'star-half'}
                            iconSet={'MaterialIcons'}
                            maxStars={5}
                            rating={this.state.selectedDriverRating}
                            emptyStarColor={EDColors.text}
                            reversed={isRTLCheck()}
                            selectedStar={this.onDriverRatingChangeHandler}
                            animation='swing'
                            halfStarEnabled={false}
                            fullStarColor={EDColors.primary} />
                    </EDRTLView>
                    : null}
                    
                    {/* DRIVER REVIEW INPUT */}
                    { this.state.deliveryFlag == 'delivery' ? 
                    <EDRTLTextInput
                        containerStyle={{marginHorizontal : -15, marginTop : -10 }}
                        type={TextFieldTypes.default}
                        identifier={'driverRemarks'}
                        isMandatory={true}
                        maxLength={40}
                        elevation={Platform.OS == "android" ? 1 : 0}
                        placeholder={strings('reviewsNew.driverRemarks')}
                        onChangeText={this.textFieldTextDidChangeHandler}
                        errorFromScreen={this.state.shouldPerformValidation
                            ? this.validationsHelper.checkForEmpty(
                                this.state.objReviewDetails.driverRemarks,
                                strings('validationsNew.requiredField'),
                            )
                            : ''
                        }
                    />
                    : null }
                    
                    {/* SUBMIT REVIEW BUTTON */}
                    <EDThemeButton
                        isLoading={this.state.isLoading}
                        style={{ marginVertical: 30, marginBottom: 20 }}
                        label={strings('reviewsNew.submit')}
                        onPress={this.buttonSubmitReviewPressed}
                        isRadius={true}
                    />
    
                </View>
      </KeyboardAwareScrollView>

        )
    }

    //#region HELPER METHODS
    /** TEXT CHANGE EVENTS */
    textFieldTextDidChangeHandler = (newValue, identifier) => {
        this.setState({ shouldPerformValidation: false });
        this.state.objReviewDetails[identifier] = newValue;
    }

    /** RATING CHANGE HANDLER */
    onOrderRatingChangeHandler = (star) => {
        this.setState({ selectedOrderRating: star })
    }

    onQualityRatingChangeHandler = (star) => {
        this.setState({ selectedQualityRating: star })
    }

    onDriverRatingChangeHandler = (star) => {
        this.setState({ selectedDriverRating: star })
    }
    //#endregion

    //#region BUTTON EVENTS
    buttonSubmitReviewPressed = () => {
        this.setState({ shouldPerformValidation: true })
        if ( this.state.deliveryFlag != 'pickup' && this.validationsHelper.checkForEmpty(this.state.objReviewDetails.driverRemarks.trim(), strings('validationsNew.requiredField')).length > 0 ||
            this.validationsHelper.checkForEmpty(this.state.objReviewDetails.orderRemarks.trim(), strings('validationsNew.requiredField')).length > 0) {
            return;
        }
        if ( this.validationsHelper.checkForEmpty(this.state.objReviewDetails.orderRemarks.trim(), strings('validationsNew.requiredField')).length > 0) {
        return; 
        }
        if ( this.state.deliveryFlag != 'pickup' && (parseInt(this.state.selectedOrderRating) == 0 || parseInt(this.state.selectedDriverRating) == 0)) {
            showDialogue(strings("reviewsNew.emptyDriverRating"))
            return;
        }
        if ( parseInt(this.state.selectedOrderRating) == 0) {
            showDialogue(strings("reviewsNew.emptyOrderRating"))
            return; 
        }
        this.state.deliveryFlag == "pickup" ? 
        this.callOrderReviewAPI() :
        this.callDriverReviewAPI()
    }
    //#endregion

    callOrderReviewAPI = () => {
        // if (this.props.sellerToAddReviewFor == undefined || this.props.sellerToAddReviewFor == null) {
        //     return
        // }

        // if (this.props.sellerToAddReviewFor.id == undefined || this.props.sellerToAddReviewFor.id == null) {
        //     return
        // }

        var orderRatingToPass = parseInt(this.state.selectedOrderRating);      
        netStatus(isConnected => {
            if (isConnected) {
                var addOrderReviewParams = {
                    language_slug: this.props.lan,
                    rating: orderRatingToPass,
                    driver_rating: "",
                    review: this.state.objReviewDetails.orderRemarks,
                    driver_review: "",
                    store_id: this.state.store_id,
                    order_id: this.state.order_id,
                    user_id: this.state.user_id,
                    driver_id: ""
                }
                this.setState({ isLoading: true })
                addOrderReview(addOrderReviewParams, this.onSuccessAddOrderReview, this.onFailureAddOrderReview, this.props.containerProps)
            } else {
                showNoInternetAlert();
            }
        })
    }

    onSuccessAddOrderReview = (objAddReviewSuccess) => {
        this.setState({ isLoading: false });
        if ( objAddReviewSuccess != undefined ) {
            showDialogue(objAddReviewSuccess.message, '', [], this.props.dismissAndHideButton);
        }
        // console.log("ONSUCCESSADDORDERREVIEWSUCCESS::")
    }

    onFailureAddOrderReview = (objAddReviewFailure) => {
        this.setState({ isLoading: false });
        showDialogue(objAddReviewFailure.message);
    }

    //#region NETWORK
    callDriverReviewAPI = () => {
        // if (this.props.sellerToAddReviewFor == undefined || this.props.sellerToAddReviewFor == null) {
        //     return
        // }

        // if (this.props.sellerToAddReviewFor.id == undefined || this.props.sellerToAddReviewFor.id == null) {
        //     return
        // }

        var driverRatingToPass = parseInt(this.state.selectedDriverRating);
        var orderRatingToPass = parseInt(this.state.selectedOrderRating);      
        netStatus(isConnected => {
            if (isConnected) {
                var addOrderReviewParams = {
                    language_slug: this.props.lan,
                    rating: orderRatingToPass,
                    driver_rating: driverRatingToPass,
                    review: this.state.objReviewDetails.orderRemarks,
                    driver_review: this.state.objReviewDetails.driverRemarks,
                    store_id: this.state.store_id,
                    order_id: this.state.order_id,
                    user_id: this.state.user_id,
                    driver_id: this.state.driver_id
                }
                this.setState({ isLoading: true })
                addOrderReview(addOrderReviewParams, this.onSuccessAddDriverReview, this.onFailureAddDriverReview, this.props.containerProps)
            } else {
                showNoInternetAlert();
            }
        })
    }

    onSuccessAddDriverReview = (objAddReviewSuccess) => {
        this.setState({ isLoading: false });
        if (
            // objAddReviewSuccess !== undefined &&
            // objAddReviewSuccess.data !== undefined &&
            // objAddReviewSuccess.data instanceof Array &&
            // objAddReviewSuccess.data.length > 0
            objAddReviewSuccess != undefined
        ) {
            showDialogue(objAddReviewSuccess.message, '', [], this.props.dismissAndHideButton );
        }
        // console.log("ONSUCCESSADDDRIVERREVIEWSUCCESS::")
    }

    onFailureAddDriverReview = (objAddReviewFailure) => {
        this.setState({ isLoading: false });
        showDialogue(objAddReviewFailure.message);
    }
    //#endregion
}

const styles = StyleSheet.create({
    scrollContainer: {maxHeight: Metrics.screenHeight * 0.75, overflow: 'scroll', borderRadius: 5, paddingHorizontal: 20, borderTopLeftRadius: 24, borderTopRightRadius: 24, backgroundColor: EDColors.white, shadowOpacity: 0.25, shadowRadius: 5, shadowColor: EDColors.text, shadowOffset: { height: 0, width: 0 }},
    // parentContainer: { maxHeight: Metrics.screenHeight * 0.75, overflow: 'scroll', borderRadius: 5, paddingHorizontal: 20, borderTopStartRadius: 24, borderTopEndRadius: 24, backgroundColor: EDColors.white, shadowOpacity: 0.25, shadowRadius: 5, shadowColor: EDColors.text, shadowOffset: { height: 0, width: 0 }, },
    whatIsYourRating: {
        marginHorizontal: 10, color: EDColors.primary, fontSize: getProportionalFontSize(16), fontFamily: EDFonts.italic, textAlign: 'center'
    },
    ratingItem: {
        margin: 10, color: EDColors.primary, fontSize: getProportionalFontSize(16), fontFamily: EDFonts.italic,
        // borderColor: 'red', borderWidth: 1,
    },
    imageContainer: {
        marginHorizontal: 5, 
        marginTop: 10,
        width: Metrics.screenWidth / 4.8,
        height: Metrics.screenWidth / 4.8,
        borderRadius: Metrics.screenWidth / 2.4,
        // alignContent: 'flex-end',
        alignSelf: 'center'
    },
    orderImageView: {
        width: Metrics.screenWidth / 4.8,
        height: Metrics.screenWidth / 4.8,
        borderColor: EDColors.primary, borderWidth: 1,
        borderRadius: Metrics.screenWidth / 2.4,
        overflow: 'hidden',
        backgroundColor:EDColors.offWhite
        // marginVertical: 8,
    },
    imageContainerDriver: {
        marginHorizontal: 5, 
        marginTop: 10,
        width: Metrics.screenWidth / 6,
        height: Metrics.screenWidth / 6,
        borderRadius: Metrics.screenWidth / 3,
        // alignContent: 'flex-end'
        alignSelf: 'center'
    },
    driverImageView: {
        width: Metrics.screenWidth / 6,
        height: Metrics.screenWidth / 6,
        borderColor: EDColors.primary, borderWidth: 1,
        borderRadius: Metrics.screenWidth / 3,
        overflow: 'hidden',
        backgroundColor:EDColors.offWhite
        // marginVertical: 8,
    },
})
