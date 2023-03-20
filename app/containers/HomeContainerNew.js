import React from 'react';
import {
    View,
    StyleSheet,
    RefreshControl,
    Image,
    Animated,
    Keyboard,
    Text,
    FlatList,
    TouchableOpacity
} from 'react-native';
import Assets from '../assets';
import { saveNavigationSelection } from '../redux/actions/Navigation';
import { netStatus } from '../utils/NetworkStatusConnection';
import { fetchHomeScreenDetails, changeToken, getProducts, userLanguage } from '../utils/ServiceManager';
import { debugLog, ProductsListType, APP_NAME, isRTLCheck, getProportionalFontSize } from '../utils/EDConstants';
import { EDColors } from '../utils/EDColors';
import BannerImages from '../components/BannerImages';
import StoreOverview from '../components/StoreOverview';
import { strings } from '../locales/i18n';
import { connect } from 'react-redux';
import { saveCartCount } from '../redux/actions/Checkout';
import { saveUserFCMInRedux } from '../redux/actions/User';
import { NavigationEvents } from 'react-navigation';
import BaseContainer from './BaseContainer';
import { changeCartButtonVisibility } from '../redux/actions/FloatingButton';
import EDPlaceholderComponent from '../components/EDPlaceholderComponent';
import { saveCurrencySymbol, saveStoreDetails, saveGoogleMapsApiKey } from '../redux/actions/Content';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import EDProgressLoader from '../components/EDProgressLoader';
import ShopByCategoryComponent from '../components/ShopByCategoryComponent';
import ShopByBrandComponent from '../components/ShopByBrandComponent';
import ProductsForYouComponent from '../components/ProductsForYouComponent';
import ReviewsCarousel from '../components/ReviewsCarousel';
import { saveFilterData } from '../redux/actions/Filter';
import { checkFirebasePermission } from '../utils/FirebaseServices';
import Metrics from '../utils/metrics';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { SearchBar } from 'react-native-elements';
import { EDFonts } from '../utils/EDFontConstants';
import EDRTLText from '../components/EDRTLText';
import { Spinner } from 'native-base';
import EDRTLView from '../components/EDRTLView';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { getSelectedStore, getLanguage } from '../utils/AsyncStorageHelper';

const PAGE_SIZE_PRODUCTS_LIST = 5
class HomeContainerNew extends React.PureComponent {

    //#region LIFE CYCLE METHODS

    /** CONSTRUCTOR */
    constructor(props) {
        super(props);
        this.strOnScreenTitle = '';
        this.strOnScreeMessage = '';
        this.strSearchMessage = '';
        this.currentIndexOfBanner = 0;
        this.arrayBrands = undefined;
        this.arrayCategories = undefined;
        this.objStoreDetails = undefined;
        this.arrayFeaturedProducts = undefined;
        this.arrayReviews = undefined;
        this.arrayBannerImages = undefined;
        this.refreshing = false;
        this.searchBarProducts = undefined;
        this.storesCount = 0;
    }

    /** DID MOUNT */
    componentDidMount() {
        this.props.navigation.closeDrawer();
        if(this.props.isLoggedIn) {
            getLanguage(
              languageSelected => {
                var languageToSave = languageSelected || 'en';
                this.getUserLanguage(languageToSave)
              },
              _err => {
                var languageToSave = 'en';
                this.getUserLanguage(languageToSave)
              },
            );
        }

        if (this.props.objStoreDetails == undefined || this.props.objStoreDetails.store_id == undefined) {
            getSelectedStore(
                onSuccess => { this.props.saveStoreDetailsInRedux(onSuccess); debugLog("Selected store :::::", onSuccess); this.getHomeScreenData() },
                onFailure => debugLog("On failure store :::::", onFailure))
        }
        else
            this.getHomeScreenData()

    }

    /** ON WILL FOCUS */
    onWillFocusHomeContainer = () => {

        if (this.props.isLoggedIn && (this.props.token === undefined || this.props.token === null || this.props.token === "")) {
            checkFirebasePermission(onSuccess => {
                this.props.saveToken(onSuccess)
                this.changeUserToken()
            }, () => {

            })
        } else if (this.props.isLoggedIn) {
            this.changeUserToken()
        }
        this.getCartCount()
        this.props.changeCartButtonVisibility({ shouldShowFloatingButton: true, currentScreen: this.props });
        this.props.saveNavigationSelection(strings('sidebarNew.home'));
    }

    onDidFocusHomeContainer = () => {

        this.props.changeCartButtonVisibility({ shouldShowFloatingButton: true, currentScreen: this.props });
        this.props.saveNavigationSelection(strings('sidebarNew.home'));

        if (this.objStoreDetails !== undefined && this.props.objStoreDetails !== undefined && this.objStoreDetails.store_id !== this.props.objStoreDetails.store_id) {
            this.strOnScreenTitle = '';
            this.strOnScreeMessage = '';
            this.strSearchMessage = '';
            this.currentIndexOfBanner = 0;
            this.arrayBrands = undefined;
            this.arrayCategories = undefined;
            this.objStoreDetails = undefined;
            this.arrayFeaturedProducts = undefined;
            this.arrayReviews = undefined;
            this.arrayBannerImages = undefined;
            this.refreshing = false;
            this.searchBarProducts = undefined;
            this.objStoreDetails = this.props.objStoreDetails;
            this.getHomeScreenData();
        }
    }

    onWillBlurHomeContainer = () => {
        this.strSearchMessage = '';
        this.setState({ strSearchString: '', arrayProducts: undefined, isSearchLoading: false, isSearchVisible: false });
        Animated.spring(this.state.bounceValue, { toValue: -heightPercentageToDP('100%'), duration: 25, friction: 8, useNativeDriver: false }).start();
    }

    /** RENDER SEARCH MODAL */
    renderSearchModal = () => {

    }

    onSwitchStoreHandler = () => {
        // this.props.navigation.navigate('storesListHomeNavigator', { isForSwitchingStore: true })

        this.props.navigation.navigate('storesList', { isForSwitchingStore: true })
        // this.objStoreDetails = selectedStore;
        // this.props.saveCurrencySymbol(this.objStoreDetails.currency_symbol);
        // this.props.saveStoreDetailsInRedux(this.objStoreDetails);
        // this.getHomeScreenData();
    }


    /** RENDER */
    render() {
        console.log("THIS.PROPS.ISLOGGEDIN:::::::::::::::,", this.props.isLoggedIn)
        return (
            <BaseContainer
                title={this.props.objStoreDetails !== undefined ? this.props.objStoreDetails.name || '' : ''}
                left={'menu'}
                onLeft={this.buttonMenuPressed}
                right={this.strOnScreenTitle !== undefined && this.strOnScreenTitle.trim().length > 0
                    ? undefined
                    : (this.state.isSearchVisible) ? 'close' : 'search'}
                onRight={this.buttonSearchPressed}
                onConnectionChangeHandler={this.onConnectionChangeHandler}
            >

                {/* SCREEN FOCUS EVENT */}
                <NavigationEvents onWillBlur={this.onWillBlurHomeContainer} onDidFocus={this.onDidFocusHomeContainer} onWillFocus={this.onWillFocusHomeContainer} />

                {this.state.isLoading
                    ? <EDProgressLoader />
                    : <KeyboardAwareScrollView
                        pointerEvents={this.state.isLoading ? 'none' : 'auto'}
                        contentContainerStyle={stylesHomeContainer.mainContainer}
                        behavior="padding"
                        enabled
                        refreshControl={
                            <RefreshControl
                                refreshing={this.refreshing}
                                title={strings('homeNew.fetchingNew')}
                                titleColor={EDColors.textAccount}
                                tintColor={EDColors.textAccount}
                                colors={[EDColors.textAccount]}
                                onRefresh={this.onPullToRefreshHandler}
                            />
                        }
                    >
                        {this.strOnScreenTitle !== undefined && this.strOnScreenTitle.trim().length > 1
                            ? <View style={stylesHomeContainer.placeholderContainer}>
                                <EDPlaceholderComponent title={this.strOnScreenTitle} subTitle={this.strOnScreeMessage} />
                            </View>
                            : <View pointerEvents={this.state.isSearchVisible ? 'none' : 'auto'} style={{ flex: 1 }}>

                                {/* SWITCH STORE OPTION */}
                                {this.storesCount > 1
                                    ? <TouchableOpacity activeOpacity={0.8} onPress={this.onSwitchStoreHandler} style={{ backgroundColor: EDColors.palePrimary, height: 40 }} >
                                        <EDRTLView style={{ backgroundColor: EDColors.palePrimary, padding: 10, justifyContent: 'space-between' }}>
                                            <EDRTLText style={{ color: EDColors.textAccount, fontFamily: EDFonts.bold, alignSelf: 'center' }} title={strings('homeNew.switchStore')} />
                                            <MaterialIcon style = {{ alignSelf : 'center' }} size={20} color={EDColors.textAccount} name={'keyboard-arrow-right'} />
                                        </EDRTLView>
                                    </TouchableOpacity>
                                    : null}
                                {/* BANNER IMAGES */}
                                <BannerImages images={this.arrayBannerImages} />

                                {/* STORE INFO */}
                                <StoreOverview storeDetails={this.objStoreDetails} />

                                {/* CATEGORIES */}
                                <ShopByCategoryComponent onSelectionHandler={this.onCategorySelectionHandler} title={strings('homeNew.shopByCategory')} shopByData={this.arrayCategories} onViewAllHandler={this.buttonViewAllCategoriesPressed} />

                                {/* PRODUCTS FOR YOU */}
                                <ProductsForYouComponent
                                    //  extraData={this.state.refreshKey} 
                                    title={strings('homeNew.featured')} shopByData={this.arrayFeaturedProducts} onViewAllHandler={this.buttonViewAllFeaturedProductsPressed} onPress={this.navigateToProductDetail} />

                                {/* REVIEWS */}
                                <ReviewsCarousel
                                    //  extraData={this.state.refreshKey}
                                    dummyReview={{ review: strings('homeNew.noReviewsTitle') + '. ' + strings('homeNew.noReviewsMessage'), first_name: this.objStoreDetails !== undefined ? this.objStoreDetails.name || APP_NAME : APP_NAME }} title={strings('homeNew.reviews')} reviewsData={this.arrayReviews} onViewAllHandler={this.buttonViewAllReviewsPressed} />

                                {/* BRANDS */}
                                <ShopByBrandComponent onSelectionHandler={this.onBrandSelectionHandler} title={strings('homeNew.shopByBrands')} shopByData={this.arrayBrands} onViewAllHandler={this.buttonViewAllBrandsPressed} />

                                {/* FOOTER LOGO */}
                                <View style={{ flex: 1, paddingVertical: 40, alignItems: 'center', justifyContent: 'center' }}>
                                    <Image source={Assets.logo} />
                                </View>
                            </View>
                        }
                    </KeyboardAwareScrollView>
                }

                {this.state.isSearchVisible ?
                    <Animated.View style={[stylesHomeContainer.subView, { transform: [{ translateY: this.state.bounceValue }] }]} >
                        {/* <EDPopupView
                    mainViewStyle={{ justifyContent: 'flex-start', marginTop: heightPercentageToDP('10%') }}
                    modalStyle={{ justifyContent: 'flex-start', position: 'absolute', top: heightPercentageToDP('10%'), height: '90%' }}
                    isModalVisible={this.state.isSearchVisible}> */}

                        <View style={{}}>
                            <SearchBar
                                placeholder={strings('productsList.searchProducts')}
                                onChangeText={this.searchTextDidChangeHandler}
                                showCancel={false}
                                onClear={this.searchTextDidClearHandler}
                                style={{ tintColor: EDColors.homeButtonColor }}
                                autoFocus={true}
                                onBlur={this.onSearchFieldBlurHandler}
                                value={this.state.strSearchString}
                                lightTheme={true}
                                ref={searchBar => this.searchBarProducts = searchBar}
                                containerStyle={{ backgroundColor: EDColors.offWhite }}
                                inputContainerStyle={{
                                    shadowOpacity: 0.25,
                                    shadowRadius: 5,
                                    shadowColor: EDColors.text,
                                    shadowOffset: { height: 0, width: 0 },
                                    backgroundColor: EDColors.white,
                                    flexDirection: isRTLCheck() ? 'row-reverse' : 'row',
                                }}
                                inputStyle={{ selectionColor: EDColors.homeButtonColor, tintColor: EDColors.homeButtonColor, color: EDColors.text, fontFamily: EDFonts.regular, fontSize: getProportionalFontSize(14), textAlign: isRTLCheck() ? 'right' : 'left' }}
                            />
                            {this.state.arrayProducts !== undefined && this.state.arrayProducts.length > 0
                                ? <FlatList
                                    contentContainerStyle={{
                                        shadowOpacity: 0.25,
                                        shadowRadius: 5,
                                        shadowColor: EDColors.text,
                                        shadowOffset: { height: 0, width: 0 },
                                        backgroundColor: EDColors.white, paddingVertical: 15, marginBottom: 10, backgroundColor: EDColors.white
                                    }}
                                    showsVerticalScrollIndicator={false}
                                    data={this.state.arrayProducts}
                                    bounces={false}
                                    keyboardShouldPersistTaps='handled'
                                    renderItem={this.renderProductItem}
                                    ItemSeparatorComponent={this.renderSeparator}
                                    keyExtractor={(item, index) => item + index} />
                                : this.strSearchMessage !== undefined && this.strSearchMessage.trim().length > 0
                                    ? <View style={{
                                        shadowOpacity: 0.25,
                                        shadowRadius: 5,
                                        shadowColor: EDColors.text,
                                        shadowOffset: { height: 0, width: 0 },
                                        backgroundColor: EDColors.white, alignItems: 'center', justifyContent: 'center', padding: 20, backgroundColor: EDColors.white
                                    }}>
                                        <Text style={{ textAlign: 'center', alignSelf: 'center', fontFamily: EDFonts.regular, fontSize: getProportionalFontSize(14), color: EDColors.text }}>{this.strSearchMessage} </Text>
                                    </View>
                                    : this.renderHeaderSearchResults()}
                        </View>

                        {/* </EDPopupView> */}

                    </Animated.View>
                    : null}

            </BaseContainer >
        );
    }
    //#endregion

    //#region HELPER METHODS
    keyboardDidShow = () => {
        // this.setState({ isSearchVisible: false, strSearchString: '', arrayProducts: undefined })
    }

    keyboardDidHide = () => {
        // this.setState({ isSearchVisible: false, strSearchString: '', arrayProducts: undefined })
        // this.onSearchFieldBlurHandler()
    }

    onPullToRefreshHandler = () => {
        if (this.refreshing) {
            return;
        }

        this.refreshing = true;
        this.strOnScreeMessage = '';
        this.strOnScreenTitle = '';

        this.getHomeScreenData()
    }

    renderProductItem = (productToLoad) => {
        return <TouchableOpacity
            onPress={() => {
                this.navigateToProductDetail(productToLoad.item)
            }}
            style={{}}>
            <EDRTLText style={stylesHomeContainer.itemName} title={(productToLoad.item.name || '')} />
        </TouchableOpacity>
    }

    renderSeparator = () => {
        return <View style={{ backgroundColor: EDColors.separatorColor, height: 1, margin: 15 }} />
    }

    renderHeaderSearchResults = () => {
        return this.state.isSearchLoading
            ? <View style={{ backgroundColor: EDColors.white, paddingVertical: 20 }}>
                <Spinner style={stylesHomeContainer.spinner} color={EDColors.homeButtonColor} />
            </View >
            : null
    }

    /** SEARCH TEXT CHANGE HANDLER */
    searchTextDidChangeHandler = (searchText) => {
        this.setState({ strSearchString: searchText })
        // if (searchText.trim().length > 0) {
        this.callProductsAPI(searchText);
        // }
    }

    searchTextDidClearHandler = () => {
        this.strSearchMessage = '';
        this.setState({ strSearchString: '', arrayProducts: undefined, isSearchVisible: true })
        if (this.searchBarProducts !== undefined) {
            this.searchBarProducts.focus()
        }
    }

    onSearchFieldBlurHandler = () => {
    }
    //#endregion

    //#region STATE
    state = {
        isLoading: false,
        isSearchLoading: false,
        isImageViewerVisible: false,
        bounceValue: new Animated.Value(heightPercentageToDP('100%')),
        strSearchString: '',
        arrayProducts: undefined,
        isSearchVisible: false,
    };
    //#endregion

    //#region BUTTON EVENTS
    /** MENU BUTTON EVENT */
    buttonMenuPressed = () => {
        Keyboard.dismiss();
        this.strSearchMessage = '';
        this.setState({ strSearchString: '', arrayProducts: undefined, isSearchLoading: false, isSearchVisible: false });
        Animated.spring(this.state.bounceValue, { toValue: -heightPercentageToDP('100%'), duration: 25, friction: 8, useNativeDriver: false }).start();
        this.props.navigation.openDrawer();
    }

    /** SEARCH PRESSED */
    buttonSearchPressed = () => {
        if (this.state.isSearchVisible) {
            // this.setState({ strSearchString: '' })
            Animated.spring(this.state.bounceValue, { toValue: -heightPercentageToDP('100%'), duration: 25, friction: 8, useNativeDriver: false }).start();
            if (this.searchBarProducts !== undefined) {
                // this.searchBarProducts.blur()
            }
            this.setState({ strSearchString: '', arrayProducts: [], isSearchVisible: false })
        } else {
            Animated.spring(this.state.bounceValue, { toValue: heightPercentageToDP('100%'), duration: 25, friction: 8, useNativeDriver: false }).start();
            if (this.searchBarProducts !== undefined) {
                // this.searchBarProducts.focus()
            }
            this.setState({ isSearchVisible: true })
        }
    }

    buttonViewAllFeaturedProductsPressed = () => {
        this.props.saveFilterParams({
            arraySelectedBrandIDs: [],
            arraySelectedCategoryIDs: [],
            shouldShowProductsWithPrescription: false,
            shouldShowProductsInStock: false,
            shouldShowFeaturedProducts: true
        })
        this.props.navigation.navigate('productsList', { listType: ProductsListType.featuredProducts })
    }

    buttonViewAllCategoriesPressed = () => {
        this.props.navigation.navigate('categories')
    }

    buttonViewAllBrandsPressed = () => {
        this.props.navigation.navigate('brands')
    }

    buttonViewAllReviewsPressed = () => {
        this.props.navigation.navigate('review', 
            {
                refreshScreen: this.getHomeScreenData,
            }
        )
    }
    //#endregion

    //#region SELECTION HANDLERS
    onPressSearchResultsHandler = () => {
        this.strSearchMessage = '';
        this.setState({ isSearchVisible: false, strSearchString: '', arrayProducts: [] })
        if (this.searchBarProducts !== undefined) {
            this.searchBarProducts.blur()
        }
        Animated.spring(this.state.bounceValue, { toValue: -heightPercentageToDP('16%'), duration: 25, friction: 8, useNativeDriver: false }).start();
    }
    /**
     * 
     * @param {The category selected by the user} selectedCategory 
     */
    onCategorySelectionHandler = selectedCategory => {
        this.props.saveFilterParams({
            arraySelectedBrandIDs: [],
            arraySelectedCategoryIDs: [selectedCategory.entity_id],
            shouldShowProductsWithPrescription: false,
            shouldShowProductsInStock: false,
            shouldShowFeaturedProducts: false
        })
        this.props.navigation.navigate('productsList', { listType: ProductsListType.category, entityFromHomeScreen: selectedCategory })
    }

    /**
     * 
     * @param {The brand selected by the user} selectedBrand 
     */
    onBrandSelectionHandler = selectedBrand => {
        this.props.saveFilterParams({
            arraySelectedBrandIDs: [selectedBrand.entity_id],
            arraySelectedCategoryIDs: [],
            shouldShowProductsWithPrescription: false,
            shouldShowProductsInStock: false,
            shouldShowFeaturedProducts: false
        })
        this.props.navigation.navigate('productsList', { listType: ProductsListType.brands, entityFromHomeScreen: selectedBrand })
    }
    //#endregion


    //#region NETWORK METHODS
    /**
    *
    * @param {The success response object} objSuccess
    */
    onGetProductsSuccess = objSuccess => {

        this.state.arrayProducts = [];
        this.strSearchMessage = strings('productsList.noProductsTitle');

        var arrProducts = []
        if (objSuccess.data.product_list !== undefined && objSuccess.data.product_list instanceof Array && objSuccess.data.product_list.length > 0) {
            arrProducts = objSuccess.data.product_list || []
        }
        this.setState({ arrayProducts: arrProducts, isSearchLoading: false });
    }

    /**
    *
    * @param {The failure response object} objFailure
    */
    onGetProductsFailure = objFailure => {
        this.refreshing = false

        this.strSearchMessage = objFailure.message;
        this.setState({ isSearchLoading: false })
    }

    /** REQUEST GET NOTIFICATIONS */
    /**
    *
    * @param {Check if it is pull-to-refresh event call or normal call and show loader accordingly} isForRefresh
    */
    callProductsAPI = (searchText) => {

        if (searchText.trim() == '') {
            this.setState({ strSearchString: '', arrayProducts: undefined, isSearchLoading: false });
            // if (this.searchBarProducts !== undefined) {
            //     this.buttonSearchPressed()
            // }
            return;
        }

        netStatus(isConnected => {
            if (isConnected) {

                let objGetProductsParams = {
                    store_id: this.props.objStoreDetails.store_id,
                    brand_id: '',
                    category: '',
                    in_stock: 0,
                    prescription_required: 0,
                    isFeatured: 0,
                    language_slug: this.props.lan,
                    page_no: 1,
                    count: PAGE_SIZE_PRODUCTS_LIST,
                    search_string: searchText || ''
                };
                this.strSearchMessage = '';
                this.setState({ isSearchLoading: true, arrayProducts: [] })
                getProducts(objGetProductsParams, this.onGetProductsSuccess, this.onGetProductsFailure, this.props);
            } else {
                this.strSearchMessage = strings('generalNew.noInternet');
                this.setState({ arrayProducts: [], isSearchLoading: false })
            }
        })
    }

    onConnectionChangeHandler = (isConnected) => {
        // showDialogue('HOME SCREEN CONNECTITIY HANDLER :: ' + isConnected)
        if (isConnected) {
            this.getHomeScreenData()
        }
    }

    /**
    *
    * @param {The success response object} objSuccess
    */
    onHomeSuccess = objSuccess => {
        console.log("ONHOMESUCCESS CALLED:::::::::::")
        this.strOnScreeMessage = '';
        this.strOnScreenTitle = '';
        this.arrayBrands = [];
        this.arrayCategories = [];
        this.objStoreDetails = {};
        this.arrayFeaturedProducts = [];
        this.arrayBannerImages = [];
        this.arrayReviews = [];
        this.storesCount = 3;

        var objData = objSuccess.data || {}
        this.refreshing = false;
        console.log("HOMENEWOBJSUCCESSDATA:::::::", objSuccess.data)

        if (objData.featured_brands !== undefined && objData.featured_brands instanceof Array) {
            this.arrayBrands = objData.featured_brands
        }

        if (objData.featured_category !== undefined && objData.featured_category instanceof Array) {
            this.arrayCategories = objData.featured_category
        }

        if (objData.store !== undefined && objData.store instanceof Array && objData.store.length > 0) {
            this.objStoreDetails = objData.store[0]
            this.props.saveCurrencySymbol(this.objStoreDetails.currency_symbol);
            this.props.saveStoreDetailsInRedux(this.objStoreDetails);
        }

        if (objData.slider !== undefined && objData.slider instanceof Array) {
            this.arrayBannerImages = objData.slider
        }

        if (objData.popular_item !== undefined && objData.popular_item instanceof Array) {
            this.arrayFeaturedProducts = objData.popular_item
        }

        if (objData.review !== undefined && objData.review instanceof Array) {
            this.arrayReviews = objData.review
        }

        if (objData.stores_count !== undefined) {
            this.storesCount = parseInt(objData.stores_count);
        }


        if (objData.google_map_api_key !== undefined && objData.google_map_api_key !== null && objData.google_map_api_key.trim().length > 0) {
            this.props.saveGoogleMapsAPIKeyInRedux(objData.google_map_api_key);
            console.log("GOOGLEMAPSAPIKEY:::::::::::", objData.google_map_api_key )
        }

        this.setState({ isLoading: false });
    };

    onChangeTokenSuccess = (objSuccess) => {
    }

    /**
    *
    * @param {The success response object} objSuccess
    */
    onHomeFailure = objFailure => {
        console.log("ONHOMEFAILURE CALLED:::::::::::::")
        this.strOnScreenTitle = objFailure.message;
        this.strOnScreeMessage = '';
        this.refreshing = false;
        this.setState({ isLoading: false });
    };

    onChangeTokenFailure = () => {
    };

    /**
     *
     * @param {The call API for get Product data}
     */
    getHomeScreenData = (isFromSideMenu) => {

        this.strOnScreenTitle = '';
        this.strOnScreeMessage = '';

        netStatus(isConnected => {
            if (isConnected) {
                let objHomeParams = { language_slug: this.props.lan, store_id: this.props.objStoreDetails.store_id };
                this.setState({ isLoading: !isFromSideMenu });
                fetchHomeScreenDetails(
                    objHomeParams,
                    this.onHomeSuccess,
                    this.onHomeFailure,
                    this.props,
                );
            } else {
                this.strOnScreenTitle = strings('generalNew.noInternetTitle');
                this.strOnScreeMessage = strings('generalNew.noInternet')
                this.setState({ isLoading: false })
                // showNoInternetAlert();
            }
        });
    };

    /**
     *
     * @param {The call API for get Product data}
     */
    changeUserToken = () => {
        netStatus(isConnected => {
            if (isConnected) {
                let objChangeTokenParams = {
                    user_id: this.props.UserID,
                    firebase_token: this.props.token
                };
                changeToken(objChangeTokenParams, this.onChangeTokenSuccess, this.onChangeTokenFailure, this.props)
            }
        })
    }

      // USER LANGUAGE API CALL

    onSuccessLanguage = (success) => {
        debugLog("Change Language Success ::::::::::: ", success)
    }

    /**
     * @param { on Failure repsonse object } failure
     */
    onFailureLanguage = (failure) => {
        debugLog("Change Language Failure ::::::::::: ", failure)
    }
    /** CALL API FOR LANGUAGE
     *
     */
    getUserLanguage = languageToSave => {
    
        let params = {
            language_slug: languageToSave,
            user_id: this.props.UserID,
        }
        console.log("GET_USER_LANGUAGE:::::::::::::::::::::::::::::::::::::::::::", params)
        userLanguage(params, this.onSuccessLanguage, this.onFailureLanguage)
    }

    // #cart Item's Total count
    getCartCount = () => {
        // let Cartdata = this.props.cartDetail
        if (this.props.cartDetail !== undefined) {
            if (this.props.cartDetail.items !== undefined && this.props.cartDetail.items.length > 0) {
                var count = 0;
                this.props.cartDetail.items.map((item) => {
                    count = count + item.quantity;
                });
                this.props.saveCartCount(count);
            } else {
                this.props.saveCartCount(0);
            }
        }
    };

    /** NAVIGATE TO DETAIL SCREEN */
    navigateToProductDetail = (data) => {
        Keyboard.dismiss()
        this.props.navigation.navigate("prodcutDetails", {
            selectedProductDetails: data
        })
    }
}

export default connect(
    state => {
        return {
            lan: state.userOperations.lan,
            cartCount: state.checkoutReducer.cartCount,
            cartDetail: state.checkoutReducer.cartDetails || {},
            isLoggedIn: state.userOperations.isLoggedIn,
            userDetails: state.userOperations.userDetails,
            token: state.userOperations.token,
            UserID: state.userOperations.userDetails.UserID,
            currencySymbol: state.contentOperations.currencySymbol,
            objFilter: state.filterOperations.objFilter || {},
            objStoreDetails: state.contentOperations.objStoreDetails || {},
        };
    },
    dispatch => {
        return {
            saveCartCount: data => {
                dispatch(saveCartCount(data));
            },
            changeCartButtonVisibility: data => {
                dispatch(changeCartButtonVisibility(data));
            },
            saveUserFCMInRedux: data => {
                dispatch(saveUserFCMInRedux(data));
            },
            saveNavigationSelection: dataToSave => {
                dispatch(saveNavigationSelection(dataToSave));
            },
            saveGoogleMapsAPIKeyInRedux: dataToSave => {
                dispatch(saveGoogleMapsApiKey(dataToSave));
            },
            saveCurrencySymbol: dataToSave => {
                dispatch(saveCurrencySymbol(dataToSave));
            },
            saveStoreDetailsInRedux: dataToSave => {
                dispatch(saveStoreDetails(dataToSave));
            },
            saveFilterParams: data => {
                dispatch(saveFilterData(data))
            },
            saveToken: token => {
                dispatch(saveUserFCMInRedux(token))
            }
        };
    },
)(HomeContainerNew);

export const stylesHomeContainer = StyleSheet.create({
    scrollContainer: { flex: 1, backgroundColor: EDColors.offWhite },
    mainContainer: { backgroundColor: EDColors.offWhite },
    subView: {
        position: 'absolute',
        top: -heightPercentageToDP('100%'),
        left: 0,
        right: 0,
        height: heightPercentageToDP('90%'),
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    placeholderContainer: { flex: 1, height: Metrics.screenHeight * 0.9, justifyContent: 'center', alignItems: 'center' },
    spinner: {
        flex: 1,
        marginVertical: 20,
        alignSelf: 'center',
        zIndex: 1000,
    },
    itemName: { fontSize: getProportionalFontSize(14), fontFamily: EDFonts.bold, color: EDColors.textAccount, paddingHorizontal: 15 },
});
