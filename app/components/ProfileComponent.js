import React from 'react';
import { View, Text, TextInput, Switch, StyleSheet } from 'react-native';
import { EDFonts } from '../utils/EDFontConstants';
import EDRTLView from './EDRTLView';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { EDColors } from '../utils/EDColors';
import { isRTLCheck, getProportionalFontSize } from '../utils/EDConstants';

export default class ProfileComponent extends React.Component {
  //#region LIFE CYCLE METHODS

  /** CONSTRUCTOR */
  constructor(props) {
    super(props);
    this.secondTextInputRef = React.createRef();
  }

  onChangeTextHandler = (newText) => {
    if (this.props.onChangeValue !== undefined) {
      this.props.onChangeValue(newText, this.props.identifier || '');
    }
  }

  /** RENDER FUNCTION */
  render() {
    return (
      // MAIN CONTAINER
      <EDRTLView style={styles.mainContainer}>

        {/* LEFT IMAGE */}
        <MaterialIcon
          size={20}
          style={{ marginHorizontal: 10 }}
          color={EDColors.primary}
          name={this.props.source} />

        {/* SEPARATOR */}
        {this.props.isNotification ? null : (<View style={[styles.separator, { left: isRTLCheck() ? 0 : 40, right: isRTLCheck() ? 0 : 0 }]} />)}

        {/* CHECK IF IT'S A TEXT OR TEXT INPUT */}
        {this.props.isText
          ? <Text style={styles.titleStyle}>{this.props.text}</Text>
          : <TextInput
            style={styles.titleStyle}
            ref={this.assignRefSecondTextInput}
            maxLength={40}
            numberOfLines={1}
            placeholder={this.props.placeholder}
            onChangeText={this.onChangeTextHandler}>
            {this.props.text}
          </TextInput>
        }

        {/* RENDER EDIT ICON OR NOTIFICATION SWTICH */}
        {this.props.isHidden
          ? <MaterialIcon
            size={20}
            style={{ marginHorizontal: 10 }}
            color={EDColors.homeButtonColor}
            onPress={this.onPressHandler}
            name={'edit'} />
          : this.props.isNotification
            ? <Switch
              onTintColor={EDColors.homeButtonColor}
              trackColor={EDColors.homeButtonColor}
              style={styles.notificationSwitch}
              value={this.props.value}
              onValueChange={this.props.onValueChange} />
            : null}
      </EDRTLView>
    );
  }
  //#endregion

  //#region HELPER METHODS
  assignRefSecondTextInput = (input) => {
    this.secondTextInput = input;
  }

  onPressHandler = () => {
    if (this.props.isTouchable) {
      this.secondTextInput.focus();
    } else {
      this.props.onPress()
    }
  }
}

//#region STYLES
const styles = StyleSheet.create({
  mainContainer: { alignItems: 'center', height: heightPercentageToDP('6.5%') },
  leftImage: { marginHorizontal: 10, height: 20, width: 20, tintColor: EDColors.primary, alignSelf: 'center' },
  separator: { position: 'absolute', backgroundColor: EDColors.separatorColor, height: 1, bottom: 1 },
  titleStyle: { fontSize: getProportionalFontSize(14), fontFamily: EDFonts.regular, flex: 1, color: EDColors.textAccount, tintColor: EDColors.homeButtonColor },
  editIcon: { marginHorizontal: 5, tintColor: EDColors.pencilColor },
  notificationSwitch: { alignSelf: 'center', marginHorizontal: 5 },
});
//#endregion
