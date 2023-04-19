import React from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import EDSectionHeader from './EDSectionHeader';
import PopularProductItem from './PopularProductItem';
import Carousel from 'react-native-snap-carousel';
import Metrics from '../utils/metrics';

export default class ProductsForYouComponent extends React.PureComponent {
  //#region LIFE CYCLE METHODS
  /** RENDER */
  render() {
    return this.props.shopByData == undefined ? null : this.props.shopByData
        .length == 0 ? null : (
      <View style={style.parentContainer}>
        {this.props.shopByData !== undefined &&
        this.props.shopByData.length > 0 ? (
          <EDSectionHeader
            title={this.props.title}
            onViewAllPressed={this.props.onViewAllHandler}
          />
        ) : null}

        {this.props.shopByData !== undefined ? (
          this.props.shopByData.length > 0 ? (
            <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={this.props.shopByData}
              renderItem={this.renderShopByItem}
              keyExtractor={(item, index) => item + index}
            />
          ) : // <Carousel
          //   data={this.props.shopByData}
          //  renderItem={this.renderShopByItem}
          //  sliderWidth={(Metrics.screenWidth - 30)}
          //  itemWidth={(Metrics.screenWidth - 30) / 3}
          //  style={style.carouselContainer}
          //  hasParallaxImages={true}
          //  pagingEnabled={false}
          //  inactiveSlideScale={1}
          //  inactiveSlideOpacity={1}
          //  loop
          //  autoplay
          //  />
          null
        ) : null}
      </View>
    );
  }
  //#endregion

  //#region HELPER METHODS
  renderShopByItem = ({item}, parallaxProps) => {
    // renderShopByItem = (shopBy) => {
    return (
      <PopularProductItem
        parallaxProps={parallaxProps}
        itemToLoad={item}
        onPress={this.props.onPress}
      />
    );
  };
  //#endregion
}

//#region STYLES
const style = StyleSheet.create({
  parentContainer: {marginHorizontal: 15},
  carouselContainer: {alignItems: 'center', justifyContent: 'center'},
});
//#endregion
