import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import {connect} from 'react-redux';
import {saveCartDataInRedux, saveCartCount} from '../redux/actions/Checkout';
import Toast from 'react-native-easy-toast';
import {
  debugLog,
  isRTLCheck,
  getProportionalFontSize,
  funGetFrench_Curr,
  STORE_ERROR,
} from '../utils/EDConstants';
import {EDColors} from '../utils/EDColors';
import Metrics from '../utils/metrics';
import ProductCartItemComponent from '../components/ProductCartItemComponent';
import {netStatus} from '../utils/NetworkStatusConnection';
import {addToCart, addOrder} from '../utils/ServiceManager';
import {showDialogue, showNoInternetAlert} from '../utils/EDAlert';
import {saveCartData, clearCartData} from '../utils/AsyncStorageHelper';
import EDRTLText from '../components/EDRTLText';
import EDRTLView from '../components/EDRTLView';
import EDImage from '../components/EDImage';
import {strings} from '../locales/i18n';
import BaseContainer from './BaseContainer';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import {EDFonts} from '../utils/EDFontConstants';
import {NavigationActions, StackActions} from 'react-navigation';
import EDPopupView from '../components/EDPopupView';
import EDConfirmationDialogue from '../components/EDConfirmationDialogue';
import CheckOutBottomComponent from '../components/CheckOutBottomComponent';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Moment from 'moment';
import {debug} from 'react-native-reanimated';
import EDItemDetails from '../components/EDItemDetails';

class CheckOutContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.CartItemsArray = this.props.cartDetail;
    this.priceArray = [];
    this.cart_id = 0;
    this.delivery_charges = '';
    this.coupon_name = '';
    this.updatedCart = this.props.cartDetail || {};
    (this.featured_items = []),
      (this.featured_items_image = []),
      (this.selectedItem = '');
  }
  // #render Componets

  deleteModalOpen = () => {
    return (
      <EDPopupView isModalVisible={this.state.isDeleteVisible}>
        <EDConfirmationDialogue
          onYesClick={this.onYesChangeHandler}
          onNoClick={this.onNoClick}
          title={strings('checkoutNew.deleteMsg')}
        />
      </EDPopupView>
    );
  };

  priceDetailssComponent = (item, index) => {
    return (
      <View>
        {index !== this.priceArray.length - 1 ? (
          <View>
            {item.value !== undefined &&
            item.value !== null &&
            item.value !== '' ? (
              <EDRTLView style={style.container}>
                <EDRTLText
                  style={style.itemTitle}
                  title={item.label !== undefined ? item.label : ''}
                />
                <EDRTLText
                  style={[
                    style.price,
                    {
                      color:
                        item.label_key.toLowerCase() == 'discount'
                          ? EDColors.text
                          : EDColors.text,
                    },
                  ]}
                  title={
                    (item.label_key.toLowerCase() === 'discount'
                      ? ' - '
                      : item.label_key.toLowerCase().includes('delivery')
                      ? ' + '
                      : item.label_key.toLowerCase().includes('service')
                      ? ' + '
                      : '') +
                    this.props.currencySymbol +
                    funGetFrench_Curr(item.value, 1, this.props.lan)
                  }
                />
              </EDRTLView>
            ) : null}
          </View>
        ) : (
          <EDRTLView style={style.container}>
            <EDRTLText
              style={style.itemTitleBold}
              title={item.label !== undefined ? item.label : ''}
            />
            <EDRTLText
              style={style.priceBold}
              title={
                this.props.currencySymbol +
                funGetFrench_Curr(item.value, 1, this.props.lan)
              }
            />
          </EDRTLView>
        )}
      </View>
    );
  };

  cartComponentRender = ({item, index}) => {
    return (
      <ProductCartItemComponent
        key={this.state.key}
        lan={this.props.lan}
        items={item}
        currencySymbol={this.props.currencySymbol}
        onPlusClick={(value) => this.increaceCartHandler(index, value)}
        onMinusClick={(value) => this.decreaceCartHandler(index, value)}
        deleteClick={() => this.deleteCartHandler(index)}
      />
    );
  };

  render() {
    return (
      <BaseContainer
        title={strings('checkoutNew.checkout')}
        left={'arrow-back'}
        onLeft={this.navigateToBack}
        loading={this.state.isLoading}>
        <Toast ref="toast" position="center" fadeInDuration={1} />

        {/* ITEM DETAILS */}
        {this.renderItemDetails()}

        <View
          pointerEvents={this.state.isLoading ? 'none' : 'auto'}
          style={style.mainContainer}>
          {this.deleteModalOpen()}

          {/* PRODUCT CART ITEM */}
          <FlatList
            data={this.CartItemsArray.items}
            renderItem={this.cartComponentRender}
            keyExtractor={(item, index) => item + index}
          />

          {/* -- FEATUED ITEMS */}

          {this.featured_items !== undefined &&
          this.featured_items !== null &&
          this.featured_items.length !== 0 ? (
            <View>
              <EDRTLText
                title={strings('checkoutNew.alsoOrdered')}
                style={[
                  style.priceBold,
                  {marginTop: 10, marginHorizontal: 10, marginBottom: 5},
                ]}
              />
              {/* <Text>Teest</Text> */}
              <FlatList
                style={{
                  marginVertical: 5,
                  marginBottom: 10,
                  marginHorizontal: 10,
                }}
                // contentContainerStyle={{ flexGrow: 1 }}
                showsHorizontalScrollIndicator={false}
                data={this.featured_items}
                renderItem={this.renderFeaturedItems}
                extraData={this.state}
                horizontal
              />
            </View>
          ) : null}

          {/* PRICE DETAIL COMPONENT */}
          {this.priceArray.length > 0 ? (
            <View>
              <View style={style.priceView}>
                <EDRTLText
                  title={strings('checkoutNew.pricedetail')}
                  style={style.priceDetailTitle}
                />
                <View style={style.sepratorStyle} />
                {this.priceArray.map(this.priceDetailssComponent)}

                {/* <View style={style.sepratorStyle} /> */}
              </View>

              <EDRTLView
                style={{
                  marginVertical: 10,
                  paddingHorizontal: 10,
                  backgroundColor: EDColors.white,
                }}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    paddingVertical: 15,
                    flexDirection: isRTLCheck() ? 'row-reverse' : 'row',
                  }}
                  onPress={this.couponHandler}>
                  <EDRTLText
                    style={[
                      style.couponText,
                      {
                        color: this.addToCartDict.is_apply
                          ? EDColors.primary
                          : EDColors.text,
                      },
                    ]}
                    title={
                      this.addToCartDict.is_apply
                        ? this.coupon_name
                        : strings('checkoutNew.promo')
                    }
                  />
                  <MaterialIcon
                    size={20}
                    color={EDColors.primary}
                    name={
                      this.addToCartDict.is_apply
                        ? 'close'
                        : 'keyboard-arrow-right'
                    }
                  />

                  {/* <EDRTLImage style={style.couponImage} source={this.addToCartDict.is_apply ? Assets.close_tab : Assets.ic_rigth_arrow} /> */}
                </TouchableOpacity>
              </EDRTLView>

              {/* //# BOTTOM CHECKOUT VIEW  */}
              {console.log(
                'CURRENCY CHECK',
                this.addToCartDict.total,
                this.props.lan,
                funGetFrench_Curr(18000, 1, 'en'),
              )}
              <CheckOutBottomComponent
                pointerEvents={this.state.isLoading ? 'none' : 'auto'}
                title={
                  this.addToCartDict != undefined
                    ? this.props.currencySymbol +
                      funGetFrench_Curr(
                        this.addToCartDict.total,
                        1,
                        this.props.lan,
                      )
                    : ''
                }
                onPress={this.navigateToPayment}
                label={strings('checkoutNew.placeOrder')}
              />
            </View>
          ) : null}
        </View>
      </BaseContainer>
    );
  }

  renderFeaturedItems = (data) => {
    return data.item.item_in_stock != 0 ? (
      <View style={[style.featuredView, {flexDirection: 'column'}]}>
        <TouchableOpacity
          onPress={() => this.onFeaturedPress(data.item)}
          style={{
            width: Metrics.screenWidth * 0.33,
            paddingEnd:
              (Metrics.screenWidth * 0.3 - Metrics.screenWidth * 0.28) / 2,
          }}>
          <EDImage
            source={data.item.image}
            style={{
              width: Metrics.screenWidth * 0.33,
              height: 70,
              borderTopLeftRadius: 6,
              borderTopRightRadius: 6,
              resizeMode: 'contain',
            }}
          />
          <EDRTLText
            title={data.item.name}
            style={{
              fontSize: getProportionalFontSize(14),
              fontFamily: EDFonts.bold,
              marginHorizontal: 5,
              marginTop: 5,
              color: EDColors.black,
            }}
            numberOfLines={1}
          />
          <EDRTLText
            style={[
              style.price1,
              {
                textDecorationLine:
                  data.item.offer_price !== '' ? 'line-through' : null,
              },
            ]}
            title={
              data.item.price !== null &&
              data.item.price !== '0' &&
              data.item.price !== '0.00'
                ? this.props.currencySymbol + data.item.price
                : ''
            }
          />
          {data.item.offer_price !== '' ? (
            <EDRTLText
              style={[style.price1, {color: EDColors.primary, marginTop: 0}]}
              title={this.props.currencySymbol + data.item.offer_price}
            />
          ) : null}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.onPressAddtoCartItemHandler(data.item, 1)}>
          <EDRTLText
            title={strings('productDetailsNew.addToCart')}
            style={style.addBtn}
          />
        </TouchableOpacity>
      </View>
    ) : (
      <View />
    );
  };

  onPressAddtoCartItemHandler = (item, qty) => {
    console.log('ITEM ::::::', item);
    console.log('I :::::::: ', this.addToCartDict);
    // this.setState({ cartLoading: true })
    if (item.is_customize === '0') {
      this.storeData(item);
    } else {
      if (
        this.addToCartDict.items !== undefined &&
        this.addToCartDict.items.length > 0
      ) {
        var repeatItem = this.addToCartDict.items.filter((items) => {
          return items.menu_id == item.menu_id;
        });

        if (repeatItem.length > 0) {
          this.selectedItem = item;
          this.setState({
            isCategory: true,
            visible: false,
          });
        } else {
          this.setState({visible: false});
          this.onResDetailsAddEvent(item);
        }
      } else {
        this.setState({visible: false});
        this.onResDetailsAddEvent(item);
      }
    }
  };

  storeData = (data) => {
    var arrCartItems = [];

    const objectWithoutKey = (object, key) => {
      const {[key]: deletedKey, ...otherKeys} = object;
      return otherKeys;
    };
    var Category_data = objectWithoutKey(data, 'addons_category_list');

    if (Category_data.is_customize === '1') {
      Category_data['addons_category_list'] =
        Category_data['selected_addons_category_list'];
      delete Category_data['selected_addons_category_list'];
    }

    let cartdata = this.props.cartDetail;
    if (
      cartdata != undefined &&
      cartdata.items != '' &&
      cartdata.items != null &&
      cartdata.items != undefined
    ) {
      if (cartdata.items.length > 0) {
        arrCartItems = cartdata.items;

        var repeatArray = arrCartItems.filter((item) => {
          return (
            item.menu_id == Category_data.menu_id && item.is_customize == 0
          );
        });

        if (repeatArray.length > 0) {
          repeatArray[0].quantity = repeatArray[0].quantity + 1;
          // repeatArray[repeatArray.length - 1].quantity = repeatArray[repeatArray.length - 1].quantity + 1;
        } else {
          Category_data.quantity = 1;
          arrCartItems.push(Category_data);
        }

        this.cartData = {
          store_id: this.props.objStoreDetails.store_id || '0',
          items: arrCartItems,
          coupon_name:
            cartdata.coupon_name.length > 0 ? cartdata.coupon_name : '',
          cart_id: cartdata.cart_id,
        };
      } else {
        Category_data.quantity = 1;
        this.cartData = {
          store_id: this.props.objStoreDetails.store_id || '0',
          items: [Category_data],
          coupon_name: '',
          cart_id: 0,
        };
      }
    } else {
      Category_data.quantity = 1;
      this.cartData = {
        store_id: this.props.objStoreDetails.store_id || '0',
        items: [Category_data],
        coupon_name: '',
        cart_id: 0,
      };
    }
    this.refs.toast.show(strings('generalNew.itemAddedSuccessfully'), 1000);
    this.props.saveCartDataInRedux(this.cartData);
    saveCartData(
      this.cartData,
      () => {},
      () => {},
    );
    this.getCartCount(this.cartData);
    this.setState({key: this.state.key + 1, visible: false});
    this.addToCartData(this.cartData);
  };

  /** RES DETAILS ADD EVENT */
  onResDetailsAddEvent = (addData) => {
    this.props.navigation.navigate('categories', {
      subCategoryArray: addData,
      store_id: this.props.objStoreDetails.store_id,
      currency_symbol: this.props.currencySymbol,
    });
  };

  onFeaturedPress = (item) => {
    debugLog('FEATURE PRESS ::::', item);
    // this.props.navigation.navigate('prodcutDetails', {
    //   selectedProductDetails: item,
    //   isForCart: true
    // });
    this.selectedItem = item;
    this.setState({
      visible: true,
    });
  };

  //#region ITEM DETAILS
  renderItemDetails = () => {
    return (
      <EDPopupView isModalVisible={this.state.visible}>
        <EDItemDetails
          data={this.selectedItem}
          onDismissHandler={this.onDismissItemDetailHandler}
          onPress={() => this.onPressAddtoCartItemHandler(this.selectedItem, 1)}
          isOpen={true}
          cartData={
            this.addToCartDict !== undefined &&
            this.addToCartDict.items.length !== 0
              ? this.addToCartDict.items
              : []
          }
          navigateToCart={this.onDismissItemDetailHandler}
          // key={this.state.key}
        />
      </EDPopupView>
    );
  };

  onDismissItemDetailHandler = () => {
    this.setState({visible: false});
  };

  state = {
    isLoading: false,
    isDeleteVisible: false,
    key: 1,
    visible: false,
  };

  componentDidMount() {
    this.addToCartData(this.props.cartDetail);
  }

  //#region NETWORK METHODS

  /**
   *
   * @param {The success response object} objSuccess
   */
  onAddtoCartSuccess = (objSuccess) => {
    debugLog('OBJ SUCCESS ADDTOCART :: ' + JSON.stringify(objSuccess));
    this.CartItemsArray = objSuccess.data;
    this.addToCartDict = objSuccess.data;
    this.coupon_name = objSuccess.data.coupon_name;
    this.priceArray =
      this.addToCartDict.price != undefined &&
      this.addToCartDict.price.length > 0
        ? this.addToCartDict.price
        : [];
    if (
      this.CartItemsArray.inactive_items != null &&
      this.CartItemsArray.inactive_items != undefined &&
      this.addToCartDict.items.length > 0
    ) {
      var inactiveItems = this.CartItemsArray.inactive_items.filter((data) => {
        return data.menu_id != '0';
      });
      showDialogue(
        strings('generalNew.itemAdjusted') +
          '\n\n' +
          inactiveItems.map((data) => data.name),
      );
    }

    this.updateCart(this.addToCartDict);
  };

  /**
   *
   * @param {The success response object} objSuccess
   */
  onAddtoCartFailure = (objFailure) => {
    this.setState({isLoading: false});
    debugLog('OBJ FAILURE ADDTOCART :: ', objFailure);
    // showDialogue(objFailure.data.message);
  };

  /**
   *
   * @param {The call API for add cart data}
   */
  addToCartData = (item) => {
    netStatus((isConnected) => {
      if (isConnected) {
        var objItems = {items: item.items};
        debugLog('JSON ITEM ::::::::::: ', JSON.stringify(item.items));
        debugLog('ONJSTOREDETAILS:::::::::', this.props.objStoreDetails);
        var objaddToCartParams = {
          language_slug: this.props.lan,
          user_id: this.props.UserID,
          store_id: this.props.objStoreDetails.store_id,
          items: JSON.stringify(objItems),
          cart_id: '',
          coupon: this.coupon_name,
          order_delivery: this.props.navigation.state.params.delivery_status,
          latitude: this.props.navigation.state.params.latitude,
          longitude: this.props.navigation.state.params.longitude,
          store_content_id: this.props.objStoreDetails.content_id,
        };
        console.log('ADDTOCARTPARAMS:::::::::::', objaddToCartParams),
          console.log('OBJITEMS::::::::::::::::::', JSON.stringify(objItems));
        this.setState({isLoading: true});
        addToCart(
          objaddToCartParams,
          this.onAddtoCartSuccess,
          this.onAddtoCartFailure,
          this.props,
        );
      } else {
        showNoInternetAlert();
      }
    });
  };

  // #UPDATE CART DATA IN REDUX
  updateCart(response) {
    console.log('ITEMS :::::::: ', JSON.stringify(response.items));
    console.log(
      'MENU_SUGGESTION :::::::: ',
      JSON.stringify(response.menu_suggestion),
    );
    this.cart_id = response.cart_id;

    // if (response.price !== undefined && response.price.length > 0) {
    //     response.price.map(item => {
    //         if (item.label_key !== undefined && item.label_key !== "") {
    //             if (item.label_key.toLowerCase().includes('delivery')) {
    //                 this.delivery_charges = item.value
    //             }
    //         }
    //     })
    // }

    if (
      response.menu_suggestion !== undefined &&
      response.menu_suggestion !== null &&
      response.menu_suggestion.length !== 0
    ) {
      let featured_items = response.menu_suggestion;
      this.featured_items.map((data) => {
        this.featured_items_image.push({image: data.image});
      });
      this.featured_items = featured_items.filter((data) => {
        return !response.items
          .map((itemToIterate) => itemToIterate.menu_id)
          .includes(data.menu_id);
      });
    }

    this.delivery_charges = response.delivery_charge;

    var updatedCart = {
      store_id: this.props.cartDetail.store_id,
      items: response.items,
      coupon_name: response.coupon_name,
      cart_id: response.cart_id,
    };

    this.props.saveCartDataInRedux(updatedCart);
    saveCartData(
      updatedCart,
      () => {},
      () => {},
    );
    this.getCartCount(updatedCart);

    this.setState({
      isLoading: false,
      key: this.state.key + 1,
    });
  }

  // #UPDATE CART PRODUCT COUNT IN REDUX
  getCartCount = (data) => {
    if (data !== undefined) {
      if (data.items !== undefined && data.items.length > 0) {
        var count = 0;
        data.items.map((item) => {
          count = count + item.quantity;
        });
        this.props.saveCartCount(count);
      } else {
        showDialogue(strings('generalNew.noitemsAvailable'), '', [], () => {
          this.props.navigation.dispatch(
            StackActions.reset({
              index: 0,
              routeName: 'MainContainer',
              actions: [
                NavigationActions.navigate({
                  routeName: isRTLCheck() ? 'mainRTL' : 'main',
                }),
              ],
            }),
          );
          this.props.saveCartCount(0);
        });
      }
    }
  };

  // #NAVIGATE TO PAYMENT CONTAINER
  navigateToPayment = () => {
    this.itemsNameArray = [];
    this.KeyString = '';
    this.addToCartDict.out_of_stock.map((key) => {
      this.addToCartDict.items.map((item) => {
        if (item.menu_id == key) {
          this.itemsNameArray.push(item.name);
        }
      });
    });

    let stock_error_items = [];
    if (
      this.addToCartDict.chk_in_stock !== undefined &&
      this.addToCartDict.chk_in_stock !== null
    )
      this.addToCartDict.chk_in_stock.map((data) => {
        console.log('DATAAA::::::::::: ', data);
        this.addToCartDict.items.map((item) => {
          console.log('ITEMSSSSSSS::::::::::', item);
          if (item.menu_id == data.menu_id) {
            data.name = item.name;
            if (data.is_customize == 1 || data.is_customize == '1') {
              data.addons_category_list = item.addons_category_list;
            }
            stock_error_items.push(data);
          }
        });
      });

    debugLog('STOCK ERROR ITEMS :::::', stock_error_items);

    var checkoutData = {
      address_id: this.props.navigation.state.params.address_id,
      subtotal: this.addToCartDict.subtotal,
      items: '',
      coupon_id: this.addToCartDict.coupon_id,
      coupon_type: this.addToCartDict.coupon_type,
      coupon_amount: this.addToCartDict.coupon_amount,
      user_id: this.props.UserID,
      total: this.addToCartDict.total,
      coupon_name: this.addToCartDict.coupon_name,
      coupon_discount: this.addToCartDict.coupon_discount,
      order_date: '',
      order_delivery: this.props.navigation.state.params.delivery_status,
      language_slug: this.props.lan,
      delivery_charge: this.delivery_charges,
      extra_comment: '',
      store_id: this.props.cartDetail.store_id,
    };

    if (this.itemsNameArray.length > 0) {
      this.KeyString = this.itemsNameArray.join('\n');
      this.alertString =
        this.itemsNameArray.length > 1
          ? strings('checkoutNew.belowProducts') +
            '\n\n' +
            this.KeyString +
            '\n\n' +
            strings('checkoutNew.removeProducts')
          : this.KeyString + ' ' + strings('checkoutNew.outOfStockAndRemove');
      showDialogue(this.alertString);
    } else if (stock_error_items.length > 0) {
      let normalItems = stock_error_items.filter((key) => {
        return key.is_customize == 0;
      });
      let nameArray = normalItems
        .map(
          (key) =>
            key.name +
            ' :\n' +
            strings('checkoutNew.currentStock') +
            ' - ' +
            key.in_stock +
            ' , ' +
            strings('checkoutNew.maxQuantity') +
            ' - ' +
            key.max_quantity,
        )
        .join('\n\n');
      let customItems = stock_error_items.filter((key) => {
        return key.is_customize !== 0;
      });
      let nameArrayCustom = [];
      customItems.map((data) => {
        data.addons_category_list.map((item) => {
          item.addons_list.map((items) => {
            debugLog(
              'TEST ADDON :::::',
              data.name,
              item.addons_category,
              items.in_stock,
            );
            let temp = {
              name: data.name,
              addons_category: item.addons_category,
              addons_category_name: items.add_ons_name,
              in_stock: items.in_stock,
              max_quantity: items.max_quantity,
            };
            nameArrayCustom.push(temp);
          });
        });
      });
      let cutomNameArray = nameArrayCustom
        .map(
          (key) =>
            key.name +
            ' (' +
            key.addons_category +
            ')' +
            ' :\n' +
            strings('checkoutNew.currentStock') +
            ' - ' +
            key.in_stock +
            ' , ' +
            strings('checkoutNew.maxQuantity') +
            ' - ' +
            key.max_quantity,
        )
        .join('\n\n');
      debugLog('NAME ARRAY ::::', nameArray, nameArrayCustom);
      let alertMsg =
        strings('checkoutNew.noStock') + nameArray + '\n\n' + cutomNameArray;
      showDialogue(alertMsg);
    } else {
      // this.props.navigation.navigate("payment", {
      //     checkoutDetail: checkoutData
      // })
      this.addOrderData(checkoutData);
    }
  };

  /**
   *
   * @param {The success response object} objSuccess
   */
  onAddOrderSuccess = (objSuccess) => {
    debugLog('OBJ SUCCESS ADDORDER :: ' + JSON.stringify(objSuccess));
    clearCartData(
      () => {
        this.props.saveCartDataInRedux({});
        this.props.saveCartCount(0);
        this.props.navigation.navigate('thankYou');
        this.setState({
          isLoading: false,
        });
      },
      () => {
        this.setState({
          isLoading: false,
        });
      },
    );
  };

  /**
   *
   * @param {The success response object} objSuccess
   */
  onAddOrderFailure = (objFailure) => {
    this.setState({isLoading: false});
    debugLog('OBJ FAILURE ADDORDER :: ', objFailure, objFailure.data.status);
    if (objFailure.data.status == STORE_ERROR)
      showDialogue(objFailure.message, '', [], () => {
        clearCartData(
          () => {
            this.props.saveCartDataInRedux({});
            this.props.saveCartCount(0);
            this.props.navigation.dispatch(
              StackActions.reset({
                index: 0,
                actions: [
                  NavigationActions.navigate({
                    routeName: isRTLCheck() ? 'mainRTL' : 'main',
                  }),
                ],
              }),
            );
            this.setState({
              isLoading: false,
            });
          },
          () => {
            this.setState({
              isLoading: false,
            });
          },
        );
      });
    else showDialogue(objFailure.message);
  };

  /**
   *
   * @param {The call API for create a order}
   */

  addOrderData = (checkoutDetail) => {
    debugLog('NAVIGATION PARAMS ::::::: ', this.props.navigation.state.params);

    netStatus((isConnected) => {
      if (isConnected) {
        var objItems = {items: this.props.cartDetail.items};

        var orderDateToPass = undefined;
        var timeSlotToPass = undefined;
        const objCheckoutDetails = checkoutDetail;
        if (objCheckoutDetails.selectedDate !== undefined) {
          orderDateToPass = objCheckoutDetails.selectedDate;
        }

        if (objCheckoutDetails.selectedTimeSlot !== undefined) {
          timeSlotToPass = objCheckoutDetails.selectedTimeSlot.name || '';
        }

        var objaddOrderParams = checkoutDetail;
        objaddOrderParams.items = objItems;
        objaddOrderParams.image = this.state.photoOnCakeSource;
        objaddOrderParams.order_date = Moment(new Date()).format(
          'DD-MM-YYYY hh:mm A',
        );

        debugLog('paarms ::::::: ', JSON.stringify(objaddOrderParams));
        this.setState({isLoading: true});
        addOrder(
          objaddOrderParams,
          this.onAddOrderSuccess,
          this.onAddOrderFailure,
          this.props,
        );
      } else {
        showNoInternetAlert();
      }
    });
  };

  // #DELETE CART PRODUCT
  onYesChangeHandler = () => {
    var array = this.props.cartDetail;
    array.items.splice(this.deleteIndex, 1);
    this.addToCartData(array);
    this.setState({isDeleteVisible: false});
  };

  onNoClick = () => {
    this.setState({isDeleteVisible: false});
  };

  // #NAVIGATION TO PREVIOUS CONTAINER
  navigateToBack = () => {
    this.props.navigation.goBack();
  };

  // #INCREASE CART PRODUCT
  increaceCartHandler = (index, value) => {
    if (value > 0) {
      this.CartItemsArray.items[index].quantity = value;
      this.addToCartData(this.CartItemsArray);
    }
  };

  // #DECREASE CART PRODUCT
  decreaceCartHandler = (index, value) => {
    if (value > 0) {
      this.CartItemsArray.items[index].quantity = value;
      this.addToCartData(this.CartItemsArray);
    }
  };

  deleteCartHandler = (index) => {
    this.deleteIndex = index;
    this.setState({isDeleteVisible: true});
  };
  // #NAVIGATION BACK TO PROMO CODE CONTAINER
  getPromoData = (data) => {
    this.coupon_name = data;
    this.addToCartData(this.CartItemsArray);
  };

  // #NAVIGATE TO PROMO CODE CONTAINER
  navigateToPromo = () => {
    if (this.addToCartDict.subtotal != undefined) {
      this.props.navigation.navigate('promoCodes', {
        getPromoCodeData: this.getPromoData,
        subTotal: this.addToCartDict.subtotal,
      });
    }
  };

  // #REMOVE PROMO CODE
  couponHandler = () => {
    if (this.addToCartDict.is_apply) {
      this.coupon_name = '';
      this.addToCartData(this.props.cartDetail);
    } else if (!this.addToCartDict.is_apply) {
      this.navigateToPromo();
    }
  };
}

export default connect(
  (state) => {
    return {
      cartDetail: state.checkoutReducer.cartDetails,
      UserID: state.userOperations.userDetails.UserID,
      lan: state.userOperations.lan,
      currencySymbol: state.contentOperations.currencySymbol,
      objStoreDetails: state.contentOperations.objStoreDetails || {},
    };
  },
  (dispatch) => {
    return {
      saveCartCount: (data) => {
        dispatch(saveCartCount(data));
      },
      saveCartDataInRedux: (data) => {
        dispatch(saveCartDataInRedux(data));
      },
    };
  },
)(CheckOutContainer);

export const style = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: EDColors.offWhite,
  },
  container: {
    marginTop: 10,
  },
  priceView: {
    backgroundColor: EDColors.white,
    padding: 10,
  },
  featuredView: {
    width: Metrics.screenWidth * 0.33,
    marginEnd: (Metrics.screenWidth * 0.3 - Metrics.screenWidth * 0.26) / 2,
    backgroundColor: EDColors.white,
    borderRadius: 6,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  sepratorStyle: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: EDColors.separatorColor,
    height: 1,
  },
  promoBtn: {
    width: Metrics.screenWidth * 0.9,
    height: heightPercentageToDP('5.0%'),
  },
  promoBtnTxt: {
    fontSize: getProportionalFontSize(18),
    fontFamily: EDFonts.medium,
  },
  checkoutViewStyle: {
    backgroundColor: EDColors.white,
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 10,
  },
  checkoutSubTxt: {
    flex: 1,
    color: EDColors.black,
    marginHorizontal: 20,
    fontFamily: EDFonts.regular,
    fontSize: getProportionalFontSize(20),
  },
  checkoutBtn: {
    marginHorizontal: 10,
    borderRadius: 30,
  },
  priceDetailTitle: {
    color: EDColors.pricingTitle,
    fontFamily: EDFonts.bold,
    fontSize: getProportionalFontSize(16),
  },
  lastBtn: {
    marginHorizontal: 20,
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 40,
  },
  couponText: {
    flex: 1,
    textAlignVertical: 'center',
  },
  couponImage: {
    height: 20,
    width: 20,
  },
  price: {
    fontFamily: EDFonts.medium,
    fontSize: getProportionalFontSize(14),
  },
  price1: {
    fontFamily: EDFonts.regular,
    marginHorizontal: 5,
    marginVertical: 5,
    color: EDColors.black,
  },
  priceBold: {
    fontFamily: EDFonts.bold,
    fontSize: getProportionalFontSize(14),
    color: EDColors.black,
  },
  itemTitle: {
    flex: 1,
    fontFamily: EDFonts.medium,
    color: EDColors.text,
    fontSize: getProportionalFontSize(14),
    // height: 20
  },
  itemTitleBold: {
    flex: 1,
    fontFamily: EDFonts.bold,
    color: EDColors.black,
    fontSize: getProportionalFontSize(14),
    // height: 20
  },
  addBtn: {
    // flex: 1,
    padding: 5,
    borderRadius: 6,
    backgroundColor: EDColors.primary,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: EDColors.white,
    width: Metrics.screenWidth * 0.3 - 10,
    marginBottom: 5,
    marginHorizontal: 5,
  },
});
