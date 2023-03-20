import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { EDColors } from '../utils/EDColors';
import { EDFonts } from '../utils/EDFontConstants';
import { TextFieldTypes, getProportionalFontSize } from '../utils/EDConstants';
import EDRTLView from './EDRTLView';
import Assets from '../assets';
import { isRTLCheck } from '../utils/EDConstants';
import EDText from './EDText';
import EDRTLText from './EDRTLText';
import { Icon } from 'react-native-elements'

export default class EDRTLTextInput extends Component {
  //#region LIFE CYCLE METHODS
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={[{ marginTop: 10 }, this.props.containerStyle]}>
        {/* PLACEHOLDER */}
        {this.props.placeholder
          ? <EDText
            style={{ marginHorizontal: 24 }}
            isMandatory={this.props.isMandatory}
            title={this.props.placeholder || ''}
          />
          : null}
        <View
          style={[this.props.style, styles.childContainer]}
          opacity={this.props.isDisable ? 0.75 : 1}
          pointerEvents={this.props.isDisable ? 'none' : 'auto'}>
          <EDRTLView style={styles.alignCenter}>
            {this.props.prefix
              ? <View style={styles.prefixContainer}>
                <Text style={styles.prefixText}>{this.props.prefix}</Text>
              </View>
              : null}

            {this.props.textToDisplay !== undefined && this.props.textToDisplay.length > 0
              ? <EDRTLText title={this.props.textToDisplay} style={[styles.textStyle]} />
              : <TextInput
                defaultValue={this.props.defaultValue}
                value={this.props.initialValue}
                style={[
                  styles.textFieldStyle,
                  {
                    textAlign: isRTLCheck() ? 'right' : 'left',
                  },
                ]}
                placeholder={''}
                autoFocus={this.props.autoFocus || false}
                autoCapitalize={this.shouldAutoCapitalise()}
                keyboardType={this.fieldKeyboardType()}
                autoCorrect={false}
                selectionColor={EDColors.homeButtonColor}
                onChangeText={
                  this.props.onChangeText != undefined
                    ? this.onTextChangeHandler
                    : undefined
                }
                secureTextEntry={
                  this.props.type === TextFieldTypes.password &&
                  !this.state.showPassword
                }
                direction={isRTLCheck() ? 'rtl' : 'ltr'}
                maxLength={
                  this.props.type === TextFieldTypes.phone
                    ? 10
                    : this.props.maxLength !== undefined
                      ? this.props.maxLength
                      : 250
                }
                editable={
                  this.props.editableBox !== undefined &&
                    this.props.editableBox === false
                    ? false
                    : true
                }
                pointerEvents={
                  this.props.editableBox !== undefined &&
                    this.props.editableBox === false
                    ? 'none'
                    : 'auto'
                }
                multiline={this.props.multiline}
              />}
            {this.props.type === TextFieldTypes.password ? (

              <Icon
                type={'font-awesome'}
                size={20}
                onPress={this.showHidePassword}
                name={this.state.showPassword ? 'eye' : 'eye-slash'}
                color={EDColors.homeButtonColor} />
            ) : null}

            {this.props.type === TextFieldTypes.datePicker ? (
              <Icon
                size={20}
                onPress={this.props.showDatePicker}
                name={'today'}
                color={EDColors.homeButtonColor} />
              ) : null}

          </EDRTLView>
          <View style={{ backgroundColor: EDColors.text, height: 1 }} />
        </View>
        {this.props.errorFromScreen
          ? <EDRTLText style={styles.errorTextStyle}
            title={this.props.errorFromScreen} />
          : null}
      </View>
    );
  }
  //#endregion

  //#region STATE
  state = {
    showPassword: false,
  };
  //#endregion

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.errorFromScreen !== nextProps.errorFromScreen) {
      return true;
    }
    return true;
  }

  //#region KEYBOARD METHODS
  fieldKeyboardType() {
    if (this.props.type === TextFieldTypes.email) {
      return 'email-address';
    } else if (this.props.type === TextFieldTypes.password) {
      return 'default';
    } else if (
      this.props.type === TextFieldTypes.amount ||
      this.props.type === TextFieldTypes.phone
    ) {
      return 'number-pad';
    } else if (this.props.type === TextFieldTypes.description) {
      return 'default';
    }
  }
  shouldAutoCapitalise() {
    if (this.props.type === TextFieldTypes.email) {
      return 'none';
    } else if (this.props.type === TextFieldTypes.password) {
      return 'none';
    }
  }
  /**
   *
   * @param {Sending text to container what user type} newText
   */
  onTextChangeHandler = newText => {
    if (this.props.onChangeText !== undefined) {
      this.props.onChangeText(newText, this.props.identifier || '');
    }
  };
  //#endregion

  //#region UIBUTTON METHODS
  showHidePassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };
}
//#endregion
const styles = StyleSheet.create({
  alignCenter: { alignItems: 'center' },
  textStyle: {
    marginHorizontal: 0,
    flex: 1,
    fontFamily: EDFonts.regular,
    fontSize: getProportionalFontSize(16),
    color: EDColors.text,
    paddingVertical: 5,
  },
  textFieldStyle: {
    marginHorizontal: 0,
    flex: 1,
    fontFamily: EDFonts.regular,
    fontSize: getProportionalFontSize(16),
    color: EDColors.text,
    paddingVertical: 5,
    tintColor: EDColors.homeButtonColor

  },
  errorTextStyle: {
    fontSize: getProportionalFontSize(12),
    fontFamily: EDFonts.regular,
    color: EDColors.error,
    marginHorizontal: 24,
  },
  separatorView: {
    height: '50%',
    width: 1,
    backgroundColor: EDColors.text,
  },
  prefixContainer: { flexDirection: 'row', alignItems: 'center', height: '100%' },
  prefixText: {
    fontFamily: EDFonts.regular,
    fontSize: getProportionalFontSize(20),
    paddingLeft: 10,
    paddingVertical: 10,
    color: EDColors.text,
  },
  childContainer: {
    marginHorizontal: 24,
    backgroundColor: EDColors.transparent,
    marginTop: 0,
    marginBottom: 0,
  },
});
