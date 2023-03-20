import React, { Component } from 'react';
import { Image, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { EDFonts } from '../utils/EDFontConstants';
import { isRTLCheck, getProportionalFontSize } from '../utils/EDConstants';
import { EDColors } from '../utils/EDColors';
import { Icon } from 'react-native-elements'

export default class EDSideMenuItem extends Component {

    onPressHandler = () => {
        if (this.props.onPressHandler !== undefined) {
            this.props.onPressHandler(this.props.item, this.props.index)
        }
    }

    render() {
        return (
            <TouchableOpacity
                style={[styles.touchableContainer, { flexDirection: isRTLCheck() ? 'row-reverse' : 'row' }]}
                onPress={this.onPressHandler}
            >

                {this.props.item.isAsset
                    ? <Image
                        style={[styles.styleImage, { tintColor: this.props.isSelected ? EDColors.homeButtonColor : EDColors.textNew }]}
                        source={this.props.item.icon}
                        resizeMode="contain"
                    />
                    : <Icon
                        size={20}
                        name={this.props.item.icon}
                        color={this.props.isSelected ? EDColors.homeButtonColor : EDColors.textNew} />
                }


                <Text style={[styles.textStyle, { color: this.props.isSelected ? EDColors.homeButtonColor : EDColors.textNew }]}>
                    {this.props.item.screenName}
                </Text>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    touchableContainer: {
        flex: 1,
        alignItems: 'center',
        marginTop: 15,
        marginHorizontal: 25,
        marginBottom: 15,
    },
    styleImage: { width: 20, height: 20 },
    textStyle: { fontSize: getProportionalFontSize(14), marginHorizontal: 10, fontFamily: EDFonts.regular }
});
