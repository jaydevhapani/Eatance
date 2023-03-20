import { Alert } from "react-native";
import { strings } from "../locales/i18n";

export function showDialogue(message, title, arrayButtons = [], okButtonHandler = () => {

}) {
  var arrayButtonsToShow = arrayButtons.concat([{ "text": strings("buttonTitles.okay"), onPress: okButtonHandler }])

  Alert.alert(
    title || '',
    message,
    arrayButtonsToShow,
    { cancelable: false }
  )
}

export function showNoInternetAlert() {
  let arrayButtonsToShow = [{ "text": strings("buttonTitles.okay") }]
  Alert.alert(
    strings("generalNew.noInternetTitle"),
    strings("generalNew.noInternet"),
    arrayButtonsToShow,
    { cancelable: false }
  )
}

export function showNotImplementedAlert() {
  arrayButtonsToShow = [{ "text": strings("buttonTitles.okay") }]
  Alert.alert(
    strings("generalNew.notImplementedTitle"),
    strings("generalNew.notImplementedMessage"),
    arrayButtonsToShow,
    { cancelable: false }
  )
}

export function showValidationAlert(msg) {
  arrayButtonsToShow = [{ "text": strings("buttonTitles.okay") }]
  Alert.alert(
    strings("login.app_name"),
    msg,
    arrayButtonsToShow,
    { cancelable: false }
  )
}