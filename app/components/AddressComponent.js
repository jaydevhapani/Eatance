import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { EDFonts } from '../utils/EDFontConstants';
import { EDColors } from '../utils/EDColors';
import EDRTLView from './EDRTLView';
import EDRTLText from './EDRTLText';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { isRTLCheck, getProportionalFontSize } from '../utils/EDConstants';
import Metrics from '../utils/metrics';
import { Icon } from 'react-native-elements';

export default class AddressComponent extends React.PureComponent {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <TouchableOpacity
                style={[this.props.isSelected ? style.selected : style.default, { flexDirection: isRTLCheck() ? 'row-reverse' : 'row' }]}
                onPress={this.selectAddressHandler}
            >
                <View style={style.mainContainer}>

                    <EDRTLView style={{ width: Metrics.screenWidth * .85 }}>
                        <EDRTLView style={{ alignItems: 'center', flex: 1, marginBottom: 10 }}>
                            {this.props.data.is_main == "1" ?
                                <Icon name={"home"} color={EDColors.primary} size={20} containerStyle={{ marginEnd: 5 }} /> : null}
                            {/* ADDRESS */}
                            <EDRTLText
                                style={style.textStyle}
                                title={this.props.data.address}
                            />
                        </EDRTLView>
                        {this.props.isViewOnly ? null :
                            <>
                                {/* EDIT BUTTON */}
                                <MaterialIcon
                                    size={20}
                                    style={style.editIcon}
                                    color={EDColors.primary}
                                    onPress={this.editAddressHandler}
                                    name={'edit'} />

                                {/* DELETE BUTTON */}
                                <MaterialIcon
                                    size={20}
                                    color={EDColors.primary}
                                    onPress={this.deleteAddressHandler}
                                    name={'delete'} />
                            </>
                        }

                    </EDRTLView>

                    {/* LANDMARK */}
                    <EDRTLText
                        style={style.txtStyleLine2}
                        title={this.props.data.landmark}
                    />

                </View>
            </TouchableOpacity>
        )
    }

    //#region BUTTON EVENTS
    /** EDIT BUTTON EVENT */
    editAddressHandler = () => {
        this.props.editAddress(this.props.data, 2)
    }

    /** DELETE BUTTON EVENT */
    deleteAddressHandler = () => {
        this.props.deleteAddress(this.props.data.address_id)
    }

    /** ADDRESS SELECTION BUTTON EVENT */
    selectAddressHandler = () => {
        if (!this.props.isViewOnly)
            this.props.onPress(this.props.index)
    }
    //#endregion
}

export const style = StyleSheet.create({
    editIcon: { marginHorizontal: 10 },
    selected: {
        alignItems: "center",
        backgroundColor: EDColors.white,
        borderRadius: 5,
        padding: 5,
        borderWidth: 1,
        borderColor: EDColors.primary,
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10
    },
    default: {
        alignItems: "center",
        backgroundColor: EDColors.white,
        borderRadius: 5,
        padding: 5,
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        borderColor: EDColors.shadow, borderWidth: 1, shadowOpacity: 0.25, shadowRadius: 5, shadowColor: EDColors.text, shadowOffset: { height: 0, width: 0 }
    },
    textStyle: {
        fontSize: getProportionalFontSize(18),
        // marginBottom: 10,
        color: EDColors.primary,
        fontFamily: EDFonts.bold,
        flex: 1
    },
    txtStyleLine1: {
        color: EDColors.textAccount,
        fontSize: getProportionalFontSize(12),
        fontFamily: EDFonts.regular,
    },
    txtStyleLine2: {
        color: EDColors.text,
        fontSize: getProportionalFontSize(11),
        fontFamily: EDFonts.regular,
    },
    imageStyle: {
        width: widthPercentageToDP("4%"),
        height: widthPercentageToDP("4%")
    },
    mainContainer: {
        padding: 10
    },
    touchableStyle: {
        margin: 5
    }
})