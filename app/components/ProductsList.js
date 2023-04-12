import React, {Component} from 'react';
import {EDColors} from '../utils/EDColors';
import {EDFonts} from '../utils/EDFontConstants';
import {strings} from '../locales/i18n';
import {getProportionalFontSize, funGetFrench_Curr} from '../utils/EDConstants';
import {View, StyleSheet, ScrollView} from 'react-native';
import EDRTLText from './EDRTLText';
import EDRTLView from './EDRTLView';
import EDButton from './EDButton';
import Metrics from '../utils/metrics';

export default class ProductsList extends Component {
  renderProductItems() {
    return (
      <View>
        {this.props.orderDetails.items.map((itemToIterate) => {
          return (
            <EDRTLView style={styles.itemContainer}>
              <EDRTLText
                style={styles.itemName}
                title={
                  itemToIterate.name + ' (x' + itemToIterate.quantity + ')'
                }
              />
              <EDRTLText
                style={styles.itemPrice}
                title={
                  this.props.currencySymbol +
                  funGetFrench_Curr(itemToIterate.itemTotal, 1, this.props.lan)
                }
              />
            </EDRTLView>
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
            {/* <EDRTLText style={styles.priceValue} title={priceToIterate.label.includes("Discount") ? " - " + this.props.currencySymbol + priceToIterate.value : this.props.currencySymbol + priceToIterate.value} /> */}
            <EDRTLText
              style={styles.priceValue}
              title={
                (priceToIterate.label_key.toLowerCase().includes('discount')
                  ? ' - '
                  : priceToIterate.label_key.toLowerCase().includes('delivery')
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
        <EDRTLView style={styles.priceContainer}>
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
  render() {
    var numberOfItems = 0;
    if (this.props.orderDetails.items !== undefined) {
      this.props.orderDetails.items.map((itemToIterate) => {
        numberOfItems += itemToIterate.quantity;
      });
    }

    return (
      <View style={styles.productsSummaryContainer}>
        <EDRTLText
          style={styles.modalTitle}
          title={
            strings('productDetailsNew.title') +
            ' (' +
            numberOfItems +
            ' ' +
            (numberOfItems === 1
              ? strings('ordersNew.orderedPopUp')
              : strings('ordersNew.orderedsPopUp')) +
            ')'
          }
        />

        <ScrollView>
          <View>
            {this.renderProductItems()}
            {this.renderPriceItems()}
          </View>
        </ScrollView>

        <EDButton
          style={styles.dismissButton}
          label={strings('generalNew.dismiss')}
          onPress={this.props.dismissProductsListHandler}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  productsSummaryContainer: {
    maxHeight: Metrics.screenHeight * 0.75,
    overflow: 'scroll',
    borderRadius: 5,
    marginHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: EDColors.white,
    shadowOpacity: 0.25,
    shadowRadius: 5,
    shadowColor: EDColors.text,
    shadowOffset: {height: 0, width: 0},
  },
  itemContainer: {marginVertical: 10, marginHorizontal: 0},
  modalTitle: {
    alignSelf: 'center',
    marginVertical: 10,
    marginHorizontal: 10,
    color: EDColors.primary,
    fontSize: getProportionalFontSize(18),
    fontFamily: EDFonts.medium,
    fontWeight: '500',
  },
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
  dismissButton: {
    paddingHorizontal: 20,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 0,
  },
});
