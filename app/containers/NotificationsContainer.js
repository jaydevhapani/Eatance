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
import {netStatus} from '../utils/NetworkStatusConnection';
import {getNotifications} from '../utils/ServiceManager';
import {showDialogue} from '../utils/EDAlert';
import BaseContainer from './BaseContainer';
import {NavigationEvents} from 'react-navigation';
import EDProgressLoader from '../components/EDProgressLoader';
import EDPlaceholderComponent from '../components/EDPlaceholderComponent';
import EDNotificationItem from '../components/EDNotificationItem';
import {changeCartButtonVisibility} from '../redux/actions/FloatingButton';
import {saveNavigationSelection} from '../redux/actions/Navigation';

const PAGE_SIZE = 20;

class NotificationsContainer extends React.Component {
  //#region STATE
  state = {
    isLoading: false,
    arrayNotifications: undefined,
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
  }

  /** DID FOCUS */
  onDidFocusNotificationsContainer = () => {
    this.strOnScreenMessage = '';
    this.state.arrayNotifications = undefined;

    // CALL API WHENEVER USER COMES TO THIS SCREEN
    // if ((this.state.arrayNotifications !== undefined && this.shouldLoadMore) ||
    //     (this.state.arrayNotifications === undefined && !this.shouldLoadMore) ||
    //     (this.state.arrayNotifications.length === 0 && this.shouldLoadMore))
    //     {
    //  this.callGetNotificationsAPI()
    // }
    this.callGetNotificationsAPI();
    this.props.changeCartButtonVisibility({
      shouldShowFloatingButton: true,
      currentScreen: this.props,
    });
  };

  onWillFocusNotificationsContainer = () => {
    this.props.saveNavigationSelection(strings('sidebarNew.notification'));
    this.props.changeCartButtonVisibility({
      shouldShowFloatingButton: true,
      currentScreen: this.props,
    });
  };

  /** RENDER */
  render() {
    return (
      <BaseContainer
        title={strings('notificationsNew.title')}
        left={'menu'}
        onLeft={this.buttonMenuPressed}
        onConnectionChangeHandler={this.onConnectionChangeHandler}>
        {/* SCREEN FOCUS EVENT */}
        <NavigationEvents
          onWillFocus={this.onWillFocusNotificationsContainer}
          onDidFocus={this.onDidFocusNotificationsContainer}
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
            {this.state.arrayNotifications !== undefined &&
            this.state.arrayNotifications.length > 0 ? (
              <FlatList
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  paddingBottom: this.props.cartCount > 0 ? 100 : 10,
                }}
                style={styles.notificationsList}
                data={this.state.arrayNotifications}
                extraData={this.state}
                renderItem={this.renderNotificationItem}
                keyExtractor={(item, index) => item + index}
                onEndReached={this.onLoadMoreEventHandler}
                onEndReachedThreshold={0.5}
                refreshControl={
                  <RefreshControl
                    refreshing={this.refreshing}
                    title={strings('notificationsNew.fetchingNew')}
                    titleColor={EDColors.textAccount}
                    tintColor={EDColors.textAccount}
                    colors={[EDColors.textAccount]}
                    onRefresh={this.onPullToRefreshHandler}
                  />
                }
              />
            ) : this.strOnScreenMessage.length > 0 ? (
              <EDPlaceholderComponent
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
  /** LOAD MORE EVENT */
  onLoadMoreEventHandler = () => {
    if (this.shouldLoadMore) {
      this.callGetNotificationsAPI();
    }
  };

  /** NOTIFICATION ITEM */
  renderNotificationItem = (notification) => {
    return <EDNotificationItem notification={notification.item} />;
  };

  /** PULL TO REFRESH HANDLER */
  onPullToRefreshHandler = () => {
    this.strOnScreenSubtitle = '';
    this.strOnScreenMessage = '';
    this.refreshing = false;
    this.shouldLoadMore = false;
    this.state.arrayNotifications = [];
    // this.setState({ arrayNotifications: undefined })
    this.callGetNotificationsAPI(true);
  };
  //#endregion

  //#region BUTTON EVENTS
  /** MENU PRESSED */
  buttonMenuPressed = () => {
    this.props.navigation.openDrawer();
  };

  /** BROWSE BUTTON HANDLER */
  buttonBrowsePressed = () => {
    this.props.navigation.navigate('home');
    this.props.saveNavigationSelection(strings('sidebarNew.home'));
  };
  //#endregion

  //#region NETWORK METHODS
  onConnectionChangeHandler = (isConnected) => {
    if (isConnected) {
      this.onPullToRefreshHandler();
    }
    // if (isConnected && (this.state.arrayNotifications || []).length == 0) {
    //     this.strOnScreenMessage = '';
    //     this.strOnScreenSubtitle = '';
    //     this.state.arrayNotifications = undefined;
    //     this.callGetNotificationsAPI()
    // }
  };
  /**
   *
   * @param {The success response object} objSuccess
   */
  onGetNotificationsSuccess = (objSuccess) => {
    // add code Jay 22 April
    // if (!this.shouldLoadMore && objSuccess.data.notification.length === 0) {
    //     this.strOnScreenMessage = strings('generalNew.noNotificationsFoundTitle');
    //     this.strOnScreenSubtitle = strings('generalNew.noNotificationsFoundMessages')
    // } else {
    //     this.strOnScreenMessage = objSuccess.message || ''
    // }
    // End

    // this.strOnScreenMessage = objSuccess.message || ''
    this.strOnScreenMessage = strings('generalNew.noNotificationsFoundTitle');
    this.strOnScreenSubtitle = strings(
      'generalNew.noNotificationsFoundMessages',
    );

    if (this.state.arrayNotifications === undefined) {
      this.state.arrayNotifications = [];
    }

    if (
      objSuccess.data.notification !== undefined &&
      objSuccess.data.notification.length > 0
    ) {
      let arrNotifications = objSuccess.data.notification || [];
      let totalNotificationsCount = objSuccess.data.notificaion_count || 0;
      this.shouldLoadMore =
        this.state.arrayNotifications.length + arrNotifications.length <
        totalNotificationsCount;
      this.setState({
        arrayNotifications: [
          ...this.state.arrayNotifications,
          ...arrNotifications,
        ],
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
  onGetNotificationsFailure = (objFailure) => {
    this.strOnScreenMessage = objFailure.message || '';
    this.setState({isLoading: false});
    showDialogue(objFailure.message);
    this.refreshing = false;
  };

  /** REQUEST GET NOTIFICATIONS */
  /**
   *
   * @param {Check if it is pull-to-refresh event call or normal call and show loader accordingly} isForRefresh
   */
  callGetNotificationsAPI = (isForRefresh = false) => {
    this.strOnScreenMessage = '';
    this.strOnScreenSubtitle = '';
    netStatus((isConnected) => {
      if (isConnected) {
        let objGetNotificationParams = {
          language_slug: this.props.lan,
          user_id: this.props.userDetails.UserID,
          count: PAGE_SIZE,
          page_no:
            this.state.arrayNotifications && !isForRefresh
              ? parseInt(this.state.arrayNotifications.length / PAGE_SIZE) + 1
              : 1,
        };
        if (!isForRefresh) {
          this.setState({
            isLoading: this.state.arrayNotifications === undefined,
          });
        }
        getNotifications(
          objGetNotificationParams,
          this.onGetNotificationsSuccess,
          this.onGetNotificationsFailure,
          this.props,
        );
      } else {
        this.refreshing = false;
        if (this.state.arrayNotifications === undefined) {
          this.strOnScreenMessage = strings('generalNew.noInternetTitle');
          this.strOnScreenSubtitle = strings('generalNew.noInternet');
          this.setState({arrayNotifications: []});
        } else {
          this.strOnScreenMessage = '';
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
    margin: 20,
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
    };
  },
)(NotificationsContainer);
//#endregion
