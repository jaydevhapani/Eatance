import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import ActionButton from 'react-native-action-button';
import { EDColors } from '../utils/EDColors';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import { isRTLCheck, getProportionalFontSize } from '../utils/EDConstants';
import { EDFonts } from '../utils/EDFontConstants';


class EDFloatingButton extends Component {

    renderCartIcon = () => {
        return <MaterialIcon size={25} color={EDColors.white} name="shopping-cart" />;
    }

    onPressCartButton = () => {
        if (this.props.currentScreen !== undefined && this.props.currentScreen.navigation !== undefined) {
            this.props.currentScreen.navigation.navigate('cart', { isview: false })
        }
    }

    render() {
        return (
            this.props.shouldShowFloatingButton && this.props.cartCount > 0
                ? <TouchableOpacity onPress={this.onPressCartButton} style={isRTLCheck() ? style.mainRightViewStyle : style.mainLeftViewStyle}>
                    <ActionButton
                        buttonColor={EDColors.primary}
                        position="left"
                        offsetX={0}
                        offsetY={0}
                        renderIcon={this.renderCartIcon}
                        onPress={this.onPressCartButton}
                    />
                    <View style={style.container}>
                        <Text style={style.cartCountText}>{this.props.cartCount || 0}</Text>
                    </View>
                </TouchableOpacity>
                : null
        );
    }
}

export const style = StyleSheet.create({
    cartCountText: { color: EDColors.white, fontFamily: EDFonts.bold, fontSize: getProportionalFontSize(12) },
    container: { position: 'absolute', alignItems: 'center', justifyContent: 'center', top: 8, right: 8, width: 22, height: 22, borderRadius: 11, backgroundColor: EDColors.primary, borderColor: EDColors.white, borderWidth: 2 },
    mainLeftViewStyle: {
        position: 'absolute', width: 55, height: 55, bottom: 44, left: 15, alignItems: 'center', justifyContent: 'center',
    },
    mainRightViewStyle: {
        position: 'absolute', width: 55, height: 55, bottom: 44, right: 15, alignItems: 'center', justifyContent: 'center',
    },
});

export default connect(
    state => {
        return {
            shouldShowFloatingButton: state.floatingButtonOperations !== undefined
                ? state.floatingButtonOperations.isFloatingButtonVisible
                : false,
            currentScreen: state.floatingButtonOperations !== undefined
                ? state.floatingButtonOperations.currentScreen
                : undefined,
            cartCount: state.checkoutReducer !== undefined
                ? state.checkoutReducer.cartCount
                : 0,
        };
    },
    () => {
        return {
        };
    }
)(EDFloatingButton);
