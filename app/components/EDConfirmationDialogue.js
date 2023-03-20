import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { EDFonts } from '../utils/EDFontConstants'
import { strings } from '../locales/i18n'
import EDRTLView from '../components/EDRTLView'
import EDButton from './EDButton'
import { getProportionalFontSize } from '../utils/EDConstants'

export default class EDConfirmationDialogue extends React.Component {
    render() {
        return (
            <View
                pointerEvents={this.props.isLoading ? 'none' : 'auto'}
                style={styles.modalContainer}>
                <View style={styles.modalSubContainer}>

                    {/* TITLE */}
                    <Text style={styles.deleteTitle}>
                        {this.props.title || ''}
                    </Text>

                    {/* BUTTONS CONTAINER */}
                    <EDRTLView style={styles.optionContainer}>

                        {/* YES BUTTON */}
                        <EDButton label={strings('buttonTitles.yes')} style={styles.deleteOption} textStyle={styles.marginVerticalZero} onPress={this.props.onYesClick} />

                        {/* NO BUTTON */}
                        <EDButton label={strings('buttonTitles.no')} style={styles.deleteOption} textStyle={styles.marginVerticalZero} onPress={this.props.onNoClick} />

                    </EDRTLView>
                </View>
            </View>
        )
    }
}

//#region STYLES
const styles = StyleSheet.create({
    marginVerticalZero: { marginVertical: 0 },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.25)'
    },
    modalSubContainer: {
        backgroundColor: '#fff',
        padding: 10,
        marginLeft: 20,
        marginRight: 20,
        borderRadius: 6,
        marginTop: 20,
        marginBottom: 20
    },
    deleteTitle: {
        fontFamily: EDFonts.bold,
        fontSize: getProportionalFontSize(14),
        color: '#000',
        marginTop: 10,
        alignSelf: 'center',
        textAlign: 'center',
        marginLeft: 20,
        marginRight: 20,
        padding: 10
    },
    optionContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20
    },
    deleteOption: {
        fontFamily: EDFonts.bold,
        fontSize: getProportionalFontSize(14),
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 30,
        paddingRight: 30,
        margin: 10,
    }
})
//#endregion