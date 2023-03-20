import React from "react";
import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { EDFonts } from "../utils/EDFontConstants";
import EDRTLText from "./EDRTLText";
import EDRTLView from "./EDRTLView";
import { EDColors } from "../utils/EDColors";
import { getProportionalFontSize } from "../utils/EDConstants";
import { Icon } from 'react-native-elements'

export default class TextViewLeftImage extends React.PureComponent {
  render() {
    return (
      <EDRTLView style={[style.container, this.props.style]}>

        <Icon
          style={this.props.imageStyle}
          size={this.props.size !== undefined ? this.props.size : 20}
          name={this.props.image}
          type={this.props.type || 'material'}
          color={EDColors.primary}
        />

        <EDRTLText style={[style.text, this.props.textStyle]} numberOfLines={this.props.lines || 0} title={this.props.title} />
      </EDRTLView>
    );
  }
}

export const style = StyleSheet.create({
  container: {
    // flex: 1,
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  text: {
    // flex: 1,
    color: EDColors.text,
    fontSize: getProportionalFontSize(14),
    fontFamily: EDFonts.regular,
    marginHorizontal: 5,
  },
  image: {
    width: wp("2%"),
    height: wp("2%"),
  }
});
