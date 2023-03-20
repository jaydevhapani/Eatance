import React from 'react'
import { View, StyleSheet, SafeAreaView, FlatList, RefreshControl } from 'react-native'
import { connect } from 'react-redux'
import { strings } from '../locales/i18n'
import { EDColors } from '../utils/EDColors'
import { debugLog, ProductsListType } from '../utils/EDConstants';
import { netStatus } from '../utils/NetworkStatusConnection'
import { getBrands } from '../utils/ServiceManager'
import { showDialogue } from '../utils/EDAlert'
import BaseContainer from './BaseContainer'
import { NavigationEvents } from 'react-navigation';
import EDProgressLoader from '../components/EDProgressLoader'
import EDPlaceholderComponent from '../components/EDPlaceholderComponent'
import { changeCartButtonVisibility } from '../redux/actions/FloatingButton'
import { saveNavigationSelection } from '../redux/actions/Navigation'
import BrandComponent from '../components/BrandComponent'
import { saveFilterData } from '../redux/actions/Filter'

const PAGE_SIZE_BRANDS = 20

class BrandsContainer extends React.Component {

    //#region STATE
    state = {
        isLoading: false,
        arrayBrands: undefined,
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
    }

    /** DID FOCUS */
    onWillFocusBrandsContainer = () => {
        this.strOnScreenMessage = ''
        this.state.arrayBrands = undefined;

        // CALL API WHENEVER USER COMES TO THIS SCREEN
        // if ((this.state.arrayBrands !== undefined && this.shouldLoadMore) ||
        //     (this.state.arrayBrands === undefined && !this.shouldLoadMore) ||
        //     (this.state.arrayBrands.length === 0 && this.shouldLoadMore))
        //     {
        //  this.callBrandsAPI()
        // }
        this.callBrandsAPI()
        this.props.changeCartButtonVisibility({ shouldShowFloatingButton: true, currentScreen: this.props });
    }

    /** RENDER */
    render() {
        return (
            <BaseContainer
                title={strings('brands.title')}
                left={'arrow-back'}
                onLeft={this.buttonBackPressed}
            >
                {/* SCREEN FOCUS EVENT */}
                <NavigationEvents onWillFocus={this.onWillFocusBrandsContainer} />

                {/* PARENT VIEW */}
                <View
                    pointerEvents={this.state.isLoading ? 'none' : 'auto'}
                    style={styles.mainViewStyle}>

                    {/* SAFE AREA VIEW */}
                    <SafeAreaView style={styles.mainViewStyle}>

                        {/* LOADER */}
                        {this.state.isLoading ? <EDProgressLoader /> : null}

                        {/* CHECK IF WE HAVE NOTIFICATIONS, ELSE DISPLAY PLAHOLDER VIEW */}
                        {this.state.arrayBrands !== undefined && this.state.arrayBrands.length > 0
                            ? <FlatList
                                showsVerticalScrollIndicator={false}
                                numColumns={2}
                                contentContainerStyle={{ paddingBottom: this.props.cartCount > 0 ? 100 : 10 }}
                                style={styles.notificationsList}
                                data={this.state.arrayBrands}
                                extraData={this.state}
                                renderItem={this.renderBrandItem}
                                keyExtractor={(item, index) => item + index}
                                onEndReached={this.onLoadMoreEventHandler}
                                onEndReachedThreshold={0.5}
                                refreshControl={<RefreshControl
                                    refreshing={this.refreshing}
                                    title={strings('brands.fetchingNew')}
                                    titleColor={EDColors.textAccount}
                                    tintColor={EDColors.textAccount}
                                    colors={[EDColors.textAccount]}
                                    onRefresh={this.onPullToRefreshHandler} />}
                            />
                            : this.strOnScreenMessage.length > 0
                                ? <EDPlaceholderComponent onBrowseButtonHandler={this.buttonBrowsePressed} title={this.strOnScreenMessage} subTitle={this.strOnScreenSubtitle} />
                                : null}
                    </SafeAreaView>
                </View>
            </BaseContainer >
        )
    }
    //#endregion

    //#region HELPER METHODS
    /** LOAD MORE EVENT */
    onLoadMoreEventHandler = () => {
        if (this.shouldLoadMore) {
            this.callBrandsAPI();
        }
    }

    /** BRAND ITEM */
    renderBrandItem = (brandToLoad) => {
        return <BrandComponent onSelectionHandler={this.onBrandSelectionHandler} data={brandToLoad.item} />
    }

    /** BRAND SELECTION HANDLER */
    onBrandSelectionHandler = (selectedBrand) => {
        this.props.saveFilterParams({
            arraySelectedBrandIDs: [selectedBrand.entity_id],
            arraySelectedCategoryIDs: [],
            shouldShowProductsWithPrescription: false,
            shouldShowProductsInStock: false,
            shouldShowFeaturedProducts: false
        })
        this.props.navigation.navigate('productsList', { listType: ProductsListType.brands, entityFromHomeScreen: selectedBrand })
    }

    /** PULL TO REFRESH HANDLER */
    onPullToRefreshHandler = () => {
        this.refreshing = false
        this.shouldLoadMore = false
        this.state.arrayBrands = []
        // this.setState({ arrayBrands: undefined })
        this.callBrandsAPI(true)
    }
    //#endregion

    //#region BUTTON EVENTS
    /** MENU PRESSED */
    buttonBackPressed = () => {
        this.props.navigation.goBack()
    }

    /** BROWSE BUTTON HANDLER */
    buttonBrowsePressed = () => {
        this.buttonBackPressed()
    }
    //#endregion

    //#region NETWORK METHODS

    /**
     *
     * @param {The success response object} objSuccess
     */
    onGetBrandsSuccess = objSuccess => {

        this.strOnScreenMessage = strings('brands.noBrandsFoundTitle');
        this.strOnScreenSubtitle = strings('brands.noBrandsFoundMessages')


        if (this.state.arrayBrands === undefined) {
            this.state.arrayBrands = [];
        }


        if (objSuccess.data.brand_list !== undefined && objSuccess.data.brand_list.length > 0) {

            let arrBrands = objSuccess.data.brand_list || []
            let totalBrandsCount = objSuccess.data.brand_count || 0
            this.shouldLoadMore = this.state.arrayBrands.length + arrBrands.length < totalBrandsCount
            this.setState({ arrayBrands: [...this.state.arrayBrands, ...arrBrands], isLoading: false });

        } else {
            this.setState({ isLoading: false })
        }
        this.refreshing = false
    }

    /**
    *
    * @param {The failure response object} objFailure
    */
    onGetBrandsFailure = objFailure => {
        this.strOnScreenMessage = objFailure.message || ''
        this.setState({ isLoading: false })
        showDialogue(objFailure.message)
        this.refreshing = false
    }

    /** REQUEST GET NOTIFICATIONS */
    /**
    *
    * @param {Check if it is pull-to-refresh event call or normal call and show loader accordingly} isForRefresh
    */
    callBrandsAPI = (isForRefresh = false) => {

        this.strOnScreenMessage = ''
        this.strOnScreenSubtitle = ''
        netStatus(isConnected => {
            if (isConnected) {

                let objGetBrandsParams = {
                    store_id: this.props.objStoreDetails.store_id,
                    language_slug: this.props.lan,
                    count: PAGE_SIZE_BRANDS,
                    page_no: (this.state.arrayBrands && !isForRefresh) ? parseInt(this.state.arrayBrands.length / PAGE_SIZE_BRANDS) + 1 : 1,
                };
                if (!isForRefresh) {
                    this.setState({ isLoading: this.state.arrayBrands === undefined });
                }
                getBrands(objGetBrandsParams, this.onGetBrandsSuccess, this.onGetBrandsFailure, this.props);

            } else {
                this.refreshing = false
                if (this.state.arrayBrands === undefined) {
                    this.strOnScreenMessage = strings('generalNew.noInternetTitle');
                    this.strOnScreenSubtitle = strings('generalNew.noInternet');
                    this.setState({ arrayBrands: [] })
                } else {
                    this.strOnScreenMessage = '';
                    this.strOnScreenSubtitle = '';
                }
            }
        })
    }
}


//#region STYLES
const styles = StyleSheet.create({
    mainViewStyle: {
        flex: 1,
        backgroundColor: EDColors.offWhite,
    },
    notificationsList: {
        margin: 20,
    },
})
//#endregion

//#region REDUX
export default connect(
    state => {
        return {
            lan: state.userOperations.lan,
            userDetails: state.userOperations.userDetails || {},
            cartCount: state.checkoutReducer !== undefined ? state.checkoutReducer.cartCount : 0,
            objStoreDetails: state.contentOperations.objStoreDetails || {},
        }
    },
    dispatch => {
        return {
            changeCartButtonVisibility: data => {
                dispatch(changeCartButtonVisibility(data));
            },
            saveNavigationSelection: dataToSave => {
                dispatch(saveNavigationSelection(dataToSave));
            },
            saveFilterParams: data => {
                dispatch(saveFilterData(data))
            }
        }
    }
)(BrandsContainer)
//#endregion
