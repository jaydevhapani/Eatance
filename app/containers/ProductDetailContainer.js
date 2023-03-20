import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
} from 'react-native';
import BaseContainer from './BaseContainer';
import EDRTLText from '../components/EDRTLText';
import { EDColors } from '../utils/EDColors';
import { EDFonts } from '../utils/EDFontConstants';
import EDButton from '../components/EDButton';
import { connect } from 'react-redux';
import Toast from 'react-native-easy-toast';
import { saveCartDataInRedux, saveCartCount } from '../redux/actions/Checkout';
import { saveCartData } from '../utils/AsyncStorageHelper';
import EDRTLView from '../components/EDRTLView';
import { debugLog, getProportionalFontSize, funGetFrench_Curr } from '../utils/EDConstants';
import { strings } from '../locales/i18n';
import { NavigationEvents } from 'react-navigation';
import { changeCartButtonVisibility } from '../redux/actions/FloatingButton';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import EDAddonsModalComponent from '../components/EDAddonsModalComponent';
import EDPopupView from '../components/EDPopupView';
import EDImage from '../components/EDImage';
import { showValidationAlert } from '../utils/EDAlert';

class ProductDetailContainer extends React.PureComponent {
    //#region LIFE CYCLE METHODS
    /** CONSTRUCTOR */

    constructor(props) {
        super(props);
        this.quantity = 1;
        this.productDetail = JSON.parse(JSON.stringify(this.props.navigation.state.params.selectedProductDetails));
    }

    /** RENDER ADDITIONAL INFO COMPONENT */
    renderInfoComponent = (title, value, styleContainer) => {
        return (
            <EDRTLView style={[style.infoContainer, styleContainer]}>
                <EDRTLText style={style.additionalInfoLabel} title={title} />
                <EDRTLText style={style.additionalInfoValue} title={value === null || value === undefined || value.trim().length === 0 ? strings('productDetailsNew.notAvailable') : value} />
            </EDRTLView>
        );
    }

    addOnsCategoryModal = () => {
        return (
            <EDPopupView isModalVisible={this.state.isAddonsCategoryOpen}>
                <View style={style.addOnsStyle}>
                    <EDAddonsModalComponent
                        categoriesData={this.productDetail}
                        onAddnewItemHandler={this.addToCartAddOnsProductItem}
                        onAddRepeatItemHandler={this.addRepeatItemAction}
                    />
                </View>
            </EDPopupView>
        );
    };

    /** RENDER */
    render() {
        return (
            <BaseContainer
                title={strings('productDetailsNew.title')}
                left={'arrow-back'}
                onLeft={this.buttonBackPressed}>
                {this.productDetail.name !== undefined ?
                    <View style={{ flex: 1 }}>
                        <Toast ref="toast" position="center" fadeInDuration={1} />
                        <ScrollView style={style.mainContainer} contentContainerStyle={{ paddingBottom: this.props.cartCount > 0 ? 80 : 10 }}>
                            <View style={style.mainContainer}>
                                {this.addOnsCategoryModal()}
                                <NavigationEvents onWillFocus={this.onWillFocusNavigation} />
                                {/* PRODUCT IMAGE */}
                                {/* <ImageBackground defaultSource={Assets.bg_without_logo} source={Assets.bg_without_logo} style={style.productImage}> */}
                                <EDImage source={this.productDetail.image}
                                    style={[style.productImage, { backgroundColor: EDColors.transparent }]}
                                />
                                {/* </ImageBackground> */}

                                {/* PRODUCT NAME */}
                                {/* {this.productDetail.name !== undefined && this.productDetail.name.trim().length > 0
                                    ? <EDRTLText
                                        style={[style.titleText, { marginTop: 20 }]}
                                        title={strings('productDetailsNew.productName')}
                                    />
                                    : null} */}

                                {this.productDetail.name !== undefined && this.productDetail.name.trim().length > 0
                                    ? <EDRTLText
                                        style={style.productName}
                                        title={this.productDetail.name}
                                    />
                                    : null}


                                {/* PRODUCT PRICE & QUANTITY */}
                                {this.productDetail.is_customize === '0' &&
                                    this.productDetail.isInStock === '1' ? (
                                        <EDRTLView
                                            style={[style.commonView]}>
                                            {this.productDetail.is_customize === '1'
                                                ? null
                                                :
                                                <EDRTLView>
                                                    <EDRTLText style={style.productPrice} title={strings('productDetailsNew.price') + ': ' + this.props.currencySymbol + funGetFrench_Curr(this.productDetail.offer_price == "" ? this.productDetail.price : this.productDetail.offer_price, 1, this.props.lan)} />
                                                    {this.productDetail.offer_price !== "" ?
                                                        <EDRTLText style={style.productDecoratedPrice} title={this.props.currencySymbol + funGetFrench_Curr(this.productDetail.price, 1, this.props.lan)} />
                                                        : null}
                                                </EDRTLView>
                                            }
                                            <EDRTLView style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                {this.state.quantity > 1 ?
                                                <MaterialIcon onPress={this.buttonMinusPressed} size={20} color={EDColors.homeButtonColor} name="remove-circle" /> : null }

                                                <View>
                                                    <Text style={style.qtystyle}>{this.state.quantity}</Text>
                                                </View>

                                                <MaterialIcon onPress={this.buttonPlusPressed} size={20} color={EDColors.homeButtonColor} name="add-circle" />
                                            </EDRTLView>
                                        </EDRTLView>
                                    ) : null}


                                {/* PRODUCT DESCRIPTION */}
                                {this.productDetail.menu_detail !== undefined && this.productDetail.menu_detail.trim().length > 0
                                    ? <EDRTLText
                                        style={[style.titleText, { marginTop: 20 }]}
                                        title={strings('productDetailsNew.description')}
                                    />
                                    : null}

                                {this.productDetail.menu_detail !== undefined && this.productDetail.menu_detail.trim().length > 0
                                    ? <EDRTLText
                                        style={[style.valueText]}
                                        title={this.productDetail.menu_detail}
                                    />
                                    : null}

                                {/* PRODUCT COMPOSITION */}
                                {this.productDetail.composition !== undefined && this.productDetail.composition.trim().length > 0
                                    ? <EDRTLText
                                        style={style.titleText}
                                        title={strings('productDetailsNew.composition')}
                                    />
                                    : null}

                                {this.productDetail.composition !== undefined && this.productDetail.composition.trim().length > 0
                                    ? <EDRTLText
                                        style={style.valueText}
                                        title={this.productDetail.composition}
                                    />
                                    : null}

                                {/* ADDITIONAL INFORMATION */}
                                <EDRTLText
                                    style={[style.titleText, { marginBottom: 10 }]}
                                    title={strings('productDetailsNew.additionalInformation')}
                                />

                                {/* PHOTO-ID REQUIRED */}
                                {/* {this.renderInfoComponent(strings('productDetailsNew.isPrescriptionRequired'), this.productDetail.isPrescriptionRequired === '0' ? strings('buttonTitles.no') : strings('buttonTitles.yes'), style.alternateColor1)} */}

                                {/* IN STOCK */}
                                {this.renderInfoComponent(strings('productDetailsNew.isInStock'), this.productDetail.isInStock === '0' ? strings('buttonTitles.no') : strings('buttonTitles.yes'), style.alternateColor1)}

                                {/* CATEGORY */}
                                {this.renderInfoComponent(strings('productDetailsNew.category'), this.productDetail.category_name, style.alternateColor2)}

                                {/* BRAND */}
                                {this.renderInfoComponent(strings('productDetailsNew.brand'), this.productDetail.brand_name, style.alternateColor1)}

                                {/* FOOD TYPE */}
                                {this.productDetail.food_type_name != undefined && this.productDetail.food_type_name != null && this.productDetail.food_type_name != '' ? 
                                this.renderInfoComponent(
                                  strings('generalNew.foodType'),
                                  this.productDetail.food_type_name,
                                  style.alternateColor2,
                                ) : null }

                            </View>
                        </ScrollView>

                        {/* ADD TO CART BUTTON */}
                        {this.props.objStoreDetails.timings.closing.toLowerCase() == "open" && this.productDetail.isInStock === '1' ? (
                            <EDButton
                                style={style.cartButton}
                                label={strings('productDetailsNew.addToCart')}
                                onPress={this.buttonAddToCartPressed}
                            />
                        ) : null}
                    </View>
                    : null}
            </BaseContainer>
        );
    }

    /** STATE */
    state = {
        quantity: 1,
        isAddonsCategoryOpen: false
    };

    onWillFocusNavigation = () => {
        this.props.changeCartButtonVisibility({ shouldShowFloatingButton: true, currentScreen: this.props });
    }

    // #store Items Data in redux and AsyncStorage
    storeData = data => {
        this.cartArray = [];
        this.cartData = {};

        const objectWithoutKey = (object, key) => {
            const { [key]: deletedKey, ...otherKeys } = object;
            return otherKeys;
        }
        var Category_data = objectWithoutKey(data, 'addons_category_list')


        if (Category_data.is_customize === "1") {

            Category_data['addons_category_list'] = Category_data['selected_addons_category_list']
            delete Category_data['selected_addons_category_list']
        }
        let cartdata = this.props.cartDetail;
        if (
            cartdata != undefined &&
            cartdata.items !== undefined
        ) {
            if (cartdata.items.length > 0) {
                this.cartArray = cartdata.items;
                var repeatArray = this.cartArray.filter(item => {
                    return item.menu_id === Category_data.menu_id && Category_data.is_customize === "0";
                });

                if (repeatArray.length > 0) {
                    // repeatArray[0].quantity =
                    //     this.state.quantity + 1;
                    repeatArray[repeatArray.length - 1].quantity = repeatArray[repeatArray.length - 1].quantity + this.state.quantity;
                } else {
                    Category_data.quantity = this.state.quantity;
                    this.cartArray.push(Category_data);
                }

                this.cartData = {
                    store_id: this.props.objStoreDetails.store_id,
                    items: this.cartArray,
                    coupon_name:
                        cartdata.coupon_name.length > 0 ? cartdata.coupon_name : '',
                    cart_id: cartdata.cart_id,
                };
            } else {
                Category_data.quantity = this.state.quantity;
                this.cartData = {
                    store_id: this.props.objStoreDetails.store_id,
                    items: [Category_data],
                    coupon_name: '',
                    cart_id: 0,
                };
            }
        } else {
            Category_data.quantity = this.state.quantity;
            this.cartData = {
                store_id: this.props.objStoreDetails.store_id,
                items: [Category_data],
                coupon_name: '',
                cart_id: 0,
            };
        }

        this.refs.toast.show(strings('generalNew.itemAddedSuccessfully'), 1000);

        this.props.saveCartDataInRedux(this.cartData);
        this.getCartCount(this.cartData);
        saveCartData(this.cartData, () => { }, () => { });
        this.setState({ key: this.state.key + 1, quantity: 1 });
    };

    // #cart Item's Total count
    getCartCount = data => {
        // let Cartdata = this.props.cartDetail
        if (data !== undefined) {
            if (data.items !== undefined && data.items.length > 0) {
                var count = 0;
                data.items.map((item) => {
                    count = count + item.quantity;
                });
                this.props.saveCartCount(count);
            } else if (data.items.length === 0) {
                this.props.saveCartCount(0);
            }
        }
    };

    buttonBackPressed = () => {
        this.props.navigation.goBack();
    };

    buttonMinusPressed = () => {
        if (this.state.quantity > 1) {
            this.setState({ quantity: this.state.quantity - 1 });
        }
    }

    buttonPlusPressed = () => {
        this.setState({ quantity: this.state.quantity + 1 });
    }

    buttonAddToCartPressed = () => {
        let cartdata = this.props.cartDetail;
        var currentQTY = 0
        if (
            cartdata != undefined &&
            cartdata.items !== undefined
        ) {
            if (cartdata.items.length > 0) {
                this.cartArray = cartdata.items;
                if (this.cartArray.filter(item => { return item.menu_id == this.productDetail.menu_id }).length !== 0) {
                    if (this.cartArray.filter(item => { return item.menu_id == this.productDetail.menu_id })[0].is_customize == 0) {
                        currentQTY = this.cartArray.filter(item => { return item.menu_id == this.productDetail.menu_id })[0].quantity
                    }
                }
            }
        }
        else
            currentQTY = 0
        if (this.productDetail.is_customize === '0') {
            if (this.productDetail.item_in_stock >= currentQTY + this.state.quantity) {
                if (this.productDetail.item_max_quantity >= currentQTY + this.state.quantity) {
                    this.storeData(this.productDetail);
                }
                else
                    this.refs.toast.show(strings("generalNew.maxQuantity") + this.productDetail.item_max_quantity, 1500);
            }
            else
                this.refs.toast.show(strings("generalNew.noMoreStock"), 1500);
        } else {
            this.props.cartDetail !== (undefined || null) &&
                this.props.cartDetail.items !== undefined &&
                this.props.cartDetail.items.some(item => item.menu_id === this.productDetail.menu_id && item.quantity >= 1) ?
                this.setState({
                    isAddonsCategoryOpen: true,
                }) :
                this.props.navigation.navigate('addOns', {
                    getCategoryDetails: this.CategoryBackFromCategory,
                    subCategoryArray: this.productDetail,
                });
        }
    }


    CategoryBackFromCategory = data => {
        if (this.props.cartDetail !== undefined && this.props.cartDetail !== null) {
            if (this.props.cartDetail.items !== undefined && this.props.cartDetail.items !== null) {
                this.cartRepeatData = {}
                this.selectedArray = this.props.cartDetail.items.filter(items => {
                    return items.menu_id === this.productDetail.menu_id;
                });
                let repeatArray = this.selectedArray.map(item => item.addons_category_list).map(item => item[0].addons_category_id)
                let cartArray = this.selectedArray.map(item => item.addons_category_list).map(item => item[0].addons_list)
                if (repeatArray.includes(data.selected_addons_category_list[0].addons_category_id)) {
                    let arr = cartArray.map(data => data[0].add_ons_id)
                    let index = arr.indexOf(data.selected_addons_category_list[0].addons_list[0].add_ons_id);
                    if (this.selectedArray[index].addons_category_list[0].addons_list[0].in_stock > this.selectedArray[
                        index
                    ].quantity) {
                        if (this.selectedArray[index].addons_category_list[0].addons_list[0].max_quantity > this.selectedArray[
                            index
                        ].quantity) {
                            this.selectedArray[
                                index
                            ].quantity =
                                this.selectedArray[index].quantity + 1;
                            // this.setState({ key: this.state.key + 1 });

                            this.setState({
                                isAddonsCategoryOpen: false,
                            });
                            this.props.saveCartDataInRedux(this.props.cartDetail);
                            this.getCartCount(this.props.cartDetail);
                            saveCartData(this.props.cartDetail, () => { }, () => { });
                        }
                        else {
                            showValidationAlert(strings("generalNew.maxQuantity") + this.selectedArray[index].addons_category_list[0].addons_list[0].max_quantity)
                            this.setState({
                                isAddonsCategoryOpen: false,
                            });
                        }
                    }
                    else {
                        showValidationAlert(strings("generalNew.noMoreStock"));
                        this.setState({
                            isAddonsCategoryOpen: false,
                        });
                    }

                }
                else
                    this.storeData(data)
            }
            else
                this.storeData(data)
        }

        else
            this.storeData(data);
    };

    addToCartAddOnsProductItem = () => {

        this.setState({ isAddonsCategoryOpen: false })
        this.selectedArray = this.props.cartDetail.items.filter(items => {
            return items.menu_id === this.productDetail.menu_id;
        });
        let repeatArray = this.selectedArray[this.selectedArray.length - 1].addons_category_list[0].addons_category_id
        // newArray.filter()
        this.props.navigation.navigate('addOns', {
            getCategoryDetails: this.CategoryBackFromCategory,
            subCategoryArray: this.productDetail,
            lastArray: repeatArray
        });
    }

    addRepeatItemAction = () => {
        this.cartRepeatData = {}
        this.selectedArray = this.props.cartDetail.items.filter(items => {
            return items.menu_id === this.productDetail.menu_id;
        });
        let repeatArray = this.selectedArray[this.selectedArray.length - 1].addons_category_list[0].addons_list[0]

        if (repeatArray.in_stock > this.selectedArray[
            this.selectedArray.length - 1
        ].quantity) {
            if (repeatArray.max_quantity > this.selectedArray[
                this.selectedArray.length - 1
            ].quantity) {
                this.selectedArray[
                    this.selectedArray.length - 1
                ].quantity =
                    this.selectedArray[this.selectedArray.length - 1].quantity + 1;
                // this.setState({ key: this.state.key + 1 });

                this.setState({
                    isAddonsCategoryOpen: false,
                });
                this.props.saveCartDataInRedux(this.props.cartDetail);
                this.getCartCount(this.props.cartDetail);
                saveCartData(this.props.cartDetail, () => { }, () => { });

            }
            else {
                showValidationAlert(strings("generalNew.maxQuantity") + repeatArray.max_quantity)
                this.setState({
                    isAddonsCategoryOpen: false,
                });
            }
        }
        else {
            showValidationAlert(strings("generalNew.noMoreStock"));
            this.setState({
                isAddonsCategoryOpen: false,
            });
        }
    };
}

export const style = StyleSheet.create({
    infoContainer: { flex: 1, padding: 20, justifyContent: 'space-between' },
    mainContainer: { backgroundColor: EDColors.offWhite, flex: 1 },
    productImage: { width: '100%', height: 200, backgroundColor: EDColors.white, paddingVertical: 20 },
    productName: { color: EDColors.productNameColor, fontFamily: EDFonts.bold, margin: 20, marginBottom: 0, fontSize: getProportionalFontSize(16) },
    titleText: { color: EDColors.primary, fontFamily: EDFonts.bold, fontSize: getProportionalFontSize(16), marginHorizontal: 20 },
    valueText: { color: EDColors.text, margin: 20, marginTop: 5 },
    alternateColor1: { backgroundColor: EDColors.white },
    alternateColor2: { backgroundColor: EDColors.offWhite },
    cartButton: { paddingHorizontal: 20, alignSelf: 'center', marginVertical: 10, backgroundColor: EDColors.homeButtonColor },
    additionalInfoLabel: { color: EDColors.text, fontFamily: EDFonts.regular, fontSize: getProportionalFontSize(16) },
    additionalInfoValue: { color: EDColors.productNameColor, fontFamily: EDFonts.semiBold, fontSize: getProportionalFontSize(16) },
    productPrice: { color: EDColors.primary, fontFamily: EDFonts.bold, fontSize: getProportionalFontSize(16), marginHorizontal: 0 },
    productDecoratedPrice: { marginHorizontal: 10, color: EDColors.text, textDecorationLine: "line-through", fontFamily: EDFonts.bold, fontSize: getProportionalFontSize(16) },
    addOnsStyle: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    commonView: {
        alignItems: 'center',
        margin: 20,
        marginBottom: 0,
        justifyContent: 'space-between'
    },
    roundButton: {
        padding: 2,
        margin: 2,
        borderRadius: 15,
        backgroundColor: EDColors.primary,
        justifyContent: 'center',
    },
    minusImage: {
        marginVertical: 9,
        width: 10,
        marginHorizontal: 5,
    },
    qtystyle: {
        marginHorizontal: 5,
    },
    addImage: {
        margin: 5,
        height: 10,
        width: 10,
    },
});

export default connect(
    state => {
        return {
            lan: state.userOperations.lan,
            cartDetail: state.checkoutReducer.cartDetails,
            productDetail: state.checkoutReducer.productDetails,
            currencySymbol: state.contentOperations.currencySymbol,
            cartCount: state.checkoutReducer !== undefined ? state.checkoutReducer.cartCount : 0,
            objStoreDetails: state.contentOperations.objStoreDetails
        };
    },
    dispatch => {
        return {
            saveCartCount: data => {
                dispatch(saveCartCount(data));
            },
            saveCartDataInRedux: data => {
                dispatch(saveCartDataInRedux(data));
            },
            changeCartButtonVisibility: data => {
                dispatch(changeCartButtonVisibility(data));
            }
        };
    },
)(ProductDetailContainer);
