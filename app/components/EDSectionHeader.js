import React from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import { EDFonts } from "../utils/EDFontConstants";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { EDColors } from "../utils/EDColors";
import EDRTLView from "./EDRTLView";
import EDRTLText from "./EDRTLText";
import { INR_SIGN, getProportionalFontSize } from "../utils/EDConstants";
import EDButton from "./EDButton";
import { strings } from "../locales/i18n";

export default class EDSectionHeader extends React.PureComponent {

    //#region LIFE CYCLE METHODS
    /** RENDER */
    render() {
        return (
            // PARENT CONTAINER
            <EDRTLView style={[style.container, this.props.containerStyle]}>
                {/* TITLE */}
                <EDRTLText style={style.itemTitle} title={this.props.title || ''} />

                {/* VIEW ALL BUTTON */}
                <EDButton
                    style={style.buttonViewAll}
                    textStyle={{ fontSize: getProportionalFontSize(12), color: EDColors.homeButtonColor, fontFamily: EDFonts.medium }}
                    label={this.props.buttonTitle || (this.props.onViewAllPressed !== undefined ? strings('homeNew.viewAll') : '')}
                    onPress={this.props.onViewAllPressed} />
            </EDRTLView>
        )
    }
    //#endregion
}

//#region STYLE SHEET
export const style = StyleSheet.create({
    buttonViewAll: { backgroundColor: EDColors.transparent, paddingHorizontal: 0, marginHorizontal: 5 },
    container: {
        marginTop: 10,
        alignItems: 'center',
    },
    price: {
        fontFamily: EDFonts.medium,
        color: EDColors.text,
        fontSize: getProportionalFontSize(14)
    },
    itemTitle: {
        flex: 1,
        fontFamily: EDFonts.bold,
        color: EDColors.textAccount,
        fontSize: getProportionalFontSize(14),
    }
});
//#endregion