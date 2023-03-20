import React from "react";
import { View, StyleSheet } from "react-native";
import { EDFonts } from "../utils/EDFontConstants";
import { EDColors } from "../utils/EDColors";
import EDRTLView from "./EDRTLView";
import EDRTLText from "./EDRTLText";
import { getProportionalFontSize, funGetFrench_Curr } from "../utils/EDConstants";

export default class PriceDetailsComponent extends React.PureComponent {

    render() {
        return (
            <View>
                {this.props.items.value !== "" && this.props.items.value !== null && this.props.items.value !== undefined ?
                    <EDRTLView style={style.container}>
                        <EDRTLText style={[style.itemTitle, this.props.labelStyle]} title={this.props.items.label !== undefined ? this.props.items.label : ""} />
                        <EDRTLText style={[style.price, , this.props.valueStyle, { color: this.props.items.label_key.includes("Discount") ? EDColors.discountColor : EDColors.text }]} title={this.props.items.label_key.includes("Discount") ? " - " + this.props.currencySymbol + funGetFrench_Curr(this.props.items.value, 1, this.props.lan) : this.props.currencySymbol + funGetFrench_Curr(this.props.items.value, 1, this.props.lan)} />
                    </EDRTLView>
                    : null
                }
            </View>
        )
    }
}

export const style = StyleSheet.create({
    container: {
        // flexDirection: "row",
        marginTop: 10,
        // marginLeft: 10,
        // marginRight: 10
    },
    price: {
        fontFamily: EDFonts.medium,
        fontSize: getProportionalFontSize(14)
    },
    itemTitle: {
        flex: 1,
        fontFamily: EDFonts.medium,
        color: EDColors.text,
        fontSize: getProportionalFontSize(14),
        // height: 20
    }
});