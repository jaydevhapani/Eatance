'use strict';

import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

const Metrics = {
  screenWidth: width,
  screenHeight: height,
  actualScreenheight : Dimensions.get("screen").height,
  statusbarHeight: Platform.OS === 'ios' ? 20 : 0,
  navbarHeight: 70,
  padding: 10,
  bottomButtonWidth: width - 20,
  avatarWidth: 60,
  spinnerSize: width * 0.5,
};

export default Metrics;
