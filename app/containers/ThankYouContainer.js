import React from 'react';
import { View, StyleSheet, Image, ImageBackground, BackHandler } from 'react-native';
import BaseContainer from './BaseContainer';
import Assets from '../assets';
import EDRTLText from '../components/EDRTLText';
import { strings } from '../locales/i18n';
import { EDFonts } from '../utils/EDFontConstants';
import { getProportionalFontSize, debugLog } from '../utils/EDConstants';
import EDButton from '../components/EDButton';
import { EDColors } from '../utils/EDColors';

export default class ThankYouContainer extends React.PureComponent {

    render() {
        return (
            <BaseContainer
                title={strings("thankYou.confirm")}
                left={'arrow-back'}
                onLeft={this.navigateToOrder}
            >
                <View style={{ flex: 1 }}>
                    <ImageBackground style={style.imageStyle} source={Assets.thankYou_Background}>
                        <Image
                            source={Assets.confirm_thumb}
                        />
                        <EDRTLText style={style.thankYouTxt} title={strings("thankYou.success")} />
                        <EDButton
                            style={style.thankYouBtn}
                            textStyle={style.thankyouBtnTxt}
                            onPress={this.navigateToOrder}
                            label={strings('thankYou.trackorder')}
                        />
                    </ImageBackground>
                </View>
            </BaseContainer>
        )
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.navigateToOrder);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.navigateToOrder)
    }

    navigateToOrder = () => {
        BackHandler.removeEventListener('hardwareBackPress', this.navigateToOrder)
        debugLog('11 thank you')
        this.props.navigation.popToTop();
        this.props.navigation.navigate({ routeName: 'parentDrawer' })
        this.props.navigation.navigate({ routeName: 'myOrders' })
    }
}

export const style = StyleSheet.create({
    thankYouBtn: {
        marginHorizontal: 10,
        borderRadius: 30,
    },
    thankyouBtnTxt: {
        marginHorizontal: 40,
        fontSize: getProportionalFontSize(18),
    },
    imageStyle: {
        width: "100%", height: "100%", alignItems: 'center', justifyContent: 'center'
    },
    thankYouTxt: {
        color: EDColors.black, fontFamily: EDFonts.satisfy, fontSize: getProportionalFontSize(26), marginVertical: 20
    }

})