import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { EDFonts } from '../utils/EDFontConstants';
import EDRTLText from './EDRTLText';
import { EDColors } from '../utils/EDColors';
import EDRTLView from './EDRTLView';
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button';
import { debugLog, arrayLanguages, isRTLCheck } from '../utils/EDConstants';
import { saveLanguage } from '../utils/AsyncStorageHelper';
import I18n from 'react-native-i18n';
import RNRestart from 'react-native-restart'; // Import package from node modules
import EDRTLImage from './EDRTLImage';
import { userLanguage } from '../utils/ServiceManager';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

export default class EDAccountItem extends Component {

    //#region LANGUAGE SELECTION
    /**
     * 
     * @param {The index of the language selected from the list} index
     * @param {The value assigned to each radio button to get the selected value} value
     */
    onLanguageSelection = (index, value) => {
        I18n.locale = value;
        saveLanguage(value, this.onSuccessLanguageSelection, this.onFailureLanguageSelection);
        this.setUserLanguage(value)
    }

    onSuccessLanguageSelection = () => {

    }

    onFailureLanguageSelection = () => {

    }
    //#endregion

    //#region LIFE CYCLE METHODS
    constructor(props) {
        super(props);
        this.selectedLanguageIndex = 0;
    }
    /** DID MOUNT */
    componentDidMount() {

    }

    /** RENDER METHOD */
    render() {
        this.selectedLanguageIndex = arrayLanguages.map(languageToIterate => languageToIterate.code).indexOf(I18n.currentLocale());

        return (
            //  PARENT CONTAINER
            <View style={styles.mainContainer}>
                {/* TOUCHABLE CONTAINER  */}
                <TouchableOpacity onPress={this.onPressHandler} disabled={this.props.isForLanguage} style={styles.touchableContainer}>
                    {/* RTL CONTAINER */}
                    <EDRTLView style={styles.childContainer}>
                        <EDRTLImage
                            style={[styles.styleImage]}
                            source={this.props.icon}
                            resizeMode='contain'
                        />
                        {/* TITLE */}
                        <EDRTLText style={styles.textStyle} title={this.props.title} />

                        {/* HIDE ARROW FOR LANGUAGE */}
                        {this.props.isForLanguage
                            ? null
                            : <MaterialIcon size={20} color={EDColors.textAccount} name={'keyboard-arrow-right'} />}

                    </EDRTLView>
                </TouchableOpacity>

                {/* RENDER LANGUAGES */}
                {this.props.isForLanguage
                    ? <EDRTLView style={[styles.languageContainer, { alignSelf: isRTLCheck() ? 'flex-end' : 'flex-start' }]}>
                        <RadioGroup color={EDColors.homeButtonColor} onSelect={this.onLanguageSelection} selectedIndex={this.selectedLanguageIndex}>
                            {arrayLanguages.map((languageToIterate) => (
                                <RadioButton style={{ flexDirection: isRTLCheck() ? 'row-reverse' : 'row' }} value={languageToIterate.code} >
                                    <EDRTLText style={styles.languageTextStyle} title={languageToIterate.title} />
                                </RadioButton>
                            ))}
                        </RadioGroup>
                    </EDRTLView>
                    : null}
            </View >
        );
    }
    //#endregion

    /**
     *
     * @param {The call API for get Product data}
     */
    setUserLanguage = (value) => {
        if (!this.props.isLoggedIn) {
            this.onSuccessUserLanguage();
            return;
        }
        let objUserLanguageParams = {
            user_id: this.props.UserID,
            language_slug: value
        };

        userLanguage(
            objUserLanguageParams,
            this.onSuccessUserLanguage,
            this.onFailureUserLanguage,
            this.props,
        )
    }

    //#region NETWORK METHODS
    /**
    *
    * @param {The success response object} objSuccess
    */
    onSuccessUserLanguage = () => {
        RNRestart.Restart();
    }

    /**
    *
    * @param {The failure response object} objFailure
    */
    onFailureUserLanguage = () => {
        RNRestart.Restart();
    }
    //#region
    /** BUTTON EVENTS */
    onPressHandler = () => {
        if (this.props.onPress !== undefined) {
            this.props.onPress(this.props.title);
        }
    }
    //#endregion
}

//#region STYLES
const styles = StyleSheet.create({
    mainContainer: {
        borderColor: EDColors.shadow,
        borderWidth: 1,
        borderRadius: 5, marginTop: 15,
        alignItems: 'center',
        backgroundColor: EDColors.white,
        shadowOpacity: 0.25,
        shadowRadius: 5,
        shadowColor: EDColors.text,
        shadowOffset: { height: 0, width: 0 },
    },
    touchableContainer: { alignItems: 'center' },
    childContainer: { padding: 15, alignItems: 'center' },
    languageContainer: {
        marginHorizontal: 15,
        flexDirection: 'row',
    },
    languageTextStyle: {
        marginHorizontal: 10,
        color: EDColors.text,
        fontWeight: '500',
    },
    styleImage: { width: 20, height: 20 },
    styleArrow: {
        tintColor: EDColors.textAccount,
    },
    textStyle: {
        marginHorizontal: 10,
        flex: 1,
        color: EDColors.textAccount,
        fontFamily: EDFonts.bold,
    },
});
//#endregion