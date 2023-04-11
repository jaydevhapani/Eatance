import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import {EDFonts} from '../utils/EDFontConstants';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import {EDColors} from '../utils/EDColors';
import EDRTLView from './EDRTLView';
import EDRTLText from './EDRTLText';
import {INR_SIGN, getProportionalFontSize} from '../utils/EDConstants';
import EDButton from './EDButton';
import EDSectionHeader from './EDSectionHeader';
import Metrics from '../utils/metrics';
import EDImage from './EDImage';
import Assets from '../assets';
import EDText from './EDText';

const NUMBER_OF_COLUMNS = Metrics.screenWidth > 375 ? 4 : 3;
const PARENT_WIDTH = (Metrics.screenWidth - 30) / NUMBER_OF_COLUMNS;
const IMAGE_WIDTH = (PARENT_WIDTH - 10) * 0.5;
const IMAGE_HEIGHT = IMAGE_WIDTH;

export default class ShopByItem extends React.PureComponent {
  //#region ON PRESS EVENT
  onPressHandler = () => {
    if (this.props.onSelectionHandler !== undefined) {
      this.props.onSelectionHandler(this.props.itemToLoad);
    }
  };
  //#endregion

  //#region LIFE CYCLE METHODS
  /** RENDER */
  render() {
    return (
      <TouchableOpacity
        onPress={this.onPressHandler}
        activeOpacity={0.8}
        style={[
          style.parentContainer,
          this.props.isForBrands ? {height: PARENT_WIDTH * 1.25} : {},
        ]}>
        <View style={[style.shadowContainer]}>
          <View
            style={[
              style.shopByImageContainer,
              this.props.isForBrands ? {} : {},
            ]}>
            <EDImage
              resizeMode="contain"
              style={[
                style.shopByImage,
                this.props.isForBrands
                  ? {width: '100%', height: '100%'}
                  : {width: '100%', height: '100%'},
              ]}
              source={this.props.itemToLoad.image}
            />
          </View>
          {/* {this.props.isForBrands
                        ? null
                        : */}
          <View style={style.titleContainer}>
            <EDRTLText
              numberOfLines={1}
              style={style.shopByTitle}
              title={this.props.itemToLoad.name}
            />
          </View>
          {/* } */}
        </View>
      </TouchableOpacity>
    );
  }
  //#endregion
}

//#region STYLES
export const style = StyleSheet.create({
  parentContainer: {
    width: PARENT_WIDTH,
    height: PARENT_WIDTH,
    // borderColor: 'purple', borderWidth: 2
  },
  shadowContainer: {
    margin: 5,
    borderColor: EDColors.shadow,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: EDColors.white,
    shadowOpacity: 0.25,
    shadowRadius: 5,
    shadowColor: EDColors.text,
    shadowOffset: {height: 0, width: 0},
    overflow: 'hidden',
    flex: 1,
  },
  shopByImageContainer: {
    width: '100%',
    height: '75%',
    alignItems: 'center',
    justifyContent: 'center',
    // borderColor: 'orange',
    // borderWidth: 1,
  },
  shopByImage: {
    // borderColor: 'green',
    // borderWidth: 1,
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
  },
  titleContainer: {
    // height: (PARENT_WIDTH - ((((PARENT_WIDTH - IMAGE_WIDTH) / 2) - 10) + (IMAGE_WIDTH))),
    height: '25%',
    // backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    // borderColor: 'green', borderWidth: 1,
    padding: 2,
  },
  shopByTitle: {
    fontFamily: EDFonts.medium,
    alignSelf: 'center',
    textAlign: 'center',
    color: EDColors.text,
    fontSize: getProportionalFontSize(12),
    // borderColor: 'yellow', borderWidth: 1
  },
});
//#endregion

// import React from "react";
// import {
//     View,
//     FlatList,
//     StyleSheet,
//     Text,
//     Image,
//     TouchableOpacity
// } from "react-native";
// import { EDFonts } from "../utils/EDFontConstants";
// import { heightPercentageToDP } from "react-native-responsive-screen";
// import { EDColors } from "../utils/EDColors";
// import EDRTLView from "./EDRTLView";
// import EDRTLText from "./EDRTLText";
// import { INR_SIGN, getProportionalFontSize } from "../utils/EDConstants";
// import EDButton from "./EDButton";
// import EDSectionHeader from "./EDSectionHeader";
// import Metrics from "../utils/metrics";
// import EDImage from "./EDImage";
// import Assets from "../assets";
// import EDText from "./EDText";

// const NUMBER_OF_COLUMNS = Metrics.screenWidth > 375 ? 4 : 3
// const PARENT_WIDTH = (Metrics.screenWidth - 30) / NUMBER_OF_COLUMNS
// const IMAGE_WIDTH = (PARENT_WIDTH - 10) * 0.5
// const IMAGE_HEIGHT = IMAGE_WIDTH

// export default class ShopByItem extends React.PureComponent {

//     //#region ON PRESS EVENT
//     onPressHandler = () => {
//         if (this.props.onSelectionHandler !== undefined) {
//             this.props.onSelectionHandler(this.props.itemToLoad)
//         }
//     }
//     //#endregion

//     //#region LIFE CYCLE METHODS
//     /** RENDER */
//     render() {
//         return (
//             <TouchableOpacity onPress={this.onPressHandler} activeOpacity={0.8} style={style.parentContainer}>
//                 <View style={style.shadowContainer}>
//                     <EDImage resizeMode='contain' style={style.shopByImage}
//                         source={this.props.itemToLoad.image !== undefined ? this.props.itemToLoad.image : Assets.logo_pin} />
//                     {this.props.isForBrands
//                         ? null
//                         : <View style={style.titleContainer}>
//                             <EDRTLText
//                                 numberOfLines={1}
//                                 style={style.shopByTitle}
//                                 title={this.props.itemToLoad.name} />
//                         </View>
//                     }
//                 </View>
//             </TouchableOpacity>
//         )
//     }
//     //#endregion
// }

// //#region STYLES
// export const style = StyleSheet.create({
//     parentContainer: { width: PARENT_WIDTH, height: PARENT_WIDTH },
//     shadowContainer: {
//         margin: 5,
//         borderColor: EDColors.shadow,
//         borderWidth: 1,
//         borderRadius: 5,
//         backgroundColor: EDColors.white,
//         shadowOpacity: 0.25,
//         shadowRadius: 5,
//         shadowColor: EDColors.text,
//         shadowOffset: { height: 0, width: 0 },
//         overflow: 'hidden',
//         flex: 1
//     },
//     shopByImage: {
//         width: IMAGE_WIDTH,
//         height: IMAGE_HEIGHT,
//         position: 'absolute',
//         left: ((PARENT_WIDTH - IMAGE_WIDTH) / 2) - 5,
//         top: ((PARENT_WIDTH - IMAGE_WIDTH) / 2) - 10,
//     },
//     titleContainer: {
//         // height: (PARENT_WIDTH - ((((PARENT_WIDTH - IMAGE_WIDTH) / 2) - 10) + (IMAGE_WIDTH))),
//         position: 'absolute',
//         left: 2,
//         right: 2,
//         top: (((PARENT_WIDTH - IMAGE_WIDTH) / 2) - 10) + (IMAGE_WIDTH),
//         bottom: 2,
//         // backgroundColor: 'red',
//         alignItems: 'center', justifyContent: 'center',
//         // borderColor: 'green', borderWidth: 1
//     },
//     shopByTitle: {
//         fontFamily: EDFonts.medium, alignSelf: 'center',
//         textAlign: 'center', color: EDColors.text, fontSize: getProportionalFontSize(12),
//         // borderColor: 'yellow', borderWidth: 1
//     }
// });
// //#endregion
