import React, {Component} from 'react';
import {Image, TouchableOpacity, StyleSheet, View} from 'react-native';
import Assets from '../assets';
import {EDColors} from '../utils/EDColors';
import Metrics from '../utils/metrics';
import {showDialogue} from '../utils/EDAlert';
import ImagePicker from 'react-native-image-crop-picker';
import {strings} from '../locales/i18n';
import {debugLog} from '../utils/EDConstants';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

export default class EDProfilePicture extends Component {
  //#region LIFE CYCLE METHODS
  constructor(props) {
    super(props);

    this.options = {
      title: strings('generalNew.selectAvatar'),
      takePhotoButtonTitle: strings('generalNew.capturePhoto'),
      chooseFromLibraryButtonTitle: strings('generalNew.selectFromLibrary'),
      cancelButtonTitle: strings('buttonTitles.cancel'),
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
        path: 'images',
        cameraRoll: true,
        waitUntilSaved: true,
      },
    };
  }

  /** RENDER METHOD */
  render() {
    return (
      //  PARENT CONTAINER
      <View>
        <TouchableOpacity
          style={styles.touchableImageContainer}
          onPress={this.buttonChangeProfilePicturePressed}>
          {/* PROFILE IMAGE  */}
          {/* <View style={{width:120, height:120, borderRadius:60, overflow:'hidden'}}> */}
          <Image
            source={
              this.state.avatarSource
                ? {uri: this.state.avatarSource}
                : this.props.imagePath
                ? {uri: this.props.imagePath}
                : this.props.placeholder || Assets.logo_pin_transparent
            }
            style={
              this.props.placeholder
                ? styles.prescriptionImage
                : styles.profileImage
            }
          />
          {/* </View> */}
          {/* CAMERA ICON */}
          <View style={styles.cameraIconContainer}>
            <MaterialIcon
              size={15}
              color={EDColors.white}
              name={'camera-alt'}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  state = {
    avatarSource: undefined,
  };
  //#endregion

  //#region
  /** BUTTON EVENTS */
  buttonChangeProfilePicturePressed = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then((image) => {
        this.onImageSelectionHandler(image?.path, 'done');
      })
      .catch((error) => {
        this.onImageSelectionHandler(error, 'error');
      });
  };
  //#endregion

  //#region HELPER FUNCTIONS
  /**
   *
   * @param {The image response received from image picker} response
   */
  onImageSelectionHandler = (PathOrError, Check) => {
    if (Check == 'done') {
      this.setState({avatarSource: PathOrError});
      if (this.props.onImageSelectionHandler !== undefined) {
        this.props.onImageSelectionHandler(PathOrError);
      }
    } else {
      debugLog('ImagePicker Error: ', rPathOrError);
      showDialogue(PathOrError + '');
    }
  };
}

//#region STYLES
const styles = StyleSheet.create({
  touchableImageContainer: {
    alignSelf: 'center',
    marginVertical: 20,
  },
  profileImage: {
    borderWidth: 2,
    borderColor: EDColors.homeButtonColor,
    width: Metrics.screenWidth * 0.25,
    height: Metrics.screenWidth * 0.25,
    borderRadius: (Metrics.screenWidth * 0.25) / 2,
  },
  prescriptionImage: {
    borderWidth: 2,
    borderColor: EDColors.homeButtonColor,
    width: Metrics.screenWidth * 0.25,
    height: Metrics.screenWidth * 0.25,
    borderRadius: (Metrics.screenWidth * 0.25) / 2,
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    backgroundColor: EDColors.homeButtonColor,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
//#endregion
