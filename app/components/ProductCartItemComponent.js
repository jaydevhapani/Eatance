import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { EDColors } from "../utils/EDColors";
import Toast from 'react-native-easy-toast';
import { funGetFrench_Curr, debugLog } from "../utils/EDConstants";
import { strings } from "../locales/i18n";
import { EDFonts } from "../utils/EDFontConstants";
import EDRTLView from "./EDRTLView";
import EDRTLText from "./EDRTLText";
import { getProportionalFontSize } from "../utils/EDConstants";
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { showValidationAlert } from "../utils/EDAlert";
import Metrics from "../utils/metrics";
import EDImage from "./EDImage";

export default class ProductCartItemComponent extends React.Component {
  //#region LIFE CYCLE METHODS
  /** CONSTRUCTOR */
  constructor(props) {
    super(props);
    this.onNavigationChanges()
  }

  /** RENDER */
  render() {
    return (
      <EDRTLView style={style.container}>
        <Toast ref="toast" position="center" fadeInDuration={1} />
        {/* PRODUCT IMAGE */}
        <EDImage style={style.itemImage} source={this.props.items.image}
        />

        {/* DETAILS VIEW */}
        <View style={style.middleView}>

          {/* PRODUCT NAME & DELETE ICON */}
          <EDRTLView style={{justifyContent:'space-between'}} >
              <EDRTLText style={style.itemName} title={this.props.items.name} />
            {this.props.items.price !== null && this.props.items.price !== undefined && this.props.items.price !== '' ? 
              <EDRTLText
                style={style.txtStyle1} title={this.props.currencySymbol}
              /> : null}
              <EDRTLText
                style={style.txtStyle1} title={this.props.items.offer_price !== "" && this.props.items.offer_price !== undefined && this.props.items.offer_price !== null ? this.props.items.offer_price : this.props.items.price}
              />
          </EDRTLView>

          {/* BRAND NAME */}
          {this.props.items.brand_name !== undefined && this.props.items.brand_name !== null && this.props.items.brand_name.trim().length > 0
            ? <EDRTLText title={strings('cartNew.by') + this.props.items.brand_name} style={style.brandName} />
            : null}

          {/* FOOD TYPE */}
          {this.props.items.food_type_name !== undefined &&
            this.props.items.food_type_name !== null &&
            this.props.items.food_type_name.trim().length > 0 ? (
              <EDRTLText
                title={strings('generalNew.foodType') + ": " + this.props.items.food_type_name}
                style={[style.brandName,]}
              />
            ) : null}

          {this.props.items.addons_category_list != undefined && this.props.items.addons_category_list.length !== 0 ? this.props.items.addons_category_list.map((item) => {
            // ()=>this.setState({rate:)
            return (
              <View style={style.marginView}>
                {item.addons_list.map((items) => {
                  return (
                    <EDRTLView style={[style.marginView, { marginVertical: 3 }]}>

                      <EDRTLView>
                        <EDRTLText style={style.edTextStyle} title={item.addons_category} />
                        <EDRTLText style={style.edTextStyle} title={" x "} />
                        <EDRTLText style={style.edTextStyle} title={this.state.quantity} />
                      </EDRTLView>
                      {items.add_ons_price != undefined ?
                        <EDRTLText style={style.edTextStyle} title={this.props.currencySymbol + funGetFrench_Curr(items.add_ons_price, this.state.quantity, this.props.lan)} />
                        : null}


                    </EDRTLView>
                  )
                })}
              </View>
            )

          }) : <View />}

          {/* PRICE */}
          <View style={style.bottomSubContainer}>
            <EDRTLText style={style.txtStyle} title={this.props.currencySymbol + funGetFrench_Curr(this.state.totalRate, 1, this.props.lan)} />

            {/* QUANTITY CONTAINER */}
            <EDRTLView style={style.qunContainer}>

              {/* MINUS BUTTON */}
              {this.state.quantity >1 ?
              <MaterialIcon onPress={this.qtyDecreaseHandler} size={20} color={EDColors.homeButtonColor} name="remove-circle" />
              : null}

              {/* QUANTITY */}
              <EDRTLText style={style.quantityNumber} title={this.state.quantity} />

              {/* PLUS BUTTON */}
              <MaterialIcon onPress={this.qtyIncreaseHandler} size={20} color={EDColors.homeButtonColor} name="add-circle" />

            </EDRTLView>
          </View>
          {/* </EDRTLView> */}


        </View>

        <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', marginHorizontal: 20 }} onPress={this.props.deleteClick}>
          <MaterialIcon size={20} color={EDColors.homeButtonColor} name="delete" />
        </TouchableOpacity>
      </EDRTLView>
    );
  }

  /** STATE */
  state = {
    quantity: this.props.items.quantity,
    rate: this.props.items.price != null ? this.props.items.offer_price !== "" ? (this.props.items.offer_price) : (this.props.items.price) : 0,
    totalRate: 0
  };

  /** DID MOUNT */
  componentDidMount() {
    this.onNavigationChanges()
  }
  //#endregion

  //#region HELPER METHODS
  onNavigationChanges = () => {
    if (this.props.items !== undefined) {
      this.cartValueHandler()
    }
  }

  // cartValueHandler() {
  //   if (this.props.items.is_customize == "1") {
  //     this.totalRate = 0
  //     this.props.items.addons_category_list.map((item) => {
  //       {
  //         item.addons_list.map((items) => {
  //           if (items.add_ons_price != undefined) {
  //             this.totalRate = funGetFrench_Curr(this.totalRate + this.state.quantity * parseInt(items.add_ons_price), 1, this.props.lan)
  //           }
  //         })
  //       }
  //     })

  //     this.setState({
  //       totalRate: this.totalRate
  //     })
  //   } else {
  //     this.setState({
  //       totalRate: funGetFrench_Curr((this.props.items.offer_price !== "" ? parseInt(this.props.items.offer_price) : parseInt(this.props.items.price)), this.state.quantity, this.props.lan)
  //     })
  //   }
  // }
  //#endregion

  cartValueHandler() {
    console.log('cartValue :::::::::::::: ', this.state.quantity, this.props.items.is_customize === '1');
    if (this.props.items.is_customize === '1' || this.props.items.is_customize === 1) {
        this.totalRate = 0;
        this.totalRate = this.state.quantity *
            (this.props.items.offer_price !== ''
                ? // eslint-disable-next-line radix
                (this.props.items.offer_price)
                : // eslint-disable-next-line radix
                (this.props.items.price)),
            this.props.items.addons_category_list.map(item => {
                // eslint-disable-next-line no-lone-blocks
                {
                    item.addons_list.map(items => {
                        debugLog("ADD ON PRICE :::::", items.add_ons_price)
                        if (items.add_ons_price !== undefined) {
                            debugLog("ADD ON PRICE :::::", items.add_ons_price)
                            this.totalRate =
                                this.totalRate +
                                // eslint-disable-next-line radix
                                this.state.quantity * (items.add_ons_price);
                        }
                    });
                }
            });

        this.setState({
            totalRate: this.totalRate,
        });
    } else {
        // this.totalRate = this.state.quantity * (this.props.items.offer_price !== "" ? parseInt(this.props.items.offer_price) : parseInt(this.props.items.price))
        this.setState({
            // totalRate: this.state.quantity * parseInt(this.props.items.price)
            totalRate:
                this.state.quantity *
                (this.props.items.offer_price !== ''
                    ? // eslint-disable-next-line radix
                    (this.props.items.offer_price)
                    : // eslint-disable-next-line radix
                    (this.props.items.price)),
        });
    }
}
//#endregion

  //#region BUTTON EVENTS
  /** PLUS BUTTON HANDLER */
  qtyIncreaseHandler = () => {
    if (this.props.items.is_customize == 1) {

      let arr = this.props.items.addons_category_list[0].addons_list[0]
      if (arr.in_stock > this.state.quantity) {
        if (arr.max_quantity > this.state.quantity) {
          this.state.quantity = this.state.quantity + 1
        }
        else {
          showValidationAlert(strings("generalNew.maxQuantity") + arr.max_quantity);
        }
      }
      else
        showValidationAlert(strings("generalNew.noMoreStock"))
    }
    else {
      if (this.props.items.item_in_stock > this.state.quantity) {
        if (this.props.items.item_max_quantity > this.state.quantity)
          this.state.quantity = this.state.quantity + 1
        else {
          showValidationAlert(strings("generalNew.maxQuantity") + this.props.items.item_max_quantity);
        }
      }
      else
        showValidationAlert(strings("generalNew.noMoreStock"))
    }
    this.props.onPlusClick(this.state.quantity);
    this.cartValueHandler()
  }

  /** MINUS BUTTON HANDLER */
  qtyDecreaseHandler = () => {
    if (this.state.quantity > 1) {
      this.state.quantity = this.state.quantity - 1
      this.props.onMinusClick(this.state.quantity);
      this.cartValueHandler()
    } else if (this.state.quantity === 1) {
      this.props.deleteClick()
    }
  }
  //#endregion
}

//#region STYLES
export const style = StyleSheet.create({
  container: {
    shadowOpacity: 0.25, shadowRadius: 5, shadowColor: EDColors.text, shadowOffset: { height: 0, width: 0 },
    marginVertical: 1,
    marginBottom: 0,
    backgroundColor: EDColors.white,
    overflow: 'hidden',
    // borderWidth: 1,
    // borderColor: 'red'
  },
  itemImage: { width: Metrics.screenWidth * 0.25, height: Metrics.screenWidth * 0.25, margin: 10 },
  itemName: { flex: 1, fontSize: getProportionalFontSize(14), fontFamily: EDFonts.bold, color: EDColors.textAccount },
  deleteButton: { tintColor: EDColors.primary, width: 20, height: 20 },
  brandName: { marginVertical: 3, fontSize: getProportionalFontSize(12), color: EDColors.text, fontFamily: EDFonts.medium },
  bottomSubContainer: { marginTop: 3 },
  quantityNumber: { marginHorizontal: 8, fontSize: getProportionalFontSize(14), color: EDColors.text, fontFamily: EDFonts.regular },
  qunContainer: { alignItems: 'center', justifyContent: "flex-start", marginTop: 12, marginBottom: 5 },
  roundButton: { padding: 2 },
  txtStyle: { flex: 1, fontSize: getProportionalFontSize(14), fontFamily: EDFonts.bold, color: EDColors.homeButtonColor },
  middleView: { flex: 1, padding: 8 },
  minusImg: { marginVertical: 9, width: 10, marginHorizontal: 5 },
  plusImg: { margin: 5, height: 10, width: 10 },
  edTextStyle: { fontFamily: EDFonts.regular, color: EDColors.textNew, fontSize: getProportionalFontSize(10) },
  marginView: { justifyContent: 'space-between' },
  txtStyle1: { fontSize: getProportionalFontSize(14), fontFamily: EDFonts.bold, color: EDColors.homeButtonColor, justifyContent: 'flex-end' },
});
//#endregion
