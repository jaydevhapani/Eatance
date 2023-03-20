import React, { Component } from 'react';
import { Image, TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { EDFonts } from '../utils/EDFontConstants';
import { EDColors } from '../utils/EDColors';
import { getProportionalFontSize } from '../utils/EDConstants';
import { style } from './AddressComponent';

export default class FilterAttributeComponent extends Component {

    onPressFilterAttribute = () => {
        if (this.props.onPressFilterAttribute !== undefined) {
            this.props.onPressFilterAttribute(this.props.attribute, this.props.index)
        }
    }
    render() {
        return (
            <TouchableOpacity
                onPress={this.onPressFilterAttribute}
                style={[styles.touchableContainer,
                { backgroundColor: this.props.isSelected ? EDColors.secondary : EDColors.transparent }
                ]}>
                <View style={style.alignCenterMarginVertical}>
                    <Image style={{ tintColor: this.props.isSelected ? EDColors.white : EDColors.white, alignSelf: 'center' }} source={this.props.attribute.icon} />
                    <Text style={[styles.attributeTitle, { color: this.props.isSelected ? EDColors.white : EDColors.white }]}>{this.props.attribute.title}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    touchableContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomColor: EDColors.separatorColor,
        borderBottomWidth: 1,
        paddingTop: 10,
    },
    alignCenterMarginVertical: { alignItems: 'center', marginVertical: 20, justifyContent: 'center' },
    attributeTitle: { marginVertical: 10, fontFamily: EDFonts.semiBold, fontSize: getProportionalFontSize(16) },
});

