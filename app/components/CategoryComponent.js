import React from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from "react-native";
import { RadioGroup, RadioButton } from "react-native-flexi-radio-button";
import { EDColors } from "../utils/EDColors";
import metrics from "../utils/metrics";
import { funGetFrench_Curr, isRTLCheck, getProportionalFontSize } from "../utils/EDConstants";
import EDRTLView from "./EDRTLView";
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import EDRTLText from "./EDRTLText";
import { EDFonts } from "../utils/EDFontConstants";
import Toast from 'react-native-easy-toast';
import { strings } from "../locales/i18n"

export default class CategoryComponent extends React.PureComponent {
    constructor(props) {
        super(props);
        this.indexArray = []
        this.category_Array = []
    }

    componentDidMount() {
        this.CategoryDict = { addons_list: this.category_Array }
        this.props.onChangedata(this.CategoryDict)
    }

    buttonMinusPressed = () => {
        if (this.state.quantity > 1) {
            this.setState({ quantity: this.state.quantity - 1 });
        }
    }

    buttonPlusPressed = (index) => {
        if (this.CategoryDict.addons_list[0].in_stock > this.state.quantity[index]) {
            if (this.CategoryDict.addons_list[0].max_quantity > this.state.quantity[index]) {
                let temp = this.state.quantity
                temp[index] = temp[index] + 1
                this.setState({ quantity: temp })
                this.forceUpdate();
            }

            else
                showValidationAlert(strings("generalNew.maxQuantity") + this.CategoryDict.addons_list[0].max_quantity, 1000)
        }
        else
            showValidationAlert(strings("generalNew.noMoreStock"))
    }

    radioComponentRender = () => {
        return (
            <RadioGroup
                color={EDColors.homeButtonColor}
                onSelect={this.onSelectedIndex}
                selectedIndex={this.state.selectedValue}>
                {this.props.testData.map((item, index) => {
                    return (
                        <RadioButton style={[{ flexDirection: isRTLCheck() ? 'row-reverse' : 'row' }, style.radioButtonItem]}>
                            <EDRTLView style={style.radioView}>
                                <EDRTLText style={[style.txtStyle, { marginLeft: isRTLCheck() ? 0 : 20, marginRight: isRTLCheck() ? 20 : 0, color: this.state.selectedValue === index ? EDColors.black : EDColors.text }]} title={item[1]} />
                                {item[0].add_ons_price != undefined
                                    ? <Text style={[style.txtStyle, { color: this.state.selectedValue === index ? EDColors.black : EDColors.text }]}>{this.props.currencySymbol + funGetFrench_Curr(item[0].add_ons_price, 1, this.props.lan)}</Text>
                                    : null}
                            </EDRTLView>
                        </RadioButton>
                    )
                })}
            </RadioGroup>
        )
    }

    checkComponentRender = () => {
        return (
            <View>

                {this.props.categorydata.addons_list.map((item, index) => {
                    return (
                        <TouchableOpacity
                            activeOpacity={1.0}
                            style={[style.checkView, { flexDirection: isRTLCheck() ? 'row-reverse' : 'row' }]}
                            onPress={() => this.onSubmit(index)}>
                            <MaterialIcon size={30} color={EDColors.primary} name={this.indexArray.includes(index) ? "check-box" : "check-box-outline-blank"} />
                            <EDRTLText style={[style.textStyle, { color: this.indexArray.includes(index) ? EDColors.black : EDColors.text }]} title={item.add_ons_name} />
                            {item.add_ons_price != undefined ?
                                <Text style={[style.checktxt, { color: this.indexArray.includes(index) ? EDColors.black : EDColors.text }]}>{this.props.currencySymbol + funGetFrench_Curr(item.add_ons_price, 1, this.props.lan)}</Text>
                                :
                                null}
                        </TouchableOpacity>
                    )
                })}
            </View>
        )
    }

    render() {
        return (
            <View style={this.props.style}>
                <Toast ref="toast" position="center" fadeInDuration={1} />
                {this.radioComponentRender()}
            </View>
        )
    }

    //#endregion

    //#region STATE
    state = {
        isChange: false,
        selectedValue: -1,
        quantity: []
    }

    onSelectedIndex = (value) => {
        this.category_Array = []
        this.category_Array.push(this.props.testData[value][0])
        this.CategoryDict.addons_list = this.category_Array
        this.CategoryDict.addons_category = this.props.testData[value][1],
            this.CategoryDict.addons_category_id = this.props.testData[value][2],
            this.props.onChangedata(this.CategoryDict)
        let temp = [];
        temp[value] = 1
        this.setState({
            selectedValue: value,
            quantity: temp
        })
    }

    onSubmit = (index) => {
        if (this.indexArray.includes(index)) {
            var indexs = this.indexArray.indexOf(index); // get index if value found otherwise -1
            this.indexArray.splice(indexs, 1);
            this.category_Array.splice(indexs, 1)
        } else {
            this.category_Array.push(this.props.categorydata.addons_list[index])
            this.indexArray.push(index)
        }
        this.CategoryDict.addons_list[0].quantity = this.state.quantity[index]
        this.CategoryDict.addons_list = this.category_Array
        this.props.onChangedata(this.CategoryDict)
        this.setState({
            isChange: !this.state.isChange
        })
    }
}

//#region STYLES
export const style = StyleSheet.create({
    textStyle: {
        flex: 1,
        marginHorizontal: 10,
        fontSize: getProportionalFontSize(14)
    },
    txtStyle: {
        fontFamily: EDFonts.medium,
        fontSize: getProportionalFontSize(14)
    },
    checkView: {
        flex: 1, paddingVertical: 10, paddingHorizontal: 30, alignItems: 'center',
        borderColor: EDColors.shadow,
        borderWidth: 0.5,
        shadowOpacity: 0.25,
        shadowRadius: 5,
        shadowColor: EDColors.text,
        shadowOffset: { height: 0, width: 0 }
    },
    checktxt: {
        fontSize: getProportionalFontSize(14)
    },
    radioView: {
        width: metrics.screenWidth * 0.78,
        justifyContent: 'space-between'
    },
    imgStyle: {
        tintColor: EDColors.primary
    },
    radioButtonItem: {
        paddingHorizontal: 30,
        borderColor: EDColors.shadow,
        borderWidth: 0.5,
        shadowOpacity: 0.25,
        shadowRadius: 5,
        shadowColor: EDColors.text,
        shadowOffset: { height: 0, width: 0 }
    }
})
//#endregion