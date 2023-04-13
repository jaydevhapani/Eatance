import React from 'react';
import {
  AppState,
  Linking,
  Platform,
  View,
  RefreshControl,
  StyleSheet,
  SafeAreaView,
  FlatList,
} from 'react-native';
import {PERMISSIONS, RESULTS} from 'react-native-permissions';
import {connect} from 'react-redux';
import {strings} from '../locales/i18n';
import {NavigationEvents} from 'react-navigation';
import {EDFonts} from '../utils/EDFontConstants';
import {EDColors} from '../utils/EDColors';
import {
  debugLog,
  getProportionalFontSize,
  isRTLCheck,
  GOOGLE_API_KEY,
} from '../utils/EDConstants';
import {netStatus} from '../utils/NetworkStatusConnection';
import {getStores} from '../utils/ServiceManager';
import {saveSelectedStore} from '../utils/AsyncStorageHelper';
import EDPopupView from '../components/EDPopupView';
import {changeCartButtonVisibility} from '../redux/actions/FloatingButton';
import BaseContainer from './BaseContainer';
import StoreInfoComponent from '../components/StoreInfoComponent';
import EDPlaceholderComponent from '../components/EDPlaceholderComponent';
import {saveCurrencySymbol, saveStoreDetails} from '../redux/actions/Content';
import {saveCartCount, saveCartDataInRedux} from '../redux/actions/Checkout';
import EDConfirmationDialogue from '../components/EDConfirmationDialogue';
import {SearchBar} from 'react-native-elements';
import {getAddress, getCurrentLocation} from '../utils/LocationServiceManager';
import {checkLocationPermission} from '../utils/LocationServices';

const PAGE_SIZE_STORES_LIST = 50;

class StoresListContainer extends React.Component {
  //#region LIFE CYCLE METHODS
  constructor(props) {
    super(props);
    this.strOnScreenTitle = '';
    this.strOnScreenSubtitle = '';
    this.shouldLoadMore = false;
    this.refreshing = false;
    this.objStoreToBeSelected = undefined;
    this.isForSwitchingStore =
      this.props.navigation.state !== undefined &&
      this.props.navigation.state.params !== undefined &&
      this.props.navigation.state.params.isForSwitchingStore;
    this.locationError = false;
    this.openSettings = false;
  }

  componentWillUnmount = () => {
    // BackgroundGeolocation.removeAllListeners();
    AppState.removeEventListener('change', this._handleAppStateChange);
  };

  componentDidMount = () => {
    AppState.addEventListener('change', this._handleAppStateChange);
  };

  _handleAppStateChange = (nextAppState) => {
    debugLog('APP STATE :::::::', nextAppState);
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      if (this.state.arrayStoresList == undefined && this.openSettings)
        this.callGetStoresListAPI();
    }
    this.setState({appState: nextAppState});
  };

  onDidFocusStoresListContainer = () => {
    this.props.changeCartButtonVisibility({
      shouldShowFloatingButton: false,
      currentScreen: this.props,
    });
    this.isForSwitchingStore =
      this.props.navigation.state !== undefined &&
      this.props.navigation.state.params !== undefined &&
      this.props.navigation.state.params.isForSwitchingStore;
  };

  onWillFocusStoresListContainer = () => {
    this.storeQuery = '';
    this.setState({arrayStoresList: undefined, strSearchString: ''});
    this.callGetStoresListAPI();
    this.props.changeCartButtonVisibility({
      shouldShowFloatingButton: false,
      currentScreen: this.props,
    });
  };
  updateSearch = (search) => {
    this.setState({strSearchString: search});
  };

  render() {
    return (
      <BaseContainer
        title={'Store'}
        left={this.isForSwitchingStore ? 'arrow-back' : undefined}
        onLeft={this.buttonBackPressed}
        loading={this.state.isLoading}
        onConnectionChangeHandler={this.onConnectionChangeHandler}>
        {/* SCREEN FOCUS EVENT */}
        <NavigationEvents
          onDidFocus={this.onDidFocusStoresListContainer}
          onWillFocus={this.onWillFocusStoresListContainer}
        />

        {/* SWITCH STORE CONFIRMATION DIALOGUE */}
        {this.renderSwitchStoreConfirmationDialogue()}

        {/* PARENT VIEW */}
        <View
          pointerEvents={this.state.isLoading ? 'none' : 'auto'}
          style={styles.mainViewStyle}>
          {/* SAFE AREA VIEW */}
          <SafeAreaView style={styles.mainViewStyle}>
            {/* SearchBar  */}
            {/* <SearchBar
              returnKeyType="search"
              placeholder={strings('generalNew.search_store')}
              lightTheme={true}
              value={this.state.strSearchString}
              onChangeText={this.updateSearch}
              onSubmitEditing={() => {
                this.setState({arrayStoresList: undefined});
                this.callGetStoresListAPI();
              }}
              inputContainerStyle={{
                shadowOpacity: 0.25,
                shadowRadius: 5,
                shadowColor: EDColors.text,
                shadowOffset: {height: 0, width: 0},
                backgroundColor: EDColors.white,
                flexDirection: isRTLCheck() ? 'row-reverse' : 'row',
              }}
              inputStyle={{
                tintColor: EDColors.homeButtonColor,
                color: EDColors.text,
                fontFamily: EDFonts.regular,
                fontSize: getProportionalFontSize(14),
                textAlign: isRTLCheck() ? 'right' : 'left',
              }}
              containerStyle={{backgroundColor: EDColors.offWhite}}
              style={{tintColor: EDColors.homeButtonColor}}
              onClear={() => {
                this.setState({arrayStoresList: undefined});
                this.callGetStoresListAPI();
              }}
            /> */}
            {/* CHECK IF WE HAVE NOTIFICATIONS, ELSE DISPLAY PLAHOLDER VIEW */}
            {this.state.arrayStoresList !== undefined &&
            this.state.arrayStoresList.length > 0 ? (
              <FlatList
                showsVerticalScrollIndicator={false}
                // contentContainerStyle={{ paddingBottom: 20 }}
                style={styles.storesList}
                data={this.state.arrayStoresList}
                extraData={this.state}
                renderItem={this.renderStoreItem}
                keyExtractor={(item, index) => item + index}
                onEndReached={this.onLoadMoreEventHandler}
                onEndReachedThreshold={0.5}
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
              />
            ) : this.strOnScreenTitle.length > 0 ? (
              <EDPlaceholderComponent
                title={this.strOnScreenTitle}
                subTitle={this.strOnScreenSubtitle}
                buttonTitle={this.buttonTitle}
                onBrowseButtonHandler={this.btnPress}
              />
            ) : null}
          </SafeAreaView>
        </View>
      </BaseContainer>
    );
  }

  //#endregion

  //#region STATE
  state = {
    isLoading: false,
    arrayStoresList: undefined,
    shouldShowConfirmationDialogue: false,
    strSearchString: '',
    appState: AppState.currentState,
  };
  //#endregion

  //#region BUTTON EVENTS
  buttonBackPressed = () => {
    this.props.navigation.navigate(isRTLCheck() ? 'mainRTL' : 'main');
  };
  //#endregion

  //#region HELPER METHODS
  onStoreSelectionHandler = (selectedStore) => {
    this.objStoreToBeSelected = selectedStore;
    const currentStore = this.props.objStoreDetails;

    if (
      currentStore !== undefined &&
      currentStore.store_id == selectedStore.store_id
    ) {
      this.props.navigation.navigate(isRTLCheck() ? 'mainRTL' : 'main');
      // this.buttonBackPressed();
      return;
    }

    if (this.props.cartCount > 0) {
      this.setState({shouldShowConfirmationDialogue: true});
    } else {
      this.clearCartAndNavigate(selectedStore);
    }
  };

  clearCartAndNavigate = (selectedStore) => {
    this.props.saveCartDataInRedux({});
    this.props.saveCartCount(0);
    this.props.saveCurrencySymbol(selectedStore.currency_symbol);
    this.props.saveStoreDetailsInRedux(selectedStore);
    saveSelectedStore(
      selectedStore,
      () => {},
      () => {},
    );
    if (this.isForSwitchingStore) {
      this.props.navigation.navigate(isRTLCheck() ? 'mainRTL' : 'main');
    } else {
      this.props.navigation.navigate(isRTLCheck() ? 'mainRTL' : 'main');
    }
  };

  /** RENDER SWITCH STORE CONFIMRATION DIALOGUE */
  onYesPressed = () => {
    if (this.objStoreToBeSelected == undefined) {
      return;
    }

    this.setState({shouldShowConfirmationDialogue: false});
    this.clearCartAndNavigate(this.objStoreToBeSelected);
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
  //#endregion

  btnPress = () => {
    this.refreshScreen();
  };

  refreshScreen = () => {
    debugLog('REFRESH :::::', this.permissionBlocked);
    if (this.permissionBlocked) {
      this.setState({isLoading: true});
      this.openSettings = true;
      if (Platform.OS == 'ios') Linking.openURL('app-settings:');
      else {
        console.log('Linking.openSettings for Android');
        Linking.openSettings();
      }
    } else {
      this.onPullToRefreshHandler();
    }
  };

  renderStoreItem = (store) => {
    return (
      <StoreInfoComponent
        onSelectionHandler={this.onStoreSelectionHandler}
        storeDetails={store.item}
      />
    );
  };

  /** LOAD MORE EVENT */
  onLoadMoreEventHandler = () => {
    if (this.shouldLoadMore) {
      this.callGetStoresListAPI();
    }
  };

  /** PULL TO REFRESH HANDLER */
  onPullToRefreshHandler = () => {
    this.storeQuery = '';
    this.strOnScreenTitle = '';
    this.strOnScreenSubtitle = '';
    this.refreshing = false;
    this.shouldLoadMore = false;
    this.state.arrayStoresList = [];
    this.setState({strSearchString: undefined, arrayStoresList: undefined});
    this.callGetStoresListAPI(false);
  };

  onConnectionChangeHandler = (isConnected) => {
    // showDialogue('HOME SCREEN CONNECTITIY HANDLER :: ' + isConnected)
    if (
      isConnected &&
      this.state.arrayStoresList !== undefined &&
      this.state.arrayStoresList.count == 0
    ) {
      this.callGetStoresListAPI();
    }
  };
  //#endregion

  //#region NETWORK METHODS
  /**
   *
   * @param {The success response object} objSuccess
   */
  onGetStoresListSuccess = (objSuccess) => {
    this.strOnScreenTitle = strings('storesList.noStoresTitle');
    // this.strOnScreenSubtitle = strings('storesList.noStoresSubtitle');

    if (this.state.arrayStoresList === undefined) {
      console.log('this.state.arrayStoresList === undefined::::::::::::::::');
      this.state.arrayStoresList = [];
    }

    if (
      objSuccess.data.store !== undefined &&
      objSuccess.data.store.length > 0
    ) {
      let arrStores = objSuccess.data.store || [];
      let totalStoresCount = objSuccess.data.stores_count || 0;
      this.shouldLoadMore =
        this.state.arrayStoresList.length + arrStores.length < totalStoresCount;
      this.setState({
        arrayStoresList: [...this.state.arrayStoresList, ...arrStores],
        isLoading: false,
      });
      this.setState({isLoading: false});
    } else {
      this.setState({isLoading: false});
      this.buttonTitle = strings('storesList.refresh');
      this.strOnScreenTitle = strings('storesList.noStoresTitle');
      this.strOnScreenSubtitle = strings('storesList.refine');
    }
    this.refreshing = false;
  };

  /**
   *
   * @param {The success response object} objSuccess
   */
  onGetStoresListFailure = (objFailure) => {
    this.strOnScreenTitle = objFailure.message || '';
    this.strOnScreenSubtitle = '';
    this.refreshing = false;
    this.setState({isLoading: false});
  };

  /** SEARCH TEXT CHANGE HANDLER */
  searchTextDidChangeHandler = (searchText) => {
    this.setState({strSearchString: searchText, arrayStoresList: undefined});
    // if (searchText.trim().length > 0) {
    if (this.state.arrayStoresList !== undefined) this.callGetStoresListAPI();
    // }
  };

  //Get Current Address
  getCurrentAddress = (lat, long) => {
    debugLog('LAT LONG ::::', lat, long);
    getAddress(
      lat,
      long,
      (onSuccess) => {
        debugLog('ON SUCCESS GET ADDRESS :::::', onSuccess);
        this.currentCity = onSuccess.localArea;
        this.currentAddress = onSuccess.strAddress;
        let addressData = {
          latitude: lat,
          longitude: long,
          areaName: onSuccess.localArea,
          address: onSuccess.strAddress,
        };
        this.props.saveCurrentLocation(addressData);
      },
      this.onFailureGetAddress,
      GOOGLE_API_KEY,
    );
  };

  onFailureGetAddress = (onFailure) => {
    debugLog('Address Fail:::::::: ', onFailure);
  };

  callGetStoresListAPI = (isForRefresh = false) => {
    this.openSettings = false;
    this.locationError = false;
    this.strOnScreenTitle = '';
    this.strOnScreenSubtitle = '';

    netStatus((isConnected) => {
      if (isConnected) {
        debugLog('CURERNT LOCAITONDSDSD :::::', this.props.currentLocation);
        if (
          this.props.currentLocation !== undefined &&
          this.props.currentLocation !== null &&
          this.props.currentLocation.latitude !== undefined
        ) {
          let objGetStoresParama = {
            language_slug: this.props.lan,
            count: PAGE_SIZE_STORES_LIST,
            page_no:
              this.state.arrayStoresList && !isForRefresh
                ? parseInt(
                    this.state.arrayStoresList.length / PAGE_SIZE_STORES_LIST,
                  ) + 1
                : 1,
            sort_by: 'distance',
            search_store: this.state.strSearchString,
            latitude: this.props.currentLocation.latitude,
            longitude: this.props.currentLocation.longitude,
          };
          console.log('objGetStoresParama =>::: ', objGetStoresParama);
          if (!isForRefresh) {
            this.setState({
              isLoading: this.state.arrayStoresList === undefined,
              isMoreLoading:
                this.state.arrayStoresList !== undefined &&
                this.state.arrayStoresList.length !== 0
                  ? true
                  : false,
            });
          }
          getStores(
            objGetStoresParama,
            this.onGetStoresListSuccess,
            this.onGetStoresListFailure,
            this.props,
          );
        } else {
          this.setState({isLoading: true});
          var paramPermission =
            Platform.OS === 'ios'
              ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
              : PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION;
          checkLocationPermission(
            paramPermission,
            () => {
              getCurrentLocation(
                (onSucces) => {
                  console.log(
                    'LOCATION PERMISSION GRANTED::::::::::',
                    onSucces,
                  );
                  // this.latitude = onSucces.latitude,
                  //     this.longitude = onSucces.longitude
                  this.getCurrentAddress(onSucces.latitude, onSucces.longitude);
                  let objGetStoresParama = {
                    language_slug: this.props.lan,
                    count: PAGE_SIZE_STORES_LIST,
                    page_no:
                      this.state.arrayStoresList && !isForRefresh
                        ? parseInt(
                            this.state.arrayStoresList.length /
                              PAGE_SIZE_STORES_LIST,
                          ) + 1
                        : 1,
                    sort_by: 'distance',
                    search_store: this.state.strSearchString,
                    latitude: onSucces.latitude,
                    longitude: onSucces.longitude,
                  };

                  // if (!isForRefresh) {
                  //     this.setState({ isLoading: this.state.arrayStoresList === undefined });
                  // }
                  getStores(
                    objGetStoresParama,
                    this.onGetStoresListSuccess,
                    this.onGetStoresListFailure,
                    this.props,
                  );
                },
                () => {
                  debugLog('UNABLE TO FETCH CURRENT LOCATION:::::');
                  this.locationError = true;
                  this.strOnScreenTitle = strings('generalNew.locationError2');
                  this.buttonTitle = strings('storesList.refresh');
                  this.permissionBlocked = false;
                  this.permissionGranted = true;
                  this.setState({isLoading: false});
                },
                GOOGLE_API_KEY,
              );
            },
            (onFailure) => {
              debugLog('LOCATION PERMISSION NOT GRANTED ::::::', onFailure);
              this.locationError = true;
              if (onFailure == RESULTS.BLOCKED) {
                this.permissionBlocked = true;
                this.permissionGranted = false;
                this.buttonTitle = strings('generalNew.openSettings');
                this.strOnScreenTitle = strings(
                  'generalNew.locationPermission',
                );
              } else {
                this.strOnScreenTitle = strings('generalNew.locationError');
                this.buttonTitle = strings('generalNew.allowLocation');
                this.permissionGranted = false;
                this.permissionBlocked = false;
              }
              this.strOnScreenSubtitle = '';
              this.setState({isLoading: false});
            },
          );
        }
      } else {
        this.refreshing = false;
        if (this.state.arrayStoresList === undefined) {
          this.strOnScreenTitle = strings('generalNew.noInternetTitle');
          this.strOnScreenSubtitle = strings('generalNew.noInternet');
          this.setState({arrayStoresList: []});
        } else {
          this.strOnScreenTitle = '';
          this.strOnScreenSubtitle = '';
        }
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
  storesList: {
    marginVertical: 20,
    marginHorizontal: 10,
  },
});
//#endregion

export default connect(
  (state) => {
    return {
      lan: state.userOperations.lan,
      objStoreDetails: state.contentOperations.objStoreDetails,
      cartCount: state.checkoutReducer.cartCount,
    };
  },
  (dispatch) => {
    return {
      changeCartButtonVisibility: (data) => {
        dispatch(changeCartButtonVisibility(data));
      },
      saveCurrencySymbol: (dataToSave) => {
        dispatch(saveCurrencySymbol(dataToSave));
      },
      saveStoreDetailsInRedux: (dataToSave) => {
        dispatch(saveStoreDetails(dataToSave));
      },
      // saveStoresCount: data => {
      //     dispatch(saveStoresCountInRedux(data));
      // },
      saveCartCount: (data) => {
        dispatch(saveCartCount(data));
      },
      saveCartDataInRedux: (data) => {
        dispatch(saveCartDataInRedux(data));
      },
    };
  },
)(StoresListContainer);
