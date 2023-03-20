import React from "react";
import {
    View,
    Text,
    StyleSheet
} from "react-native";
import EDButton from "./EDButton";
import EDRTLView from "./EDRTLView";
import { EDFonts } from "../utils/EDFontConstants";
import Metrics from "../utils/metrics";
import { EDColors } from "../utils/EDColors";
import { strings } from "../locales/i18n";

export default class EDAddonsModalComponent extends React.PureComponent {
    render() {
        return (
            <View style={style.mainViewstyle}>
                <Text style={style.txtStyle}>{this.props.categoriesData.name}</Text>
                <EDRTLView style={style.rtlView}>
                    <EDButton
                        style={style.btnstyle}
                        textStyle={style.btnText}
                        onPress={this.props.onAddnewItemHandler}
                        label={strings("addonsNew.newItem")}
                    />
                    <EDButton
                        style={style.btnstyle}
                        textStyle={style.btnText}
                        onPress={this.props.onAddRepeatItemHandler}
                        label={strings("addonsNew.repeatItem")}
                    />
                </EDRTLView>
            </View>
        )
    }
}
const style = StyleSheet.create({
    btnstyle: {
        width: Metrics.screenWidth*0.40,
        paddingHorizontal:20
    },
    btnText: {
        // flex: 1,
        textAlign: 'center',
        fontFamily: EDFonts.bold
    },
    mainViewstyle: {
        backgroundColor: EDColors.white,
        marginBottom: 10
    },
    txtStyle: {
        margin: 10,
        fontFamily: EDFonts.bold
    },
    rtlView: {
        width: Metrics.screenWidth,
        marginBottom: 20,
        justifyContent: 'space-evenly'
    }
})