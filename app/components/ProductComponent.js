import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {EDColors} from '../utils/EDColors';
import {
  funGetFrench_Curr,
  debugLog,
  getProportionalFontSize,
  isRTLCheck,
} from '../utils/EDConstants';
import {strings} from '../locales/i18n';
import {EDFonts} from '../utils/EDFontConstants';
import EDRTLText from './EDRTLText';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import EDRTLView from './EDRTLView';
import Metrics from '../utils/metrics';
import EDImage from './EDImage';

export default class ProductComponent extends React.Component {
  //#region LIFE CYCLE METHODS
  constructor(props) {
    super(props);

    this.quantity = 0;
  }

  render() {
    return (
      <TouchableOpacity
        style={[
          style.container,
          {flexDirection: isRTLCheck() ? 'row-reverse' : 'row'},
        ]}
        onPress={this.onItemDetailData}>
        <EDImage
          // resizeMode={'contain'}
          source={this.props.data.image}
          style={style.itemImage}
        />
        <View style={style.middleView}>
          {/* PRODUCT NAME */}
          <EDRTLText style={style.itemName} title={this.props.data.name} />

          {/* BRAND NAME */}
          {this.props.data.brand_name !== undefined &&
          this.props.data.brand_name !== null &&
          this.props.data.brand_name.trim().length > 0 ? (
            <EDRTLText
              title={strings('cartNew.by') + this.props.data.brand_name}
              style={style.brandName}
            />
          ) : null}

          <EDRTLView style={style.bottomContainer}>
            <EDRTLView style={style.bottomSubContainer}>
              {this.props.data.is_customize === '1' ? (
                <EDRTLView style={{flexDirection: 'column'}}>
                  <View style={{flexDirection: 'row', marginBottom: 5}}>
                    <EDRTLText
                      style={style.txtStyle}
                      title={
                        this.props.currencySymbol +
                        funGetFrench_Curr(
                          this.props.data.offer_price == ''
                            ? this.props.data.price
                            : this.props.data.offer_price,
                          1,
                          this.props.lan,
                        )
                      }
                    />
                    {this.props.data.offer_price !== '' ? (
                      <EDRTLText
                        style={style.txtdecoratedStyle}
                        title={
                          this.props.currencySymbol +
                          funGetFrench_Curr(
                            this.props.data.price,
                            1,
                            this.props.lan,
                          )
                        }
                      />
                    ) : null}
                  </View>
                  <View>
                    <EDRTLText
                      style={style.custmisationAvailable}
                      title={strings('homeNew.customization')}
                    />
                  </View>
                </EDRTLView>
              ) : (
                <EDRTLView>
                  <EDRTLText
                    style={style.txtStyle}
                    title={
                      this.props.currencySymbol +
                      funGetFrench_Curr(
                        this.props.data.offer_price == ''
                          ? this.props.data.price
                          : this.props.data.offer_price,
                        1,
                        this.props.lan,
                      )
                    }
                  />
                  {this.props.data.offer_price !== '' ? (
                    <EDRTLText
                      style={style.txtdecoratedStyle}
                      title={
                        this.props.currencySymbol +
                        funGetFrench_Curr(
                          this.props.data.price,
                          1,
                          this.props.lan,
                        )
                      }
                    />
                  ) : null}
                </EDRTLView>
              )}

              <View>
                {this.props.isOpen ? (
                  this.props.data.isInStock === '1' ? (
                    <View>
                      {this.props.data.addons_category_list === undefined ||
                      this.props.data.addons_category_list.length === 0 ? (
                        <TouchableOpacity
                          style={style.nestedRoundView}
                          onPress={this.onAddOneData}>
                          <MaterialIcon
                            size={18}
                            color={EDColors.white}
                            name="add"
                          />
                        </TouchableOpacity>
                      ) : this.props.cartData.length !== 0 ? (
                        this.props.cartData.some(
                          (item) =>
                            item.menu_id === this.props.data.menu_id &&
                            item.quantity >= 1,
                        ) ? (
                          <EDRTLView
                            style={[
                              style.qunContainer,
                              {
                                justifyContent: isRTLCheck()
                                  ? 'flex-start'
                                  : 'flex-end',
                              },
                            ]}>
                            {/* MINUS BUTTON */}
                            <MaterialIcon
                              onPress={this.onMinusItemsData}
                              size={22}
                              color={EDColors.homeButtonColor}
                              name="remove-circle"
                            />

                            {/* QUANTITY */}
                            <EDRTLText
                              style={style.quantityNumber}
                              title={this.state.quantity}
                            />

                            {/* PLUS BUTTON */}
                            <MaterialIcon
                              size={22}
                              color={EDColors.homeButtonColor}
                              name="add-circle"
                              onPress={this.onPlusItemsData}
                            />
                          </EDRTLView>
                        ) : (
                          <TouchableOpacity
                            style={style.addbtn}
                            onPress={this.onAddDataData}>
                            <EDRTLText
                              style={style.addtxt}
                              title={strings('homeNew.add')}
                            />
                          </TouchableOpacity>
                        )
                      ) : (
                        <TouchableOpacity
                          style={style.addbtn}
                          onPress={this.onAddDataData}>
                          <EDRTLText
                            style={style.addtxt}
                            title={strings('homeNew.add')}
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  ) : (
                    <EDRTLText
                      style={{
                        color: EDColors.error,
                        fontSize: getProportionalFontSize(14),
                      }}
                      title={strings('ordersNew.outOfStock')}
                    />
                  )
                ) : null}
              </View>
            </EDRTLView>
          </EDRTLView>
        </View>
      </TouchableOpacity>
    );
  }
  //#endregion

  //#region STATE
  state = {
    quantity: 0,
  };
  //#endregion

  componentDidMount() {
    this.props.cartData.map((value) => {
      if (value.menu_id === this.props.data.menu_id && value.quantity >= 1) {
        this.quantity = parseInt(this.quantity) + parseInt(value.quantity);
      }
    });

    this.setState({
      quantity: this.quantity,
    });
  }

  onAddOneData = () => {
    this.props.addOneData(this.props.data);
  };
  onAddDataData = () => {
    this.props.addData(this.props.data);
  };
  onPlusItemsData = () => {
    this.props.plusItems(this.props.data);
  };
  onMinusItemsData = () => {
    this.props.minusItems(true);
  };

  onItemDetailData = () => {
    this.props.itemDetails(this.props.data);
  };
}

//#region STYLES
const style = StyleSheet.create({
  container: {
    shadowOpacity: 0.25,
    shadowRadius: 5,
    shadowColor: EDColors.text,
    shadowOffset: {height: 0, width: 0},
    marginTop: 15,
    marginBottom: 0,
    backgroundColor: EDColors.white,
    overflow: 'hidden',
    marginHorizontal: 15,
    // paddingVertical: 200,
    // backgroundColor: EDColors.error
  },
  itemImage: {
    width: Metrics.screenWidth * 0.25,
    height: Metrics.screenWidth * 0.25,
  },
  itemName: {
    fontSize: getProportionalFontSize(14),
    fontFamily: EDFonts.bold,
    color: EDColors.textAccount,
  },
  deleteButton: {tintColor: EDColors.homeButtonColor, width: 20, height: 20},
  brandName: {
    marginTop: 3,
    fontSize: getProportionalFontSize(12),
    color: EDColors.text,
    fontFamily: EDFonts.medium,
  },
  bottomContainer: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flex: 1,
  },
  bottomSubContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityNumber: {
    marginHorizontal: 5,
    fontSize: getProportionalFontSize(14),
    color: EDColors.text,
    fontFamily: EDFonts.regular,
  },
  qunContainer: {alignItems: 'center'},
  roundButton: {padding: 7},
  custmisationAvailable: {
    flex: 1,
    fontSize: getProportionalFontSize(10),
    fontFamily: EDFonts.bold,
    color: EDColors.homeButtonColor,
  },
  txtStyle: {
    fontSize: getProportionalFontSize(14),
    fontFamily: EDFonts.bold,
    color: EDColors.homeButtonColor,
  },
  txtdecoratedStyle: {
    marginHorizontal: 10,
    color: EDColors.text,
    textDecorationLine: 'line-through',
    fontSize: getProportionalFontSize(14),
    fontFamily: EDFonts.bold,
  },
  middleView: {flex: 1, padding: 8},
  minusImg: {marginVertical: 9, width: 10, marginHorizontal: 5},
  plusImg: {margin: 5, height: 10, width: 10},
  edTextStyle: {
    fontFamily: EDFonts.regular,
    color: EDColors.textNew,
    fontSize: getProportionalFontSize(10),
  },
  marginView: {marginVertical: 3, justifyContent: 'space-between'},
  addbtn: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 15,
    backgroundColor: EDColors.homeButtonColor,
  },
  nestedRoundView: {
    backgroundColor: EDColors.homeButtonColor,
    borderRadius: 5,
    alignSelf: 'center',
  },
  addtxt: {
    fontFamily: EDFonts.medium,
    fontSize: getProportionalFontSize(10),
    textAlign: 'center',
  },
});
//#endregion
