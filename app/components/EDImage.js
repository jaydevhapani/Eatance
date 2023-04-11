import React from 'react';
import {Image} from 'react-native';
import FastImage from 'react-native-fast-image';
import Assets from '../assets';

export default class EDImage extends React.PureComponent {
  render() {
    return this.props.source !== undefined &&
      this.props.source !== null &&
      this.props.source.trim().length > 0 ? (
      <FastImage
        style={[this.props.style, {overflow: 'hidden'}]}
        source={{
          uri: this.props.source,
          priority: FastImage.priority.normal,
        }}
        fallback={true}
        resizeMode={this.props.resizeMode || FastImage.resizeMode.cover}
      />
    ) : (
      <Image
        style={[this.props.style, {overflow: 'hidden'}]}
        resizeMode={this.props.resizeMode || 'contain'}
        defaultSource={this.props.placeholder || Assets.logo_pin_transparent}
        source={this.props.placeholder || Assets.logo_pin_transparent}
      />
    );
  }
}
