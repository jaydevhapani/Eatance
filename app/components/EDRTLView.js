import React from 'react';
import { View } from 'react-native';
import { isRTLCheck } from '../utils/EDConstants';

export default class EDRTLView extends React.Component {
  render() {
    return (
      <View
        pointerEvents={this.props.pointerEvents || 'auto'}
        opacity={this.props.opacity || 1}
        style={[{ flexDirection: isRTLCheck() ? 'row-reverse' : 'row' }, this.props.style]}>
        {this.props.children}
      </View>
    )
  }
}
