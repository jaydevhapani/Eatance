import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, RefreshControl } from "react-native";
import EDRTLText from "./EDRTLText";
import BannerImages from "./BannerImages";
import { isRTLCheck, getProportionalFontSize } from "../utils/EDConstants";
import { EDColors } from "../utils/EDColors";
import StoreOverview from "./StoreOverview";
import { widthPercentageToDP, heightPercentageToDP } from "react-native-responsive-screen";
import { EDFonts } from "../utils/EDFontConstants";
import Metrics from "../utils/metrics";
import EDRTLView from "./EDRTLView";
import EDButton from "./EDButton";
import { strings } from "../locales/i18n";
import PopularProductComponent from "./PopularProductComponent";

export default class HomeHeaderSectionComponent extends React.PureComponent {

    constructor(props) {
        super(props)
    }

    // #render Componets

    photosList = () => {
        return (
            <View>
                {this.props.popularItemArray.length > 0 ?
                    <View>
                        <EDRTLView style={style.photoViewstyle}>
                            <EDRTLText
                                style={style.photoTxtStyle}
                                title={strings('homeNew.featured')}
                            />
                        </EDRTLView>
                        <FlatList
                            horizontal={true}
                            data={this.props.popularItemArray}
                            showsHorizontalScrollIndicator={false}
                            renderItem={this.photoListComponennt}
                            keyExtractor={(item, index) => item + index}
                        />
                    </View>
                    : null}
            </View>
        );
    };

    photoListComponennt = ({ item }) => {
        return <PopularProductComponent data={item} onButtonClick={() => this.props.onButtonClick(item)} currencySymbol={this.props.currencySymbol} />;
    };

    menuHeaderRender = () => {
        return (
            <EDRTLView>
                <EDRTLView style={style.menubtn}>
                    <EDButton
                        style={{
                            backgroundColor: this.props.isMenuSelect
                                ? EDColors.primary
                                : EDColors.white,
                        }}
                        textStyle={{
                            color: this.props.isMenuSelect ? EDColors.white : EDColors.black,
                        }}
                        label={strings('homeNew.menu')}
                        onPress={this.props.onChangeMenuFlag}
                    />
                    <EDButton
                        style={{
                            backgroundColor: !this.props.isMenuSelect
                                ? EDColors.primary
                                : EDColors.white,
                        }}
                        textStyle={{
                            color: !this.props.isMenuSelect
                                ? EDColors.white
                                : EDColors.black,
                        }}
                        label={strings('homeNew.reviews')}
                        onPress={this.props.onChangeReviewFlag}
                    />

                </EDRTLView>
                {this.props.isMenuSelect ?
                    <TouchableOpacity
                        style={[style.searchViewStyle, { flexDirection: isRTLCheck() ? 'row-reverse' : 'row', justifyContent: 'flex-end' }]}
                        onPress={this.props.searchPressHandler}>
                        <Text>{strings("homeNew.search")}</Text>
                    </TouchableOpacity>
                    : null}
            </EDRTLView>
        );
    };

    render() {
        return (
            <View>
                <View>
                    <ScrollView refreshControl={<RefreshControl colors={[EDColors.primary]} refreshing={this.props.refreshing} onRefresh={this.props.onRefresh} />}>
                        <BannerImages images={this.props.bannerArray} />
                        <StoreOverview style={style.storeOverwise} data={this.props.storeArray} />

                        {this.props.isStoreClose.toLowerCase() !== 'open' ? (
                            <EDRTLText
                                style={style.stoerStatusStyle}
                                title={strings('homeNew.notAcceptingOrdersMessage')}
                            />
                        ) : null}

                        {this.photosList()}
                        {this.menuHeaderRender()}
                    </ScrollView>
                </View>
            </View>
        )
    }
}

const style = StyleSheet.create({
    itemContainer: {
        marginTop: heightPercentageToDP('1.8%'),
        paddingHorizontal: widthPercentageToDP('5.0%'),
        borderRadius: 2,
        justifyContent: 'space-between',
        elevation: 2,
        height: 45,
        alignItems: 'center',
        marginHorizontal: 15
    },
    searchViewStyle: {
        flex: 1,
        marginHorizontal: 10,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageSearch: {
        marginHorizontal: 2,
        height: 15,
        width: 15,
        resizeMode: 'contain',
    },
    itemTitle: {
        fontFamily: EDFonts.medium,
        fontSize: getProportionalFontSize(14),
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.50)',
    },
    imageStyle: {
        marginTop: 20,
        height: Metrics.screenHeight * 0.12,
        width: Metrics.screenWidth * 0.75,
        resizeMode: 'contain',
        marginBottom: 10,
    },
    menuStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 2,
        backgroundColor: EDColors.white,
        borderColor: EDColors.primary,
        borderRadius: 25,
        borderWidth: 1,
        paddingHorizontal: 15,
        paddingVertical: 5,
        marginBottom: 10,
    },
    searchBarStyle: {
        position: 'absolute',
        right: 10,
        borderRadius: 25,
        backgroundColor: EDColors.offWhite,
        elevation: 2,
        width: 25,
        height: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    txtInputStyle: {
        height: 40,
        elevation: 2,
        width: '100%',
        paddingLeft: 10,
        paddingRight: 40,
        borderRadius: 15,
        borderWidth: 0.1,
        marginBottom: 0,
        backgroundColor: EDColors.white,
    },
    flatListStyle: {
        backgroundColor: 'white',
        zIndex: 1,
        marginHorizontal: 10,
        elevation: 2,
        borderRadius: 15,
        paddingHorizontal: 10,
    },
    rightImage: {
        alignSelf: 'center',
        // marginEnd: 10
    },
    photoViewstyle: {
        paddingHorizontal: 10,
        justifyContent: 'space-between',
        paddingVertical: 10,
    },
    photoTxtStyle: {
        fontFamily: EDFonts.bold,
        color: EDColors.black,
    },
    photoUnderlineStyle: {
        color: EDColors.grey,
        fontFamily: EDFonts.light,
    },
    reviewbtnStyle: {
        color: EDColors.white,
    },
    reviewFlatlist: {
        marginBottom: 10,
    },
    menuItemView: {
        height: Metrics.screenHeight * 0.25,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    topSearchView: {
        position: 'absolute',
        top: 20,
        width: '100%',
    },
    topSearchSubView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
        zIndex: 1,
    },
    searchImg: {
        width: 12,
        resizeMode: 'contain',
    },
    searchSeprator: {
        height: 1,
        backgroundColor: '#e5e5e5',
    },
    searchtxt: {
        marginVertical: 5,
    },
    bottomLeftMenuView: {
        position: 'absolute',
        bottom: widthPercentageToDP('2.0%'),
        left: widthPercentageToDP('2.0%'),
    },
    bottomRightMenuView: {
        position: 'absolute',
        bottom: widthPercentageToDP('2.0%'),
        right: widthPercentageToDP('2.0%'),
    },
    bottomMenuImg: {
        height: 15,
        width: 15,
        resizeMode: 'contain',
        marginRight: 5,
        tintColor: EDColors.primary,
    },
    storeOverwise: {
        marginTop: -40,
    },
    stoerStatusStyle: {
        textAlign: 'center',
        fontFamily: EDFonts.bold,
        color: 'red',
        marginHorizontal: 10,
        paddingHorizontal: 10
    },
    menubtn: {
        paddingVertical: 5,
    },
    addOnsStyle: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    commonView: {
        flex: 1,
        backgroundColor: EDColors.offWhite,
    },
    childContainerView: {
        flex: 1,
        backgroundColor: EDColors.offWhite,
    },
});
