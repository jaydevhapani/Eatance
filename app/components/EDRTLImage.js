
import React from 'react'
import { View, Image } from 'react-native'
import { strings, isRTL } from "../locales/i18n";
import { isRTLCheck } from '../utils/EDConstants';


export default class EDRTLImage extends React.Component {

    render() {
        return (<Image
            source={this.props.source}
            resizeMode={this.props.resizeMode || 'contain'}
            style={[{ transform: [{ scaleX: isRTLCheck() ? -1 : 1 }] }, this.props.style]}
        />)
    }
}