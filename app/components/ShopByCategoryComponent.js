import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { EDFonts } from "../utils/EDFontConstants";
import { EDColors } from "../utils/EDColors";
import { getProportionalFontSize } from "../utils/EDConstants";
import EDSectionHeader from "./EDSectionHeader";
import ShopByItem from "./ShopByItem";
import Metrics from "../utils/metrics";

export default class ShopByCategoryComponent extends React.PureComponent {

    //#region LIFE CYCLE METHODS
    /** RENDER */
    render() {
        return (
            <View style={{ marginHorizontal: 15 }}>
                {this.props.shopByData !== undefined && this.props.shopByData.length > 0
                    ? <EDSectionHeader title={this.props.title} onViewAllPressed={this.props.onViewAllHandler} />
                    : null}

                {this.props.shopByData !== undefined
                    ? this.props.shopByData.length > 0
                        ? <FlatList
                            numColumns={Metrics.screenWidth > 375 ? 4 : 3}
                            showsHorizontalScrollIndicator={false}
                            data={this.props.shopByData}
                            renderItem={this.renderShopByItem}
                            keyExtractor={(item, index) => item + index}
                        />
                        : null
                    : null}
            </View>
        )
    }
    //#endregion

    //#region HELPER METHODS
    renderShopByItem = (shopByItem) => {
        return <ShopByItem onSelectionHandler={this.props.onSelectionHandler} itemToLoad={shopByItem.item} />
    }
    //#endregion
}

//#region STYLES
export const style = StyleSheet.create({
    container: {
        marginTop: 10,
    },
    price: {
        fontFamily: EDFonts.medium,
        color: EDColors.text,
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
//#endregion
