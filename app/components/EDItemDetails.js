/* eslint-disable react/no-string-refs */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import { Spinner } from 'native-base'
import React from 'react'
import { Alert, Dimensions, Linking, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Icon } from 'react-native-elements'
import WebView from 'react-native-webview'
import { strings } from '../locales/i18n'
import { EDColors } from '../utils/EDColors'
import { debugLog, getProportionalFontSize } from '../utils/EDConstants'
import { EDFonts } from '../utils/EDFontConstants'
import metrics from '../utils/metrics'
import EDImage from './EDImage'
import EDRTLText from './EDRTLText'
import EDRTLView from './EDRTLView'
import EDThemeButton from './EDThemeButton'


export default class EDItemDetails extends React.Component {

    constructor(props) {
        super(props)

        this.fontSize = Platform.OS == "ios" ? "14px" : "14px";
        this.meta = '<head><meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0"></head>';
        this.customStyle =
            this.meta +
            "<style>* {max-width: 100%;} body {font-size:" +
            this.fontSize +
            ";}</style>";
        this.quantity = 0
    }

    state = {
        quantity: 0,
        cartLoading: false,
        cartData: [],
        count: 0
    }


    componentDidMount() {
        this.setState({
            cartData: this.props.cartData,
        })
        this.state.cartData.map((value) => {
            if (value.menu_id === this.props.data.menu_id && value.quantity >= 1) {
                this.quantity = parseInt(this.quantity) + parseInt(value.quantity)
            }
        })
        this.setState({
            quantity: this.quantity
        })

    }

    componentWillReceiveProps(props) {
        debugLog("RECIVED PROPS ::::", props.cartData)
        this.setState({
            cartData: props.cartData,
            cartLoading: false
        })
    }


    render() {
        debugLog("INGREDIENTS :::::", this.props.data)
        let count = 0
        let same_item_incart = this.state.cartData.filter(item => { return item.menu_id === this.props.data.menu_id })
        if (same_item_incart !== undefined && same_item_incart !== null && same_item_incart.length !== 0) {
            same_item_incart.map(data => {
                count = count + data.quantity
            })
        }

        return (
            <View style={style.modalContainer}>
                <View style={style.modalSubContainer}>
                    <EDRTLView>
                        <EDRTLText
                            style={style.textStyle}
                            numberOfLines={2}
                            html={this.props.html}
                            title={this.props.data.name} />

                        <TouchableOpacity
                            onPress={this.props.onDismissHandler}>
                            <Icon
                                name={"close"}
                                size={20}
                                color={EDColors.primary}
                                containerStyle={{ margin: 10 }}
                            />
                        </TouchableOpacity>
                    </EDRTLView>

                    <EDImage
                        source={this.props.data.image}
                        style={style.imageStyle}
                    />
                    {this.props.data.menu_detail !== undefined && this.props.data.menu_detail !== null && this.props.data.menu_detail.trim().length !== 0
                        ?
                        <View>
                            <EDRTLText title={strings("productDetailsNew.title")} style={style.normalText} />

                            <EDRTLText title={this.props.data.menu_detail} style={style.detailText} />
                        </View>
                        : null}

                    {this.state.cartLoading ?
                        <Spinner size="small" color={EDColors.primary} style={{ height: 37 }} /> :
                                <EDThemeButton
                                    style={{marginBottom: 10}}
                                    label={strings("productDetailsNew.addToCart")}
                                    onPress={this.props.onPress}
                                /> }
                </View>
            </View>
        )
    }

    onPressAddtoCartHandler = (qty) => {
        this.setState({ cartLoading: true })
        if ((this.props.data.is_customize === "1" || this.props.data.is_customize === 1) && qty == -1)
            this.props.navigateToCart()
        else {
            this.props.onPress(this.props.data, qty)
            // this.setState({ quantity: this.state.quantity + qty })
        }
    }
    //R.K 07-01-2021 Open email
    openEmail = (email) => {
        Linking.openURL(email.url).catch(er => {
            Alert.alert("Failed to open Link: " + er.message);

        });
        this.setState({ count: this.state.count + 1 })
    }
}

const style = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.50)"
    },
    modalSubContainer: {
        backgroundColor: "#fff",
        padding: 10,
        marginLeft: 20,
        marginRight: 20,
        borderRadius: 6,
        width: Dimensions.get("window").width - 40,
        marginTop: 20,
        marginBottom: 20
    },
    textStyle: {
        flex: 1,
        alignSelf: "center",
        textAlign: "center",
        fontFamily: EDFonts.bold,
        color: "#000",
        fontSize: getProportionalFontSize(17)
    },
    detailText: {
        fontFamily: EDFonts.regular,
        color: "#000",
        fontSize: getProportionalFontSize(14),
        marginTop: 5
    },
    normalText: {
        fontFamily: EDFonts.bold,
        color: "#000",
        fontSize: getProportionalFontSize(15),
        marginVertical: 5,
        textDecorationLine: "underline",
        marginTop: 10
    },
    imageStyle: {
        width: "100%",
        height: metrics.screenHeight * 0.225,
        marginTop: 10,
        borderRadius: 6,
        resizeMode: 'center'
    },
    qtyContainer: {
        alignItems: "center",
        marginTop: 15,
        alignSelf: "center"
    },
    qtyText: {
        fontFamily: EDFonts.regular,
        fontSize: getProportionalFontSize(18),
        marginHorizontal: 10
    }
})