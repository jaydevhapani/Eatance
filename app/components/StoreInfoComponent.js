import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import TextViewLeftImage from './TextViewLeftImage';
import Assets from '../assets';
import {EDFonts} from '../utils/EDFontConstants';
import {EDColors} from '../utils/EDColors';
import EDRTLView from './EDRTLView';
import EDRTLText from './EDRTLText';
import {getProportionalFontSize} from '../utils/EDConstants';
import StarRating from 'react-native-star-rating';
import {strings} from '../locales/i18n';
import EDImage from './EDImage';
import Metrics from '../utils/metrics';

export default class StoreInfoComponent extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  onStoreSelectionHandler = () => {
    if (this.props.onSelectionHandler !== undefined) {
      this.props.onSelectionHandler(this.props.storeDetails);
    }
  };

  render() {
    var objStoreDetails = this.props.storeDetails;
    return objStoreDetails == undefined ? null : (
      <TouchableOpacity onPress={this.onStoreSelectionHandler}>
        <View>
          <View style={style.imageContainer} />
          <EDImage
            placeholder={Assets.logo}
            style={style.storeImage}
            source={objStoreDetails.image}
            resizeMode={'contain'}
          />
          <View style={style.storeInfo}>
            <View style={style.storeInfoChildContainer}>
              <EDRTLText style={style.storeName} title={objStoreDetails.name} />

              {/* ADDRESS */}
              <TextViewLeftImage
                textStyle={{flex: 1}}
                style={{
                  flex: 1,
                  alignItems: 'flex-start',
                  paddingHorizontal: 0,
                  marginBottom: 10,
                }}
                image={'location-pin'}
                type={'simple-line-icon'}
                title={objStoreDetails.address || ''}
                lines={0}
              />

              {/* BOTTOM CONTAINER */}
              <EDRTLView style={style.bottomContainer}>
                {/* STAR RATING */}
                {objStoreDetails.rating !== undefined &&
                objStoreDetails.rating !== null &&
                objStoreDetails.rating > 0 ? (
                  <StarRating
                    containerStyle={{alignSelf: 'flex-start'}}
                    starStyle={{}}
                    starSize={20}
                    disabled={true}
                    emptyStar={'star'}
                    fullStar={'star'}
                    halfStar={'star-half'}
                    iconSet={'MaterialIcons'}
                    maxStars={5}
                    rating={parseFloat(objStoreDetails.rating)}
                    fullStarColor={EDColors.primary}
                  />
                ) : (
                  <EDRTLText
                    style={style.noReviews}
                    title={strings('review.noReviewsFoundTitle')}
                  />
                )}

                {this.props.storeDetails.timings !== null &&
                this.props.storeDetails.timings !== undefined ? (
                  <TextViewLeftImage
                    style={{justifyContent: 'flex-end', paddingHorizontal: 0}}
                    imageStyle={[style.imageStyle]}
                    image="access-time"
                    title={
                      this.props.storeDetails.timings.open != '' &&
                      this.props.storeDetails.timings.close != ''
                        ? this.props.storeDetails.timings.open +
                          '-' +
                          this.props.storeDetails.timings.close
                        : strings('storesList.close')
                    }
                    lines={0}
                  />
                ) : null}
              </EDRTLView>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
  //#endregion

  //#region BUTTON EVENTS
  //#endregion
}

//#region STYLES
export const style = StyleSheet.create({
  imageContainer: {
    position: 'absolute',
    zIndex: 999,
    shadowOpacity: 0.25,
    shadowRadius: 5,
    borderRadius: 8,
    borderColor: EDColors.transparent,
    borderWidth: 1,
    shadowColor: EDColors.text,
    shadowOffset: {height: 0, width: 0},
    backgroundColor: EDColors.white,
    alignSelf: 'center',
    width: '95%',
    height: Metrics.screenHeight * 0.2,
  },
  storeImage: {
    // tintColor: EDColors.white,
    zIndex: 1000,
    shadowOpacity: 0.25,
    shadowRadius: 5,
    borderRadius: 8,
    borderColor: EDColors.transparent,
    borderWidth: 1,
    shadowColor: EDColors.text,
    shadowOffset: {height: 0, width: 0},
    // margin: 15,
    backgroundColor: EDColors.transparent,
    alignSelf: 'center',
    width: '95%',
    height: Metrics.screenHeight * 0.2,
  },
  storeInfo: {
    shadowOpacity: 0.25,
    shadowRadius: 5,
    borderRadius: 8,
    borderColor: EDColors.shadow,
    borderWidth: 1,
    shadowColor: EDColors.text,
    shadowOffset: {height: 0, width: 0},
    backgroundColor: EDColors.white,
    // borderColor: 'yellow',
    // borderWidth: 2,
    flex: 1,
    marginTop: -30,
    marginBottom: 16,
  },
  storeInfoChildContainer: {
    // borderColor: 'blue', borderWidth: 1,
    padding: 15,
    marginTop: 30,
  },
  storeName: {
    marginBottom: 10,
    // borderColor: 'brown', borderWidth: 1,
    fontFamily: EDFonts.bold,
    fontSize: getProportionalFontSize(16),
    color: EDColors.textAccount,
  },
  noReviews: {
    fontFamily: EDFonts.semiBold,
    color: EDColors.textAccount,
    marginHorizontal: 0,
    // borderColor: 'red',
    // borderWidth: 1
  },
  bottomContainer: {
    // marginTop: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
//#endregion
