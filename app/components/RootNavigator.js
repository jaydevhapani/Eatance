import React from 'react';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import SplashContainer from '../containers/SplashConainer';
import LoginContainer from '../containers/LoginContainer';
import HomeContainerNew from '../containers/HomeContainerNew';
import SideBar from './SideBar';
import ChangePasswordContainer from "../containers/ChangePasswordContainer";
import CMSContainer from '../containers/CMSContainer';
import AccountContainer from '../containers/AccountContainer';
import { isRTLCheck } from '../utils/EDConstants';
import EditProfileContainer from '../containers/EditProfileContainer';
import MyOrdersContainer from '../containers/MyOrdersContainer';
import NotificationsContainer from '../containers/NotificationsContainer';
import AddOnsContainer from '../containers/AddOnsContainer';
import CartContainer from '../containers/CartContainer';
import AddressListContainer from '../containers/AddressListContainer';
import CheckOutContainer from '../containers/CheckOutContainer';
import AddressMapContainer from '../containers/AddressMapContainer';
import FilterContainer from '../containers/FilterContainer';

import PromoCodeContainer from '../containers/PromoCodeContainer';
import PaymentContainer from '../containers/PaymentContainer';
import ProductDetailContainer from '../containers/ProductDetailContainer';
import ThankYouContainer from '../containers/ThankYouContainer';
import ReviewContainer from '../containers/ReviewContainer';
import BrandsContainer from '../containers/BrandsContainer';
import ProductsListContainer from '../containers/ProductsListContainer';
import CategoriesContainer from '../containers/CategoriesContainer';
import TrackOrderContainer from '../containers/TrackOrderContainer';
import StoresListContainer from '../containers/StoresListContainer';
import DetailedAddressListContainer from '../containers/DetailedAddressListContainer';
import SignUpContainer from '../containers/SignupContainer';

export const HOME_NAVIGATOR = createStackNavigator(
  {
    home: {
      screen: HomeContainerNew
    },
    addOns: {
      screen: AddOnsContainer
    },
    productsFilter: {
      screen: FilterContainer
    },
    prodcutDetails: {
      screen: ProductDetailContainer
    },
    review: {
      screen: ReviewContainer
    },
    brands: {
      screen: BrandsContainer
    },
    productsList: {
      screen: ProductsListContainer
    },
    categories: {
      screen: CategoriesContainer
    },
    storesListHomeNavigator: {
      screen: StoresListContainer
    },
  },
  {
    initialRouteName: 'home',
    headerMode: 'none',
  },
)
export const ORDERS_NAVIGATOR = createStackNavigator(
  {
    trackOrder: {
      screen: TrackOrderContainer
    },
    ordersList: {
      screen: MyOrdersContainer
    },

  },
  {
    initialRouteName: 'ordersList',
    headerMode: 'none',
  },
)

export const ACCOUNT_NAVIGATOR = createStackNavigator(
  {
    accountScreen: {
      screen: AccountContainer
    },
    changePassword: {
      screen: ChangePasswordContainer
    },
    editProfile: {
      screen: EditProfileContainer
    },
    addressMap: {
      screen: AddressMapContainer
    },
    addressList: {
      screen: AddressListContainer
    },
    detailedAddressList: {
      screen: DetailedAddressListContainer
    }
  },
  {
    initialRouteName: 'accountScreen',
    headerMode: 'none',
  },
)

export const HOME_SCREEN_DRAWER = createDrawerNavigator(
  {
    main: {
      screen: HOME_NAVIGATOR
    },
    cms: {
      screen: CMSContainer
    },
    account: {
      screen: ACCOUNT_NAVIGATOR
    },
    myOrders: {
      screen: ORDERS_NAVIGATOR
    },
    notifications: {
      screen: NotificationsContainer
    }

  },
  {
    initialRouteName: 'main',
    initialRouteParams: 'main',
    drawerLockMode: 'locked-closed',
    // backBehavior: "none",
    contentComponent: props => <SideBar {...props} />
  }
);

export const HOME_SCREEN_DRAWER_RIGHT = createDrawerNavigator(
  {
    main: {
      screen: HOME_NAVIGATOR
    },
    cms: {
      screen: CMSContainer
    },
    account: {
      screen: ACCOUNT_NAVIGATOR
    },
    myOrders: {
      screen: MyOrdersContainer
    },
    notifications: {
      screen: NotificationsContainer
    }

  },
  {
    initialRouteName: 'main',
    initialRouteParams: 'main',
    drawerLockMode: 'locked-closed',
    drawerPosition: 'right',
    // backBehavior: "none",
    contentComponent: props => <SideBar {...props} />
  }
);

export const PARENT_STACK_NAVIGATOR = createStackNavigator(
  {
    parentDrawer: {
      screen: HOME_SCREEN_DRAWER
    },
    cart: {
      screen: CartContainer
    },
    addressListFromCart: {
      screen: AddressListContainer
    },
    detailedAddressListFromCart: {
      screen: DetailedAddressListContainer
    },
    checkout: {
      screen: CheckOutContainer
    },
    addressMapFromCart: {
      screen: AddressMapContainer
    },
    promoCodes: {
      screen: PromoCodeContainer
    },
    payment: {
      screen: PaymentContainer
    },
    thankYou: {
      screen: ThankYouContainer
    }
  },
  {
    initialRouteName: 'parentDrawer',
    headerMode: 'none',
  },
)

export const PARENT_STACK_NAVIGATOR_RIGHT = createStackNavigator(
  {
    parentDrawer: {
      screen: HOME_SCREEN_DRAWER_RIGHT
    },
    cart: {
      screen: CartContainer
    },
    addressListFromCart: {
      screen: AddressListContainer
    },
    detailedAddressListFromCart: {
      screen: DetailedAddressListContainer
    },
    checkout: {
      screen: CheckOutContainer
    },
    addressMapFromCart: {
      screen: AddressMapContainer
    },
    promoCodes: {
      screen: PromoCodeContainer
    },
    payment: {
      screen: PaymentContainer
    },
  },
  {
    initialRouteName: 'parentDrawer',
    headerMode: 'none',
  },
)


export const BASE_STACK_NAVIGATOR = createStackNavigator(
  {
    splash: {
      screen: SplashContainer
    },
    storesList: {
      screen: StoresListContainer
    },
    login: {
      screen: LoginContainer
    },
    register: {
      screen: SignUpContainer
    },
    cmsFromSignUp: {
      screen: CMSContainer
    },
    main: {
      screen: PARENT_STACK_NAVIGATOR
    },
    mainRTL: {
      screen: PARENT_STACK_NAVIGATOR_RIGHT
    },
    editProfileFromSideMenu: {
      screen: EditProfileContainer
    }
  },
  {
    initialRouteName: 'splash',
    headerMode: 'none',
  },
);

export const AppNavigator = createAppContainer(BASE_STACK_NAVIGATOR);

// export default createAppContainer(BASE_STACK_NAVIGATOR);
