import {debugLog} from './EDConstants';
import Geocoder from 'react-native-geocoding';
import Geolocation from '@react-native-community/geolocation';
import {showDialogue} from './EDAlert';
import {strings} from '../locales/i18n';

export function getCurrentLocation(onSucess, onFailure, googleMapsAPIKey) {
  if (
    googleMapsAPIKey == undefined ||
    googleMapsAPIKey == null ||
    googleMapsAPIKey.trim().length == 0
  ) {
    showDialogue('Please configure Google Maps API Key');
    if (onFailure !== undefined) {
      onFailure({
        data: {},
        message: strings('generalNew.generalWebServiceError'),
      });
    }
    return;
  }

  Geocoder.init(googleMapsAPIKey);
  Geolocation.getCurrentPosition(
    (position) => {
      getAddress(
        position.coords.latitude,
        position.coords.longitude,
        (onSuccess) => {
          var region = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            address: onSuccess,
          };
          onSucess(region);
        },
        onFailure,
        googleMapsAPIKey,
      );
    },
    (error) => {
      debugLog('ERROR IN GETTING CURRENT LOCATION :: ', error);
      onFailure(error);
    },
    {
      enableHighAccuracy: false,
      timeout: 3000,
      maximumAge: 2000,
      distanceFilter: 200,
    },
  );
}

export function getAddress(
  latitude,
  longitude,
  onSuccess,
  onFailure,
  googleMapsAPIKey,
) {
  if (
    googleMapsAPIKey == undefined ||
    googleMapsAPIKey == null ||
    googleMapsAPIKey.trim().length == 0
  ) {
    showDialogue('Please configure Google Maps API Key!');
    if (onFailure !== undefined && onFailure !== null) {
      onFailure({
        data: {},
        message: strings('generalNew.generalWebServiceError'),
      });
    }
    return;
  }
  debugLog('latitude :: longitude :: ', latitude, longitude);
  Geocoder.init(googleMapsAPIKey);
  Geocoder.from(latitude, longitude)
    .then((json) => {
      debugLog('JSON ADDRESS ::::::', json);
      if (json.results.length !== 0) {
        var city = json.results[0].address_components.filter(
          (x) =>
            x.types.filter((t) => t == 'administrative_area_level_2').length >
            0,
        );

        var state = json.results[0].address_components.filter(
          (x) =>
            x.types.filter((t) => t == 'administrative_area_level_1').length >
            0,
        );
        var country = json.results[0].address_components.filter(
          (x) => x.types.filter((t) => t == 'country').length > 0,
        );

        if (city.length !== 0) {
          city = city[0].long_name;
        } else {
          city = '';
        }

        if (state.length !== 0) {
          state = state[0].long_name;
        } else {
          state = '';
        }

        if (country.length !== 0) {
          country = country[0].long_name;
        } else {
          country = '';
        }

        var localArea = json.results[0].address_components.filter(
          (x) =>
            x.types.filter((t) => t == 'sublocality_level_1' || t == 'locality')
              .length > 0,
        );

        if (localArea.length !== 0) {
          localArea = localArea[0].long_name;
        } else {
          localArea = 'Untitled';
        }

        var pincode = json.results[0].address_components.filter(
          (x) => x.types.filter((t) => t == 'postal_code').length > 0,
        );

        if (pincode.length !== 0) {
          pincode = pincode[0].short_name;
        } else {
          pincode = '';
        }

        var addressComponent = json.results[0].formatted_address;

        var address = {
          strAddress: addressComponent,
          city: city,
          state: state,
          country: country,
          zipCode: pincode,
          localArea: localArea,
        };
        onSuccess(address);
      } else {
        debugLog('ERROR IN GETTING CURRENT LOCATION 123 :: ', json);
        onFailure({
          data: json,
          message: json.message || strings('generalNew.generalWebServiceError'),
        });
      }
    })
    .catch((error) => {
      debugLog('ERROR IN GETTING CURRENT LOCATION 125 :: ', error);
      onFailure({
        data: error,
        message: error.message || strings('generalNew.generalWebServiceError'),
      });
    });
}

export function getAddressFromAddressComponent(
  address_components,
  formatted_address,
) {
  var city = address_components.filter(
    (x) => x.types.filter((t) => t == 'administrative_area_level_2').length > 0,
  );

  var state = address_components.filter(
    (x) => x.types.filter((t) => t == 'administrative_area_level_1').length > 0,
  );
  var country = address_components.filter(
    (x) => x.types.filter((t) => t == 'country').length > 0,
  );

  if (city.length !== 0) {
    city = city[0].long_name;
  } else {
    city = '';
  }

  if (state.length !== 0) {
    state = state[0].long_name;
  } else {
    state = '';
  }

  if (country.length !== 0) {
    country = country[0].long_name;
  } else {
    country = '';
  }

  var localArea = address_components.filter(
    (x) =>
      x.types.filter((t) => t == 'sublocality_level_1' || t == 'locality')
        .length > 0,
  );

  if (localArea.length !== 0) {
    localArea = localArea[0].long_name;
  } else {
    localArea = 'Untitled';
  }

  var pincode = address_components.filter(
    (x) => x.types.filter((t) => t == 'postal_code').length > 0,
  );

  if (pincode.length !== 0) {
    pincode = pincode[0].short_name;
  } else {
    pincode = '';
  }

  var addressComponent = formatted_address;

  var address = {
    strAddress: addressComponent,
    city: city,
    state: state,
    country: country,
    zipCode: pincode,
    localArea: localArea,
  };
  return address;
}
