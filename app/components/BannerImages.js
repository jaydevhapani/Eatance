/* eslint-disable prettier/prettier */
import React from 'react';
import Carousel from 'react-native-banner-carousel';
import {Image, View, StyleSheet} from 'react-native';
import Assets from '../assets';
import Metrics from '../utils/metrics';
import EDImage from './EDImage';

const BannerHeight = 180;

export default class BannerImages extends React.PureComponent {
  /** CONSTRUCTOR */
  constructor(props) {
    super(props);
    this.currentSliderIndex = 0;
  }
  onPageChanged = (currentIndex) => {
    this.currentSliderIndex = currentIndex;
  };

  onImageSelectionHandler = () => {
    if (this.props.onImageSelectionHandler !== undefined) {
      this.props.onImageSelectionHandler(this.currentSliderIndex);
    }
  };

  renderImage(image, index) {
    return (
      <View key={index}>
        <EDImage style={style.bannerImage} source={image.image} />
      </View>
    );
  }

  render() {
    return (
      <View>
        {this.props.images !== undefined && this.props.images.length > 0 ? (
          <Carousel
            autoplay
            autoplayTimeout={5000}
            loop
            showsPageIndicator={false}
            index={0}
            // onPageChanged={this.onPageChanged}
            pageSize={Metrics.screenWidth}>
            {this.props.images.map((image, index) =>
              this.renderImage(image, index),
            )}
          </Carousel>
        ) : this.props.images == undefined ? null : (
          <Image
            resizeMode="contain"
            source={Assets.logo}
            style={[style.imageStyle, {marginBottom: 10}]}
          />
        )}
      </View>
    );
  }
}

//#region STYLES
const style = StyleSheet.create({
  bannerImage: {width: Metrics.screenWidth, height: BannerHeight},
  imageStyle: {
    alignItems: 'center',
    width: '100%',
    height: 180,
  },
});
