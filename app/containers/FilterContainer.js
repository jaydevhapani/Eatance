import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { strings } from '../locales/i18n'
import { EDColors } from '../utils/EDColors'
import EDThemeButton from '../components/EDThemeButton';
import { netStatus } from '../utils/NetworkStatusConnection'
import { getFilterValues } from '../utils/ServiceManager'
import BaseContainer from './BaseContainer'
import Assets from '../assets'
import Metrics from '../utils/metrics'
import EDProgressLoader from '../components/EDProgressLoader'
import EDPlaceholderComponent from '../components/EDPlaceholderComponent'
import EDRTLView from '../components/EDRTLView'
import { ImageBackground } from 'react-native'
import { heightPercentageToDP } from 'react-native-responsive-screen'
import FilterAttributeComponent from '../components/FilterAttributeComponent'
import EDRTLText from '../components/EDRTLText'
import EDSelectionList from '../components/EDSelectionList'
import { saveFilterData, resetFilterData, saveBrandsData, saveCategoriesData } from '../redux/actions/Filter'
import { ProductsListType, getProportionalFontSize, debugLog } from '../utils/EDConstants'
import { Icon } from 'react-native-elements'

class FilterContainer extends React.Component {

    //#region STATE
    state = {
        isLoading: false,
        selectedFilterAttributeIndex: this.props.navigation.state.params.isFilterSelection !== undefined ? this.props.navigation.state.params.isFilterSelection === ProductsListType.category ?
            1 : this.props.navigation.state.params.isFilterSelection === ProductsListType.brands ? 0 : 0
            : -1 || 0,
        isPrescriptionSelected: this.props.filterParams.shouldShowProductsWithPrescription,
        isInStockSelected: this.props.filterParams.shouldShowProductsInStock,
    }
    //#endregion

    //#region LIFE CYCLE METHODS
    /** CONSTRUCTOR */
    constructor(props) {
        super(props);
        this.isFilterSelection = this.props.navigation.state.params.isFilterSelection !== undefined ? this.props.navigation.state.params.isFilterSelection === ProductsListType.category ?
            1 : this.props.navigation.state.params.isFilterSelection === ProductsListType.brands ? 0 : -1
            : -1
        this.arrayFilterAttributes = [
            { icon: Assets.category_icon, title: strings('filterNew.categories') },
            { icon: Assets.brand_icon, title: strings('filterNew.brands') },
            { icon: Assets.other_icon, title: strings('filterNew.others') },
        ];
        this.strOnScreenMessage = '';
        this.strOnScreenSubtitle = '';
        this.arraySelectedBrands = this.props.filterParams.arraySelectedBrandIDs;
        this.arraySelectedCategories = this.props.filterParams.arraySelectedCategoryIDs;
        this.arrayCategories = this.props.arrayAvailableCategories;
        this.arrayBrands = this.props.arrayAvailableBrands;
    }

    /** DID MOUNT */
    componentDidMount() {
        if (this.arrayBrands !== undefined && this.arrayBrands.length === 0 &&
            this.arrayCategories !== undefined && this.arrayCategories.length === 0) {
            this.callGetFilterValuesAPI()
        }
    }

    /** RENDER */
    render() {
        return (
            <BaseContainer
                title={strings('filterNew.title')}
                left={'arrow-back'}
                // left={'arrow-back'}
                onLeft={this.buttonBackPressed}
            >
                {/* BACKGROUND IMAGE */}
                <ImageBackground
                    style={styles.backgroundImage}
                    source={Assets.bg_without_logo}
                    defaultSource={Assets.bg_without_logo}
                />
                <View
                    pointerEvents={this.state.isLoading ? 'none' : 'auto'}
                    style={styles.mainContainer}>

                    {/* PROGRESS LOADER */}
                    {this.state.isLoading ? <EDProgressLoader /> : null}

                    {this.strOnScreenMessage.length > 0
                        // DISPLAY PLACEHOLDER IF NO DATA
                        ? <EDPlaceholderComponent title={this.strOnScreenMessage} subTitle={this.strOnScreenSubtitle} />

                        // FILTER CONTAINER
                        : <EDRTLView style={styles.mainContainer}>
                            {/* LEFT SIDE ATTRIBUTES LIST */}
                            <View style={styles.filterAttributesList}>
                                {this.renderFilterAttributes()}
                            </View>

                            {/* RIGHT SIDE FILTER VALUES LIST */}
                            <View style={styles.filterValuesList}>

                                {/* VALUES CONTAINER VIEW */}
                                <View style={styles.mainContainer}>

                                    {this.state.selectedFilterAttributeIndex === 0

                                        // CATEGORIES LIST
                                        ? <EDSelectionList
                                            selectedIDs={this.arraySelectedCategories}
                                            onValueSelectionHandler={this.onCategoryValueSelectionHandler}
                                            arrayData={this.arrayCategories} />

                                        // BRANDS LIST
                                        : this.state.selectedFilterAttributeIndex === 1
                                            ? <EDSelectionList
                                                selectedIDs={this.arraySelectedBrands}
                                                isForBrands={true} onValueSelectionHandler={this.onBrandValueSelectionHandler}
                                                arrayData={this.arrayBrands} />

                                            // OTHERS VIEW
                                            : <View style={styles.othersParentContainer}>

                                                {/* IN STOCK */}
                                                <TouchableOpacity onPress={this.onInStockSelectionHandler} style={styles.touchableContainer}>
                                                    <EDRTLView style={styles.otherChildContainer}>
                                                        <EDRTLText style={styles.othersText} title={strings('filterNew.onlyInStock')} />
                                                        <Icon
                                                            // type={'material'} 
                                                            size={20}
                                                            name={this.state.isInStockSelected ? 'check-box' : 'check-box-outline-blank'} color={EDColors.secondary} />
                                                        {/* <EDRTLImage style={styles.othersCheckBox} source={this.state.isInStockSelected ? Assets.check : Assets.uncheck} /> */}
                                                    </EDRTLView>
                                                </TouchableOpacity >

                                            </View>
                                    }
                                </View>

                                {/* RESET & APPLY BUTTONS */}
                                <View style={styles.buttonsContainer}>
                                    <EDThemeButton textStyle={{ fontSize: getProportionalFontSize(16) }} onPress={this.buttonResetPressed} isTransparent={true} style={styles.resetButton} label={strings('filterNew.reset')} />
                                    <EDThemeButton textStyle={{ fontSize: getProportionalFontSize(16) }} onPress={this.buttonApplyPressed} style={styles.applyButton} label={strings('filterNew.apply')} />
                                </View>

                            </View>
                        </EDRTLView>
                    }
                </View>
            </BaseContainer >
        )
    }
    //#endregion

    //#region ON PRESS EVENTS
    /** LEFT SIDE FILTER ATTRIBUTE CHANGE EVENT */
    onPressFilterAttribute = (attribute, index) => {
        this.setState({ selectedFilterAttributeIndex: index })
    }

    /** OTHERS - PRESCRIPTION REQUIRED CHANGE EVENT */
    onPrescriptionRequiredSelectionHandler = () => {
        this.setState({ isPrescriptionSelected: !this.state.isPrescriptionSelected })
    }

    /** OTHERS - IN STOCK PRODUCT REQUIRED CHANGE EVENT */
    onInStockSelectionHandler = () => {
        this.setState({ isInStockSelected: !this.state.isInStockSelected })
    }

    /** CATEGORY SELECTION CHANGE HANDLER */
    onCategoryValueSelectionHandler = (selectedCategoryIndex, selectedCategory) => {
        if (this.arraySelectedCategories.includes(selectedCategory.entity_id)) {
            this.arraySelectedCategories.splice(this.arraySelectedCategories.indexOf(selectedCategory.entity_id), 1)
        } else {
            this.arraySelectedCategories.push(this.props.arrayAvailableCategories[selectedCategoryIndex].entity_id)
        }
    }

    /** BRAND SELECTION HANDLER */
    onBrandValueSelectionHandler = (selectedBrandIndex, selectedBrand) => {
        if (this.arraySelectedBrands.includes(selectedBrand.entity_id)) {
            this.arraySelectedBrands.splice(this.arraySelectedBrands.indexOf(selectedBrand.entity_id), 1)
        } else {
            this.arraySelectedBrands.push(this.props.arrayAvailableBrands[selectedBrandIndex].entity_id)
        }
    }
    //#endregion

    //#region HELPER METHODS
    /** RENDER LEFT SIDE FILTER TYPES VIEW */
    renderFilterAttributes = () => {
        return <View style={{ flex: 1, backgroundColor: EDColors.transparentWhite }}>
            {this.arrayFilterAttributes.map((attribute, index) => (this.isFilterSelection === index || this.isFilterSelection === -1 || index === 2) ? this.renderIndividualFilterAttribute(attribute, index) : null)}
        </View >
    }

    /** RENDER INDIVIDUAL FILTER TYPE BUTTON */
    renderIndividualFilterAttribute = (attribute, index) => {
        return (<FilterAttributeComponent
            isSelected={this.state.selectedFilterAttributeIndex === index}
            onPressFilterAttribute={this.onPressFilterAttribute}
            attribute={attribute}
            index={index} />)
    }
    //#endregion


    //#region BUTTON EVENTS
    /** BACK PRESSED */
    buttonBackPressed = () => {
        this.props.navigation.goBack()
    }

    /** RESET BUTTON EVENT */
    buttonResetPressed = () => {
        debugLog('this.isfilter :: ' + this.isFilterSelection)
        /** IF SCREEN IS LOADED FOR CATEGORIES, THEN WE SHOW ONLY BRANDS AND OTHERS OPTION */
        if (this.isFilterSelection == 1) {
            this.arraySelectedBrands = [];
            this.arraySelectedCategories = this.props.filterParams.arraySelectedCategoryIDs;
            this.setState({ isPrescriptionSelected: false, isInStockSelected: false })
            this.props.saveFilterParams({
                arraySelectedBrandIDs: [],
                arraySelectedCategoryIDs: this.props.filterParams.arraySelectedCategoryIDs,
                shouldShowProductsWithPrescription: false,
                shouldShowProductsInStock: false,
                shouldShowFeaturedProducts: false
            })
        }
        /** IF SCREEN IS LOADED FOR BRANDS, THEN WE SHOW ONLY CATEGORIES AND OTHERS OPTION */
        else if (this.isFilterSelection == 0) {

            this.arraySelectedCategories = [];
            this.arraySelectedBrands = this.props.filterParams.arraySelectedBrandIDs;
            this.setState({ isPrescriptionSelected: false, isInStockSelected: false })
            this.props.saveFilterParams({
                arraySelectedBrandIDs: this.props.filterParams.arraySelectedBrandIDs,
                arraySelectedCategoryIDs: [],
                shouldShowProductsWithPrescription: false,
                shouldShowProductsInStock: false,
                shouldShowFeaturedProducts: false
            })
        }
        /** IF SCREEN IS LOADED FOR PRODUCTS, THEN WE SHOW ALL 3 OPTIONS */
        else if (this.isFilterSelection == -1) {
            this.arraySelectedCategories = [];
            this.arraySelectedBrands = [];
            this.setState({ isPrescriptionSelected: false, isInStockSelected: false });
            this.props.resetFilterParams();
        }

        setTimeout(() => {
            if (this.props.navigation.state.params !== undefined && this.props.navigation.state.params.onApplyResetHandler !== undefined) {
                this.props.navigation.state.params.onApplyResetHandler()
            }
        }, 500);
    }

    /** APPLY BUTTON EVENT */
    buttonApplyPressed = () => {
        this.props.saveFilterParams({
            arraySelectedBrandIDs: this.arraySelectedBrands,
            arraySelectedCategoryIDs: this.arraySelectedCategories,
            shouldShowProductsWithPrescription: this.state.isPrescriptionSelected,
            shouldShowProductsInStock: this.state.isInStockSelected,
        })
        setTimeout(() => {
            if (this.props.navigation.state.params !== undefined && this.props.navigation.state.params.onApplyResetHandler !== undefined) {
                this.props.navigation.state.params.onApplyResetHandler()
            }
            this.props.navigation.goBack();
        }, 100);
    }
    //#endregion

    //#region NETWORK METHODS
    /**
     *
     * @param {The success response object} objSuccess
     */
    onGetFilterValuesSuccessHandler = objSuccess => {
        // ON SCREEN MESSAGE
        this.strOnScreenMessage = ''

        // SAVE BRANDS
        if (objSuccess.data.brand !== undefined && objSuccess.data.brand.length > 0) {
            this.arrayBrands = objSuccess.data.brand
            this.props.saveBrands(this.arrayBrands)
        }

        // SAVE CATEGORIES
        if (objSuccess.data.categories !== undefined && objSuccess.data.categories.length > 0) {
            this.arrayCategories = objSuccess.data.categories
            this.props.saveCategories(this.arrayCategories)
        }

        this.setState({ isLoading: false })
    }

    /**
    *
    * @param {The failure response object} objFailure
    */
    onGetFilterValuesFailureHandler = objFailure => {
        this.strOnScreenMessage = objFailure.message || ''
        this.setState({ isLoading: false })
    }

    /** REQUEST CHANGE PASSWORD */
    callGetFilterValuesAPI = () => {
        this.strOnScreenMessage = ''
        this.strOnScreenSubtitle = ''
        netStatus(isConnected => {
            if (isConnected) {
                let objGetFilterValuesParams = {
                    store_id: this.props.objStoreDetails.store_id,
                    language_slug: this.props.lan,
                    user_id: this.props.userDetails.UserID,
                };
                this.setState({ isLoading: true });
                getFilterValues(objGetFilterValuesParams, this.onGetFilterValuesSuccessHandler, this.onGetFilterValuesFailureHandler, this.props);
            } else {
                this.strOnScreenMessage = strings('generalNew.noInternetTitle');
                this.strOnScreenSubtitle = strings('generalNew.noInternet');
            }
        })
    }
}


//#region STYLES
const styles = StyleSheet.create({
    backgroundImage: { position: 'absolute', top: 0, left: 0, width: '100%', height: Metrics.screenHeight * 1.1 },
    mainContainer: { flex: 1, backgroundColor: EDColors.transparent },
    filterAttributesList: { flex: 2.5, backgroundColor: EDColors.transparentWhite, borderRightWidth: 1, borderRightColor: EDColors.separatorColor },
    filterValuesList: { flex: 7.5, backgroundColor: EDColors.transparentWhite },
    othersParentContainer: { flex: 1, paddingHorizontal: 10 },
    otherChildContainer: { marginVertical: 10, justifyContent: 'space-between', alignItems: 'center' },
    othersText: { flex: 1, color: EDColors.white, marginHorizontal: 5 },
    othersCheckBox: { tintColor: EDColors.homeButtonColor },
    touchableContainer: { marginHorizontal: 5 },
    buttonsContainer: { flexDirection: 'row', justifyContent: 'space-evenly' },
    resetButton: { marginTop: 0, height: heightPercentageToDP('6.2%'), flex: 1, borderRadius: 0, backgroundColor: EDColors.transparentWhite, padding: 0, margin: 0 },
    applyButton: { marginTop: 0, height: heightPercentageToDP('6.2%'), flex: 1, borderRadius: 0, backgroundColor: EDColors.secondary, padding: 0, margin: 0 }
})
//#endregion


export default connect(
    state => {
        return {
            lan: state.userOperations.lan,
            userDetails: state.userOperations.userDetails || {},
            arrayAvailableBrands: state.filterOperations.arrayBrands,
            arrayAvailableCategories: state.filterOperations.arrayCategories,
            filterParams: state.filterOperations.objFilter,
            objStoreDetails: state.contentOperations.objStoreDetails || {}
        }
    },
    dispatch => {
        return {
            saveFilterParams: data => {
                dispatch(saveFilterData(data))
            },
            resetFilterParams: _data => {
                dispatch(resetFilterData())
            },
            saveBrands: data => {
                dispatch(saveBrandsData(data))
            },
            saveCategories: data => {
                dispatch(saveCategoriesData(data))
            }
        }
    }
)(FilterContainer)
