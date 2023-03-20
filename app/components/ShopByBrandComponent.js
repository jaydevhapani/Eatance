import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { EDFonts } from "../utils/EDFontConstants";
import { EDColors } from "../utils/EDColors";
import { getProportionalFontSize } from "../utils/EDConstants";
import EDSectionHeader from "./EDSectionHeader";
import PopularProductItem from "./PopularProductItem";


export default class ShopByBrandComponent extends React.PureComponent {

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
                        ?
                        // <Carousel
                        //     data={this.props.shopByData}
                        //     renderItem={this.renderShopByItem}
                        //     sliderWidth={(Metrics.screenWidth - 30)}
                        //     itemWidth={(Metrics.screenWidth - 30) / 3}
                        //     style={{ alignItems: 'center', justifyContent: 'center' }}
                        //     hasParallaxImages={true}
                        //     pagingEnabled={false}
                        //     inactiveSlideScale={1}
                        //     inactiveSlideOpacity={1}
                        //     loop
                        // // autoplay
                        // />
                        <FlatList
                            horizontal={true}
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
    renderShopByItem = ({ item }, parallaxProps) => {
        return <PopularProductItem resizeMode={'contain'} parallaxProps={parallaxProps} itemToLoad={item} onPress={this.onSelectionHandler} />
    }
    //#endregion

    //#region SELECTION HANDLER
    onSelectionHandler = (selectedBrand) => {
        if (this.props.onSelectionHandler !== undefined) {
            this.props.onSelectionHandler(selectedBrand)
        }
    }
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
    }
});
//#endregion
