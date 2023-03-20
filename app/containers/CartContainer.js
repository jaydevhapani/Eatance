import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import Toast from 'react-native-easy-toast';
import { saveCartDataInRedux, saveCartCount } from '../redux/actions/Checkout';
import { saveCartData } from '../utils/AsyncStorageHelper';
import ProductCartItemComponent from '../components/ProductCartItemComponent';
import { connect } from 'react-redux';
import { debugLog } from '../utils/EDConstants';
import { EDColors } from '../utils/EDColors';
import { strings } from '../locales/i18n';
import EDPopupView from '../components/EDPopupView';
import BaseContainer from './BaseContainer';
import EDConfirmationDialogue from '../components/EDConfirmationDialogue';
import { changeCartButtonVisibility } from '../redux/actions/FloatingButton';
import { NavigationEvents } from 'react-navigation';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import CheckOutBottomComponent from '../components/CheckOutBottomComponent';

class CartContainer extends React.PureComponent {
    constructor(props) {
        super(props);

        this.CartItemsArray = this.props.cartDetail;
        this.isView = this.props.navigation.state.params !== undefined && this.props.navigation.state.params.isview !== undefined
            ? this.props.navigation.state.params.isview
            : false;
    }

    // #Open modal to delete cart Item
    deleteModalOpen = () => {
        return (
            <EDPopupView isModalVisible={this.state.isDeleteVisible}>
                <EDConfirmationDialogue
                    onYesClick={this.onYesChangeHandler}
                    onNoClick={this.onNoChangeHandler}
                    title={strings('cartNew.deleteMsg')}
                />
            </EDPopupView>
        );
    };

    // #render Componets Product Cart Item
    productCartItemRender = ({ item, index }) => {
        console.log("ITEMS PASSED:::::::::::::::::::::,", item)
        return (
            <ProductCartItemComponent
                key={this.state.key}
                lan={this.props.lan}
                items={item}
                currencySymbol={this.props.currencySymbol}
                onPlusClick={value => this.plusClickHandler(value, index)}
                onMinusClick={value => this.minusClickHandler(value, index)}
                deleteClick={() => this.deleteClickHandler(index)}
            />
        );
    };
    // #render Componets
    render() {
        console.log("THIS.CARTITEMSARRAY::::::::",this.CartItemsArray)
        return (
            <BaseContainer
                title={strings('cartNew.title')}
                left={'arrow-back'}
                onLeft={this.navigateToBack}>
                <View style={style.mainView}>
                    <NavigationEvents onWillFocus={this.onWillFocusCartContainer} />
                    <Toast ref="toast" position="center" fadeInDuration={1} />
                    {this.deleteModalOpen()}
                    <FlatList
                        style={style.mainView}
                        data={this.CartItemsArray.items}
                        renderItem={this.productCartItemRender}
                        nestedScrollEnabled={true}
                        keyExtractor={(item, index) => item + index}
                    />
                    {this.isView ? null : (
                        <CheckOutBottomComponent
                            style={{ justifyContent: 'flex-end' }}
                            onPress={this.navigateToAddressScreen}
                            label={strings('cartNew.continue')}
                        />
                    )}
                </View>
            </BaseContainer>
        );
    }

    //#endregion

    //#region STATE

    state = {
        isDeleteVisible: false,
        key: 1,
    };

    // #store Items Data in redux and AsyncStorage
    updateUI(response) {
        this.cart_id = response.cart_id;

        var updatedCartDict = {
            store_id: response.store_id,
            items: response.items,
            coupon_name: response.coupon_name,
            cart_id: response.cart_id,
        };

        this.props.saveCartDataInRedux(updatedCartDict);
        saveCartData(updatedCartDict, () => { }, () => { });
        this.getCartCount(updatedCartDict)

    }
    // #store Items Count in redux and AsyncStorage
    getCartCount = data => {
        if (data !== undefined) {
            if (data.items !== undefined && data.items.length > 0) {
                var count = 0;
                data.items.map((item) => {
                    count = count + item.quantity;
                });
                this.props.saveCartCount(count);
            } else {
                this.props.navigation.goBack();
                this.props.saveCartCount(0);
            }
        }
    };
    // #Navigate to AddressList OR Login
    navigateToAddressScreen = () => {
        if (this.props.isLoggedIn) {
            this.props.navigation.navigate('addressListFromCart', {
                isSelectAddress: true,
            });
        } else {
            this.props.navigation.navigate('login', {
                isCheckout: true,
            });
        }
    };

    onNoChangeHandler = () => {
        this.deleteIndex = -1;
        this.setState({ isDeleteVisible: false });
    };

    // #Items delete Handler
    onYesChangeHandler = () => {
        var array = this.props.cartDetail;
        array.items.splice(this.deleteIndex, 1);
        this.updateUI(array);
        this.setState({ isDeleteVisible: false, key: this.state.key + 1 });
    };

    // Item count action button handler's
    plusClickHandler = (value, index) => {
        if (value > 0) {
            // console.log( "Plus action :::::"+this.CartItemsArray.items[index].item_in_stock +" "+this.CartItemsArray.items[index].item_max_quantity+ " " + this.CartItemsArray.items[index].quantity  )
            if (this.CartItemsArray.items[index].is_customize !== "1" || this.CartItemsArray.items[index].is_customize !== 1) {
                if (this.CartItemsArray.items[index].item_in_stock >= value) {
                    if (this.CartItemsArray.items[index].item_max_quantity >= value) {
                        this.CartItemsArray.items[index].quantity = value;
                        this.updateUI(this.CartItemsArray);
                    }
                };
            }
            if (this.CartItemsArray.items[index].is_customize === "1" || this.CartItemsArray.items[index].is_customize === 1) {
                let arr = this.CartItemsArray.items[index].addons_category_list[0].addons_list[0]
                if (arr.in_stock >= value) {
                    if (arr.max_quantity >= value) {
                        this.CartItemsArray.items[index].quantity = value;
                        this.updateUI(this.CartItemsArray);
                    }
                };
            }
        }
    }

    minusClickHandler = (value, index) => {
        if (value > 0) {
            this.CartItemsArray.items[index].quantity = value;
            this.updateUI(this.CartItemsArray);
        }
    };

    deleteClickHandler = index => {
        this.deleteIndex = index;
        this.setState({ isDeleteVisible: true, key: this.state.key + 1 });
    };
    onWillFocusCartContainer = () => {
        this.setState({ key: this.state.key + 1 })
        this.CartItemsArray = this.props.cartDetail;
        this.props.changeCartButtonVisibility({ shouldShowFloatingButton: false, currentScreen: this.props });
    }

    navigateToBack = () => {
        this.props.navigation.goBack()
    }
}

export default connect(
    state => {
        return {
            cartDetail: state.checkoutReducer.cartDetails,
            cartCount: state.checkoutReducer.cartCount,
            isLoggedIn: state.userOperations.isLoggedIn,
            lan: state.userOperations.lan,
            currencySymbol: state.contentOperations.currencySymbol
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
)(CartContainer);

//#region STYLE
const style = StyleSheet.create({
    mainView: {
        flex: 1
    },
    btnStyle: {
        backgroundColor: EDColors.white,
        borderRadius: 5,
        marginHorizontal: 10,
        paddingVertical: 10,
        justifyContent: 'flex-end'
    },
    edBtnStyle: {
        marginHorizontal: 10,
        paddingHorizontal: 60,
        borderRadius: 30,
    },
    cartButton: {
        marginHorizontal: 20, height: heightPercentageToDP('5%'), borderRadius: heightPercentageToDP('5%') / 2, paddingHorizontal: 40
    }
});
//#endregion