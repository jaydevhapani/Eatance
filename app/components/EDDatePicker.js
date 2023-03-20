import React, { Component } from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { EDColors } from '../utils/EDColors'
import { EDFonts } from '../utils/EDFontConstants'
import EDRTLView from './EDRTLView'
import { isRTLCheck } from '../utils/EDConstants'
import { heightPercentageToDP } from 'react-native-responsive-screen'
import DateTimePicker from 'react-native-modal-datetime-picker'
import moment from 'moment'
import EDRTLText from './EDRTLText'
import { Icon } from 'react-native-elements'

export default class EDDatePicker extends Component {
  //#region LIFE CYCLE METHODS
  constructor(props) {
    super(props)
    this.todayDate = new Date()
  }
  onShowDatePicker = () => {
    this.setState({ isDatePickerVisible: true })
  }
  onConfirm = selectedDateReceived => {
    this.setState({
      isDatePickerVisible: false,
      selectedDate: selectedDateReceived,
    })
    if (this.props.onDateChange !== undefined) {
      this.props.onDateChange(
        selectedDateReceived,
        this.props.identifier || this.props.placeholder,
      )
    }
  }
  onCancel = () => {
    this.setState({ isDatePickerVisible: false })
  }
  static getDerivedStateFromProps(nextProps) {
    return {
      selectedDate: nextProps.initialValue,
    }
  }

  render() {
    return (
      <View style={{ marginBottom: 10, flex: 1 }}>
        {this.props.placeholder ? <EDRTLText style={{ flex: 1, color: EDColors.text, marginHorizontal: 10 }} title={this.props.placeholder} /> : null}
        <TouchableOpacity
          disabled={this.props.disabled}
          onPress={this.onShowDatePicker}
          style={[styles.containerStyle, this.props.style]}
          pointerEvents={this.props.isDisable ? 'none' : 'auto'}>
          <EDRTLView style={{ paddingHorizontal: 10 }}>

            <EDRTLText
              style={{ color: EDColors.textAccount, flex: 1 }}
              title={moment(this.state.selectedDate).format('MMM DD, YYYY')} />

            <Icon size={20}
              name={this.state.isDatePickerVisible ? 'arrow-drop-up' : 'arrow-drop-down'} color={EDColors.textAccount} />

          </EDRTLView>

        </TouchableOpacity>
        {this.props.errorFromScreen ? (
          <EDRTLView style={{}}>
            <Text style={styles.errorTextStyle}>
              {this.props.errorFromScreen}
            </Text>
          </EDRTLView>
        ) : null}
        <DateTimePicker
          isVisible={this.state.isDatePickerVisible}
          mode='date'
          date={this.state.selectedDate}
          minimumDate={this.props.minDate}
          maximumDate={this.props.maxDate}
          onConfirm={this.onConfirm}
          onCancel={this.onCancel}
        />
      </View>
    )
  }
  //#endregion

  //#region STATE
  state = {
    isDatePickerVisible: false,
    selectedDate: this.props.initialValue || new Date(),
  }
  //#endregion

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.errorFromScreen != nextProps.errorFromScreen) {
      return true
    }
    return true
  }
}
//#endregion
const styles = StyleSheet.create({
  containerStyle: {
    marginHorizontal: 10,
    backgroundColor: EDColors.white,
    marginTop: 10,
    borderColor: EDColors.primary,
    borderRadius: 4,
    borderWidth: 1,
    alignItems: 'center',
    flexDirection: 'row',
    height: heightPercentageToDP('6.7%'),
  },
  textFieldStyle: {
    marginHorizontal: 10,
    flex: 1,
    fontFamily: EDFonts.regular,
    fontSize: heightPercentageToDP('2%'),
    color: EDColors.text,
    alignSelf: 'center',
  },
  errorTextStyle: {
    fontSize: heightPercentageToDP('1.7%'),
    fontFamily: EDFonts.regular,
    color: EDColors.error,
    marginHorizontal: 20,
  },
})
