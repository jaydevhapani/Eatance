import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { isRTLCheck, getProportionalFontSize } from '../utils/EDConstants';
import { EDColors } from '../utils/EDColors';
import { EDFonts } from '../utils/EDFontConstants';

export default class EDRTLText extends React.Component {
    //#region LIFE CYCLE METHODS
    /** RENDER */
    render() {
        return (
            <Text style={[styles.textStyle, { textAlign: isRTLCheck() ? 'right' : 'left' }, this.props.style]}
            numberOfLines={this.props.numberOfLines}
            >
                {this.props.title}
            </Text>
        )
    }
    //#endregion
}

//#region STYLES
const styles = StyleSheet.create({
    textStyle: {
        color: EDColors.white,
        fontSize: getProportionalFontSize(14),
        fontFamily: EDFonts.regular,
    },
})
//#endregion
