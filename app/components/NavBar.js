/* eslint-disable prettier/prettier */
'use strict';

import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform, Text, StatusBar } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { EDColors } from '../utils/EDColors';
import { EDFonts } from '../utils/EDFontConstants';
import EDRTLView from './EDRTLView';
import { getProportionalFontSize } from '../utils/EDConstants';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import DeviceInfo from 'react-native-device-info';
import { Icon } from 'react-native-elements'

export default class NavBar extends Component {
  render() {
    return (
      <View style={styles.parentContainer}>

        {/* STATUS BAR */}
        <StatusBar barStyle="light-content" backgroundColor={EDColors.primary} />

        <EDRTLView style={styles.contentContainer}>

          {/* LEFT BUTTONS */}
          <EDRTLView style={styles.leftContainer}>
            {this.props.left ?
              <EDRTLView style={styles.leftSubContainer}>
                <TouchableOpacity style={styles.leftButton}
                  onPress={this.props.onLeft}>
                  <Icon type={this.props.iconFamily || 'material'} size={25}
                    name={this.props.left} color={EDColors.white} />
                </TouchableOpacity>
              </EDRTLView>
              : null}
          </EDRTLView>

          {/* TITLE */}
          <View style={[styles.titleContainer]}>
            <Text numberOfLines={2} style={styles.titleTextStyle}>
              {(this.props.title || '')}
            </Text>
          </View>

          {/* RIGHT BUTTONS */}
          <EDRTLView style={styles.leftContainer}>
            {this.props.right
              ? <EDRTLView style={styles.rightSubContainer}>
                <TouchableOpacity
                  style={[styles.rightButton]}
                  onPress={this.props.onRight}>
                  <Icon type={this.props.iconFamily || 'font-awesome'} size={20}
                    name={this.props.right} color={EDColors.white} />
                </TouchableOpacity>
              </EDRTLView>
              : null}
          </EDRTLView>
        </EDRTLView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  parentContainer: { marginTop: DeviceInfo.hasNotch() ? -1 * (Platform.OS == 'ios' ? getStatusBarHeight() : hp('5%')) : -20, height: hp('10%'), backgroundColor: EDColors.primary },
  contentContainer: { paddingTop: Platform.OS === 'ios' ? (DeviceInfo.hasNotch() ? 36 : 20) : StatusBar.currentHeight, flex: 1 },
  leftContainer: { flex: 1 },
  leftSubContainer: { marginLeft: 10, alignItems: 'center' },
  leftButton: { justifyContent: 'center', height: 40, width: 40, alignContent: 'center', alignItems: 'center' },
  leftImage: { tintColor: EDColors.white, alignSelf: 'center', height: 25, width: 25 },
  titleContainer: { flex: 4, justifyContent: 'center', marginLeft: 10, marginRight: 10, alignItems: 'center' },
  titleTextStyle: { fontFamily: EDFonts.bold, fontSize: getProportionalFontSize(19), color: EDColors.white, textAlign: 'center' },
  rightSubContainer: { justifyContent: 'flex-end', flex: 2, marginRight: 10, alignItems: 'center' },
  rightButton: { height: 40, width: 40, flexDirection: 'row', marginRight: 5, alignItems: 'center', justifyContent: 'center' },
  rightImage: { tintColor: EDColors.white, height: 25, width: 25, alignSelf: 'center', marginLeft: 10 },
});