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
import {debugLog, ProductsListType} from '../utils/EDConstants';
import {netStatus} from '../utils/NetworkStatusConnection';
import {getCategories} from '../utils/ServiceManager';
import {showDialogue} from '../utils/EDAlert';
import BaseContainer from './BaseContainer';
import {NavigationEvents} from 'react-navigation';
import EDProgressLoader from '../components/EDProgressLoader';
import EDPlaceholderComponent from '../components/EDPlaceholderComponent';
import {changeCartButtonVisibility} from '../redux/actions/FloatingButton';
import {saveNavigationSelection} from '../redux/actions/Navigation';
import ShopByItem from '../components/ShopByItem';
import {saveFilterData} from '../redux/actions/Filter';
import Metrics from '../utils/metrics';

const PAGE_SIZE_CATEGORIES = 20;

class CategoriesContainer extends React.Component {
  //#region STATE
  state = {
    isLoading: false,
    arrayCategories: undefined,
  };
  //#endregion

  //#region LIFE CYCLE METHODS

  /** CONSTRUCTOR */
  constructor(props) {
    super(props);
    this.strOnScreenTitle = '';
    this.strOnScreenSubtitle = '';
    this.shouldLoadMore = false;
    this.refreshing = false;
  }

  componentDidMount() {
    this.strOnScreenTitle = '';
    this.state.arrayCategories = undefined;
    this.callCategoriesAPI();
  }

  /** DID FOCUS */
  onWillFocusCategoriesContainer = () => {
    this.props.changeCartButtonVisibility({
      shouldShowFloatingButton: true,
      currentScreen: this.props,
    });
  };

  /** RENDER */
  render() {
    return (
      <BaseContainer
        title={strings('categories.title')}
        left={'arrow-back'}
        onLeft={this.buttonBackPressed}>
        {/* SCREEN FOCUS EVENT */}
        <NavigationEvents onWillFocus={this.onWillFocusCategoriesContainer} />

        {/* PARENT VIEW */}
        <View
          pointerEvents={this.state.isLoading ? 'none' : 'auto'}
          style={styles.mainViewStyle}>
          {/* SAFE AREA VIEW */}
          <SafeAreaView style={styles.mainViewStyle}>
            {/* LOADER */}
            {this.state.isLoading ? <EDProgressLoader /> : null}

            {/* CHECK IF WE HAVE NOTIFICATIONS, ELSE DISPLAY PLAHOLDER VIEW */}
            {this.state.arrayCategories !== undefined &&
            this.state.arrayCategories.length > 0 ? (
              <FlatList
                showsVerticalScrollIndicator={false}
                numColumns={Metrics.screenWidth > 375 ? 4 : 3}
                contentContainerStyle={{
                  paddingBottom: this.props.cartCount > 0 ? 100 : 10,
                }}
                style={styles.notificationsList}
                data={this.state.arrayCategories}
                extraData={this.state}
                renderItem={this.renderCategoryItem}
                keyExtractor={(item, index) => item + index}
                onEndReached={this.onLoadMoreEventHandler}
                onEndReachedThreshold={0.5}
                refreshControl={
                  <RefreshControl
                    refreshing={this.refreshing}
                    title={strings('categories.fetchingNew')}
                    titleColor={EDColors.textAccount}
                    tintColor={EDColors.textAccount}
                    colors={[EDColors.textAccount]}
                    onRefresh={this.onPullToRefreshHandler}
                  />
                }
              />
            ) : this.strOnScreenTitle.length > 0 ? (
              <EDPlaceholderComponent
                onBrowseButtonHandler={this.buttonBrowsePressed}
                title={this.strOnScreenTitle}
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
  /** LOAD MORE EVENT */
  onLoadMoreEventHandler = () => {
    if (this.shouldLoadMore) {
      this.callCategoriesAPI();
    }
  };

  /** BRAND ITEM */
  renderCategoryItem = (categoryToLoad) => {
    return (
      <ShopByItem
        onSelectionHandler={this.onCategorySelectionHandler}
        itemToLoad={categoryToLoad.item}
      />
    );
    // return <BrandComponent containerStyle={{ margin: 0 }} imageStyle={{ height: (Metrics.screenWidth / (Metrics.screenWidth > 375 ? 4 : 3) - 20) }} resizeMode='contain' onSelectionHandler={this.onCategorySelectionHandler} data={brandToLoad.item} />
  };

  /** BRAND SELECTION HANDLER */
  onCategorySelectionHandler = (selectedCategory) => {
    this.props.saveFilterParams({
      arraySelectedCategoryIDs: [selectedCategory.entity_id],
      arraySelectedBrandIDs: [],
      shouldShowProductsWithPrescription: false,
      shouldShowProductsInStock: false,
      shouldShowFeaturedProducts: false,
    });
    this.props.navigation.navigate('productsList', {
      listType: ProductsListType.category,
      entityFromHomeScreen: selectedCategory,
    });
  };

  /** PULL TO REFRESH HANDLER */
  onPullToRefreshHandler = () => {
    this.refreshing = false;
    this.shouldLoadMore = false;
    this.state.arrayCategories = [];
    // this.setState({ arrayCategories: undefined })
    this.callCategoriesAPI(true);
  };
  //#endregion

  //#region BUTTON EVENTS
  /** MENU PRESSED */
  buttonBackPressed = () => {
    this.props.navigation.goBack();
  };

  /** BROWSE BUTTON HANDLER */
  buttonBrowsePressed = () => {
    this.buttonBackPressed();
  };
  //#endregion

  //#region NETWORK METHODS

  /**
   *
   * @param {The success response object} objSuccess
   */
  onGetCategoriesSuccess = (objSuccess) => {
    this.strOnScreenTitle = strings('categories.noCategoriesFoundTitle');
    this.strOnScreenSubtitle = strings('categories.noCategoriesFoundMessages');

    if (this.state.arrayCategories === undefined) {
      this.state.arrayCategories = [];
    }

    if (
      objSuccess.data.categories_list !== undefined &&
      objSuccess.data.categories_list.length > 0
    ) {
      let arrCategories = objSuccess.data.categories_list || [];
      let totalCategoriesCount = objSuccess.data.categories_count || 0;
      this.shouldLoadMore =
        this.state.arrayCategories.length + arrCategories.length <
        totalCategoriesCount;
      this.setState({
        arrayCategories: [...this.state.arrayCategories, ...arrCategories],
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
  onGetCategoriesFailure = (objFailure) => {
    this.strOnScreenTitle = objFailure.message || '';
    this.setState({isLoading: false});
    showDialogue(objFailure.message);
    this.refreshing = false;
  };

  /** REQUEST GET NOTIFICATIONS */
  /**
   *
   * @param {Check if it is pull-to-refresh event call or normal call and show loader accordingly} isForRefresh
   */
  callCategoriesAPI = (isForRefresh = false) => {
    this.strOnScreenTitle = '';
    this.strOnScreenSubtitle = '';
    netStatus((isConnected) => {
      if (isConnected) {
        let objGetCategoriesParams = {
          language_slug: this.props.lan,
          count: PAGE_SIZE_CATEGORIES,
          page_no:
            this.state.arrayCategories && !isForRefresh
              ? parseInt(
                  this.state.arrayCategories.length / PAGE_SIZE_CATEGORIES,
                ) + 1
              : 1,
        };
        if (!isForRefresh) {
          this.setState({isLoading: this.state.arrayCategories === undefined});
        }
        getCategories(
          objGetCategoriesParams,
          this.onGetCategoriesSuccess,
          this.onGetCategoriesFailure,
          this.props,
        );
      } else {
        this.refreshing = false;
        if (this.state.arrayCategories === undefined) {
          this.strOnScreenTitle = strings('generalNew.noInternetTitle');
          this.strOnScreenSubtitle = strings('generalNew.noInternet');
          this.setState({arrayCategories: []});
        } else {
          this.strOnScreenTitle = '';
          this.strOnScreenSubtitle = '';
        }
      }
    });
  };
}

//#region STYLES
const styles = StyleSheet.create({
  mainViewStyle: {
    flex: 1,
    backgroundColor: EDColors.offWhite,
  },
  notificationsList: {
    paddingHorizontal: 5,
    margin: 10,
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
      saveFilterParams: (data) => {
        dispatch(saveFilterData(data));
      },
    };
  },
)(CategoriesContainer);
//#endregion
