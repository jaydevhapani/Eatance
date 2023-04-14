import React from 'react';
import {
  View,
  StyleSheet,
  Linking,
  Platform,
  TouchableOpacity,
  Image,
} from 'react-native';
import TextViewLeftImage from './TextViewLeftImage';
import {EDFonts} from '../utils/EDFontConstants';
import {EDColors} from '../utils/EDColors';
import EDRTLView from './EDRTLView';
import EDRTLText from './EDRTLText';
import {debugLog} from '../utils/EDConstants';
import StarRating from 'react-native-star-rating';
import {strings} from '../locales/i18n';
import {showDialogue} from '../utils/EDAlert';
import {Icon} from 'react-native-elements';
import {GET_WHATSP_NUMBER} from '../utils/ServiceManager';
import Assets from '../assets';

export default class StoreOverview extends React.PureComponent {
  render() {
    return this.props.storeDetails !== undefined &&
      this.props.storeDetails.address !== undefined &&
      this.props.storeDetails.address.trim().length > 0 ? (
      <View style={[style.parentContainer]}>
        <EDRTLView>
          {/* ADDRESS */}
          <TextViewLeftImage
            imageStyle={[
              // style.imageStyle,
              {marginTop: 5},
            ]}
            textStyle={{flex: 1}}
            style={{flex: 1, alignItems: 'flex-start'}}
            image={'location-pin'}
            type={'simple-line-icon'}
            title={this.props.storeDetails.address || ''}
            lines={0}
          />

          {/* CALL BUTTON */}
          {this.props.storeDetails.phone_number !== undefined &&
          this.props.storeDetails.phone_number.trim().length > 0 ? (
            <Icon
              reverse
              raised
              containerStyle={{margin: 0, marginRight: 2}}
              size={13}
              name={'call'}
              color={EDColors.homeButtonColor}
              onPress={this.buttonCallPressed}
            />
          ) : null}

          {/* DIRECTIONS BUTTON */}
          {this.props.storeDetails.latitude !== undefined &&
          this.props.storeDetails.longitude !== undefined ? (
            <Icon
              reverse
              raised
              size={13}
              containerStyle={{margin: 0, marginRight: 2}}
              name={'directions'}
              color={EDColors.homeButtonColor}
              onPress={this.buttonDirectionsPressed}
            />
          ) : null}
          {/* <Icon
            reverse
            raised
            size={13}
            containerStyle={{margin: 0}}
            name={'chat'}
            color={EDColors.homeButtonColor}
            onPress={this.ChatCovergation}
          /> */}
          <TouchableOpacity onPress={() => this.ChatCovergation()}>
            <Image source={Assets.whatspp} style={{height: 30, width: 30}} />
          </TouchableOpacity>
        </EDRTLView>

        <View
          style={{
            backgroundColor: EDColors.separatorColor,
            margin: 10,
            marginHorizontal: 10,
            height: 1,
          }}
        />

        {/* BOTTOM CONTAINER */}
        <EDRTLView style={style.bottomContainer}>
          {/* STAR RATING */}
          {this.props.storeDetails.rating !== undefined &&
          this.props.storeDetails.rating !== null &&
          this.props.storeDetails.rating > 0 ? (
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
              rating={parseFloat(this.props.storeDetails.rating)}
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
              // image={Assets.time}
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

        {/* STORE OPEN OR CLOSE */}
        {this.props.storeDetails.timings !== null &&
        this.props.storeDetails.timings !== undefined &&
        this.props.storeDetails.timings.closing.toLowerCase() !== 'open' ? (
          <EDRTLText
            style={style.storeStatus}
            title={strings('homeNew.notAcceptingOrdersMessage')}
          />
        ) : null}
      </View>
    ) : null;
  }

  //ChatCovergation
  ChatCovergation = async () => {
    await GET_WHATSP_NUMBER()
      .then((Response) => {
        if (Response.status == 'success') {
          console.log('WhatsappNumber :: ', Response.whatsapp_number);
          let WHATSP_APP_OPEN_URL = `https://wa.me/${Response.whatsapp_number}?text='hello`;
          Linking.openURL(WHATSP_APP_OPEN_URL);
        }
      })
      .catch((Error) => {
        console.log('Error ::: ', Error);
      });
  };

  //#endregion

  //#region BUTTON EVENTS
  /** CALL BUTTON EVENT */
  buttonCallPressed = () => {
    const strCallURL = 'tel:' + this.props.storeDetails.phone_number;
    if (Linking.canOpenURL(strCallURL)) {
      Linking.openURL(strCallURL).catch((error) => {
        showDialogue('generalNew.canNotDial');
      });
    } else {
      showDialogue('generalNew.canNotDial');
    }
  };

  /** DIRECTIONS BUTTON EVENT */
  buttonDirectionsPressed = () => {
    const scheme = Platform.select({ios: 'maps:0,0?q=', android: 'geo:0,0?q='});
    const latLng = `${this.props.storeDetails.latitude},${this.props.storeDetails.longitude}`;
    const label = this.props.storeDetails.address;
    const strMapsURL = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    if (Linking.canOpenURL(strMapsURL)) {
      Linking.openURL(strMapsURL).catch(() =>
        showDialogue('generalNew.canNotLoadDirections'),
      );
    } else {
      showDialogue('generalNew.canNotLoadDirections');
    }
  };
  //#endregion
}

//#region STYLES
export const style = StyleSheet.create({
  parentContainer: {
    marginHorizontal: 15,
    marginTop: -25,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderColor: EDColors.shadow,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: EDColors.white,
    shadowOpacity: 0.25,
    shadowRadius: 5,
    shadowColor: EDColors.text,
    shadowOffset: {height: 0, width: 0},
  },
  imageStyle: {
    width: 20,
    height: 20,
    tintColor: EDColors.primary,
  },
  bottomContainer: {
    // marginTop: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  storeStatus: {
    textAlign: 'center',
    fontFamily: EDFonts.semiBold,
    color: EDColors.primary,
    marginHorizontal: 0,
    marginTop: 10,
  },
  noReviews: {
    fontFamily: EDFonts.semiBold,
    color: EDColors.textAccount,
    marginHorizontal: 0,
  },
});
//#endregion
