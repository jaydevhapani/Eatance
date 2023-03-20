import React, { Component } from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { EDColors } from '../utils/EDColors';
import { EDFonts } from '../utils/EDFontConstants';
import { getProportionalFontSize } from '../utils/EDConstants';

export default class EDUnderlineButton extends Component {
    //#region LIFE CYCLE METHODS
    /** RENDER */
    render() {
        return (
            <TouchableOpacity
                pointerEvents={this.props.pointerEvents || 'auto'}
                style={[stylesButton.themeButton, this.props.buttonStyle]}
                onPress={this.props.onPress} >
                <Text
                    style={[
                        stylesButton.themeButtonText,
                        this.props.textStyle,
                    ]}>
                    {this.props.label}
                </Text>
            </TouchableOpacity >

        );
    }
    //#endregion
}

//#region STYLES
export const stylesButton = StyleSheet.create({
    themeButton: {
        justifyContent: 'center',
        alignSelf: 'center',
        borderBottomColor: EDColors.white,
        borderBottomWidth: 1,
    },
    themeButtonText: {
        color: EDColors.white,
        fontFamily: EDFonts.regular,
        alignSelf: 'center',
        fontSize: getProportionalFontSize(14),
    },
});
//#endregion
