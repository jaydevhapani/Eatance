
import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { EDColors } from '../utils/EDColors';
import { EDFonts } from '../utils/EDFontConstants';
import { isRTLCheck, getProportionalFontSize } from '../utils/EDConstants';

export default class EDText extends Component {
  render() {
    return (
      <View
        style={[
          styles.container,
          this.props.style,
          { alignItems: isRTLCheck() ? 'flex-end' : 'flex-start' },
        ]}>
        <Text style={[styles.mainText, this.props.textStyle]}>
          {this.props.title}
          {this.props.isMandatory === undefined
            ? <Text style={styles.asterisk}>*</Text>
            : null}
        </Text>
      </View>
    );
  }
}

//#region STYLES
const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 10,
  },
  mainText: {
    color: EDColors.placeholder,
    fontFamily: EDFonts.medium,
    fontSize: getProportionalFontSize(16),
  },
  asterisk: {
    color: EDColors.error,
    fontFamily: EDFonts.regular,
    padding: 10,
  },
});
//#endregion