import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Spinner } from "native-base";
import { EDColors } from "../utils/EDColors";

export default class EDProgressLoader extends React.Component {
  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        {/* <View style={styles.containerOpac} /> */}
        <Spinner style={styles.spinner} color={this.props.spinnerColor || EDColors.homeButtonColor} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.9,
    zIndex: 997,
    alignItems: 'center',
    justifyContent: 'center'
  },
  containerOpac: {
    position: "absolute",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    backgroundColor: EDColors.transparent,
    zIndex: 998
  },
  spinner: {
    flex: 1,
    alignSelf: "center",
    zIndex: 1000
  }
});
