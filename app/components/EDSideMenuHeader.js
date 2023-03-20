import React, { Component } from 'react';
import { Image, TouchableOpacity, StyleSheet, View } from 'react-native';
import { EDFonts } from '../utils/EDFontConstants';
import Metrics from '../utils/metrics';
import EDRTLText from './EDRTLText';
import Assets from '../assets';
import { strings } from '../locales/i18n';
import { capiString, getProportionalFontSize } from '../utils/EDConstants';
import EDRTLView from './EDRTLView';
import { EDColors } from '../utils/EDColors';
import EDImage from './EDImage';

export default class EDSideMenuHeader extends Component {
    render() {
        return (
            <View>
                {/* BACKGROUND IMAGE */}
                <Image style={styles.bgImage}
                    source={Assets.bg_login}
                    defaultSource={Assets.bg_login}
                />

                {/* MAIN CONTAINER */}
                <View style={styles.mainContainer}>

                    {/* PROFILE DETAILS CONTAINER */}
                    <View style={[styles.bgImage, { justifyContent: 'center' }]}>
                        <TouchableOpacity style={styles.touchableContainer} onPress={this.props.onProfilePressed}>
                            <EDRTLView>

                                {/* PROFILE IMAGE */}
                                <View style={styles.profileImageContainer}>
                                    <EDImage
                                        source={this.props.userDetails.image} style={styles.profileImage} />
                                </View>

                                {/* NAME AND EMAIL DETAILS */}
                                <View style={styles.profileDetailsContainer}>
                                    {/* FULL NAME */}
                                    <EDRTLText
                                        style={styles.fullName}
                                        title={this.props.userDetails !== undefined && this.props.userDetails.FirstName !== undefined && this.props.userDetails.FirstName.trim() !== ''
                                            ? capiString(this.props.userDetails.FirstName + ' ' + this.props.userDetails.LastName).trim()
                                            : strings('sidebarNew.guest')} />

                                    {/* EMAIL */}
                                    {this.props.userDetails.Email
                                        ? <EDRTLText
                                            style={styles.email}
                                            title={this.props.userDetails.Email} />
                                        : null}
                                </View>
                            </EDRTLView>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

// #region STYLE SHEET
const styles = StyleSheet.create({
    bgImage: {
        width: '100%',
        height: (Metrics.screenWidth * 216) / 414,
    },
    mainContainer: {
        position: 'absolute', width: '100%',
        height: (Metrics.screenWidth * 216) / 414,
        top: 0,
        left: 0, alignItems: 'center', justifyContent: 'center',
        // borderColor: 'red',
        // borderWidth: 1
    },
    touchableContainer: {
        margin: 10,
        // borderColor: 'purple',
        // borderWidth: 2,
    },
    profileImageContainer: {
        borderWidth: 2,
        borderColor: EDColors.white,
        width: Metrics.screenWidth * 0.2,
        height: Metrics.screenWidth * 0.2,
        backgroundColor: EDColors.white,
        borderRadius: Metrics.screenWidth * 0.1,
        overflow: 'hidden'
    },
    profileImage: {
        width: '100%',
        height: '100%',
        backgroundColor: EDColors.transparent,
        borderRadius: Metrics.screenWidth * 0.1,
        overflow: 'hidden'
    },
    profileDetailsContainer: { marginHorizontal: 5, flex: 1, justifyContent: 'center' },
    fullName: { fontFamily: EDFonts.bold },
    email: { fontSize: getProportionalFontSize(14) }
})
// #endregion

// #region REDUX
// export default connect(
//     state => {
//         return {
//             titleSelected: state.navigationReducer.selectedItem,
//             userDetails: state.userOperations.userDetails,
//             isLoggedIn: state.userOperations.isLoggedIn,
//             lan: state.userOperations.lan,
//         };
//     },
//     dispatch => {
//         return {
//             saveNavigationSelection: dataToSave => {
//                 dispatch(saveNavigationSelection(dataToSave));
//             },
//             saveUserDetailsInRedux: detailsToSave => {
//                 dispatch(saveUserDetailsInRedux(detailsToSave));
//             },
//             saveCartCount: data => {
//                 dispatch(saveCartCount(data));
//             }

//         };
//     }
// )(EDSideMenuHeader);
// #endregion
