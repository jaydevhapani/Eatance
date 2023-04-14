import React, {Component} from 'react';
import {View, StyleSheet, Image, TouchableOpacity, Linking} from 'react-native';
import EDRTLView from './EDRTLView';
import EDRTLText from './EDRTLText';
import {EDColors} from '../utils/EDColors';
import {EDFonts} from '../utils/EDFontConstants';
import StepIndicator from 'react-native-step-indicator';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {strings} from '../locales/i18n';
import Assets from '../assets';
import {
  debugLog,
  funGetDateStr,
  isRTLCheck,
  getProportionalFontSize,
  funGetFrench_Curr,
} from '../utils/EDConstants';
import EDButton from './EDButton';
import {Icon} from 'react-native-elements';
import Metrics from '../utils/metrics';
import StarRating from 'react-native-star-rating';
import {GET_WHATSP_NUMBER} from '../utils/ServiceManager';
import {showDialogue} from '../utils/EDAlert';

const orderStatus = [
  strings('ordersNew.accepted'),
  strings('ordersNew.packed'),
  strings('ordersNew.pickedUp'),
  strings('ordersNew.delivered'),
];

const stepperCustomStyle = {
  stepIndicatorSize: 25,
  currentStepIndicatorSize: 30,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: EDColors.homeButtonColor,
  stepStrokeWidth: 2,
  stepStrokeFinishedColor: EDColors.homeButtonColor,
  stepStrokeUnFinishedColor: EDColors.text,
  separatorFinishedColor: EDColors.homeButtonColor,
  separatorUnFinishedColor: EDColors.text,
  stepIndicatorFinishedColor: EDColors.homeButtonColor,
  stepIndicatorUnFinishedColor: EDColors.shadow,
  stepIndicatorCurrentColor: EDColors.shadow,
  stepIndicatorLabelFontSize: 0,
  currentStepIndicatorLabelFontSize: 0,
  stepIndicatorLabelCurrentColor: 'transparent',
  stepIndicatorLabelFinishedColor: 'transparent',
  stepIndicatorLabelUnFinishedColor: 'transparent',
  labelColor: EDColors.text,
  labelSize: getProportionalFontSize(11),
  labelFontFamily: EDFonts.regular,
  currentStepLabelColor: EDColors.text,
};

export default class EDOrderDetails extends Component {
  constructor(props) {
    super(props);
    this.currentOrderStatus = this.getCurrentOrderStatus();

    this.numberOfItems = 0;
    if (
      this.props.orderDetails !== undefined &&
      this.props.orderDetails.items !== undefined
    ) {
      this.props.orderDetails.items.map((itemToIterate) => {
        this.numberOfItems += itemToIterate.quantity;
      });
    }
  }
  renderStepIndicator = (params) =>
    params.stepStatus === 'finished' ? (
      <Image style={styles.stepperImage} source={Assets.tick} />
    ) : null;

  state = {
    isExpanded: this.props.isForCurrentOrder,
  };

  buttonRepeatOrderPressed = () => {
    if (this.props.isForCurrentOrder) {
      return;
    }
    if (this.props.onPressRepeatButtonHandler !== undefined) {
      this.props.onPressRepeatButtonHandler(this.props.orderDetails);
    }
  };
  buttonTrackOrderPressed = () => {
    if (!this.props.isForCurrentOrder) {
      return;
    }
    if (this.props.onPressTrackButtonHandler !== undefined) {
      this.props.onPressTrackButtonHandler(this.props.orderDetails);
    }
  };
  buttonReviewOrderPressed = () => {
    if (this.props.isForCurrentOrder) {
      return;
    }
    if (this.props.onPressReviewButtonHandler !== undefined) {
      this.props.onPressReviewButtonHandler(this.props.orderDetails);
    }
  };

  buttonArrowPressed = () => {
    if (this.props.isForCurrentOrder) {
      return;
    }
    this.setState({isExpanded: !this.state.isExpanded});
  };

  renderProductItems() {
    return (
      <View>
        {this.props.orderDetails.items.map((itemToIterate) => {
          return (
            <View>
              <EDRTLView style={styles.itemContainer}>
                <EDRTLText
                  style={styles.itemName}
                  title={
                    itemToIterate.name +
                    ' (' +
                    ' x ' +
                    itemToIterate.quantity +
                    ')'
                  }
                />
                {itemToIterate.price != null &&
                itemToIterate.price != undefined &&
                itemToIterate.price != '' ? (
                  <EDRTLText
                    style={styles.itemPrice}
                    title={
                      this.props.currencySymbol +
                      funGetFrench_Curr(itemToIterate.price, 1, this.props.lan)
                    }
                  />
                ) : null}
              </EDRTLView>
              {itemToIterate.is_customize == 1 ||
              itemToIterate.is_customize == '1'
                ? itemToIterate.addons_category_list.map((category) => {
                    return (
                      <View
                        style={{
                          marginHorizontal: 15,
                          marginBottom: 10,
                          marginTop: -10,
                        }}>
                        {/* <EDRTLText title={category.addons_category + " :"} style={{ fontSize: getProportionalFontSize(12), fontFamily: EDFonts.bold, color: EDColors.black }} /> */}
                        {category.addons_list.map((addons) => {
                          return (
                            <EDRTLView style={{marginVertical: 2, flex: 1}}>
                              <EDRTLText
                                style={{
                                  flex: 2,
                                  fontSize: getProportionalFontSize(12),
                                  color: EDColors.black,
                                }}
                                title={
                                  '- ' +
                                  category.addons_category +
                                  ' (x' +
                                  itemToIterate.quantity +
                                  ')'
                                }
                              />
                              <EDRTLText
                                style={{
                                  flex: 1,
                                  textAlign: 'right',
                                  fontSize: getProportionalFontSize(12),
                                  color: EDColors.black,
                                }}
                                title={
                                  this.props.currencySymbol +
                                  ' ' +
                                  funGetFrench_Curr(
                                    addons.add_ons_price,
                                    itemToIterate.quantity,
                                    this.props.currencySymbol,
                                  )
                                }
                              />
                            </EDRTLView>
                          );
                        })}
                      </View>
                    );
                  })
                : null}
            </View>
          );
        })}
        <View
          style={{
            position: 'absolute',
            height: 1,
            backgroundColor: EDColors.separatorColor,
            bottom: 0,
            left: 10,
            right: 10,
          }}
        />
      </View>
    );
  }

  renderPriceItems() {
    this.arrayPrice = this.props.orderDetails.price || [];
    return this.arrayPrice.map((priceToIterate, index) => {
      return index !== this.arrayPrice.length - 1 ? (
        priceToIterate.value != 0 ? (
          <EDRTLView style={styles.priceContainer}>
            <EDRTLText style={styles.priceLabel} title={priceToIterate.label} />
            <EDRTLText
              style={styles.priceValue}
              title={
                (priceToIterate.label_key.toLowerCase().includes('discount')
                  ? ' - '
                  : priceToIterate.label_key.toLowerCase().includes('delivery')
                  ? ' + '
                  : priceToIterate.label_key.toLowerCase().includes('service')
                  ? ' + '
                  : '') +
                this.props.currencySymbol +
                funGetFrench_Curr(priceToIterate.value, 1, this.props.lan)
              }
            />
            <View
              style={{
                position: 'absolute',
                height: 1,
                backgroundColor: EDColors.separatorColor,
                bottom: 0,
                left: 10,
                right: 10,
              }}
            />
          </EDRTLView>
        ) : null
      ) : (
        <EDRTLView style={styles.totalContainer}>
          <EDRTLText style={styles.totalLabel} title={priceToIterate.label} />
          <EDRTLText
            style={styles.totalValue}
            title={
              this.props.currencySymbol +
              funGetFrench_Curr(priceToIterate.value, 1, this.props.lan)
            }
          />
        </EDRTLView>
      );
    });
  }

  getCurrentOrderStatus = () => {
    if (
      this.props.orderDetails !== undefined &&
      this.props.orderDetails.order_status !== undefined
    ) {
      if (this.props.orderDetails.order_status.toLowerCase() === 'placed') {
        return 0;
      } else if (
        this.props.orderDetails.order_status.toLowerCase() === 'preparing' ||
        this.props.orderDetails.order_status.toLowerCase() === 'accepted'
      ) {
        return 1;
      } else if (
        this.props.orderDetails.order_status.toLowerCase() === 'packed'
      ) {
        return 2;
      } else if (
        this.props.orderDetails.order_status.toLowerCase() === 'ongoing' ||
        this.props.orderDetails.order_status.toLowerCase() === 'on the way' ||
        this.props.orderDetails.order_status.toLowerCase() === 'ontheway'
      ) {
        return 3;
      } else if (
        this.props.orderDetails.order_status.toLowerCase() === 'delivered' ||
        this.props.orderDetails.order_status.toLowerCase() === 'completed'
      ) {
        return 4;
      } else if (
        this.props.orderDetails.order_status.toLowerCase() === 'cancelled'
      ) {
        return 5;
      }
    }
  };

  render() {
    return (
      <View
        style={[
          styles.summaryContainer,
          {
            backgroundColor:
              this.currentOrderStatus === 5
                ? EDColors.transparentRed
                : EDColors.white,
          },
        ]}>
        <TouchableOpacity
          activeOpacity={this.props.isForCurrentOrder ? 1.0 : 0.75}
          onPress={this.buttonArrowPressed}
          style={[
            styles.summary,
            {flexDirection: isRTLCheck() ? 'row-reverse' : 'row'},
          ]}>
          <EDRTLText
            style={styles.orderID}
            title={strings('ordersNew.id') + this.props.orderDetails.order_id}
          />
          <EDRTLText
            style={styles.orderDate}
            title={funGetDateStr(
              this.props.orderDetails.order_date,
              'MMM DD, YYYY',
            )}
          />
          <EDRTLText
            style={styles.numberOfItems}
            title={
              this.numberOfItems +
              ' ' +
              (this.numberOfItems === 1
                ? strings('ordersNew.ordered')
                : strings('ordersNew.ordereds'))
            }
          />
          {/* <EDRTLText style={styles.orderAmount} title={this.props.currencySymbol + this.props.orderDetails.total} /> */}
          {
            this.props.isForCurrentOrder ? null : (
              <MaterialIcon
                onPress={this.buttonArrowPressed}
                size={20}
                color={EDColors.homeButtonColor}
                name={
                  this.state.isExpanded
                    ? 'keyboard-arrow-up'
                    : 'keyboard-arrow-down'
                }
              />
            )
            // <TouchableOpacity onPress={this.buttonArrowPressed}>
            //     <EDRTLImage source={Assets.ic_up_arrow} style={[styles.arrowButton, { transform: [{ rotate: this.state.isExpanded ? '0deg' : '180deg' }] }]} title={'14 May'} />
            // </TouchableOpacity>
          }
        </TouchableOpacity>

        {this.state.isExpanded ? (
          <View style={styles.orderDetailsContainer}>
            <EDRTLView
              style={{
                marginBottom: 15,
                paddingHorizontal: 10,
                justifyContent: 'space-between',
              }}>
              <EDRTLText
                style={{color: EDColors.primary, fontFamily: EDFonts.bold}}
                title={
                  strings('ordersNew.store_name') +
                  this.props.orderDetails.store_name
                }
              />
              <TouchableOpacity style={{marginRight: 0, flexDirection: 'row'}}>
                <Icon
                  reverse
                  raised
                  containerStyle={{marginHorizontal: 4, marginVertical: 0}}
                  size={13}
                  name={'call'}
                  onPress={this.buttonCallPressed}
                  color={EDColors.homeButtonColor}
                />
                {/* <Icon
                  reverse
                  raised
                  containerStyle={{marginHorizontal: 0, marginVertical: 0}}
                  size={13}
                  name={'chat'}
                  onPress={this.ChatCovergation}
                  color={EDColors.homeButtonColor}
                /> */}
                <TouchableOpacity onPress={() => this.ChatCovergation()}>
                  <Image
                    source={Assets.whatspp}
                    style={{height: 30, width: 30}}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            </EDRTLView>

            {/* <EDRTLText style={{ color: EDColors.primary, fontFamily: EDFonts.bold, marginTop : -15, paddingHorizontal : 10, marginBottom : 15 }} title={strings("ordersNew.delivery_type") + this.props.orderDetails.delivery_flag.toUpperCase() } /> */}

            {this.props
              .isReview ? null : this.props.orderDetails.delivery_flag.toLowerCase() ==
              'pickup' ? (
              <EDRTLView
                style={{
                  flexDirection: 'column',
                  backgroundColor: EDColors.palePrimary,
                  marginHorizontal: 10,
                  marginBottom: 10,
                }}>
                <EDRTLView style={{justifyContent: 'space-between'}}>
                  <EDRTLText
                    style={[
                      styles.ratingItem,
                      {color: EDColors.black, fontFamily: EDFonts.bold},
                    ]}
                    title={strings('ordersNew.orderRating')}
                  />
                  <StarRating
                    containerStyle={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 10,
                    }}
                    starStyle={{}}
                    starSize={getProportionalFontSize(20)}
                    emptyStar={'star'}
                    fullStar={'star'}
                    halfStar={'star-half'}
                    iconSet={'MaterialIcons'}
                    maxStars={5}
                    rating={this.props.orderDetails.rating}
                    emptyStarColor={EDColors.text}
                    reversed={isRTLCheck()}
                    disabled={true}
                    animation="swing"
                    halfStarEnabled={false}
                    fullStarColor={EDColors.primary}
                  />
                </EDRTLView>
                {this.props.orderDetails.review != undefined &&
                this.props.orderDetails.review != null &&
                this.props.orderDetails.review != '' ? (
                  <EDRTLView style={{flexDirection: 'row', marginTop: -15}}>
                    <EDRTLText
                      style={[
                        styles.ratingItem,
                        {color: EDColors.black, fontFamily: EDFonts.semiBold},
                      ]}
                      title={strings('ordersNew.orderRemarks')}
                    />
                    <EDRTLText
                      style={[
                        styles.ratingItem,
                        {
                          color: EDColors.black,
                          fontSize: getProportionalFontSize(14),
                          fontFamily: EDFonts.regular,
                          marginRight: 83,
                          marginTop: 14,
                          marginLeft: -5,
                        },
                      ]}
                      title={this.props.orderDetails.review}
                    />
                  </EDRTLView>
                ) : null}
              </EDRTLView>
            ) : (
              <EDRTLView
                style={{
                  flexDirection: 'column',
                  backgroundColor: EDColors.palePrimary,
                  marginHorizontal: 10,
                  marginBottom: 10,
                }}>
                <EDRTLView style={{justifyContent: 'space-between'}}>
                  <EDRTLText
                    style={[
                      styles.ratingItem,
                      {color: EDColors.black, fontFamily: EDFonts.bold},
                    ]}
                    title={strings('ordersNew.orderRating')}
                  />
                  <StarRating
                    containerStyle={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 10,
                    }}
                    starStyle={{}}
                    starSize={getProportionalFontSize(20)}
                    emptyStar={'star'}
                    fullStar={'star'}
                    halfStar={'star-half'}
                    iconSet={'MaterialIcons'}
                    maxStars={5}
                    rating={this.props.orderDetails.rating}
                    emptyStarColor={EDColors.text}
                    reversed={isRTLCheck()}
                    disabled={true}
                    animation="swing"
                    halfStarEnabled={false}
                    fullStarColor={EDColors.primary}
                  />
                </EDRTLView>
                {this.props.orderDetails.review != undefined &&
                this.props.orderDetails.review != null &&
                this.props.orderDetails.review != '' ? (
                  <EDRTLView style={{flexDirection: 'row', marginTop: -15}}>
                    <EDRTLText
                      style={[
                        styles.ratingItem,
                        {color: EDColors.black, fontFamily: EDFonts.semiBold},
                      ]}
                      title={strings('ordersNew.orderRemarks')}
                    />
                    <EDRTLText
                      style={[
                        styles.ratingItem,
                        {
                          color: EDColors.black,
                          fontSize: getProportionalFontSize(14),
                          fontFamily: EDFonts.regular,
                          marginRight: 83,
                          marginTop: 14,
                          marginLeft: -5,
                        },
                      ]}
                      title={this.props.orderDetails.review}
                    />
                  </EDRTLView>
                ) : null}

                <View
                  style={{
                    height: 1,
                    backgroundColor: EDColors.text,
                    marginHorizontal: 10,
                  }}
                />

                <EDRTLView style={{justifyContent: 'space-between'}}>
                  <EDRTLText
                    style={[
                      styles.ratingItem,
                      {color: EDColors.black, fontFamily: EDFonts.bold},
                    ]}
                    title={strings('ordersNew.driverRating')}
                  />
                  <StarRating
                    containerStyle={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 10,
                    }}
                    starStyle={{}}
                    starSize={getProportionalFontSize(20)}
                    emptyStar={'star'}
                    fullStar={'star'}
                    halfStar={'star-half'}
                    iconSet={'MaterialIcons'}
                    maxStars={5}
                    rating={this.props.orderDetails.driver_rating}
                    emptyStarColor={EDColors.text}
                    reversed={isRTLCheck()}
                    disabled={true}
                    animation="swing"
                    halfStarEnabled={false}
                    fullStarColor={EDColors.primary}
                  />
                </EDRTLView>
                {this.props.orderDetails.driver_review != undefined &&
                this.props.orderDetails.driver_review != null &&
                this.props.orderDetails.driver_review != '' ? (
                  <EDRTLView style={{flexDirection: 'row', marginTop: -15}}>
                    <EDRTLText
                      style={[styles.ratingItem, {color: EDColors.black}]}
                      title={strings('ordersNew.driverRemarks')}
                    />
                    <EDRTLText
                      style={[
                        styles.ratingItem,
                        {
                          color: EDColors.black,
                          fontSize: getProportionalFontSize(14),
                          fontFamily: EDFonts.regular,
                          marginRight: 83,
                          marginTop: 14,
                          marginLeft: -5,
                        },
                      ]}
                      title={this.props.orderDetails.driver_review}
                    />
                  </EDRTLView>
                ) : null}
              </EDRTLView>
            )}

            {this.currentOrderStatus === 0 || this.currentOrderStatus === 5 ? (
              <EDRTLView style={styles.instructionsContainer}>
                <Image style={styles.instructionsIcon} source={Assets.driver} />
                <EDRTLText
                  style={styles.instructionsText}
                  title={
                    this.currentOrderStatus === 5
                      ? this.props.orderDetails.cancel_reason !== undefined &&
                        this.props.orderDetails.cancel_reason.trim().length > 0
                        ? this.props.orderDetails.cancel_reason
                        : strings('ordersNew.orderCancelled')
                      : strings('ordersNew.orderNotAccepted')
                  }
                />
              </EDRTLView>
            ) : (
              <StepIndicator
                stepCount={4}
                renderStepIndicator={this.renderStepIndicator}
                customStyles={stepperCustomStyle}
                currentPosition={this.getCurrentOrderStatus()}
                labels={[
                  strings('ordersNew.accepted'),
                  strings('ordersNew.packed'),
                  strings('ordersNew.pickedUp'),
                  strings('ordersNew.delivered'),
                ]}
              />
            )}

            <View style={styles.productsSummaryContainer}>
              {/* PRODUCTS */}
              {this.renderProductItems()}
              {/* <View style={{ position: 'absolute', height: 1, backgroundColor: EDColors.separatorColor, bottom: 0, left: 10, right: 10 }} /> */}

              {/* PRICE SUMMARY */}
              {this.renderPriceItems()}

              {/* RE-ORDER */}
              {this.props.isForCurrentOrder ? (
                (this.props.orderDetails.delivery_flag || '').toLowerCase() ==
                  'delivery' &&
                this.props.orderDetails.order_status.toLowerCase() ===
                  'ongoing' &&
                this.props.orderDetails.driver !== undefined &&
                this.props.orderDetails.driver !== null ? (
                  <EDButton
                    style={styles.reorderButton}
                    label={strings('ordersNew.trackorder')}
                    onPress={this.buttonTrackOrderPressed}
                  />
                ) : null
              ) : (
                <EDRTLView style={{justifyContent: 'center', marginTop: 10}}>
                  <EDButton
                    style={styles.reorderButton}
                    label={strings('ordersNew.reOrder')}
                    onPress={this.buttonRepeatOrderPressed}
                  />
                  {this.props.isReview &&
                  this.props.orderDetails.order_status.toLowerCase() !=
                    'cancelled' ? (
                    <EDButton
                      style={styles.reorderButton}
                      label={strings('ordersNew.rateOrder')}
                      onPress={this.buttonReviewOrderPressed}
                    />
                  ) : null}
                </EDRTLView>
              )}
            </View>
          </View>
        ) : null}
      </View>
    );
  }

  //ChatCovergation
  ChatCovergation = async () => {
    await GET_WHATSP_NUMBER()
      .then((Response) => {
        if (Response.status == 'success') {
          console.log('WhatsappNumber :: ', Response.whatsapp_number);
          let WHATSP_APP_OPEN_URL = `whatsapp://send?text=hello&phone=${Response.whatsapp_number}`;
          Linking.openURL(WHATSP_APP_OPEN_URL);
        }
      })
      .catch((Error) => {
        console.log('Error ::: ', Error);
      });
  };
  buttonCallPressed = () => {
    if (
      this.props.orderDetails.store_phone_number !== undefined &&
      this.props.orderDetails.store_phone_number.trim().length > 0
    ) {
      const strCallURL = 'tel:' + this.props.orderDetails.store_phone_number;
      if (Linking.canOpenURL(strCallURL)) {
        Linking.openURL(strCallURL).catch((error) => {
          showDialogue(strings('generalNew.canNotDial'));
        });
      } else {
        showDialogue(strings('generalNew.canNotDial'));
      }
    } else {
      showDialogue(strings('generalNew.canNotDial'));
    }
  };
}

//#region STYLES
const styles = StyleSheet.create({
  summaryContainer: {
    margin: 10,
    borderColor: EDColors.shadow,
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 0,
    backgroundColor: EDColors.white,
    shadowOpacity: 0.25,
    shadowRadius: 5,
    shadowColor: EDColors.text,
    shadowOffset: {height: 0, width: 0},
  },
  summary: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  orderID: {
    color: EDColors.textAccount,
    fontSize: getProportionalFontSize(14),
    fontFamily: EDFonts.bold,
    maxWidth: Metrics.screenWidth * 0.25,
  },
  orderDate: {
    flex: 3,
    textAlign: 'center',
    color: EDColors.homeButtonColor,
    fontSize: getProportionalFontSize(14),
    fontFamily: EDFonts.regular,
  },
  numberOfItems: {
    textAlign: 'center',
    color: EDColors.textAccount,
    fontSize: getProportionalFontSize(14),
    fontFamily: EDFonts.regular,
  },
  orderAmount: {
    textAlign: 'center',
    flex: 2,
    color: EDColors.text,
    fontSize: getProportionalFontSize(14),
    fontFamily: EDFonts.regular,
  },
  arrowButton: {tintColor: EDColors.homeButtonColor},
  orderDetailsContainer: {paddingTop: 0},
  productsSummaryContainer: {
    margin: 10,
    marginHorizontal: 0,
    paddingVertical: 10,
  },
  itemContainer: {marginVertical: 10, marginHorizontal: 0},
  itemName: {
    marginHorizontal: 10,
    flex: 1,
    color: EDColors.textAccount,
    fontSize: getProportionalFontSize(16),
    fontFamily: EDFonts.medium,
    fontWeight: '500',
  },
  itemPrice: {
    marginHorizontal: 10,
    color: EDColors.textAccount,
    fontSize: getProportionalFontSize(16),
    fontFamily: EDFonts.medium,
    fontWeight: '500',
  },
  priceContainer: {marginHorizontal: 0, paddingVertical: 10},
  totalContainer: {marginHorizontal: 0, paddingTop: 10},
  priceLabel: {
    marginHorizontal: 10,
    flex: 1,
    color: EDColors.text,
    fontSize: getProportionalFontSize(14),
    fontFamily: EDFonts.medium,
  },
  priceValue: {
    marginHorizontal: 10,
    color: EDColors.text,
    fontSize: getProportionalFontSize(14),
    fontFamily: EDFonts.medium,
  },
  totalLabel: {
    marginHorizontal: 10,
    flex: 1,
    color: EDColors.textAccount,
    fontSize: getProportionalFontSize(16),
    fontFamily: EDFonts.bold,
  },
  totalValue: {
    marginHorizontal: 10,
    color: EDColors.textAccount,
    fontSize: getProportionalFontSize(16),
    fontFamily: EDFonts.bold,
  },
  instructionsText: {
    textAlign: 'center',
    marginHorizontal: 10,
    fontFamily: EDFonts.medium,
    padding: 0,
    color: EDColors.homeButtonColor,
    fontSize: getProportionalFontSize(14),
  },
  instructionsIcon: {tintColor: EDColors.homeButtonColor},
  instructionsContainer: {
    paddingHorizontal: 5,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reorderButton: {
    paddingHorizontal: 20,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 0,
    backgroundColor: EDColors.homeButtonColor,
  },
  stepperImage: {width: 10, height: 10},
  ratingItem: {
    margin: 10,
    color: EDColors.primary,
    fontSize: getProportionalFontSize(16),
    fontFamily: EDFonts.italic,
    // borderColor: 'red', borderWidth: 1,
  },
});
//#endregion
