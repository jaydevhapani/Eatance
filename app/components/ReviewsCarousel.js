import React from "react";
import { View, StyleSheet } from "react-native";
import { EDFonts } from "../utils/EDFontConstants";
import { EDColors } from "../utils/EDColors";
import EDRTLText from "./EDRTLText";
import EDSectionHeader from "./EDSectionHeader";
import ShopByItem from "./ShopByItem";
import Metrics from "../utils/metrics";
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Carousel from 'react-native-snap-carousel';

export default class ReviewsCarousel extends React.PureComponent {

    //#region LIFE CYCLE METHODS
    /** RENDER */
    render() {
        return (
            this.props.reviewsData !== undefined
                ? <View style={style.parentContainer}>
                    <EDSectionHeader containerStyle={style.header} title={this.props.title} onViewAllPressed={this.props.onViewAllHandler} />

                    <View style={style.carouserContainer}>
                        <Carousel
                            data={this.props.reviewsData.length > 0 ? this.props.reviewsData : [this.props.dummyReview]}
                            renderItem={this.renderReviewItem}
                            sliderWidth={Metrics.screenWidth - 30}
                            itemWidth={Metrics.screenWidth - 90}
                            // loop
                            autoplay
                        />
                        {/* <Carousel
                            autoplay
                            autoplayTimeout={5000}
                            loop
                            showsPageIndicator={false}
                            index={0}
                            itemWidth='100%'
                            pageSize={Metrics.screenWidth - 30}
                        >
                            {this.props.reviewsData.length > 0
                                ? this.props.reviewsData.map(this.renderReviewItem)
                                : [this.props.dummyReview].map(this.renderReviewItem)}
                        </Carousel> */}
                    </View>
                </View>
                : null
        )
    }

    renderReviewItem = (itemToLoad) => {
        var reviewItem = itemToLoad.item
        var index = itemToLoad.index
        return (
            <View style={style.itemContainer} key={index}>
                <View style={style.contentContainer}>
                    <MaterialIcon size={30} color={EDColors.homeButtonColor} name="format-quote" />
                    <View style={style.reviewDescriptionContainer}>
                        <EDRTLText numberOfLines={3} title={decodeURI(reviewItem.review)} style={style.reviewDescriptionText} />
                    </View>
                    <EDRTLText title={'- ' + (reviewItem.first_name || '') + " " + (reviewItem.last_name || '')} style={style.reviewerName} />
                </View>
            </View>
        )
    }
    //#endregion

    //#region HELPER METHODS
    renderShopByItem = (shopByItem) => {
        return <ShopByItem itemToLoad={shopByItem.item} />
    }
    //#endregion
}

//#region STYLES
const style = StyleSheet.create({
    parentContainer: {
        marginTop: 10, marginHorizontal: 15, height: Metrics.screenHeight * 0.225,
        //  backgroundColor: 'purple'
    },
    header: { marginTop: 0, flex: 2 },
    carouserContainer: { flex: 8 },
    itemContainer: {
        // backgroundColor: 'yellow', 
        alignSelf: 'center', alignItems: 'center', justifyContent: 'center'
    },
    contentContainer: {
        marginHorizontal: 20,
        marginVertical: 5,
        borderColor: EDColors.shadow,
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: EDColors.white,
        shadowOpacity: 0.25,
        shadowRadius: 5,
        shadowColor: EDColors.text,
        shadowOffset: { height: 0, width: 0 },
        overflow: 'hidden',
        flex: 1,
        padding: 10,
        alignItems: 'center',
        // justifyContent: 'center',
        // borderColor: 'yellow',
        //  borderWidth: 2,
        // backgroundColor: 'blue',
        height: '100%', width: Metrics.screenWidth - 90
    },
    reviewDescriptionContainer: { flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', paddingVertical: 2 },
    reviewDescriptionText: { color: EDColors.text, textAlign: 'center' },
    reviewerName: { fontFamily: EDFonts.boldItalic, color: EDColors.textAccount, textAlign: 'center' }

});
//#endregion
