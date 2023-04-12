import React, {Component} from 'react';
import {FlatList, RefreshControl} from 'react-native';
import EDOrderDetails from './EDOrderDetails';
import {EDColors} from '../utils/EDColors';
import {strings} from '../locales/i18n';

export default class EDOrdersFlatList extends Component {
  onPullToRefreshHandler = () => {
    if (this.props.onPullToRefreshHandler !== undefined) {
      this.props.onPullToRefreshHandler();
    }
  };

  renderOrderDetails = (order) => {
    return (
      <EDOrderDetails
        lan={this.props.lan}
        onPressRepeatButtonHandler={this.props.onPressRepeatButtonHandler}
        onPressTrackButtonHandler={this.props.onPressTrackButtonHandler}
        onPressReviewButtonHandler={this.props.onPressReviewButtonHandler}
        isReview={order.item.review != null ? false : true}
        isForCurrentOrder={this.props.isForCurrentOrder}
        currencySymbol={this.props.currencySymbol}
        orderDetails={order.item}
      />
    );
  };

  render() {
    return this.props.arrayOrders ? (
      <FlatList
        contentContainerStyle={{
          paddingBottom: this.props.cartCount > 0 ? 70 : 10,
        }}
        showsVerticalScrollIndicator={false}
        style={this.props.style}
        data={this.props.arrayOrders}
        renderItem={this.renderOrderDetails}
        keyExtractor={(item, index) => item + index}
        refreshControl={
          <RefreshControl
            refreshing={this.props.refreshing || false}
            title={strings('ordersNew.fetchingNew')}
            titleColor={EDColors.textAccount}
            tintColor={EDColors.textAccount}
            colors={[EDColors.textAccount]}
            onRefresh={this.onPullToRefreshHandler}
          />
        }
      />
    ) : null;
  }
}
