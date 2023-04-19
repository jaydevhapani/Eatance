import React from 'react';
import {View, StyleSheet, ScrollView, SafeAreaView} from 'react-native';
import {connect} from 'react-redux';
import {strings} from '../locales/i18n';
import {EDColors} from '../utils/EDColors';
import {
  showDialogue,
  showNoInternetAlert,
  showValidationAlert,
} from '../utils/EDAlert';
import BaseContainer from './BaseContainer';
import Metrics from '../utils/metrics';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import {EDFonts} from '../utils/EDFontConstants';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import EDOrdersFlatList from '../components/EDOrdersFlatList';
import {netStatus} from '../utils/NetworkStatusConnection';
import {debugLog, getProportionalFontSize} from '../utils/EDConstants';
import {NavigationEvents} from 'react-navigation';
import {getOrders} from '../utils/ServiceManager';
import EDPlaceholderComponent from '../components/EDPlaceholderComponent';
import EDProgressLoader from '../components/EDProgressLoader';
import {changeCartButtonVisibility} from '../redux/actions/FloatingButton';
import {saveNavigationSelection} from '../redux/actions/Navigation';
import {saveCartData, getSelectedStore} from '../utils/AsyncStorageHelper';
import {saveCartCount, saveCartDataInRedux} from '../redux/actions/Checkout';
import {saveStoreDetails} from '../redux/actions/Content';
import EDPopupView from '../components/EDPopupView';
import EDConfirmationDialogue from '../components/EDConfirmationDialogue';
import {saveCurrencySymbol} from '../redux/actions/Content';
import {saveSelectedStore} from '../utils/AsyncStorageHelper';
import EDWriteReview from '../components/EDWriteReview';
import EDWriteSellerReview from '../components/EDWriteSellerReview';

const ORDERS_PAGE_SIZE = 50;

class MyOrdersContainer extends React.Component {
  //#region LIFE CYCLE METHODS
  /** CONSTRUCTION */
  constructor(props) {
    super(props);
    this.scrollViewOrders = null;
    this.strCurrentOrderTitle = '';
    this.strCurrentOrderMessage = '';
    this.strPastOrderTitle = '';
    this.strPastOrderMessage = '';
    this.shouldLoadMore = false;
    this.refreshing = false;
    this.arrayCurrentOrders = undefined;
    this.arrayPastOrders = undefined;
  }

  /** DID FOCUS */
  onWillFocusOrdersContainer = () => {
    this.saveStorefromAsync();

    this.props.saveNavigationSelection(strings('sidebarNew.myOrder'));
    this.props.changeCartButtonVisibility({
      shouldShowFloatingButton: true,
      currentScreen: this.props,
    });
  };

  saveStorefromAsync = () => {
    if (
      this.props.objStoreDetails.store_id == undefined ||
      this.props.objStoreDetails.store_id == undefined
    ) {
      getSelectedStore(
        (onSuccess) => {
          this.props.saveStoreDetailsInRedux(onSuccess);
          this.callGetOrdersAPI();
        },
        (onFailure) => debugLog('Store save failure', onFailure),
      );
    } else {
      this.callGetOrdersAPI();
    }
  };

  /** DISMISS WRITE REVIEW DIALOGUE */
  dismissWriteReviewDialogueHandler = () => {
    this.setState({isWriteAReviewVisible: false});
  };

  dismissAndHideButton = () => {
    this.setState({isWriteAReviewVisible: false});
    this.onPullToRefreshHandler();
  };

  onPressReviewButtonHandler = (orderToRepeat) => {
    this.setState({
      isWriteAReviewVisible: true,
      deliveryFlag: orderToRepeat.delivery_flag.toLowerCase(),
      isReview: orderToRepeat.review === null ? true : false,
      store_id: orderToRepeat.store_obj.store_id,
      order_id: orderToRepeat.order_id,
      driver_id:
        orderToRepeat.driver != undefined && orderToRepeat.driver != null
          ? orderToRepeat.driver.driver_id
          : '',
      store_name: orderToRepeat.store_name,
      store_image: orderToRepeat.store_obj.image,
      amount: orderToRepeat.total,
      driver_name:
        orderToRepeat.driver != undefined && orderToRepeat.driver != null
          ? orderToRepeat.driver.first_name
          : '',
      driver_image:
        orderToRepeat.driver != undefined && orderToRepeat.driver != null
          ? orderToRepeat.driver.image
          : '',
      currency_symbol: orderToRepeat.currency_symbol,
    });
  };

  /** RENDER WRITE REVIEW DIALOGUE */
  renderWriteAReviewDialogue = () => {
    console.log('RENDERWRITEREVIEWCALLED:::::::::::::::;');
    return (
      <EDPopupView
        modalMainViewStyle={{justifyContent: 'flex-end'}}
        isModalVisible={this.state.isWriteAReviewVisible}>
        <EDWriteSellerReview
          containerProps={this.props}
          lan={this.props.lan}
          dismissWriteReviewDialogueHandler={
            this.dismissWriteReviewDialogueHandler
          }
          delivery_flag={this.state.deliveryFlag}
          order_id={this.state.order_id}
          store_id={this.state.store_id}
          driver_id={this.state.driver_id}
          user_id={this.state.user_id}
          dismissAndHideButton={this.dismissAndHideButton}
          store_name={this.state.store_name}
          store_image={this.state.store_image}
          amount={this.state.amount}
          driver_name={this.state.driver_name}
          driver_image={this.state.driver_image}
          currency_symbol={this.state.currency_symbol}
        />
      </EDPopupView>
    );
  };

  /** RENDER METHOD */
  render() {
    return (
      <BaseContainer
        title={strings('ordersNew.title')}
        left={'menu'}
        onLeft={this.buttonMenuPressed}
        // right={'contact-phone'}
        iconFamily={'material'}
        // onRight={this.buttonCallPressed}
        onConnectionChangeHandler={this.onConnectionChangeHandler}>
        {/* SCREEN FOCUS EVENT */}
        <NavigationEvents onWillFocus={this.onWillFocusOrdersContainer} />
        {this.renderSwitchStoreConfirmationDialogue()}

        {/* WRITE A REVIEW DIALOGUE */}
        {this.renderWriteAReviewDialogue()}

        {/* PROGRESS LOADER */}
        {this.state.isLoading ? (
          <EDProgressLoader />
        ) : (
          <View
            pointerEvents={this.state.isLoading ? 'none' : 'auto'}
            style={styles.mainViewStyle}>
            {/* SAFE AREA VIEW */}
            <SafeAreaView style={styles.mainViewStyle}>
              {/* SEGMENT/TAB  */}
              <View style={styles.tabContainer}>
                <SegmentedControlTab
                  values={[
                    strings('ordersNew.inProcess'),
                    strings('ordersNew.past'),
                  ]}
                  selectedIndex={this.state.selectedIndex}
                  onTabPress={this.onSegmentIndexChangeHandler}
                  backgroundColor={EDColors.primary}
                  tabStyle={styles.tabStyle}
                  tabTextStyle={styles.tabTextStyle}
                  activeTabStyle={styles.activeTabStyle}
                  activeTabTextStyle={styles.activeTabTextStyle}
                  allowFontScaling={false}
                  borderColor={EDColors.primary}
                />
              </View>

              {/* HORIZONTAL SCROLL FOR ORDERS TAB */}
              <ScrollView
                scrollEnabled={false}
                ref={(scrollView) => (this.scrollViewOrders = scrollView)}
                bounces={false}
                pagingEnabled={true}
                horizontal={true}>
                <View style={{flexDirection: 'row'}}>
                  {/* CURRENT ORDERS */}
                  {this.arrayCurrentOrders !== undefined &&
                  this.arrayCurrentOrders.length > 0 ? (
                    <EDOrdersFlatList
                      lan={this.props.lan}
                      onPressTrackButtonHandler={this.onPressTrackButtonHandler}
                      refreshing={this.refreshing}
                      onPullToRefreshHandler={this.onPullToRefreshHandler}
                      cartCount={this.props.cartCount}
                      isForCurrentOrder={true}
                      currencySymbol={this.props.currencySymbol}
                      style={{width: Metrics.screenWidth}}
                      arrayOrders={this.arrayCurrentOrders}
                    />
                  ) : (this.strCurrentOrderTitle || '').trim().length > 0 ? (
                    <View style={{width: Metrics.screenWidth}}>
                      <EDPlaceholderComponent
                        onBrowseButtonHandler={this.buttonBrowsePressed}
                        title={this.strCurrentOrderTitle}
                        subTitle={this.strCurrentOrderMessage}
                      />
                    </View>
                  ) : null}

                  {/* PAST ORDERS */}
                  {this.arrayPastOrders !== undefined &&
                  this.arrayPastOrders.length > 0 ? (
                    <EDOrdersFlatList
                      onPressRepeatButtonHandler={
                        this.onPressRepeatButtonHandler
                      }
                      refreshing={this.refreshing}
                      onPullToRefreshHandler={this.onPullToRefreshHandler}
                      cartCount={this.props.cartCount}
                      currencySymbol={this.props.currencySymbol}
                      style={{width: Metrics.screenWidth}}
                      arrayOrders={this.arrayPastOrders}
                      onPressReviewButtonHandler={
                        this.onPressReviewButtonHandler
                      }
                    />
                  ) : (this.strPastOrderTitle || '').trim().length > 0 ? (
                    <View style={{width: Metrics.screenWidth}}>
                      <EDPlaceholderComponent
                        onBrowseButtonHandler={this.buttonBrowsePressed}
                        title={this.strPastOrderTitle}
                        subTitle={this.strPastOrderMessage}
                      />
                    </View>
                  ) : null}
                </View>
              </ScrollView>
            </SafeAreaView>
          </View>
        )}
      </BaseContainer>
    );
  }

  /** STATE */
  state = {
    isLoading: false,
    selectedIndex: 0,
    shouldShowConfirmationDialogue: false,
    isWriteAReviewVisible: false,
    deliveryFlag: 'pickup',
    isReview: true,
    store_id: '',
    user_id: this.props.userDetails.UserID,
    driver_id: '',
    order_id: '',
    store_name: '',
    store_image: '',
    driver_image: '',
    amount: '',
    driver_name: '',
    currency_symbol: '',
  };
  //#endregion

  //#region NETWORK
  onConnectionChangeHandler = (isConnected) => {
    // showDialogue('ORDER SCREEN CONNECTITIY HANDLER :: ' + isConnected)
    if (isConnected) {
      this.callGetOrdersAPI();
    }
  };
  /**
   *
   * @param {The success response object} objSuccess
   */
  onGetOrdersSuccess = (objSuccess) => {
    this.strCurrentOrderTitle = '';
    this.strCurrentOrderMessage = '';
    this.strPastOrderTitle = '';
    this.strPastOrderMessage = '';
    this.arrayCurrentOrders = undefined;
    this.arrayPastOrders = undefined;
    this.refreshing = false;

    if (
      objSuccess.data.in_process !== undefined &&
      objSuccess.data.in_process.in_process !== undefined &&
      objSuccess.data.in_process.in_process.length > 0
    ) {
      this.arrayCurrentOrders = objSuccess.data.in_process.in_process;
    } else {
      this.strCurrentOrderTitle = strings('ordersNew.noCurrentOrdersTitle');
      this.strCurrentOrderMessage = strings('ordersNew.noCurrentOrdersMessage');
    }

    if (
      objSuccess.data.past !== undefined &&
      objSuccess.data.past.past !== undefined &&
      objSuccess.data.past.past.length > 0
    ) {
      this.arrayPastOrders = objSuccess.data.past.past;
    } else {
      this.strPastOrderTitle = strings('ordersNew.noPastOrdersTitle');
      this.strPastOrderMessage = strings('ordersNew.noPastOrdersMessage');
    }
    this.setState({isLoading: false});
  };

  /**
   *
   * @param {The failure response object} objFailure
   */
  onGetOrdersFailure = (objFailure) => {
    this.strCurrentOrderTitle = objFailure.message || '';
    this.strCurrentOrderMessage = '';
    this.strPastOrderTitle = objFailure.message || '';
    this.strPastOrderMessage = '';
    this.refreshing = false;

    this.setState({isLoading: false});
  };

  /** REQUEST GET NOTIFICATIONS */
  /**
   *
   * @param {Check if it is pull-to-refresh event call or normal call and show loader accordingly} isForRefresh
   */
  callGetOrdersAPI = (isForRefresh = false) => {
    this.strCurrentOrderTitle = '';
    this.strCurrentOrderMessage = '';
    this.strPastOrderTitle = '';
    this.strPastOrderMessage = '';
    this.arrayCurrentOrders = [];
    this.arrayOrders = [];
    this.setState({
      isLoading: true,
    });
    netStatus((isConnected) => {
      if (isConnected) {
        let objGetOrdersParams = {
          store_id: this.props.objStoreDetails.store_id,
          language_slug: this.props.lan,
          user_id: this.props.userDetails.UserID,
          count: ORDERS_PAGE_SIZE,
          page_no:
            this.state.arrayPastOrders && !isForRefresh
              ? parseInt(this.state.arrayPastOrders.length / ORDERS_PAGE_SIZE) +
                1
              : 1,
        };
        // if (!isForRefresh) {
        //     this.setState({ isLoading: this.state.arrayPastOrders === undefined });
        // }
        this.setState({selectedIndex: 0});
        getOrders(
          objGetOrdersParams,
          this.onGetOrdersSuccess,
          this.onGetOrdersFailure,
          this.props,
        );
      } else {
        debugLog('HERE NO INTERNET');
        this.strCurrentOrderTitle = strings('generalNew.noInternetTitle');
        this.strCurrentOrderMessage = strings('generalNew.noInternet');
        this.strPastOrderTitle = strings('generalNew.noInternetTitle');
        this.strPastOrderMessage = strings('generalNew.noInternet');
        this.arrayCurrentOrders = [];
        this.arrayPastOrders = [];
        this.setState({
          isLoading: false,
        });
      }
    });
  };
  //#endregion

  //#region HELPER METHODS
  /** PULL TO REFRESH HANDLER */
  onPullToRefreshHandler = () => {
    this.refreshing = true;
    this.shouldLoadMore = false;
    this.strCurrentOrderTitle = '';
    this.strCurrentOrderMessage = '';
    this.strPastOrderTitle = '';
    this.strPastOrderMessage = '';

    // this.state.arrayPastOrders = []
    // this.setState({arrayPastOrders: undefined })
    this.callGetOrdersAPI(true);
  };

  onSegmentIndexChangeHandler = (segmentIndex) => {
    this.setState({selectedIndex: segmentIndex});
    this.scrollViewOrders.scrollTo({
      x: Metrics.screenWidth * segmentIndex,
      y: 0,
      animated: true,
    });
  };
  //#endregion

  //#region BUTTON EVENTS
  /** MENU BUTTON EVENT */
  buttonMenuPressed = () => {
    this.props.navigation.openDrawer();
  };

  /** CALL BUTTON EVENT */

  /** BROWSE BUTTON EVENT */
  buttonBrowsePressed = () => {
    this.props.navigation.navigate('home');
    this.props.saveNavigationSelection(strings('sidebarNew.home'));
  };

  clearCartAndNavigate = () => {
    console.log('THIS.ORDERTOREPEAT::::::::::::', this.orderToRepeat);
    console.log('THIS>STOREOBJ::::::::::', this.store_obj);
    // this.props.saveCartDataInRedux({});
    // this.props.saveCartCount(0);
    this.props.saveCurrencySymbol(this.orderToRepeat.currency_symbol);
    this.props.saveStoreDetailsInRedux(this.store_obj);
    saveSelectedStore(
      this.store_obj,
      () => {},
      () => {},
    );

    // this.buttonBackPressed();
    // this.props.navigation.navigate(isRTLCheck() ? 'mainRTL' : 'main');
    this.cartData = {
      store_id: this.orderToRepeat.store_id,
      items: this.orderToRepeat.items,
      coupon_name: '',
      cart_id: 0,
    };
    this.props.saveCartDataInRedux(this.cartData);
    saveCartData(
      this.cartData,
      () => {
        this.props.navigation.navigate('cart', {isview: false});
      },
      () => {},
    );
  };

  /** RENDER SWITCH STORE CONFIMRATION DIALOGUE */
  onYesPressed = () => {
    this.setState({shouldShowConfirmationDialogue: false});
    this.clearCartAndNavigate();
  };

  onNoPressed = () => {
    this.objStoreToBeSelected = undefined;
    this.setState({shouldShowConfirmationDialogue: false});
  };

  renderSwitchStoreConfirmationDialogue = () => {
    return (
      <EDPopupView isModalVisible={this.state.shouldShowConfirmationDialogue}>
        <EDConfirmationDialogue
          onYesClick={this.onYesPressed}
          onNoClick={this.onNoPressed}
          title={strings('storesList.switchStoreConfirmation')}
        />
      </EDPopupView>
    );
  };

  checkCurrentStore = (orderToRepeat) => {
    console.log(
      'THIS.PROPS.OBJSTOREDETAILS::::::::::::',
      this.props.objStoreDetails,
    );
    console.log('THIS.STORE_OBJ::::::::::::::', this.store_obj);
    if (orderToRepeat.store_id !== this.props.objStoreDetails.store_id) {
      this.setState({shouldShowConfirmationDialogue: true});
      this.store_obj = orderToRepeat.store_obj;
      this.orderToRepeat = orderToRepeat;
    } else {
      this.cartData = {
        // store_id: this.props.objStoreDetails.store_id,
        store_id: orderToRepeat.store_obj.store_id,
        items: orderToRepeat.items,
        coupon_name: '',
        cart_id: 0,
      };
      this.props.saveCartDataInRedux(this.cartData);
      saveCartData(
        this.cartData,
        () => {
          this.props.navigation.navigate('cart', {isview: false});
        },
        () => {},
      );
    }
  };

  onPressRepeatButtonHandler = (orderToRepeat) => {
    if (
      orderToRepeat.timings.off === 'open' &&
      orderToRepeat.timings.closing === 'open'
    ) {
      debugLog('ORDER TO REPEAT :: ' + JSON.stringify(orderToRepeat));
      let arr = orderToRepeat.items.map((data) => data.isInStock);
      debugLog('array::::', arr, arr.includes('0'));
      if (!arr.includes('1')) {
        showValidationAlert(strings('generalNew.noitemsAvailable'));
      } else if (arr.includes('0')) {
        let invalidItems = orderToRepeat.items.filter((data) => {
          return data.isInStock == '0';
        });
        showDialogue(
          strings('generalNew.someitemsAvailable') +
            '\n\n' +
            strings('generalNew.itemsunavailable') +
            '\n' +
            invalidItems.map((data) => data.name),
          '',
          [
            {
              text: strings('buttonTitles.proceed'),
              onPress: () => {
                let newitems = orderToRepeat.items.filter((data) => {
                  return data.isInStock == '1';
                });
                orderToRepeat.items = newitems;
                this.repeatOrder(orderToRepeat);
              },
            },
          ],
        );
        // this.repeatOrder(orderToRepeat);
      } else {
        this.repeatOrder(orderToRepeat);
      }
    } else showValidationAlert(strings('homeNew.notAcceptingOrdersMessage'));
  };

  repeatOrder = (orderToRepeat) => {
    let items = orderToRepeat.items;
    let filteredArray = [];
    let removeArray = [];
    var change_flag = false;
    for (let i = 0; i < items.length; i++) {
      if (items[i].is_customize === 0) {
        if (items[i].item_in_stock >= items[i].quantity) {
          if (items[i].item_max_quantity >= items[i].quantity) {
            console.log('All items available');
            items[i].quantity = parseInt(items[i].quantity);
          } else {
            items[i].quantity = parseInt(items[i].item_max_quantity);
            change_flag = true;
            filteredArray.push(items[i].name);
          }
        } else {
          if (items[i].item_max_quantity <= items[i].item_in_stock) {
            items[i].quantity = parseInt(items[i].item_max_quantity);
            change_flag = true;
            filteredArray.push(items[i].name);
          } else {
            items[i].quantity = parseInt(items[i].item_in_stock);
            change_flag = true;
            filteredArray.push(items[i].name);
          }
        }
      }
      if (items[i].is_customize === 1) {
        if (
          items[i].addons_category_list[0].addons_list[0].in_stock >=
          items[i].quantity
        ) {
          if (
            items[i].addons_category_list[0].addons_list[0].max_quantity >=
            items[i].quantity
          ) {
            items[i].quantity = parseInt(items[i].quantity);
          } else {
            items[i].quantity = parseInt(
              items[i].addons_category_list[0].addons_list[0].max_quantity,
            );
            change_flag = true;
            filteredArray.push(
              items[i].name + items[i].addons_category_list[0].addons_category,
            );
          }
        } else {
          if (
            items[i].addons_category_list[0].addons_list[0].max_quantity <=
            items[i].addons_category_list[0].addons_list[0].in_stock
          ) {
            items[i].quantity = parseInt(
              items[i].addons_category_list[0].addons_list[0].max_quantity,
            );
            change_flag = true;
            filteredArray.push(
              items[i].name + items[i].addons_category_list[0].addons_category,
            );
          } else {
            if (
              items[i].addons_category_list[0].addons_list[0].in_stock == 0 ||
              items[i].addons_category_list[0].addons_list[0].in_stock == '0'
            ) {
              removeArray.push(
                items[i].name +
                  items[i].addons_category_list[0].addons_category,
              );
              change_flag = true;
            } else {
              items[i].quantity = parseInt(
                items[i].addons_category_list[0].addons_list[0].in_stock,
              );
              change_flag = true;
              filteredArray.push(
                items[i].name +
                  items[i].addons_category_list[0].addons_category,
              );
            }
          }
        }
      }
    }
    debugLog('REMOVE ARRAY ::::::', removeArray);
    debugLog('FILTERED ARRAY:::::::', filteredArray);
    let tempArray = [];
    if (change_flag == true) {
      if (items.length !== 0) {
        showValidationAlert(
          strings('generalNew.itemAdjusted') +
            '\n\n' +
            filteredArray +
            '\n' +
            removeArray,
        );
      }
    }
    if (removeArray.length !== 0) {
      tempArray = items.filter((data) => {
        return !removeArray.includes(
          data.name + data.addons_category_list[0].addons_category,
        );
      });
      items = tempArray;
    }
    if (filteredArray.length !== 0) {
      tempArray = items.filter((data) => {
        return !filteredArray.includes(
          data.name + data.addons_category_list[0].addons_category,
        );
      });
      items = tempArray;
    }
    if (items.length !== 0) {
      orderToRepeat.items = items;
      this.checkCurrentStore(orderToRepeat);
    } else showValidationAlert(strings('generalNew.noitemsAvailable'));
  };
  onPressTrackButtonHandler = (orderDetails) => {
    netStatus((isConnected) => {
      if (isConnected) {
        if (orderDetails.driver !== undefined && orderDetails.driver !== null) {
          this.props.navigation.navigate('trackOrder', {
            orderToTrack: orderDetails,
          });
        } else {
          showDialogue(strings('generalNew.generalWebServiceError'));
        }
      } else {
        showNoInternetAlert();
      }
    });
  };
  //#endregion
}

//#region STYLES
const styles = StyleSheet.create({
  mainViewStyle: {
    flex: 1,
    backgroundColor: EDColors.offWhite,
  },
  tabContainer: {
    backgroundColor: EDColors.offWhite,
    margin: 25,
  },
  tabStyle: {
    borderColor: EDColors.primary,
    height: heightPercentageToDP('5%'),
  },
  tabTextStyle: {
    color: EDColors.primary,
    alignSelf: 'flex-start',
    fontFamily: EDFonts.regular,
    fontSize: getProportionalFontSize(16),
  },
  activeTabStyle: {
    backgroundColor: EDColors.primary,
  },
  activeTabTextStyle: {
    color: EDColors.white,
    fontFamily: EDFonts.bold,
    fontSize: getProportionalFontSize(16),
  },
  tabBadgeContainerStyle: {
    //custom styles
  },
  activeTabBadgeContainerStyle: {
    //custom styles
  },
  tabBadgeStyle: {
    //custom styles
  },
  activeTabBadgeStyle: {
    //custom styles
  },
});
//#endregion

export default connect(
  (state) => {
    debugLog('STATE IN ORDERS SCREEN :: ', state);
    return {
      lan: state.userOperations.lan,
      currencySymbol: state.contentOperations.currencySymbol,
      userDetails: state.userOperations.userDetails || {},
      cartCount:
        state.checkoutReducer !== undefined
          ? state.checkoutReducer.cartCount
          : 0,
      objStoreDetails: state.contentOperations.objStoreDetails || {},
    };
  },
  (dispatch) => {
    return {
      changeCartButtonVisibility: (data) => {
        dispatch(changeCartButtonVisibility(data));
      },
      saveNavigationSelection: (dataToSave) => {
        dispatch(saveNavigationSelection(dataToSave));
      },
      saveCartDataInRedux: (data) => {
        dispatch(saveCartDataInRedux(data));
      },
      // saveStoresCount: data => {
      //     dispatch(saveStoresCountInRedux(data));
      // },
      saveCartCount: (data) => {
        dispatch(saveCartCount(data));
      },
      saveStoreDetailsInRedux: (dataToSave) => {
        dispatch(saveStoreDetails(dataToSave));
      },
      saveCurrencySymbol: (dataToSave) => {
        dispatch(saveCurrencySymbol(dataToSave));
      },
      saveStoreDetailsInRedux: (dataToSave) => {
        dispatch(saveStoreDetails(dataToSave));
      },
    };
  },
)(MyOrdersContainer);
