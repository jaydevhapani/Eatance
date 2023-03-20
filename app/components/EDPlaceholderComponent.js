import React, { Component } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import EDRTLText from './EDRTLText';
import { EDColors } from '../utils/EDColors';
import { EDFonts } from '../utils/EDFontConstants';
import Assets from '../assets';
import EDButton from './EDButton';
import { strings } from '../locales/i18n';
import { getProportionalFontSize } from '../utils/EDConstants';

export default class EDPlaceholderComponent extends Component {
    //#region LIFE CYCLE METHODS
    /** RENDER */
    render() {
        return (
            <View style={[styles.mainContainer, this.props.style]}>

                <View style={[styles.childContainer, { backgroundColor: this.props.backgroundColor || EDColors.white, borderColor: this.props.backgroundColor ? EDColors.white : EDColors.primary }]}>
                    <Image
                        defaultSource={this.props.icon || Assets.logo_pin_transparent}
                        source={this.props.icon || Assets.logo_pin_transparent} />
                    {this.props.title
                        ? <EDRTLText title={this.props.title} style={[styles.titleText, { color: this.props.backgroundColor ? EDColors.white : EDColors.textAccount }]} />
                        : null}
                    {this.props.subTitle
                        ? <EDRTLText title={this.props.subTitle} style={[styles.messageText, { color: this.props.backgroundColor ? EDColors.white : EDColors.text, marginTop: this.props.title ? 0 : 10 }]} />
                        : null}
                    {this.props.onBrowseButtonHandler
                        ? <EDButton onPress={this.props.onBrowseButtonHandler} style={{ marginTop: 20, backgroundColor: EDColors.homeButtonColor }} label={this.props.buttonTitle || strings('buttonTitles.browse')} />
                        : null}
                </View>

            </View>
        );
    }
    //#region 
}

//#region STYLES
const styles = StyleSheet.create({
    mainContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 20 },
    childContainer: {
        borderRadius: 5,
        borderWidth: 1,
        paddingBottom: 20,
        paddingHorizontal: 10,
        width: '75%',
        alignItems: 'center',
        shadowOpacity: 0.25,
        shadowRadius: 5,
        shadowColor: EDColors.text,
        shadowOffset: { height: 0, width: 0 }
    },
    titleText: {
        fontSize: getProportionalFontSize(16),
        fontFamily: EDFonts.semiBold,
        textAlign: 'center',
        marginTop: 0,
        marginBottom: 10
    },
    messageText: {
        fontSize: getProportionalFontSize(14),
        fontFamily: EDFonts.regular,
        textAlign: 'center'
    }
});
//#endregion