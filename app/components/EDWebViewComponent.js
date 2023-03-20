import React from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import { EDColors } from '../utils/EDColors';
import { EDFonts } from '../utils/EDFontConstants';
import { strings } from '../locales/i18n';
import { debugLog, getProportionalFontSize } from '../utils/EDConstants';
import EDThemeButton from './EDThemeButton';
import { netStatus } from '../utils/NetworkStatusConnection';
import { getCMSPageDetails } from '../utils/ServiceManager';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Assets from '../assets';
import EDRTLView from './EDRTLView';
import EDRTLText from './EDRTLText';
import Metrics from '../utils/metrics';
import EDProgressLoader from './EDProgressLoader';
import WebView from 'react-native-webview';

export default class EDWebViewComponent extends React.Component {
    //#region LIFE CYCLE METHODS
    constructor(props) {
        super(props);
        this.fontSize = getProportionalFontSize(14);
        this.meta =
            '<head><meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0"></head>';
        this.customStyle =
            this.meta +
            '<style>* {max-width: 100%;} body {font-size:' +
            this.fontSize +
            ';color:white}</style>';
    }

    state = {
        webViewContent: undefined,
        strErrorMessage: '',
        webViewOpacity: 0
    }

    componentDidMount() {
        this.getCMSContent();
    }

    render() {

        return (
            <View style={styles.modalContainer} >
                <View style={styles.modalSubContainer}>
                    <ImageBackground style={styles.imageBg} source={Assets.bg_without_logo} defaultSource={Assets.bg_without_logo}>

                        {/* LOADER */}
                        {this.state.isLoading
                            ? <EDProgressLoader spinnerColor={EDColors.white} style={{ backgroundColor: EDColors.transparent, alignSelf: 'center' }} />
                            : this.state.webViewContent == undefined
                                ? <View style={styles.paddingContainer}>
                                    <MaterialIcon style={styles.alignFlexEnd} onPress={this.props.onDismissHandler} size={20} color={EDColors.white} name={'close'} />
                                    <EDRTLText title={this.state.strErrorMessage} style={styles.parentFlex} />
                                </View>
                                : <View style={styles.paddingContainer}>

                                    <EDRTLView style={styles.justifySpaceBetween}>
                                        <EDRTLText title={this.state.webViewContent.name} style={{ fontFamily: EDFonts.bold, fontSize: getProportionalFontSize(18) }} />
                                        <MaterialIcon style={styles.alignFlexEnd} onPress={this.props.onDismissHandler} size={20} color={EDColors.white} name={'close'} />
                                    </EDRTLView>

                                    <WebView
                                        source={{ html: this.customStyle + (this.state.webViewContent.description || '') }}
                                        containerStyle={{ flex: 1, backgroundColor: EDColors.transparent }}
                                        width={Metrics.screenWidth - 70}
                                        startInLoadingState={false}
                                        style={[styles.webView, { flex: 1, backgroundColor: EDColors.transparent }]}
                                        scrollEnabled={true}
                                    />


                                    <EDRTLView style={{ justifyContent: 'center', alignItems: 'center', height: '10%' }}>
                                        <EDThemeButton
                                            textStyle={{ margin: 0, fontSize: getProportionalFontSize(14), color: EDColors.black }}
                                            style={{ margin: 0, width: '40%', height: '60%', backgroundColor: EDColors.secondary, borderRadius: 5 }}
                                            label={strings('buttonTitles.agree')}
                                            onPress={this.buttonAgreePressed}
                                        />
                                    </EDRTLView>
                                </View>
                        }

                    </ImageBackground>

                </View>
            </View >
        );
    }


    //#region BUTTON EVENTS
    buttonAgreePressed = () => {
        if (this.props.onAcceptPressHandler !== undefined) {
            this.props.onAcceptPressHandler();
        }
    }
    //#endregion

    //#region NETWORK
    /** FETCH CMS CONTENT API CALL */
    getCMSContent() {
        if (this.props.cmsSlug == undefined || this.props.cmsSlug == null) {
            return;
        }
        netStatus(status => {
            if (status) {
                this.setState({ isLoading: true, webViewContent: '', strErrorMessage: '' });
                let paramsGetCMS = {
                    language_slug: this.props.lan,
                    cms_slug: this.props.cmsSlug,
                };
                getCMSPageDetails(paramsGetCMS, this.onSuccessCMSPage, this.onFailureCMSPage, this.props);

            } else {
                this.setState({ isLoading: false, strErrorMessage: strings('generalNew.noInternet') });
            }
        });
    }

    /**
     *
     * @param {The success response object parsed from CMS API response} objSuccess
     */
    onSuccessCMSPage = objSuccess => {
        if (objSuccess.data !== undefined && objSuccess.data.cmsData !== undefined && objSuccess.data.cmsData.length > 0) {
            var cmsData = objSuccess.data.cmsData[0];
            this.setState({ isLoading: false, webViewContent: cmsData, strErrorMessage: '' });
        } else {
            this.setState({ isLoading: false, strErrorMessage: objSuccess.message });
        }
    };

    /**
     *
     * @param {The failure response object parsed from CMS API response} objFailure
     */
    onFailureCMSPage = objFailure => {
        this.setState({ isLoading: false, webViewContent: undefined, strErrorMessage: objFailure.message });
    };
    //#endregion
}

const styles = StyleSheet.create({
    alignFlexEnd: { alignSelf: 'flex-end' },
    imageBg: { flex: 1, borderRadius: 10, overflow: 'hidden' },
    parentFlex: { flex: 1 },
    paddingContainer: { flex: 1, padding: 20 },
    justifySpaceBetween: { justifyContent: 'space-between' },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        // backgroundColor: EDColors.transparent,
        backgroundColor: 'rgba(0,0,0,0.25)',
    },
    modalSubContainer: {
        flex: 1,
        backgroundColor: EDColors.palePrimary,
        margin: 20,
        marginVertical: Metrics.screenWidth * 0.125,
        borderRadius: 10,
        backgroundColor: EDColors.primary,
        overflow: 'hidden'
    },
    optionContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    webView: {
        flex: 1, margin: 10, alignSelf: 'center',
        backgroundColor: EDColors.transparent,
    },
});
