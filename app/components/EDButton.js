import React from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';
import { EDColors } from '../utils/EDColors';
import { EDFonts } from '../utils/EDFontConstants';
import { getProportionalFontSize } from '../utils/EDConstants';

export default class EDButton extends React.PureComponent {
    //#region LIFE CYCLE METHODS
    /** RENDER */
    render() {
        return (
            <TouchableOpacity
                activeOpacity={this.props.activeOpacity}
                style={[style.buttonStyle, this.props.style]}
                onPress={this.props.onPress}>
                <Text style={[style.textStyle, this.props.textStyle]}>
                    {this.props.label}
                </Text>
            </TouchableOpacity>
        );
    }
    //#endregion
}

//#region STYLES
export const style = StyleSheet.create({
    buttonStyle: {
        marginHorizontal: 20,
        backgroundColor: EDColors.homeButtonColor,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textStyle: {
        alignSelf: 'center',
        color: EDColors.white,
        fontSize: getProportionalFontSize(16),
        fontFamily: EDFonts.medium,
    },
});
//#endregion
