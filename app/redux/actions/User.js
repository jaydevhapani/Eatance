
export const TYPE_SAVE_LOGIN_DETAILS = "TYPE_SAVE_LOGIN_DETAILS"
export function saveUserDetailsInRedux(details) {
    return {
        type: TYPE_SAVE_LOGIN_DETAILS,
        value: details
    }
}

export const TYPE_SAVE_LOGIN_FCM = "TYPE_SAVE_LOGIN_FCM"
export function saveUserFCMInRedux(details) {
    return {
        type: TYPE_SAVE_LOGIN_FCM,
        value: details
    }
}

export const TYPE_SAVE_LANGUAGE = "TYPE_SAVE_LANGUAGE";
export function saveLanguageInRedux(data) {
    return {
        type: TYPE_SAVE_LANGUAGE,
        value: data
    };
}

export const TYPE_SAVE_TERMS_ACCEPTED_STATUS = "TYPE_SAVE_TERMS_ACCEPTED_STATUS";
export function saveTermsAcceptedStatus(data) {
    return {
        type: TYPE_SAVE_TERMS_ACCEPTED_STATUS,
        value: data
    };
}
