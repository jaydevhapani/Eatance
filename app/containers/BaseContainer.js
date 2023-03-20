import React from 'react';
import { View, StyleSheet } from 'react-native';
import NavBar from '../components/NavBar';
import EDProgressLoader from '../components/EDProgressLoader';
import { EDColors } from '../utils/EDColors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationEvents } from 'react-navigation';
import NetInfo from "@react-native-community/netinfo";


export default class BaseContainer extends React.Component {

  //#region LIFE CYCLE METHODS

  /** CONSTRUCTOR */
  constructor(props) {
    super(props);
    this.connectivityChangeHandler = undefined;
    this.isConnectedToInternet = true;
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: this.props.backgroundColor || EDColors.offWhite }}>
        <View
          pointerEvents={this.props.loading ? 'none' : 'auto'}
          style={{ flex: 1, backgroundColor: this.props.backgroundColor || EDColors.offWhite }}>
          <NavBar
            title={this.props.title}
            left={this.props.left}
            onLeft={this.props.onLeft}
            right={this.props.right}
            onRight={this.props.onRight}
            iconFamily={this.props.iconFamily}
            onTitlePressHandler={this.props.onTitlePressHandler}
          />

          <NavigationEvents onDidFocus={this.onDidFocusBaseContainer} onWillBlur={this.onWillBlurBaseContainer} />

          <View pointerEvents={this.props.loading ? 'none' : 'auto'} style={styles.container}>{this.props.children}</View>

          {this.props.loading ? <EDProgressLoader primaryColor={this.props.loadingColor || EDColors.primary} /> : null}
        </View>
      </SafeAreaView>
    );
  }

  onConnectivityChangeCallback = state => {
    if (this.props.onConnectionChangeHandler !== undefined && this.isConnectedToInternet !== state.isConnected) {
      this.isConnectedToInternet = state.isConnected;
      this.props.onConnectionChangeHandler(state.isConnected);
    }
  }

  onDidFocusBaseContainer = () => {
    if (this.props.onConnectionChangeHandler !== undefined) {
      this.connectivityChangeHandler = NetInfo.addEventListener(this.onConnectivityChangeCallback);
    }
  }

  onWillBlurBaseContainer = () => {
    if (this.props.onConnectionChangeHandler !== undefined) {
      if (this.connectivityChangeHandler !== undefined) {
        this.connectivityChangeHandler()
      }
    }
  }
  //#endregion
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  children: {},
});
