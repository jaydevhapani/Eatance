import React from 'react';
import { Modal, StyleSheet, View, Platform } from 'react-native';
import { debugLog } from '../utils/EDConstants';
import EDProgressLoader from './EDProgressLoader';

export default class EDPopupView extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    shouldShowModal: this.props.isModalVisible,
  };

  UNSAFE_componentWillReceiveProps(newProps) {
    this.setState({ shouldShowModal: newProps.isModalVisible });
  }

  render() {
    return (
      <Modal
        visible={this.state.shouldShowModal}
        animationType="slide"
        transparent={true}
        onRequestClose={this.onRequestCloseHandler}
        style={[styles.modalStyle]}>
        <View
          pointerEvents={this.props.isLoading ? 'none' : 'auto'}
          style={[styles.mainViewStyle, this.props.modalMainViewStyle]}>
          {this.props.isLogoutLoading
            ? <EDProgressLoader />
            : null}
          {this.props.children}
        </View>
      </Modal>
    );
  }

  onRequestCloseHandler = () => {
    if (Platform.OS !== 'android' && this.props.onRequestClose !== undefined) {
      this.props.onRequestClose();
    } else if (Platform.OS == 'android' && this.props.shouldDismissModalOnBackButton) {
      this.props.onRequestClose();
    } else {
      debugLog('Hardware back button pressed, do nothing.');
    }
  }
}

const styles = StyleSheet.create({
  modalStyle: {
    flex: 1,
  },
  mainViewStyle: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
});
