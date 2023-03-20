import React from "react";
import { StyleSheet } from "react-native";
import EDRTLText from "./EDRTLText";
import EDRTLView from "./EDRTLView";
import EDButton from "./EDButton";
import { EDFonts } from "../utils/EDFontConstants";
import { EDColors } from "../utils/EDColors";
import { getProportionalFontSize } from "../utils/EDConstants";

export default class CheckOutBottomComponent extends React.PureComponent {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <EDRTLView
                pointerEvents={this.props.pointerEvents || 'auto'}
                style={[style.checkoutViewStyle, this.props.style]}>
                {this.props.title !== undefined
                    ? <EDRTLText
                        style={style.checkoutSubTxt}
                        title={this.props.title !== undefined && this.props.title !== null ? this.props.title : ""} />
                    : null}
                <EDButton
                    activeOpacity={this.props.activeOpacity}
                    style={[style.lastBtn, this.props.btnStyle]}
                    onPress={this.props.onPress}
                    label={this.props.label}
                />
            </EDRTLView>
        )
    }
}

//#region STYLES
const style = StyleSheet.create({
    checkoutViewStyle: {
        backgroundColor: EDColors.white,
        alignItems: 'center',
        paddingVertical: 20,
        borderColor: EDColors.shadow,
        borderWidth: 1,
        shadowOpacity: 0.25,
        shadowRadius: 5,
        shadowColor: EDColors.text,
        shadowOffset: { height: 0, width: 0 },
    },
    checkoutSubTxt: {
        flex: 1,
        color: EDColors.black,
        marginHorizontal: 20,
        fontFamily: EDFonts.regular,
        fontSize: getProportionalFontSize(20),
    },
    lastBtn: {
        marginHorizontal: 20, paddingVertical: 10, borderRadius: 20, paddingHorizontal: 40, backgroundColor: EDColors.homeButtonColor
    }
})
//#endregion