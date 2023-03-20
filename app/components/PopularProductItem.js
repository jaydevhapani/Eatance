/* eslint-disable prettier/prettier */
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { EDColors } from '../utils/EDColors';
import EDRTLText from './EDRTLText';
import { getProportionalFontSize } from '../utils/EDConstants';
import Metrics from '../utils/metrics';
import EDImage from './EDImage';
import Assets from '../assets';
import { EDFonts } from '../utils/EDFontConstants';
import Carousel, { ParallaxImage } from 'react-native-snap-carousel';

const NUMBER_OF_COLUMNS = 3;
const PARENT_WIDTH = (Metrics.screenWidth - 30) / NUMBER_OF_COLUMNS;
const IMAGE_WIDTH = PARENT_WIDTH - 12;
const IMAGE_HEIGHT = PARENT_WIDTH - 10;

export default class PopularProductItem extends React.PureComponent {
    //#region LIFE CYCLE METHODS
    onItemSelectionHandler = () => {
        if (this.props.onPress !== undefined) {
            this.props.onPress(this.props.itemToLoad);
        }
    };

    /** RENDER */
    render() {
        return (this.props.itemToLoad == undefined ? null :
            <TouchableOpacity
                activeOpacity={0.8}
                style={style.parentContainer}
                onPress={this.onItemSelectionHandler}>
                <View style={style.shadowContainer}>
                    <EDImage
                        resizeMode={this.props.resizeMode}
                        style={style.productImage}
                        source={this.props.itemToLoad.image}
                    />
                    {/* <ParallaxImage
                        style={{
                            ...StyleSheet.absoluteFillObject,
                            resizeMode: 'contain',
                        }}
                        containerStyle={style.imageContainer}
                        source={this.props.itemToLoad.image !== undefined ? { uri: this.props.itemToLoad.image } : Assets.logo_pin}
                        parallaxFactor={0.4}
                        {...this.props.parallaxProps}
                    /> */}

                    <EDRTLText
                        numberOfLines={1}
                        style={style.productName}
                        title={this.props.itemToLoad.name}
                    />
                </View>
            </TouchableOpacity>
        );
    }
    //#endregion
}

//#region STYLES
export const style = StyleSheet.create({
    parentContainer: { width: PARENT_WIDTH, height: PARENT_WIDTH * 1.2 },
    imageContainer: {
        flex: 1,
        marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
        // borderRadius: 8,
    },
    shadowContainer: {
        margin: 5,
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
    },
    productImage: {
        height: IMAGE_HEIGHT,
        width: IMAGE_WIDTH,
        // borderColor: 'red', borderWidth: 2
    },
    productName: {
        // height: PARENT_WIDTH * 0.2,
        fontFamily: EDFonts.medium,
        textAlign: 'center',
        textAlignVertical: 'center',
        color: EDColors.text,
        fontSize: getProportionalFontSize(12),
        marginVertical: 3,
        marginHorizontal: 4,
        // borderWidth: 2, borderColor: 'yellow'
    },
});
//#endregion
