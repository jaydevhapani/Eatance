import React from "react";
import { Image, Text, View } from "react-native";
import styles from "../stylesheet/stylesheet";

export default class SideMenuComponent extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      url: this.props.imageUrl,
      view: this.props.display,
      itemName: this.props.itemName
    };
  }

  changeStyle() { }

  render() {
    // this.state.view;
    return (
      <View style={styles.navItem}>
        <Image
          style={{ alignSelf: "center", width: 15, height: 15 }}
          source={this.state.url}
        />

        <Text
          style={
            this.state.isSelected
              ? styles.sideMenuTextSelected
              : styles.sideMenuText
          }
          onPress={() => {
            this.props.click(this.props.itemName);
          }}
        >
          {this.props.itemName}
        </Text>
      </View>
    );
  }
}
