import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { capiString, getProportionalFontSize } from "../utils/EDConstants";
import { EDFonts } from "../utils/EDFontConstants";
import Metrics from "../utils/metrics";
import { EDColors } from "../utils/EDColors";
import EDRTLText from "./EDRTLText";
import EDImage from "./EDImage";


export default class PopularProductComponent extends React.PureComponent {
  render() {
    return (
      <View style={style.container}>
        <TouchableOpacity
          style={style.flexStyle}
          onPress={this.props.onButtonClick}
        >
          <EDImage style={style.image} source={this.props.data.image} />
          <EDRTLText ellipsizeMode={"tail"} numberOfLines={1} style={style.title}
            title={capiString(this.props.data.name)} />
        </TouchableOpacity>
      </View>
    );
  }
}

export const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 6,
    borderColor: EDColors.shadow,
    borderWidth: 1,
    shadowOpacity: 0.25,
    shadowRadius: 5,
    shadowColor: EDColors.text,
    shadowOffset: { height: 0, width: 0 },
    elevation: 1,
    margin: 10,
    alignSelf: "flex-start",
    overflow: 'hidden'
  },
  image: {
    width: Metrics.screenWidth * 0.37,
    height: Metrics.screenWidth * 0.37,
  },
  title: {
    // flex: 1,
    fontFamily: EDFonts.regular,
    fontSize: getProportionalFontSize(14),
    margin: 5,
    // marginTop: 5,
    // marginRight: 5,
    color: EDColors.text
  },
  price: {
    fontFamily: EDFonts.regular,
    fontSize: getProportionalFontSize(16),
    marginLeft: 5,
    marginBottom: 10,
    color: EDColors.grey
  },
  flexStyle: {
    flex: 1
  }
});
