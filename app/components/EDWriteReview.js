/* eslint-disable react-native/no-inline-styles */
/* eslint-disable semi */
/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import { EDColors } from '../utils/EDColors'
import { EDFonts } from '../utils/EDFontConstants'
import { strings } from '../locales/i18n';
import { getProportionalFontSize, getFormattedPrice, isRTLCheck,TextFieldTypes } from '../utils/EDConstants';
import { View, StyleSheet, Image, TouchableOpacity, ScrollView, Platform } from 'react-native';
import EDRTLText from './EDRTLText';
import EDRTLView from './EDRTLView';
import EDButton from './EDButton';
import Metrics from '../utils/metrics';
import { Icon } from 'react-native-elements'
import StarRating from "react-native-star-rating";
import EDRTLTextInput from './EDRTLTextInput';
import EDThemeButton from './EDThemeButton';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { showNotImplementedAlert, showNoInternetAlert, showDialogue } from '../utils/EDAlert';
import Validations from '../utils/Validations';
import { netStatus } from '../utils/NetworkStatusConnection'
import { submitProductReview } from '../utils/ServiceManager';



export default class EDWriteReview extends Component {

    /** CONSTRUCTOR */
    constructor(props) {
        super(props);
        this.validationsHelper = new Validations()
    }

    state = {
        selectedRating: 0,
        shouldPerformValidation: false,
        ratingErrorMessage: undefined,
        isLoading: false,
        objReviewDetails: { nickname: '', summary: '', review: '' }
    }

    render() {

        return (
            <View pointerEvents={this.state.isLoading ? 'none' : 'auto'} style={styles.parentContainer}>
                <EDRTLView style={{ justifyContent: 'space-between', marginTop: 10, paddingBottm: getStatusBarHeight() }}>
                    <EDRTLText
                        style={styles.whatIsYourRating}
                        title={'Rate Your Order'} />

                    {/* <EDRTLText
                        style={styles.modalTitle}
                        title={this.props.productToAddReviewFor.name} /> */}
                    <Icon onPress={this.props.dismissWriteReviewDialogueHandler} containerStyle={{ marginHorizontal: 5 }} type={'material'} size={25} name={'close'} color={EDColors.black} />
                </EDRTLView>

                {/* <EDRTLText
                    style={styles.whatIsYourRating}
                    title={'What is your rating?'} /> */}

                <StarRating
                    containerStyle={styles.starRatingControl}
                    starStyle={{}}
                    starSize={getProportionalFontSize(32)}
                    emptyStar={'star'}
                    fullStar={'star'}
                    halfStar={'star-half'}
                    iconSet={'MaterialIcons'}
                    maxStars={5}
                    rating={this.state.selectedRating}
                    emptyStarColor={EDColors.text}
                    reversed={isRTLCheck()}
                    selectedStar={this.onRatingChangeHandler}
                    animation='swing'
                    halfStarEnabled={false}
                    fullStarColor={EDColors.rating} />

                {/* ERROR MESSAGE */}
                {this.state.ratingErrorMessage !== undefined && this.state.ratingErrorMessage.trim().length > 0
                    ? <EDRTLText
                        style={[styles.errorTextStyle]}
                        title={this.state.ratingErrorMessage}
                    />
                    : null}

                {/* <EDRTLText
                    style={styles.pleaseShareYourOpinion}
                    title={strings('writeReviewsM2.shareYourOpinion')} /> */}

                {/* NICKNAME INPUT */}
                {/* <EDRTLTextInput
                    type={TextFieldTypes.default}
                    identifier={'nickname'}
                    isMandatory={true}
                    elevation={Platform.OS == "android" ? 1 : 0}
                    placeholder={strings('writeReviewsM2.nickname')}
                    onChangeText={this.textFieldTextDidChangeHandler}
                    errorFromScreen={this.state.shouldPerformValidation
                        ? this.validationsHelper.checkForEmpty(
                            this.state.objReviewDetails.nickname,
                            strings('validationsM2.requiredField'),
                        )
                        : ''
                    }
                /> */}

                {/* SUMMARY INPUT */}
                {/* <EDRTLTextInput
                    elevation={Platform.OS == "android" ? 1 : 0}
                    type={TextFieldTypes.default}
                    identifier={'summary'}
                    isMandatory={true}
                    maxLength={40}
                    placeholder={strings('writeReviewsM2.summary')}
                    onChangeText={this.textFieldTextDidChangeHandler}
                    errorFromScreen={this.state.shouldPerformValidation
                        ? this.validationsHelper.checkForEmpty(
                            this.state.objReviewDetails.summary,
                            strings('validationsM2.requiredField'),
                        )
                        : ''
                    }
                /> */}

                {/* REVIEW INPUT */}
                <EDRTLTextInput
                    type={TextFieldTypes.default}
                    identifier={'review'}
                    isMandatory={true}
                    maxLength={250}
                    elevation={Platform.OS == "android" ? 1 : 0}
                    placeholder={'Share Your Review'}
                    onChangeText={this.textFieldTextDidChangeHandler}
                    errorFromScreen={this.state.shouldPerformValidation
                        ? this.validationsHelper.checkForEmpty(
                            this.state.objReviewDetails.review,
                            strings('validationsM2.requiredField'),
                        )
                        : ''
                    }
                />

                {/* SUBMIT REVIEW BUTTON */}
                <EDThemeButton
                    isLoading={this.state.isLoading}
                    style={{ marginTop: 30, marginBottom: 20 }}
                    label={"Submit"}
                    onPress={this.buttonSubmitReviewPressed}
                    isRadius={true}
                />

            </View>
        )
    }

    //#region HELPER METHODS
    /** TEXT CHANGE EVENTS */
    textFieldTextDidChangeHandler = (newValue, identifier) => {
        this.setState({ shouldPerformValidation: false, ratingErrorMessage: undefined });
        this.state.objReviewDetails[identifier] = newValue;
    }

    /** RATING CHANGE HANDLER */
    onRatingChangeHandler = (star) => {
        this.setState({ selectedRating: star })
    }
    //#endregion

    //#region BUTTON EVENTS
    buttonSubmitReviewPressed = () => {
        this.setState({ shouldPerformValidation: true, ratingErrorMessage: this.state.selectedRating == 0 ? strings('writeReviewsM2.selectRating') : '' })
        if (this.state.selectedRating == 0 ||
            this.validationsHelper.checkForEmpty(this.state.objReviewDetails.nickname.trim(), strings('validationsM2.requiredField')).length > 0 ||
            this.validationsHelper.checkForEmpty(this.state.objReviewDetails.summary.trim(), strings('validationsM2.requiredField')).length > 0 ||
            this.validationsHelper.checkForEmpty(this.state.objReviewDetails.review.trim(), strings('validationsM2.requiredField')).length > 0) {
            return;
        }
        this.callSubmitReviewAPI();
    }
    //#endregion

    //#region NETWORK
    callSubmitReviewAPI = () => {
        netStatus(isConnected => {
            if (isConnected) {
                var objWriteReviewsParams = {
                    productId: this.props.productToAddReviewFor.id || this.props.productToAddReviewFor.entity_id,
                    nickname: this.state.objReviewDetails.nickname,
                    title: this.state.objReviewDetails.summary,
                    detail: this.state.objReviewDetails.review,
                    ratingData: [{ rating_id: 4, rating_code: true, rating_value: this.state.selectedRating }],
                    customer_id: this.props.containerProps.isLoggedIn ? this.props.containerProps.userDetails.id : null,
                    storeId: '1'
                }

                this.setState({ isLoading: true })
                submitProductReview(objWriteReviewsParams, this.onSuccessAddReview, this.onFailureAddReview, this.props.containerProps)
            } else {
                showNoInternetAlert();
            }
        })
    }

    onSuccessAddReview = (objAddReviewSuccess) => {
        this.setState({ isLoading: false });
        if (
            objAddReviewSuccess !== undefined &&
            objAddReviewSuccess.data !== undefined &&
            objAddReviewSuccess.data instanceof Array &&
            objAddReviewSuccess.data.length > 0
        ) {
            var firstObject = objAddReviewSuccess.data[0];
            showDialogue(firstObject.message, '', [], this.props.dismissWriteReviewDialogueHandler);
        }
    }

    onFailureAddReview = (objAddReviewFailure) => {
        this.setState({ isLoading: false });
        showDialogue(objAddReviewFailure.message);
    }
    //#endregion
}

const styles = StyleSheet.create({
    starRatingControl: { alignItems: 'center', justifyContent: 'center', marginVertical: 10 },
    parentContainer: { maxHeight: Metrics.screenHeight * 0.75, overflow: 'scroll', borderRadius: 24, paddingHorizontal: 20, borderTopStartRadius: 24, borderTopEndRadius: 24, backgroundColor: EDColors.white, shadowOpacity: 0.25, shadowRadius: 5, shadowColor: EDColors.text, shadowOffset: { height: 0, width: 0 }, marginHorizontal: 25 },
    modalTitle: { alignSelf: 'center', marginVertical: 10, marginHorizontal: 10, color: EDColors.primary, fontSize: getProportionalFontSize(18), fontFamily: EDFonts.medium, fontWeight: '500' },
    whatIsYourRating: {
        marginLeft: Metrics.screenWidth * 0.25, color: EDColors.primary, fontSize: getProportionalFontSize(16), fontFamily: EDFonts.italic,
        // borderColor: 'red', borderWidth: 1,
        textAlign: 'center', textAlignVertical: 'center'
    },
    pleaseShareYourOpinion: {
        marginHorizontal: 60, color: EDColors.primary, fontSize: getProportionalFontSize(16), fontFamily: EDFonts.italic,
        // borderColor: 'red', borderWidth: 1,
        textAlign: 'center'
    },

    errorTextStyle: {
        fontSize: getProportionalFontSize(12),
        fontFamily: EDFonts.regular,
        color: EDColors.error,
        marginVertical: 5,
        textAlign: "center"
    },
})
