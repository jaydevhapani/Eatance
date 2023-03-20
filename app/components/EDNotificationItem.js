/* eslint-disable jsx-quotes */
/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { EDFonts } from '../utils/EDFontConstants';
import EDRTLText from './EDRTLText';
import Assets from '../assets';
import { EDColors } from '../utils/EDColors';
import EDRTLView from './EDRTLView';
import { funGetDateStr, getProportionalFontSize, isRTLCheck } from '../utils/EDConstants';
import EDRTLImage from './EDRTLImage';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

export default class EDNotificationItem extends Component {

    //#region LIFE CYCLE METHODS
    constructor(props) {
        super(props);
    }

    /** RENDER METHOD */
    render() {

        return (
            //  PARENT CONTAINER
            <View style={styles.mainContainer}>

                {/* RTL CONTAINER */}
                <EDRTLView style={styles.childContainer}>

                    <MaterialIcon
                        size={20}
                        color={EDColors.primary}
                        name={'notifications-active'} />

                    {/* TITLE */}
                    <EDRTLText style={styles.titleStyle} title={this.props.notification.notification_title} />
                </EDRTLView>

                {/* DESCRIPTION */}
                <EDRTLText style={styles.descriptionStyle} title={this.props.notification.notification_description} />

                {/* DATE */}
                {/* <EDRTLText style={[styles.dateStyle, { alignSelf: isRTLCheck() ? 'flex-start' : 'flex-end' }]} title={funGetDateStr(this.props.notification.created_date)} /> */}

            </View >
        );
    }
    //#endregion
}

//#region STYLES
const styles = StyleSheet.create({
    mainContainer: {
        borderColor: EDColors.shadow,
        borderWidth: 1,
        borderRadius: 5,
        marginTop: 15,
        backgroundColor: EDColors.white,
        shadowOpacity: 0.25,
        shadowRadius: 5,
        shadowColor: EDColors.text,
        shadowOffset: { height: 0, width: 0 },
        flex: 1,
        paddingVertical: 10,
    },
    childContainer: { paddingHorizontal: 15 },
    languageContainer: {
        marginHorizontal: 15,
        flexDirection: 'row',
    },
    styleImage: { width: 20, height: 20, tintColor: EDColors.primary },
    titleStyle: {
        marginHorizontal: 10,
        color: EDColors.textAccount,
        fontFamily: EDFonts.bold,
        fontSize: getProportionalFontSize(16),
    },
    descriptionStyle: {
        marginHorizontal: 10,
        marginVertical: 5,
        color: EDColors.text,
        fontFamily: EDFonts.regular,
        fontSize: getProportionalFontSize(14),
    },
    dateStyle: {
        marginHorizontal: 10,
        color: EDColors.text,
        fontFamily: EDFonts.regular,
        fontSize: getProportionalFontSize(12),
        alignSelf: 'flex-end',
    },
});
//#endregion
