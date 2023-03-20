/* eslint-disable semi */
/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import { EDColors } from '../utils/EDColors'
import { EDFonts } from '../utils/EDFontConstants'
import { strings } from '../locales/i18n';
import { getProportionalFontSize, isRTLCheck } from '../utils/EDConstants';
import { View, StyleSheet, TextInput } from 'react-native';
import EDRTLText from './EDRTLText';
import EDButton from './EDButton';
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button';

export default class CancelReasonsList extends Component {


    constructor(props) {
        super(props);
        this.arrayCancellationReasons = [
            { label: strings('orderCancellationReasons.naturalDisaster'), value: strings('orderCancellationReasons.naturalDisaster') },
            { label: strings('orderCancellationReasons.legalObligation'), value: strings('orderCancellationReasons.legalObligation') },
            { label: strings('orderCancellationReasons.customerNotAvailable'), value: strings('orderCancellationReasons.customerNotAvailable') },
            { label: strings('orderCancellationReasons.customerRejectedOrder'), value: strings('orderCancellationReasons.customerRejectedOrder') },
            { label: strings('orderCancellationReasons.other'), value: strings('orderCancellationReasons.other') },
        ];
    }

    state = {
        selectedIndex: this.props.selectedCancelReasonIndex || -1,
        strCancellationReason: '',
        shouldPerformValidation: false
    }

    componentDidMount() {
    }

    render() {
        return (
            <View style={styles.productsSummaryContainer}>

                <EDRTLText
                    style={styles.modalTitle}
                    title={strings('orderCancellationReasons.selectReason')} />

                <RadioGroup
                    color={EDColors.primary || EDColors.text}
                    onSelect={this.onSelectionIndexChangeHandler}
                    style={{ marginHorizontal: 10, backgroundColor: EDColors.transparent }}
                    selectedIndex={this.state.selectedIndex}
                >
                    {this.arrayCancellationReasons.map(index => {
                        return (
                            <RadioButton
                                style={{ flexDirection: isRTLCheck() ? 'row-reverse' : 'row' }}
                                key={index.label}
                                value={index.label}
                            >
                                <EDRTLText title={index.label} style={styles.itemPrice} />
                            </RadioButton>
                        )
                    })}
                </RadioGroup>

                {this.state.selectedIndex == 4
                    ? <TextInput
                        defaultValue={this.state.strCancellationReason}
                        value={this.state.strCancellationReason}
                        style={[styles.textFieldStyle, { textAlign: isRTLCheck() ? 'right' : 'left' }]}
                        placeholder={strings('orderCancellationReasons.enterReason')}
                        tintColor={EDColors.primary}
                        autoCorrect={false}
                        selectionColor={EDColors.primary}
                        onChangeText={this.onTextDidChangeHandler}
                        direction={isRTLCheck() ? 'rtl' : 'ltr'}
                        maxLength={250}
                    />
                    : null}

                {this.state.shouldPerformValidation
                    ? this.state.selectedIndex == -1
                        ? <EDRTLText style={styles.errorTextStyle}
                            title={strings('orderCancellationReasons.pleaseSelectReason')} />
                        : this.state.selectedIndex == 4 && this.state.strCancellationReason.trim().length == 0
                            ? <EDRTLText style={styles.errorTextStyle}
                                title={strings('orderCancellationReasons.emptyReason')} />
                            : null
                    : null}

                <EDButton
                    style={styles.dismissButton}
                    label={strings('generalNew.submit')}
                    onPress={this.buttonSavePressed} />

            </View>
        )
    }

    onSelectionIndexChangeHandler = (selectedIndexRadioButton, selectedValue) => {
        this.setState({
            selectedIndex: selectedIndexRadioButton,
            strCancellationReason: selectedIndexRadioButton == this.arrayCancellationReasons.length - 1
                ? ''
                : selectedValue,
            shouldPerformValidation: false
        })
    }

    onTextDidChangeHandler = (reason) => {
        this.setState({ strCancellationReason: reason })
    }

    buttonSavePressed = () => {
        this.setState({ shouldPerformValidation: true })
        if (this.state.selectedIndex == this.arrayCancellationReasons.length - 1 && this.state.strCancellationReason.trim().length == 0) {
            return;
        }

        if (this.state.selectedIndex == -1) {
            return;
        }

        if (this.props.onDismissCancellationReasonDialogueHandler !== undefined) {
            this.props.onDismissCancellationReasonDialogueHandler(this.state.strCancellationReason)
        }
    }
}

//#region STYLES
const styles = StyleSheet.create({
    productsSummaryContainer: { borderRadius: 5, marginHorizontal: 20, paddingVertical: 10, backgroundColor: EDColors.white, shadowOpacity: 0.25, shadowRadius: 5, shadowColor: EDColors.text, shadowOffset: { height: 0, width: 0 } },
    itemContainer: { marginVertical: 10, marginHorizontal: 0 },
    modalTitle: { alignSelf: 'center', marginVertical: 10, marginHorizontal: 10, color: EDColors.primary, fontSize: getProportionalFontSize(18), fontFamily: EDFonts.medium, fontWeight: '500' },
    itemName: { marginHorizontal: 10, flex: 1, color: EDColors.textAccount, fontSize: getProportionalFontSize(16), fontFamily: EDFonts.medium, fontWeight: '500' },
    itemPrice: { marginHorizontal: 10, color: EDColors.textAccount, fontSize: getProportionalFontSize(16), fontFamily: EDFonts.medium, fontWeight: '500' },
    priceContainer: { marginHorizontal: 0, paddingVertical: 10 },
    priceLabel: { marginHorizontal: 10, flex: 1, color: EDColors.text, fontSize: getProportionalFontSize(14), fontFamily: EDFonts.medium },
    priceValue: { marginHorizontal: 10, color: EDColors.text, fontSize: getProportionalFontSize(14), fontFamily: EDFonts.medium },
    totalLabel: { marginHorizontal: 10, flex: 1, color: EDColors.textAccount, fontSize: getProportionalFontSize(16), fontFamily: EDFonts.bold },
    totalValue: { marginHorizontal: 10, color: EDColors.textAccount, fontSize: getProportionalFontSize(16), fontFamily: EDFonts.bold },
    dismissButton: { paddingHorizontal: 20, alignSelf: 'center', marginTop: 20, marginBottom: 10 },
    textFieldStyle: {
        marginHorizontal: 20,
        marginTop: 10,
        fontFamily: EDFonts.regular,
        fontSize: getProportionalFontSize(16),
        color: EDColors.text,
        paddingVertical: 5,
        tintColor: EDColors.primary,
        borderBottomColor: EDColors.shadow,
        borderBottomWidth: 1,
        paddingBottom: 10,
    },
    errorTextStyle: {
        fontSize: getProportionalFontSize(12),
        fontFamily: EDFonts.regular,
        color: EDColors.error,
        marginHorizontal: 20,
    },
})
//#endregion