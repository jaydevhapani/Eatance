import React from 'react';
import { StyleSheet, View } from 'react-native';
import EDRTLView from './EDRTLView';
import EDRTLText from './EDRTLText';
import { EDColors } from '../utils/EDColors';
import { EDFonts } from '../utils/EDFontConstants';
import { getProportionalFontSize } from '../utils/EDConstants';
import EDButton from './EDButton';
import { strings } from '../locales/i18n';

export default class PromoCodeComponent extends React.PureComponent{

    constructor(props){
        super(props)

    }

    render(){
        return(
            <View style={style.mainContainer}>
                <EDRTLView
                    style={{ alignItems: 'center', justifyContent: 'space-between' }}>
                    <EDRTLText style={style.titleStyle} title={this.props.item.name} />
                    <EDButton
                        style={style.applyBtnText}
                        textStyle={style.applyText}
                        label={strings('promoCode.apply')}
                        onPress={this.props.onPressHandler}
                    />
                </EDRTLView>
                <EDRTLText
                    style={style.descriptionStyle}
                    title={this.props.item.description}
                />

            </View>
        )
    }
}
export const style = StyleSheet.create({
    mainContainer: {
        marginHorizontal: 10,
        marginTop: 10,
        paddingVertical: 10,
        borderColor: EDColors.shadow,
        borderWidth: 1,
        borderRadius: 5,
        shadowOpacity: 0.25,
        shadowRadius: 5,
        shadowColor: EDColors.text,
        backgroundColor: EDColors.white,
        shadowOffset: { height: 0, width: 0 },
    },
    titleStyle: {
        color: EDColors.primary,
        marginHorizontal: 10,
        fontFamily: EDFonts.bold, fontSize: getProportionalFontSize(16)
    },
    applyBtnText: {
        paddingVertical: 5,
        borderRadius: 30,
        marginHorizontal: 10,
    },
    applyText: {
        marginVertical: 0,
        marginHorizontal: 15,
        fontSize: getProportionalFontSize(12),
    },
    descriptionStyle: { color: EDColors.text, margin: 10, marginTop: 5 }
})