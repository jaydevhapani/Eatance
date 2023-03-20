import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { EDColors } from "../utils/EDColors";
import { getProportionalFontSize, isRTLCheck } from "../utils/EDConstants";
import { EDFonts } from "../utils/EDFontConstants";
import EDRTLText from "./EDRTLText";
import EDRTLView from "./EDRTLView";
import { widthPercentageToDP } from "react-native-responsive-screen";
import StarRating from "react-native-star-rating";

export default class ReviewItemComponent extends React.PureComponent {
  //#region LIFE CYCLE METHODS
  constructor(props) {
    super(props);

  }

  render() {
    return (
      <View style={style.container}>
        <EDRTLText style={style.review} title={decodeURI(this.props.review)} />
        <EDRTLView style={{ justifyContent: 'space-between', alignItem: 'center' }}>

          <StarRating
            containerStyle={{ justifyContent: 'center' }}
            starStyle={{ marginHorizontal: 1 }}
            starSize={widthPercentageToDP("4%")}
            disabled={true}
            emptyStar={'star'}
            fullStar={'star'}
            halfStar={'star-half'}
            iconSet={'MaterialIcons'}
            maxStars={5}
            rating={parseFloat(this.props.rating)}
            emptyStarColor={EDColors.text}
            fullStarColor={EDColors.primary}
            halfStarColor={EDColors.primary}
            halfStarEnabled={true}
            reversed={isRTLCheck()}
          />
          {this.props.name !== undefined && this.props.name !== null && this.props.name !== " " && this.props.name.trim().length > 0
            ? <Text style={{ fontFamily: EDFonts.boldItalic, fontSize: getProportionalFontSize(16) }}>{"- " + this.props.name}</Text>
            : null}
        </EDRTLView>
      </View>
    );
  }

  //#endregion
}

export const style = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: EDColors.white,
    borderRadius: 3,
    borderColor: EDColors.shadow,
    borderWidth: 1,
    shadowOpacity: 0.25,
    shadowRadius: 5,
    shadowColor: EDColors.text,
    shadowOffset: { height: 0, width: 0 },
    elevation: 1,
    margin: 7,
    flex: 1,
  },
  review: {
    color: EDColors.text,
    fontSize: getProportionalFontSize(14),
    fontFamily: EDFonts.medium,
    marginBottom: 10
  }
});
