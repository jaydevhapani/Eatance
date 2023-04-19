import React from 'react';
import {Platform, StyleSheet, FlatList, Linking, View} from 'react-native';
import Assets from '../assets';
import {connect} from 'react-redux';
import {saveNavigationSelection} from '../redux/actions/Navigation';
import {EDColors} from '../utils/EDColors';
import {
  flushAllData,
  saveLanguage,
  saveSelectedStore,
  setIsTermsAndConditionsAccepted,
} from '../utils/AsyncStorageHelper';
import {
  saveUserDetailsInRedux,
  saveLanguageInRedux,
  saveTermsAcceptedStatus,
} from '../redux/actions/User';
import {
  NavigationActions,
  NavigationEvents,
  StackActions,
} from 'react-navigation';
import Share from 'react-native-share';
import {debugLog} from '../utils/EDConstants';
import {saveCartCount} from '../redux/actions/Checkout';
import {logoutUser} from '../utils/ServiceManager';
import {strings} from '../locales/i18n';
import {showNoInternetAlert, showDialogue} from '../utils/EDAlert';
import EDSideMenuHeader from './EDSideMenuHeader';
import EDSideMenuItem from './EDSideMenuItem';
import EDPopupView from './EDPopupView';
import EDConfirmationDialogue from './EDConfirmationDialogue';
import {netStatus} from '../utils/NetworkStatusConnection';
import EDProgressLoader from './EDProgressLoader';

const APP_STORE_LINK = 'https://epicwinesandspirits.africa/';
const PLAY_STORE_LINK = 'https://epicwinesandspirits.africa/';

class SideBar extends React.PureComponent {
  //#region LIFECYCLE METHODS

  /** CONSTRUCTOR */
  constructor(props) {
    super(props);
    this.arrayFinalSideMenu = [];
  }

  /** STATE */
  state = {
    isLogout: false,
    isLoading: false,
  };

  /** ON DID FOCUS */
  onDidFocusNavigationEvents = () => {
    debugLog('1234');
  };

  /** MAIN RENDER METHOD */
  render() {
    let arrCMSPages = this.props.arrayCMSPages.map((itemToIterate) => {
      return {
        isAsset: true,
        route: 'cms',
        screenName: itemToIterate.name,
        icon: {uri: itemToIterate.cms_icon},
        cmsSlug: itemToIterate.cms_slug,
      };
    });
    let arrTemp = this.setupSideMenuData();
    let arraySideMenuData = arrTemp.concat(arrCMSPages);

    this.arrayFinalSideMenu = this.props.isLoggedIn
      ? arraySideMenuData.concat({
          isAsset: true,
          route: 'SignOut',
          screenName: strings('sidebarNew.signout'),
          icon: Assets.logout,
        })
      : arraySideMenuData;

    return (
      <View
        pointerEvents={this.state.isLoading ? 'none' : 'auto'}
        style={style.mainContainer}>
        {/* DETECT DID FOCUS EVENT */}
        <NavigationEvents onDidFocus={this.onDidFocusNavigationEvents} />

        {this.state.isLoading ? <EDProgressLoader /> : null}

        {/* LOGOUT DIALOGUE */}
        {this.logoutDialogue()}

        {/* HEADER VIEW */}
        <EDSideMenuHeader
          userDetails={this.props.userDetails}
          onProfilePressed={this.onProfilePressed}
        />

        {/* SIDE MENU ITEMS LIST */}
        <View style={style.navItemContainer}>
          <FlatList
            contentContainerStyle={{
              paddingBottom: this.props.cartCount > 0 ? 100 : 10,
            }}
            showsVerticalScrollIndicator={false}
            data={this.arrayFinalSideMenu}
            extraData={this.state}
            keyExtractor={(item, index) => item + index}
            renderItem={this.renderSideMenuItem}
          />
        </View>
      </View>
    );
  }
  //#endregion

  //#region HELPER FUNCTIONS
  /** SETUP SIDE MENU ITEMS */
  setupSideMenuData = () => {
    return [
      {route: 'home', screenName: strings('sidebarNew.home'), icon: 'home'},
      {
        route: 'account',
        screenName: strings('sidebarNew.account'),
        icon: 'settings',
      },
      {
        route: 'myOrders',
        screenName: strings('sidebarNew.myOrder'),
        icon: 'receipt',
      },
      {
        route: 'notifications',
        screenName: strings('sidebarNew.notification'),
        icon: 'notifications-active',
      },
      {route: 'Rate', screenName: strings('sidebarNew.rate'), icon: 'star'},
      {route: 'Share', screenName: strings('sidebarNew.share'), icon: 'share'},
    ];
  };

  /**
   *
   * @param {The side menu item to render from this.arrayFinalSideMenu} sideMenuItem
   */
  renderSideMenuItem = (sideMenuItem) => {
    let isSelected =
      this.props.titleSelected ===
      this.arrayFinalSideMenu[sideMenuItem.index].screenName;
    return (
      <EDSideMenuItem
        isSelected={isSelected}
        onPressHandler={this.onPressHandler}
        item={sideMenuItem.item}
        index={sideMenuItem.index}
      />
    );
  };

  /** OPEN APPLICATION IN STORE FOR REVIEW */
  openStore() {
    if (Platform.OS === 'ios') {
      Linking.openURL(APP_STORE_LINK).catch((_err) => {});
    } else {
      Linking.openURL(PLAY_STORE_LINK).catch((_err) => {});
    }
  }

  /** OPEN DEFAULT SHARE CONTROLLER FOR SHARING APP LINK */
  shareApp() {
    const shareOptions = {
      title: strings('sidebarNew.shareApp'),
      url: Platform.OS === 'ios' ? APP_STORE_LINK : PLAY_STORE_LINK,
    };
    Share.open(shareOptions);
  }

  /** RENDER LOGOUT DIALOGUE */
  logoutDialogue = () => {
    return (
      <EDPopupView
        isLogoutLoading={this.state.isLoading}
        isLoading={this.state.isLoading}
        isModalVisible={this.state.isLogout}>
        <EDConfirmationDialogue
          isLoading={this.state.isLoading}
          onYesClick={this.onYesClick}
          onNoClick={this.onNoClick}
          title={strings('sidebarNew.logoutConfirm')}
        />
      </EDPopupView>
    );
  };
  //#endregion

  //#region BUTTON/TAP EVENTS

  /**
   *
   * @param {The item selected by the user from the list. Unused for now, so having _ as prefix} _selectedItem
   * @param {The index of item selected by the user} selectedIndex
   */
  onPressHandler = (_selectedItem, selectedIndex) => {
    // CLOSE DRAWER
    if (
      this.arrayFinalSideMenu[selectedIndex].screenName !==
      strings('sidebarNew.signout')
    ) {
      this.props.navigation.closeDrawer();
    }

    // LOGOUT
    if (
      this.arrayFinalSideMenu[selectedIndex].screenName ===
      strings('sidebarNew.signout')
    ) {
      this.setState({isLogout: true});
    }
    // NOTIFICATION
    else if (
      this.arrayFinalSideMenu[selectedIndex].screenName ===
      strings('sidebarNew.notification')
    ) {
      if (this.props.isLoggedIn) {
        // SAVE SELECTED ITEM IN REDUX
        this.props.saveNavigationSelection(strings('sidebarNew.notification'));
        this.props.navigation.navigate('notifications');
      } else {
        // Take the user to login screen if not logged in
        this.props.navigation.navigate('login');
      }
    }
    // ORDERS
    else if (
      this.arrayFinalSideMenu[selectedIndex].screenName ===
      strings('sidebarNew.myOrder')
    ) {
      if (this.props.isLoggedIn) {
        // SAVE SELECTED ITEM IN REDUX
        this.props.saveNavigationSelection(strings('sidebarNew.myOrder'));
        this.props.navigation.navigate('myOrders');
      } else {
        // Take the user to login screen if not logged in
        this.props.navigation.navigate('login');
      }
    }
    // ACCOUNT
    else if (
      this.arrayFinalSideMenu[selectedIndex].screenName ===
      strings('sidebarNew.account')
    ) {
      // if (this.props.isLoggedIn) {
      // SAVE SELECTED ITEM IN REDUX
      this.props.saveNavigationSelection(strings('sidebarNew.account'));
      this.props.navigation.navigate('account');
      // } else {
      //   // Take the user to login screen if not logged in
      //   this.props.navigation.navigate('login');
      // }
    }
    // RATE APP
    else if (
      this.arrayFinalSideMenu[selectedIndex].screenName ===
      strings('sidebarNew.rate')
    ) {
      this.openStore();
    }
    // SHARE APP
    else if (
      this.arrayFinalSideMenu[selectedIndex].screenName ===
      strings('sidebarNew.share')
    ) {
      this.shareApp();
    }
    // CHANGE CENTER SCREEN
    else {
      // SAVE SELECTED ITEM IN REDUX
      this.props.saveNavigationSelection(
        this.arrayFinalSideMenu[selectedIndex].screenName,
      );

      // CHANGE MAIN SCREEN
      this.props.navigation.navigate(
        this.arrayFinalSideMenu[selectedIndex].route,
        {routeParams: this.arrayFinalSideMenu[selectedIndex]},
      );
    }
  };

  /** PROFILE DETAILS TAP EVENT */
  onProfilePressed = () => {
    if (this.props.isLoggedIn) {
      this.props.navigation.closeDrawer();
      // SAVE SELECTED ITEM IN REDUX

      this.props.navigation.navigate('editProfileFromSideMenu');
    } else {
      // Take the user to login screen if not logged in
      this.props.navigation.closeDrawer();
      this.props.navigation.navigate('login');
    }
  };

  /** YES BUTTON TAP EVENT OF LOGOUT CONFIRMATION DIALOGUE */
  onYesClick = () => {
    // CALL LOGOUT API
    this.setState({isLogout: false});
    this.callLogoutAPI();
  };

  /** NO BUTTON TAP EVENT OF LOGOUT CONFIRMATION DIALOGUE */
  onNoClick = () => {
    // DISMISS LOGOUT DIALOGUE
    this.setState({isLogout: false});
  };
  //#endregion

  //#region NETWORK

  //SKIP__LOGOUT
  SkipLogOut() {
    // TAKE THE USER TO INITIAL SCREEN
    global.isSkipUser == false;
    //FLUSH ALL DATA
    this.Flush_All_Data();
    this.props.navigation.dispatch(
      StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({routeName: 'splash'})],
      }),
    );
  }

  /** LOGOUT API CALL */
  callLogoutAPI = () => {
    // CHECK INTERNET STATUS
    netStatus((isConnected) => {
      if (isConnected) {
        // LOGOUT PARAMS
        const logoutParams = {
          user_id: this.props.userDetails.UserID,
          language_slug: this.props.lan,
        };
        // LOGOUT CALL
        this.setState({isLoading: true});
        logoutUser(
          logoutParams,
          this.onLogoutSuccess,
          this.onLogoutFailure,
          this.props,
        );
      } else {
        showNoInternetAlert();
      }
    });
  };

  //Flush_All_Data
  Flush_All_Data() {
    const selectedLanguage = this.props.lan;
    // CLEAR USER DETAILS IN REDUX
    this.props.saveUserDetailsInRedux({});
    this.props.saveLanguageRedux(selectedLanguage);
    this.props.saveTermsAndConditionsStatus(false);
    setIsTermsAndConditionsAccepted(
      false,
      () => {},
      () => {},
    );

    flushAllData(
      (_response) => {
        // MAINTAIN THE SELECTED LANGUAGE IN ASYNC STORE
        saveLanguage(
          selectedLanguage,
          (_successSaveLanguage) => {},
          (_error) => {},
        );

        // SET CART COUNT TO 0 IN REDUX
        this.props.saveCartCount(0);

        // REPLACE SELECTED STORE TO DEFAULT

        saveSelectedStore(
          undefined,
          (onSuccess) => {},
          (onFailure) => {},
        );

        // TAKE THE USER TO INITIAL SCREEN
        this.props.navigation.dispatch(
          StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({routeName: 'splash'})],
          }),
        );
      },
      (_error) => {},
    );
  }

  /**
   *
   * @param {The success object returned in logout API response} _objSuccess
   */
  onLogoutSuccess = (_objSuccess) => {
    this.props.navigation.closeDrawer();
    this.Flush_All_Data();
    // SAVE SELECTED ITEM IN REDUX
    this.props.saveNavigationSelection(this.arrayFinalSideMenu[0].screenName);

    // DISMISS LOGOUT DIALOGUE
    this.setState({isLogout: false, isLoading: false});
  };

  /**
   *
   * @param {The failure response object returned in logout API} _objFailure
   */
  onLogoutFailure = (_objFailure) => {
    // DISMISS LOGOUT DIALOGUE
    showDialogue(_objFailure.message || '');
    this.setState({isLogout: false, isLoading: false});
  };
}

const style = StyleSheet.create({
  mainContainer: {flex: 1, backgroundColor: EDColors.white},
  navHeader: {
    flex: 1,
    flexDirection: 'column-reverse',
    backgroundColor: EDColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navItemContainer: {flex: 5, paddingBottom: 20},
});

export default connect(
  (state) => {
    return {
      titleSelected: state.navigationReducer.selectedItem,
      userDetails: state.userOperations.userDetails,
      isLoggedIn: state.userOperations.isLoggedIn,
      lan: state.userOperations.lan,
      arrayCMSPages: state.contentOperations.arrayCMSData,
      cartCount:
        state.checkoutReducer !== undefined
          ? state.checkoutReducer.cartCount
          : 0,
    };
  },
  (dispatch) => {
    return {
      saveNavigationSelection: (dataToSave) => {
        dispatch(saveNavigationSelection(dataToSave));
      },
      saveUserDetailsInRedux: (detailsToSave) => {
        dispatch(saveUserDetailsInRedux(detailsToSave));
      },
      saveCartCount: (data) => {
        dispatch(saveCartCount(data));
      },
      saveLanguageRedux: (language) => {
        dispatch(saveLanguageInRedux(language));
      },
      saveTermsAndConditionsStatus: (dataToSave) => {
        dispatch(saveTermsAcceptedStatus(dataToSave));
      },
    };
  },
)(SideBar);
