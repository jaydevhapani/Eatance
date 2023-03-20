import React from 'react'
import { View, StyleSheet, FlatList, RefreshControl, Animated } from 'react-native'
import { connect } from 'react-redux'
import { strings } from '../locales/i18n'
import { EDColors } from '../utils/EDColors'
import { debugLog, getProportionalFontSize, isRTLCheck } from '../utils/EDConstants';
import { netStatus } from '../utils/NetworkStatusConnection'
import BaseContainer from './BaseContainer'
import { changeCartButtonVisibility } from '../redux/actions/FloatingButton'
import ReviewItemComponent from '../components/ReviewItemComponent'
import { NavigationEvents } from 'react-navigation'
import CheckOutBottomComponent from '../components/CheckOutBottomComponent'
import StarRating from 'react-native-star-rating'
import { widthPercentageToDP } from 'react-native-responsive-screen'
import EDRTLView from '../components/EDRTLView'
import EDRTLText from '../components/EDRTLText'
import { Textarea } from 'native-base'
import EDPlaceholderComponent from '../components/EDPlaceholderComponent'
import { EDFonts } from '../utils/EDFontConstants'
import { reviewAdd, fetchReview } from '../utils/ServiceManager'
import { showDialogue } from '../utils/EDAlert'
import Metrics from '../utils/metrics'

const PAGE_SIZE = 20

class ReviewContainer extends React.PureComponent {

    //#region STATE
    state = {
        isLoading: false,
        isWriteReviewDisplay: false,
        strReview: '',
        starRating: 0,
        bounceValue: new Animated.Value(-Metrics.screenHeight),
        arrayReviews: undefined,
        onScrollReviewsList: undefined,
        refreshScreen: this.props.navigation.state.params.refreshScreen
    }
    //#endregion

    //#region LIFE CYCLE METHODS

    /** CONSTRUCTOR */
    constructor(props) {
        super(props);
        this.strOnScreenMessage = '';
        this.strOnScreenSubtitle = ''
        this.shouldLoadMore = false;
        this.refreshing = false;
        this.flatListReviews = undefined;
        this.textViewReviewDescription = undefined;
    }

    /** DID FOCUS */
    onDidFocusReviewContainer = () => {
        this.strOnScreenMessage = ''
        this.state.arrayReviews = undefined;

        // CALL API WHENEVER USER COMES TO THIS SCREEN
        this.callGetReviewsAPI()
        this.props.changeCartButtonVisibility({ shouldShowFloatingButton: true, currentScreen: this.props });
    }

    onWillFocusReviewsContainer = () => {
        this.props.changeCartButtonVisibility({ shouldShowFloatingButton: true, currentScreen: this.props });
    }

    renderReviewItem = ({ item }) => {
        return (
            <ReviewItemComponent
                name={item.first_name + ' ' + item.last_name}
                review={item.review}
                rating={item.rating}
                date={item.created_date}
            />
        )
    }

    renderHeader = () => {

        // ADD REVIEW VIEW
        return (
            this.state.isWriteReviewDisplay ?
                // <View style={styles.writeReviewContainer}>
                //     <Textarea
                //         style={styles.textAreaStyle}
                //         defaultValue={this.state.strReview}
                //         placeholder={strings("review.reviewPlaceholder")}
                //         placeholderTextColor={EDColors.text}
                //         maxLength={500}
                //         onChangeText={(text) => {
                //             this.setState({
                //                 strReview: text
                //             })
                //         }}
                //     />
                //     <EDRTLView style={{ justifyContent: 'space-between', marginTop: 5 }}>
                //         <StarRating
                //             containerStyle={{ marginTop: 5, justifyContent: 'center' }}
                //             starStyle={{ marginHorizontal: 1 }}
                //             starSize={widthPercentageToDP("5%")}
                //             disabled={false}
                //             emptyStar={'star'}
                //             fullStar={'star'}
                //             halfStar={'star-half'}
                //             iconSet={'MaterialIcons'}
                //             maxStars={5}
                //             selectedStar={this.onRatingChangeHandler}
                //             rating={this.state.starRating}
                //             emptyStarColor={EDColors.text}
                //             fullStarColor={EDColors.primary}
                //             halfStarColor={EDColors.primary}
                //             halfStarEnabled={true}
                //             reversed={isRTLCheck()}
                //             animation='swing'
                //         />
                //         <EDRTLText style={styles.reviewTextCounter} title={this.state.strReview.length + "/500"} />
                //     </EDRTLView>
                // </View>
                
                    <EDPlaceholderComponent style = {{flex : 1, marginTop: Metrics.screenHeight * 0.30}} title={strings('review.noReviewsFoundTitle')} /> 
                : null
        )

    }
    render() {
        return (
            <BaseContainer
                title={strings("review.title")}
                loading={this.state.isLoading}
                left={'arrow-back'}
                onLeft={this.buttonBackPressed}
                onConnectionChangeHandler={this.onConnectionChangeHandler}
            >
                {/* SCREEN FOCUS EVENT */}
                <NavigationEvents onWillFocus={this.onWillFocusReviewsContainer} onDidFocus={this.onDidFocusReviewContainer} />

                {/* PARENT VIEW */}
                <View
                    pointerEvents={this.state.isLoading ? 'none' : 'auto'}
                    style={styles.mainViewStyle}>
                    <View style={{ flex: 1 }}>


                        {/* CHECK IF WE HAVE REVIEWS, ELSE DISPLAY PLAHOLDER VIEW */}
                        {this.state.arrayReviews !== undefined
                            ? <FlatList
                                showsVerticalScrollIndicator={false}
                                style={styles.reviewsList}
                                contentContainerStyle={{ paddingBottom: this.props.cartCount > 0 ? 100 : 10 }}
                                data={this.state.arrayReviews}
                                extraData={this.state}
                                renderItem={this.renderReviewItem}
                                ref={flatListReference => this.flatListReviews = flatListReference}
                                onScroll={this.state.onScrollReviewsList}
                                onMomentumScrollEnd={this.onMomentumScrollEndReviewsList}
                                ListHeaderComponent={this.renderHeader}
                                keyExtractor={(item, index) => item + index}
                                onEndReached={this.onLoadMoreEventHandler}
                                onEndReachedThreshold={0.5}
                                refreshControl={<RefreshControl
                                    refreshing={this.refreshing}
                                    title={strings('review.fetchingNew')}
                                    titleColor={EDColors.textAccount}
                                    tintColor={EDColors.textAccount}
                                    colors={[EDColors.textAccount]}
                                    onRefresh={this.onPullToRefreshHandler}
                                />}
                            />
                            : this.strOnScreenMessage.length > 0
                                ? <EDPlaceholderComponent onBrowseButtonHandler={this.buttonBrowsePressed} title={this.strOnScreenMessage} subTitle={this.strOnScreenSubtitle} />
                                : null}
                    </View>
                    {/* {this.state.arrayReviews !== undefined ?
                        <CheckOutBottomComponent
                            pointerEvents={this.state.isLoading ? 'none' : 'auto'}
                            style={{ justifyContent: 'center' }}
                            btnStyle={{ backgroundColor: !this.state.isWriteReviewDisplay ? EDColors.homeButtonColor : this.state.strReview.trim() !== '' && this.state.starRating != 0 ? EDColors.homeButtonColor : EDColors.palePrimary }}
                            label={this.state.isWriteReviewDisplay ? strings("review.submit") : strings("review.addreview")}
                            activeOpacity={this.state.isWriteReviewDisplay && this.state.strReview.trim() !== '' && this.state.starRating != 0 ? 0.1 : 1.0}
                            onPress={this.writeReviewHandler}
                        />
                        : null} */}

                </View>
            </BaseContainer>
        )
    }

    //#region HELPER METHODS
    onRatingChangeHandler = (star) => {
        this.setState({ starRating: star })
    }

    onScrollReviewsListLocal = () => {
        this.setState({ onScrollReviewsList: undefined, isWriteReviewDisplay: false })
    }

    onMomentumScrollEndReviewsList = () => {
    }

    /** LOAD MORE EVENT */
    onLoadMoreEventHandler = () => {
        if (this.shouldLoadMore) {
            this.callGetReviewsAPI();
        }
    }

    /** PULL TO REFRESH HANDLER */
    onPullToRefreshHandler = () => {
        this.strOnScreenMessage = ''
        this.strOnScreenSubtitle = ''
        this.refreshing = false
        this.shouldLoadMore = false
        this.state.arrayReviews = []
        // this.setState({ arrayReviews: undefined })
        this.callGetReviewsAPI(true)
    }
    //#endregion

    //#region NETWORK METHODS
    onConnectionChangeHandler = (isConnected) => {
        if (isConnected) {
            this.onPullToRefreshHandler()
        }
    }

    /**
     *
     * @param {The success response object} objSuccess
     */
    onGetReviewsSuccess = objSuccess => {

        this.strOnScreenMessage = strings('review.noReviewsFoundTitle');
        this.strOnScreenSubtitle = strings('review.noReviewsFoundMessages')


        if (this.state.arrayReviews === undefined) {
            this.state.arrayReviews = [];
        }


        if (objSuccess.data.reviews !== undefined) {
            let arrReviews = objSuccess.data.reviews || []
            let totalReviewsCount = objSuccess.data.reviews_count || 0
            this.shouldLoadMore = this.state.arrayReviews.length + arrReviews.length < totalReviewsCount
            this.setState({ arrayReviews: [...this.state.arrayReviews, ...arrReviews], isLoading: false, isWriteReviewDisplay: (this.state.arrayReviews.length + arrReviews.length) == 0 });
        } else {
            this.setState({ isLoading: false })
        }
        if(objSuccess.data.reviews_count == 0){
            this.strOnScreenMessage = strings('review.noReviewsFoundTitle');
        }
        this.refreshing = false
    }

    /**
    *
    * @param {The failure response object} objFailure
    */
    onGetReviewsFailure = objFailure => {
        this.strOnScreenMessage = objFailure.message || ''
        this.setState({ isLoading: false })
        debugLog('onGetReviewsFailure :: ' + JSON.stringify(objFailure));
        // showDialogue(objFailure.message)
        this.refreshing = false
    }

    /** REQUEST GET REVIEWS */
    /**
    *
    * @param {Check if it is pull-to-refresh event call or normal call and show loader accordingly} isForRefresh
    */
    callGetReviewsAPI = (isForRefresh = false) => {

        this.strOnScreenMessage = ''
        this.strOnScreenSubtitle = ''
        netStatus(isConnected => {
            if (isConnected) {
                let objGetReviewParams = {
                    store_id: this.props.objStoreDetails.store_id,
                    language_slug: this.props.lan,
                    count: PAGE_SIZE,
                    page_no: (this.state.arrayReviews && !isForRefresh) ? parseInt(this.state.arrayReviews.length / PAGE_SIZE) + 1 : 1,
                };
                if (!isForRefresh) {
                    this.setState({ isLoading: this.state.arrayReviews === undefined });
                }
                fetchReview(objGetReviewParams, this.onGetReviewsSuccess, this.onGetReviewsFailure, this.props);

            } else {
                this.refreshing = false
                if (this.state.arrayReviews === undefined) {
                    this.strOnScreenMessage = strings('generalNew.noInternetTitle');
                    this.strOnScreenSubtitle = strings('generalNew.noInternet');
                    this.setState({ arrayReviews: [] })
                } else {
                    this.strOnScreenMessage = '';
                    this.strOnScreenSubtitle = '';
                }
            }
        })
    }

    /**
    *
    * @param {The call API for add review}
    */

    reviewAddAction = () => {

        if (this.state.strReview.trim().length == 0) {
            showDialogue(strings('review.noReviewText'));
            return;
        }

        if (this.state.isLoading) {
            return;
        }

        netStatus(isConnected => {
            if (isConnected) {
                let objReviewParams = {
                    language_slug: this.props.lan,
                    review: encodeURI(this.state.strReview),
                    user_id: this.props.UserID,
                    rating: this.state.starRating,
                    store_id: this.props.objStoreDetails.store_id,
                };
                this.setState({ isLoading: true, isReviewOpen: false });
                reviewAdd(
                    objReviewParams,
                    this.onReviewSuccess,
                    this.onReviewFailure,
                    this.props,
                );
            } else {
                showNoInternetAlert();
            }
        });
    };

    /**
     *
     * @param {The success response object} objSuccess
     */
    onReviewSuccess = objSuccess => {
        debugLog('OBJ SUCCESS REVIEW :: ' + JSON.stringify(objSuccess));
        this.state.arrayReviews = undefined;
        this.strOnScreenMessage = '';
        this.strOnScreenSubtitle = '';
        this.callGetReviewsAPI()
        this.setState({ isLoading: false, isWriteReviewDisplay: false, starRating: 0, strReview: '' });
    };

    /**
     *
     * @param {The failure response object} objFailure
     */
    onReviewFailure = objFailure => {
        this.setState({ isLoading: false, starRating: 0, strReview: '' });
        showDialogue(objFailure.message);
    };

    //#region BUTTON EVENTS
    writeReviewHandler = () => {
        if (this.props.isLoggedIn) {
            if (this.state.isWriteReviewDisplay && this.state.starRating != 0 && this.state.strReview.trim() !== '') {
                this.reviewAddAction()
            } else if (!this.state.isWriteReviewDisplay) {
                this.setState({ isWriteReviewDisplay: true })
                this.flatListReviews.scrollToIndex({ index: 0, animated: true })
                setTimeout(() => {
                    this.setState({ onScrollReviewsList: this.onScrollReviewsListLocal })
                }, 2000);
                // this._toggleSubview()
            }
        } else {
            this.props.navigation.navigate('login', {
                isCheckout: true,
            });
        }

    }

    _toggleSubview() {
        Animated.spring(this.state.bounceValue, { toValue: 0, velocity: 3, tension: 2, friction: 8, useNativeDriver: true }).start();
    }

    buttonBrowsePressed = () => {
        if (this.props.isLoggedIn) {
            this._toggleSubview()
            this.setState({ isWriteReviewDisplay: true })
        }
    }

    buttonBackPressed = () => {
        console.log("BACK BUTTON PRESSED:::::::::::::::", this.state.refreshScreen)
        if (this.state.refreshScreen !== undefined)
        this.state.refreshScreen();
        this.props.navigation.goBack()
    }
}

//#region STYLES
const styles = StyleSheet.create({
    reviewTextCounter: { fontFamily: EDFonts.regular, marginHorizontal: 20, fontSize: getProportionalFontSize(10), color: EDColors.textAccount },
    writeReviewContainer: {
        margin: 10,
        padding: 10,
        backgroundColor: EDColors.white,
        borderColor: EDColors.shadow,
        borderWidth: 1,
        shadowOpacity: 0.25,
        shadowRadius: 5,
        shadowColor: EDColors.text,
        shadowOffset: { height: 0, width: 0 },
    },
    textAreaStyle: { fontFamily: EDFonts.regular, height: 100, backgroundColor: EDColors.offWhite, padding: 10 },
    mainViewStyle: {
        flex: 1,
        backgroundColor: EDColors.offWhite,
    },
    reviewsList: {
        margin: 10,
    },
})
//#endregion

//#region REDUX
export default connect(
    state => {
        return {
            cartCount: state.checkoutReducer.cartCount,
            lan: state.userOperations.lan,
            UserID: state.userOperations.userDetails.UserID,
            isLoggedIn: state.userOperations.isLoggedIn,
            objStoreDetails: state.contentOperations.objStoreDetails
        }
    },
    dispatch => {
        return {
            changeCartButtonVisibility: data => {
                dispatch(changeCartButtonVisibility(data));
            }
        }
    }
)(ReviewContainer)
//#endregion
