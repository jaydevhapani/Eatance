import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  RefreshControl,
} from 'react-native';
import {connect} from 'react-redux';
import {strings} from '../locales/i18n';
import {EDColors} from '../utils/EDColors';
import {
  debugLog,
  ProductsListType,
  isRTLCheck,
  getProportionalFontSize,
} from '../utils/EDConstants';
import {netStatus} from '../utils/NetworkStatusConnection';
import {getProducts} from '../utils/ServiceManager';
import {showValidationAlert} from '../utils/EDAlert';
import BaseContainer from './BaseContainer';
import {NavigationEvents} from 'react-navigation';
import EDProgressLoader from '../components/EDProgressLoader';
import EDPlaceholderComponent from '../components/EDPlaceholderComponent';
import {changeCartButtonVisibility} from '../redux/actions/FloatingButton';
import {saveNavigationSelection} from '../redux/actions/Navigation';
import ProductComponent from '../components/ProductComponent';
import {saveCartData} from '../utils/AsyncStorageHelper';
import Toast from 'react-native-easy-toast';
import {saveCartDataInRedux, saveCartCount} from '../redux/actions/Checkout';
import EDPopupView from '../components/EDPopupView';
import EDAddonsModalComponent from '../components/EDAddonsModalComponent';
import {SearchBar} from 'react-native-elements';
import {EDFonts} from '../utils/EDFontConstants';

const PAGE_SIZE_PRODUCTS_LIST = 10;

class ProductsListContainer extends React.Component {
  //#region STATE
  state = {
    isLoading: false,
    arrayProducts: undefined,
    strSearchString: '',
    isAddonsOpen: false,
    key: 1,
  };
  //#endregion

  //#region LIFE CYCLE METHODS

  /** CONSTRUCTOR */
  constructor(props) {
    super(props);
    this.strOnScreenMessage = '';
    this.strOnScreenSubtitle = '';
    this.shouldLoadMore = false;
    this.refreshing = false;
    this.listType =
      this.props.navigation.state.params !== undefined &&
      this.props.navigation.state.params.listType !== undefined
        ? this.props.navigation.state.params.listType
        : ProductsListType.other;
    this.entityFromHomeScreen =
      this.props.navigation.state.params !== undefined &&
      this.props.navigation.state.params.entityFromHomeScreen !== undefined
        ? this.props.navigation.state.params.entityFromHomeScreen
        : {};
    this.objSelectedCustomisableProduct = undefined;
    this.objLastSelectedProduct = undefined;
  }

  componentDidMount() {
    debugLog('componentDidMount');
    this.callProductsAPI();
  }

  /** DID FOCUS */
  onWillFocusProductsListContainer = () => {
    // CALL API WHENEVER USER COMES TO THIS SCREEN
    // if ((this.state.arrayProducts !== undefined && this.shouldLoadMore) ||
    //     (this.state.arrayProducts === undefined && !this.shouldLoadMore) ||
    //     (this.state.arrayProducts.length === 0 && this.shouldLoadMore))
    //     {
    //  this.callProductsAPI()
    // }

    // this.strOnScreenSubtitle = ''
    // this.strOnScreenMessage = ''
    // this.state.arrayProducts = undefined;
    // this.callProductsAPI()
    this.setState({key: this.state.key + 1});
    this.props.changeCartButtonVisibility({
      shouldShowFloatingButton: true,
      currentScreen: this.props,
    });
  };

  addOnsModal = () => {
    return (
      <EDPopupView isModalVisible={this.state.isAddonsOpen}>
        <View style={styles.addOnsStyle}>
          <EDAddonsModalComponent
            categoriesData={this.objSelectedCustomisableProduct}
            onAddnewItemHandler={this.buttonAddNewFromModalComponentPressed}
            onAddRepeatItemHandler={this.addRepeatItemAction}
          />
        </View>
      </EDPopupView>
    );
  };

  addRepeatItemAction = () => {
    this.cartRepeatData = {};
    this.selectedArray = this.props.cartDetail.items.filter((items) => {
      return items.menu_id === this.objLastSelectedProduct.menu_id;
    });
    let repeatArray =
      this.selectedArray[this.selectedArray.length - 1].addons_category_list[0]
        .addons_list[0];

    if (
      repeatArray.in_stock >
      this.selectedArray[this.selectedArray.length - 1].quantity
    ) {
      if (
        repeatArray.max_quantity >
        this.selectedArray[this.selectedArray.length - 1].quantity
      ) {
        this.selectedArray[this.selectedArray.length - 1].quantity =
          this.selectedArray[this.selectedArray.length - 1].quantity + 1;

        this.setState({
          isAddonsOpen: false,
          key: this.state.key + 1,
        });
        this.props.saveCartDataInRedux(this.props.cartDetail);
        this.getCartCount(this.props.cartDetail);
        saveCartData(
          this.props.cartDetail,
          () => {},
          () => {},
        );
      } else {
        showValidationAlert(
          strings('generalNew.maxQuantity') + repeatArray.max_quantity,
        );
        this.setState({
          isAddonsOpen: false,
        });
      }
    } else {
      showValidationAlert(strings('generalNew.noMoreStock'));
      this.setState({
        isAddonsOpen: false,
      });
    }
  };

  getScreenTitle = () => {
    if (this.listType == ProductsListType.category) {
      return this.entityFromHomeScreen !== undefined
        ? this.entityFromHomeScreen.name || ''
        : '';
    } else if (this.listType == ProductsListType.brands) {
      return this.entityFromHomeScreen !== undefined
        ? this.entityFromHomeScreen.name || ''
        : '';
    } else if (this.listType == ProductsListType.featuredProducts) {
      return strings('homeNew.featured');
    } else {
      return strings('productsList.title');
    }
  };

  /** RENDER */
  render() {
    return (
      <BaseContainer
        title={this.getScreenTitle()}
        left={'arrow-back'}
        onLeft={this.buttonBackPressed}
        right={'filter'}
        // right={Assets.ic_filter}
        onRight={this.buttonFilterPressed}>
        {/* TOAST */}
        <Toast ref="toast" position="center" fadeInDuration={1} />

        {this.addOnsModal()}

        {/* SCREEN FOCUS EVENT */}
        <NavigationEvents onWillFocus={this.onWillFocusProductsListContainer} />

        <SearchBar
          placeholder={strings('productsList.searchProducts')}
          pointerEvents={this.state.isLoading ? 'none' : 'auto'}
          onChangeText={this.searchTextDidChangeHandler}
          onClear={this.searchTextDidClearHandler}
          onBlur={this.onSearchFieldBlurHandler}
          value={this.state.strSearchString}
          lightTheme={true}
          containerStyle={{backgroundColor: EDColors.offWhite}}
          inputContainerStyle={{
            // borderColor: EDColors.shadow,
            // borderWidth: 1,
            shadowOpacity: 0.25,
            shadowRadius: 5,
            shadowColor: EDColors.text,
            shadowOffset: {height: 0, width: 0},
            backgroundColor: EDColors.white,
            flexDirection: isRTLCheck() ? 'row-reverse' : 'row',
          }}
          inputStyle={{
            color: EDColors.text,
            fontFamily: EDFonts.regular,
            fontSize: getProportionalFontSize(14),
            textAlign: isRTLCheck() ? 'right' : 'left',
          }}
        />

        {/* PARENT VIEW */}
        <View
          pointerEvents={this.state.isLoading ? 'none' : 'auto'}
          style={styles.mainViewStyle}>
          {/* SAFE AREA VIEW */}
          <SafeAreaView style={styles.mainViewStyle}>
            {/* LOADER */}
            {this.state.isLoading ? <EDProgressLoader /> : null}

            {/* CHECK IF WE HAVE NOTIFICATIONS, ELSE DISPLAY PLAHOLDER VIEW */}
            {this.state.arrayProducts !== undefined &&
            this.state.arrayProducts.length > 0 ? (
              <FlatList
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  paddingBottom: this.props.cartCount > 0 ? 100 : 10,
                }}
                style={[styles.productsList]}
                data={this.state.arrayProducts}
                extraData={this.state}
                renderItem={this.renderProductItem}
                keyExtractor={(item, index) => item + index}
                onEndReached={this.onLoadMoreEventHandler}
                onEndReachedThreshold={0.5}
                refreshControl={
                  <RefreshControl
                    refreshing={this.refreshing}
                    title={strings('productsList.fetchingNew')}
                    titleColor={EDColors.textAccount}
                    tintColor={EDColors.textAccount}
                    colors={[EDColors.textAccount]}
                    onRefresh={this.onPullToRefreshHandler}
                  />
                }
              />
            ) : this.strOnScreenMessage.length > 0 ? (
              <EDPlaceholderComponent
                buttonTitle={strings('buttonTitles.okay')}
                onBrowseButtonHandler={this.buttonBrowsePressed}
                title={this.strOnScreenMessage}
                subTitle={this.strOnScreenSubtitle}
              />
            ) : null}
          </SafeAreaView>
        </View>
      </BaseContainer>
    );
  }
  //#endregion

  //#region HELPER METHODS
  /** SEARCH TEXT CHANGE HANDLER */
  searchTextDidChangeHandler = (searchText) => {
    this.setState({strSearchString: searchText});
  };

  searchTextDidClearHandler = () => {
    this.state.strSearchString = '';
    this.setState({strSearchString: ''});
    this.onSearchFieldBlurHandler();
  };

  onSearchFieldBlurHandler = () => {
    this.strOnScreenMessage = '';
    this.strOnScreenSubtitle = '';
    this.refreshing = false;
    this.shouldLoadMore = false;
    this.state.arrayProducts = undefined;
    this.callProductsAPI();
  };

  /** LOAD MORE EVENT */
  onLoadMoreEventHandler = () => {
    if (this.shouldLoadMore) {
      this.callProductsAPI();
    }
  };

  /** PRODUCT ITEM */
  renderProductItem = (productToLoad) => {
    return (
      <ProductComponent
        key={this.state.key}
        lan={this.props.lan}
        data={productToLoad.item}
        cartData={
          this.props.cartDetail !== undefined
            ? this.props.cartDetail.items !== undefined
              ? this.props.cartDetail.items.length > 0
                ? this.props.cartDetail.items
                : []
              : []
            : []
        }
        currencySymbol={this.props.currencySymbol}
        isOpen={
          (
            (this.props.objStoreDetails.timings || {}).closing || ''
          ).toLowerCase() == 'open'
            ? true
            : false
        }
        itemDetails={this.navigateToProductDetail}
        plusItems={this.buttonAddQuantityPressed}
        minusItems={this.buttonRemoveQuantityPressed}
        addData={this.buttonCustomiseProductPressed}
        addOneData={this.buttonAddSingleItemPressed}
      />
    );
  };

  /** PULL TO REFRESH HANDLER */
  onPullToRefreshHandler = () => {
    this.refreshing = false;
    this.shouldLoadMore = false;
    this.state.arrayProducts = undefined;
    this.strOnScreenMessage = '';
    this.strOnScreenSubtitle = '';
    // this.setState({ arrayProducts: undefined })
    debugLog('PTR');
    this.callProductsAPI(true);
  };
  //#endregion

  //#region BUTTON EVENTS
  /** MENU PRESSED */
  buttonBackPressed = () => {
    this.props.navigation.goBack();
  };

  /** FILTER BUTTON EVENT */
  buttonFilterPressed = () => {
    this.props.navigation.navigate('productsFilter', {
      isFilterSelection: this.listType,
      onApplyResetHandler: this.onFilterCallback,
    });
  };

  /** ADD / CUSTOMISE PRODUCT HANDLER */
  buttonAddQuantityPressed = (productSelected) => {
    this.objSelectedCustomisableProduct = productSelected;
    this.objLastSelectedProduct = productSelected;
    this.setState({isAddonsOpen: true});
  };

  /** MINUS - BUTTON HANDLER */
  buttonRemoveQuantityPressed = (value) => {
    this.props.navigation.navigate('cart', {
      isview: value,
    });
  };
  buttonAddNewFromModalComponentPressed = () => {
    this.buttonCustomiseProductPressed(this.objSelectedCustomisableProduct);
  };
  /** PLUS + BUTTON HANDLER */
  buttonCustomiseProductPressed = (productSelected) => {
    this.setState({isAddonsOpen: false});
    this.props.navigation.navigate('addOns', {
      getCategoryDetails: this.onAddOnsItemSelectionHandler,
      subCategoryArray: productSelected,
    });
  };

  /** ADD SINGLE ITEM PRESSED */
  buttonAddSingleItemPressed = (productToAdd) => {
    if (
      this.props.cartDetail !== null &&
      this.props.cartDetail.items !== undefined &&
      this.props.cartDetail.length !== 0
    ) {
      let cartData = this.props.cartDetail.items;
      let arr = cartData.filter((p) => {
        return p.menu_id == productToAdd.menu_id;
      });
      if (arr.length !== 0) {
        if (
          productToAdd.item_in_stock !== null &&
          productToAdd.item_in_stock !== 0 &&
          productToAdd.item_in_stock > arr[0].quantity
        ) {
          if (productToAdd.item_max_quantity > arr[0].quantity)
            this.storeData(productToAdd);
          else
            showValidationAlert(
              strings('generalNew.maxQuantity') +
                productToAdd.item_max_quantity,
            );
        } else showValidationAlert(strings('generalNew.noMoreStock'));
      } else {
        if (
          productToAdd.item_in_stock !== null &&
          productToAdd.item_in_stock !== 0
        )
          this.storeData(productToAdd);
        else showValidationAlert(strings('generalNew.noMoreStock'));
      }
    } else this.storeData(productToAdd);
  };
  /** BROWSE BUTTON HANDLER */
  buttonBrowsePressed = () => {
    this.buttonBackPressed();
  };
  //#endregion

  //#region HELPER METHODS
  onFilterCallback = () => {
    this.strOnScreenMessage = '';
    this.strOnScreenSubtitle = '';
    this.state.arrayProducts = undefined;
    this.shouldLoadMore = false;
    this.callProductsAPI();
  };

  onAddOnsItemSelectionHandler = (data) => {
    if (this.props.cartDetail !== null && this.props.cartDetail !== undefined) {
      if (
        this.props.cartDetail.items !== undefined &&
        this.props.cartDetail.items !== null
      ) {
        this.cartRepeatData = {};
        this.selectedArray = this.props.cartDetail.items.filter((items) => {
          return items.menu_id === data.menu_id;
        });
        let repeatArray = this.selectedArray
          .map((item) => item.addons_category_list)
          .map((item) => item[0].addons_category_id);
        let cartArray = this.selectedArray
          .map((item) => item.addons_category_list)
          .map((item) => item[0].addons_list);
        if (
          repeatArray.includes(
            data.selected_addons_category_list[0].addons_category_id,
          )
        ) {
          let arr = cartArray.map((data) => data[0].add_ons_id);
          let index = arr.indexOf(
            data.selected_addons_category_list[0].addons_list[0].add_ons_id,
          );
          // let index = cartArray.indexOf(data.selected_addons_category_list[0].addons_category_id)
          if (
            this.selectedArray[index].addons_category_list[0].addons_list[0]
              .in_stock > this.selectedArray[index].quantity
          ) {
            if (
              this.selectedArray[index].addons_category_list[0].addons_list[0]
                .max_quantity > this.selectedArray[index].quantity
            ) {
              this.selectedArray[index].quantity =
                this.selectedArray[index].quantity + 1;
              // this.setState({ key: this.state.key + 1 });

              this.setState({
                isAddonsCategoryOpen: false,
              });
              this.props.saveCartDataInRedux(this.props.cartDetail);
              this.getCartCount(this.props.cartDetail);
              saveCartData(
                this.props.cartDetail,
                () => {},
                () => {},
              );
            } else {
              showValidationAlert(
                strings('generalNew.maxQuantity') +
                  this.selectedArray[index].addons_category_list[0]
                    .addons_list[0].max_quantity,
              );
              this.setState({
                isAddonsCategoryOpen: false,
              });
            }
          } else {
            showValidationAlert(strings('generalNew.noMoreStock'));
            this.setState({
              isAddonsCategoryOpen: false,
            });
          }
        } else this.storeData(data);
      } else this.storeData(data);
    } else this.storeData(data);
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
    this.setState({key: this.state.key + 1});
  };

  // #cart Item's Total count
  getCartCount = (data) => {
    // let Cartdata = this.props.cartDetail
    if (data !== undefined) {
      if (data.items !== undefined && data.items.length > 0) {
        var count = 0;
        data.items.map((item) => {
          count = count + item.quantity;
        });
        this.props.saveCartCount(count);
      } else {
        this.props.saveCartCount(0);
      }
    }
  };
  //#endregion

  //#region NETWORK METHODS

  /**
   *
   * @param {The success response object} objSuccess
   */
  onGetProductsSuccess = (objSuccess) => {
    this.strOnScreenMessage = strings('productsList.noProductsTitle');
    this.strOnScreenSubtitle = strings('productsList.noProductsMessage');
    this.refreshing = false;

    if (this.state.arrayProducts === undefined) {
      this.state.arrayProducts = [];
    }

    if (
      objSuccess.data.product_list !== undefined &&
      objSuccess.data.product_list instanceof Array &&
      objSuccess.data.product_list.length > 0
    ) {
      let arrProducts = objSuccess.data.product_list || [];
      let totalProductsCount = objSuccess.data.product_count || 0;
      this.shouldLoadMore =
        this.state.arrayProducts.length + arrProducts.length <
        totalProductsCount;
      this.setState({
        arrayProducts: [...this.state.arrayProducts, ...arrProducts],
        isLoading: false,
      });
    } else {
      this.setState({isLoading: false});
    }
    this.refreshing = false;
  };

  /**
   *
   * @param {The failure response object} objFailure
   */
  onGetProductsFailure = (objFailure) => {
    this.refreshing = false;

    this.strOnScreenSubtitle = '';
    this.strOnScreenMessage = objFailure.message || '';
    this.setState({isLoading: false});
    this.refreshing = false;
  };

  /** REQUEST GET NOTIFICATIONS */
  /**
   *
   * @param {Check if it is pull-to-refresh event call or normal call and show loader accordingly} isForRefresh
   */
  callProductsAPI = (isForRefresh = false) => {
    if (
      this.state.arrayProducts !== undefined &&
      this.state.arrayProducts.length > 0 &&
      !this.shouldLoadMore
    ) {
      return;
    }

    if (this.refreshing) {
      return;
    }

    this.strOnScreenMessage = '';
    this.strOnScreenSubtitle = '';
    var strSelectedBrandIDs = this.props.objFilter.arraySelectedBrandIDs.join();
    var strSelectedCategoryIDs =
      this.props.objFilter.arraySelectedCategoryIDs.join();

    netStatus((isConnected) => {
      if (isConnected) {
        console.log('CHECKLISTING ::::::::: ', this.props.objStoreDetails);
        console.log(
          'strSelectedCategoryIDs ::::::::: ',
          strSelectedCategoryIDs,
          strSelectedBrandIDs,
        );
        this.refreshing = true;
        this.setState({isLoading: true});
        let objGetProductsParams = {
          store_id: this.props.objStoreDetails.store_id,
          brand_id: strSelectedBrandIDs,
          category: strSelectedCategoryIDs,
          in_stock: this.props.objFilter.shouldShowProductsInStock ? 1 : 0,
          prescription_required: this.props.objFilter
            .shouldShowProductsWithPrescription
            ? 1
            : 0,
          isFeatured: this.props.objFilter.shouldShowFeaturedProducts ? 1 : 0,
          language_slug: this.props.lan,
          page_no:
            this.state.arrayProducts && !isForRefresh
              ? parseInt(
                  this.state.arrayProducts.length / PAGE_SIZE_PRODUCTS_LIST,
                ) + 1
              : 1,
          count: PAGE_SIZE_PRODUCTS_LIST,
          search_string: this.state.strSearchString,
        };
        if (!isForRefresh) {
          this.setState({isLoading: this.state.arrayProducts === undefined});
        }
        getProducts(
          objGetProductsParams,
          this.onGetProductsSuccess,
          this.onGetProductsFailure,
          this.props,
        );
      } else {
        this.refreshing = false;
        if (this.state.arrayProducts === undefined) {
          this.strOnScreenMessage = strings('generalNew.noInternetTitle');
          this.strOnScreenSubtitle = strings('generalNew.noInternet');
          this.setState({arrayProducts: []});
        } else {
          this.strOnScreenMessage = '';
          this.strOnScreenSubtitle = '';
        }
      }
    });
  };

  /** NAVIGATE TO DETAIL SCREEN */
  navigateToProductDetail = (data) => {
    this.props.navigation.navigate('prodcutDetails', {
      selectedProductDetails: data,
    });
  };
}

//#region STYLES
const styles = StyleSheet.create({
  mainViewStyle: {
    flex: 1,
    backgroundColor: EDColors.offWhite,
  },
  productsList: {
    // margin: 20,
  },
  addOnsStyle: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});
//#endregion

//#region REDUX
export default connect(
  (state) => {
    return {
      lan: state.userOperations.lan,
      userDetails: state.userOperations.userDetails || {},
      cartCount:
        state.checkoutReducer !== undefined
          ? state.checkoutReducer.cartCount
          : 0,
      objFilter: state.filterOperations.objFilter || {},
      cartDetail: state.checkoutReducer.cartDetails || {},
      currencySymbol: state.contentOperations.currencySymbol,
      objStoreDetails: state.contentOperations.objStoreDetails,
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
      saveCartCount: (data) => {
        dispatch(saveCartCount(data));
      },
      saveCartDataInRedux: (data) => {
        dispatch(saveCartDataInRedux(data));
      },
    };
  },
)(ProductsListContainer);
//#endregion
