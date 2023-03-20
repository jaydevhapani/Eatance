import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import BaseContainer from './BaseContainer';
import { netStatus } from '../utils/NetworkStatusConnection';
import { getPromocode } from '../utils/ServiceManager';
import { showNoInternetAlert } from '../utils/EDAlert';
import { strings } from '../locales/i18n';
import { connect } from 'react-redux';
import {
    debugLog,
    isRTLCheck,
    getProportionalFontSize,
} from '../utils/EDConstants';
import { EDColors } from '../utils/EDColors';
import { EDFonts } from '../utils/EDFontConstants';
import EDPlaceholderComponent from '../components/EDPlaceholderComponent';
import PromoCodeComponent from '../components/PromoCodeComponent';

class PromoCodeContainer extends React.PureComponent {
    constructor(props) {
        super(props);

        this.strOnScreenTitle = ''
        this.strOnScreenMessage = ''
        this.promoCodeArray = [];
        this.subTotal = this.props.navigation.state.params.subTotal;
    }

    promoCodeComponentRender = ({ item }) => {
        return (
            <PromoCodeComponent
                item={item}
                onPressHandler={() => this.getDataToPrevious(item)}
            />
        );
    };

    render() {
        return (
            <BaseContainer
                title={strings("promoCode.title")}
                loading={this.state.isLoading}
                left={'arrow-back'}
                onLeft={this.navigationToBack}>

                {this.promoCodeArray.length > 0 ?
                    <FlatList
                        pointerEvents={this.state.isLoading ? 'none' : 'auto'}
                        data={this.promoCodeArray}
                        renderItem={this.promoCodeComponentRender}
                        keyExtractor={(item, index) => item + index}
                    />
                    : this.strOnScreenTitle.length > 0 ?
                        <EDPlaceholderComponent title={this.strOnScreenTitle} subTitle={this.strOnScreenMessage} /> : null}
            </BaseContainer>
        );
    }

    //#endregion

    //#region STATE

    state = {
        isLoading: false,
        getPromoDetail: this.props.navigation.state.params.getPromoCodeData,
    };

    componentDidMount() {
        this.getAllPromoCode();
    }

    //#region NETWORK METHODS

    /**
     *
     * @param {The success response object} objSuccess
     */

    onPromoSuccess = objSuccess => {
        this.strOnScreenTitle = ''
        this.strOnScreenMessage = ''
        this.promoCodeArray = objSuccess.data.coupon_list;
        this.setState({ isLoading: false });
    };

    /**
     *
     * @param {The success response object} objSuccess
     */

    onPromoFailure = objFailure => {
        this.strOnScreenTitle = strings('promoCode.noPromoCodeTitle');
        this.strOnScreenMessage = strings('promoCode.noPromoCodeMessage');
        this.setState({ isLoading: false });
    };

    /**
     * @param {The call API for get PromoCode data}
     */

    getAllPromoCode = () => {
        netStatus(isConnected => {
            if (isConnected) {
                let objPromoCodeParams = {
                    language_slug: this.props.lan,
                    user_id: this.props.UserID,
                    subtotal: this.subTotal,
                    store_id: this.props.cartDetail.store_id,
                };
                this.setState({ isLoading: true });
                getPromocode(objPromoCodeParams, this.onPromoSuccess, this.onPromoFailure, this.props);
            } else {
                showNoInternetAlert();
            }
        });
    };

    navigationToBack = () => {
        this.props.navigation.goBack();
    };

    getDataToPrevious(item) {
        if (this.state.getPromoDetail !== undefined) {
            this.state.getPromoDetail(item.name);
        }
        this.navigationToBack();
    }
}

export default connect(
    state => {
        return {
            lan: state.userOperations.lan,
            UserID: state.userOperations.userDetails.UserID,
            cartDetail: state.checkoutReducer.cartDetails,
        };
    },
    () => {
        return {
        };
    },
)(PromoCodeContainer);

const style = StyleSheet.create({
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
    txtColor: {
        color: EDColors.primary,
        marginHorizontal: 10,
        fontFamily: EDFonts.bold, fontSize: getProportionalFontSize(16)
    },
    btnStyle: {
        paddingVertical: 5,
        borderRadius: 30,
        marginHorizontal: 10,
    },
    btntxtStyle: {
        marginVertical: 0,
        marginHorizontal: 15,
        fontSize: getProportionalFontSize(12),
    },
    linetxtStyle: {
        fontFamily: EDFonts.regular,
        color: EDColors.primary,
        fontSize: getProportionalFontSize(12),
    },
    lineBtnStyle: {
        borderBottomColor: EDColors.primary,
        alignSelf: isRTLCheck() ? 'flex-end' : 'flex-start',
        marginTop: 5,
    },
    valueText: { color: EDColors.text, margin: 10, marginTop: 5 }
});
