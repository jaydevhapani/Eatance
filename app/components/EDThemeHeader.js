import React, {Component} from 'react';
import {
  Image,
  TouchableOpacity,
  StyleSheet,
  View,
  Platform,
  SafeAreaView,
} from 'react-native';
import {EDFonts} from '../utils/EDFontConstants';
import Metrics from '../utils/metrics';
import EDRTLText from './EDRTLText';
import Assets from '../assets';
import {strings} from '../locales/i18n';
import DeviceInfo from 'react-native-device-info';
import {EDColors} from '../utils/EDColors';
import {isRTLCheck, getProportionalFontSize} from '../utils/EDConstants';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

export default class EDThemeHeader extends Component {
  render() {
    return (
      <View>
        <Image style={styles.imageBackground} source={Assets.bg_login} />
        <SafeAreaView style={styles.backButtonContainer}>
          <View
            style={[
              // styles.backButtonContainer,
              {alignItems: isRTLCheck() ? 'flex-end' : 'flex-start'},
            ]}>
            <TouchableOpacity
              onPress={() =>
                this.props.onLeftButtonPress && this.props.onLeftButtonPress()
              }>
              <MaterialIcon
                size={25}
                color={EDColors.white}
                name={this.props.icon || 'arrow-back'}
              />
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        <View style={styles.welcomeContainer}>
          <EDRTLText
            style={styles.welcomeText}
            title={strings('login.welcome')}
          />
          <EDRTLText style={styles.titleText} title={this.props.title} />
        </View>
      </View>
    );
  }
}

export const styles = StyleSheet.create({
  imageBackground: {
    width: Metrics.screenWidth,
    height: (Metrics.screenWidth * 216) / 414,
  },
  backButtonContainer: {
    position: 'absolute',
    marginHorizontal: 20,
    top: DeviceInfo.hasNotch() && Platform.OS === 'ios' ? 44 : 20,
    width: Metrics.screenWidth - 40,
  },
  welcomeContainer: {
    position: 'absolute',
    marginHorizontal: 20,
    bottom: '20%',
    width: Metrics.screenWidth - 40,
  },
  welcomeText: {
    fontFamily: EDFonts.light,
    fontSize: getProportionalFontSize(16),
    color: EDColors.white,
  },
  titleText: {
    fontFamily: EDFonts.bold,
    fontSize: getProportionalFontSize(28),
    color: EDColors.white,
  },
});
