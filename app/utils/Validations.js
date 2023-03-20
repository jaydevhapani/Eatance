/* eslint-disable prettier/prettier */
import { strings } from '../locales/i18n';

export default class Validations {
  isUrl(strToCheck) {
    var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    return regexp.test(strToCheck);
  }
  // This function is used for checking type od EDTextField and accordingly secures the text entry
  checkingFieldType = fieldType => {
    if (fieldType === 'password') {
      return true;
    } else {
      return false;
    }
  };

  checkForEmpty = (text, errorMessage = 'This is a required field') => {
    if (text.trim().length === 0) {
      return errorMessage;
    }
    return ''
  };
  checkForMobileNumber = (text, errorMessage = 'This is a required field') => {
    // let reg =/^\d+$/;
    let reg = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;

    if (text.trim().length === 0) {
      return errorMessage;
    }
     if(!reg.test(text)){
      return strings("validationsNew.validPhone")
    }
    if(text.trim().length < 10){
      return strings('validationsNew.phoneValidationString')
    }
    return ''
  };

  // Function for performing email validations
  validateEmail = (text, errorMessage = 'This is a required field') => {


    if (text.trim().length === 0) {
      return errorMessage;
    }

    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return reg.test(text) ? '' : strings('validationsNew.validEmail');
  };

  // Function for performing Password validations
  validatePassword = (text, errorMessage = 'This is a required field') => {
    if (text.trim().length === 0) {
      return errorMessage;
    }

    let reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~])[A-Za-z\d!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]{6,12}$/;
    return reg.test(text) ? '' : strings('validationsNew.passwordValidationString');
  };

  validateConfirmPassword = (password1, password2, errorMessage = 'Passwords does not match') => {
    if (password2.trim().length === 0) {
      return strings('validationsNew.emptyConfirmPassword');
    }
    if (password1 === password2) {
      return '';
    }
    return errorMessage;
  };
}
