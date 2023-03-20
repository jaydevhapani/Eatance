import ReactNative from "react-native";
import I18n from "react-native-i18n";
// Import all locales
import en from "./en.json";
import fr from "./fr.json";
import ar from "./ar.json";

// Should the app fallback to English if user locale doesn't exists
I18n.fallbacks = true;
// Define the supported translations
I18n.translations = {
  en,
  fr,
  ar
};

export var currentLocale = I18n.currentLocale();
currentLocale = "en"
I18n.locale = currentLocale


// Is it a RTL language?
export const isRTL = I18n.currentLocale().indexOf('fr') === 0;

// Allow RTL alignment in RTL languages
ReactNative.I18nManager.allowRTL(isRTL);

// The method we'll use instead of a regular string
export function strings(name, params = {}) {
  return I18n.t(name, params);
}

export default I18n;
