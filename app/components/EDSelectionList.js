/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import { FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import EDRTLText from './EDRTLText';
import Assets from '../assets';
import { EDColors } from '../utils/EDColors';
import EDRTLImage from './EDRTLImage';
import EDRTLView from './EDRTLView';
import EDPlaceholderComponent from './EDPlaceholderComponent';
import { Icon } from 'react-native-elements'

export class EDSelectionItem extends React.Component {

    //#region LIFE CYCLE METHODS
    /** SHOULD COMPONENT UPDATE */
    shouldComponentUpdate(newProps, nextState) {
        if (newProps.isSelected !== undefined && newProps.isSelected !== this.props.isSelected) {
            this.setState({ isSelected: newProps.isSelected });
            return true;
        }
        else if (newProps.selectedIDs !== this.props.selectedIDs) {
            this.setState({
                isSelected: (newProps.selectedIDs || []).includes(newProps.value.entity_id)
            });
        }
        return true;
    }

    /** RENDER */
    render() {
        return (
            <TouchableOpacity onPress={this.onPress} style={styles.touchableContainer}>
                <EDRTLView style={styles.mainContainer}>
                    <EDRTLText style={styles.title} title={this.props.value.name} />
                    <Icon
                        size={20}
                        name={this.state.isSelected ? 'check-box' : 'check-box-outline-blank'}
                        color={EDColors.white} />
                </EDRTLView>
            </TouchableOpacity >

        );
    }
    //#endregion

    //#region ON PRESS EVENTS
    onPress = () => {
        if (this.props.onSelection !== undefined) {
            this.props.onSelection(this.props.index, this.props.value);
        }
        this.setState({ isSelected: !this.state.isSelected });
    }
    //#endregion

    //#region STATE
    state = {
        isSelected: this.props.isSelected !== undefined
            ? this.props.isSelected
            : this.props.selectedIDs.includes(this.props.value.entity_id),
    }
    //#endregion
}

export default class EDSelectionList extends Component {
    //#region HELPER METHODS
    /** RENDER FILTER ITEM */
    renderValues = (value) => {
        return (
            <EDSelectionItem
                selectedIDs={this.props.selectedIDs}
                isForBrands={this.props.isForBrands}
                onSelection={this.props.onValueSelectionHandler}
                index={value.index}
                value={value.item} />
        );
    }
    //#endregion

    //#region LIFE CYCLE METHODS
    /** RENDER */
    render() {
        return (
            // CHECK FOR DATA, ELSE DISPLAY EMPTY PLACEHOLDER VIEW
            this.props.arrayData !== undefined && this.props.arrayData.length !== 0
                ? <FlatList
                    showsVerticalScrollIndicator={false}
                    style={styles.listStyle}
                    data={this.props.arrayData}
                    extraData={this.props.selectedIDs}
                    renderItem={this.renderValues}
                    keyExtractor={(item, index) => item + index}
                />
                : this.props.strTitle !== undefined && this.props.strTitle.length > 0
                    ? <EDPlaceholderComponent backgroundColor={EDColors.transparentWhite} title={this.props.strTitle} />
                    : null

        );
    }
    //#endregion
}

const styles = StyleSheet.create({
    listStyle: { flex: 1, marginHorizontal: 10, marginVertical: 20 },
    touchableContainer: { flex: 1, marginHorizontal: 5 },
    mainContainer: { marginVertical: 10, justifyContent: 'space-between', alignItems: 'flex-start' },
    icon: { width: 25, height: 25 },
    title: { flex: 1, color: EDColors.white, marginHorizontal: 5 },
    checkBox: { tintColor: EDColors.homeButtonColor },
})
