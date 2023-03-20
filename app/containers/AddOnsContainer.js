import React from 'react';
import { View, StyleSheet } from 'react-native';
import { EDColors } from '../utils/EDColors';
import { strings } from '../locales/i18n';
import CategoryComponent from '../components/CategoryComponent';
import { debugLog, getProportionalFontSize } from '../utils/EDConstants';
import EDRTLText from '../components/EDRTLText';
import { showDialogue, showValidationAlert } from '../utils/EDAlert';
import BaseContainer from './BaseContainer';
import EDRTLView from '../components/EDRTLView';
import { EDFonts } from '../utils/EDFontConstants';
import { connect } from 'react-redux';
import EDImage from '../components/EDImage';
import Metrics from '../utils/metrics';
import EDButton from '../components/EDButton';

class AddOnsContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.category_array = [];
    this.subCategoryArray =
      this.props.navigation.state.params.subCategoryArray
        .addons_category_list || [];
    this.subCategoryDict = this.props.navigation.state.params.subCategoryArray
  }

  categoryComponentRender = () => {
    return (
      <View>
        <EDRTLView style={styles.viewStyle}>
          <EDRTLText style={styles.headerAddOnCategoryStyle} title={strings("addonsNew.size")} />
        </EDRTLView>
        <EDRTLView style={styles.radioGroupStyle}>
          <CategoryComponent
            lan={this.props.lan}
            currencySymbol={this.props.currencySymbol}
            style={styles.mainContainer}
            // categorydata={section.item}
            testData={this.newAddonsList}
            onChangedata={this.categoryComponentAction}
          />
        </EDRTLView>
      </View>
    );
  }

  addonsHeaderComponent = () => {
    return (
      <EDRTLView>
        <EDImage
          source={this.subCategoryDict.image}
          style={{ width: Metrics.screenWidth * 0.32, height: Metrics.screenWidth * 0.32, margin: 10 }}
        />

        <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 10 }}>
          <EDRTLText style={{ color: EDColors.black, marginBottom: 10 }} title={this.subCategoryDict.name} />
          <EDRTLText style={{ color: EDColors.text }} title={strings("addonsNew.by") + this.subCategoryDict.brand_name} />
        </View>
      </EDRTLView>
    )
  }

  // #render Componets
  render() {
    return (
      <BaseContainer
        title={strings('addonsNew.categoryTitle')}
        left={'arrow-back'}
        onLeft={this.navigateToBack}>
        <View style={styles.containerView}>

          <View style={{ flex: 1 }}>
            {this.addonsHeaderComponent()}
            {this.categoryComponentRender()}
          </View>
          <View style={styles.saveView}>

            <EDButton
              style={styles.lastBtn}
              onPress={this.onSubmitAction}
              label={strings('addonsNew.continue')}
            />
          </View>
        </View>
      </BaseContainer>
    );
  }

  // ComponentDidMount Function to make an array from individual add ons category

  componentWillMount() {
    var arrLength = this.subCategoryArray.length
    let tempSubcategory = []
    for (let i = 0; i < arrLength; i++) {
      let temp = []
      temp.push(this.subCategoryArray[i].addons_list[0], this.subCategoryArray[i].addons_category, this.subCategoryArray[i].addons_category_id)
      tempSubcategory.push(temp)
    }
    this.newAddonsList = tempSubcategory
    console.log("TEMPSUBCATEGORY::::::::::::::::::::", tempSubcategory)
    console.log("NEWADDONSLIST::::::::::::::::::::", this.newAddonsList)
    debugLog("this.props.navigation.state.params.subCategoryArray::::::::::::::::::::", this.props.navigation.state.params.subCategoryArray)
  }

  //#endregion

  //#region STATE
  state = {
    categoryDetail: this.props.navigation.state.params.getCategoryDetails,
    quantity: 1
  };

  navigateToPrevious = data => {
    if (this.state.categoryDetail !== undefined) {
      this.state.categoryDetail(data);
    }

    this.props.navigation.goBack();
  };

  navigateToBack = () => {
    this.props.navigation.goBack();
  };

  // onSubmitAction = () => {
  //   var data = this.props.navigation.state.params.subCategoryArray;
  //   data.selected_addons_category_list = []
  //   if (this.category_array[0] !== undefined) {
  //     if (this.props.cartDetail !== null && this.props.cartDetail.items !== undefined) {
  //       let arr = this.props.cartDetail.items
  //       var newarr = arr.filter((p) => { return p.menu_id === data.menu_id })
  //       var temp = newarr.map(data => data.addons_category_list).map(data => data[0].addons_list).map(data => data[0].add_ons_id)
  //       if (newarr.length !== 0) {
  //         if (temp.includes(this.category_array[0].addons_list[0].add_ons_id)) {
  //           let index = temp.indexOf(this.category_array[0].addons_list[0].add_ons_id)
  //           if (newarr[index].addons_category_list[0].addons_list[0].in_stock > newarr[index].quantity) {
  //             if (newarr[index].addons_category_list[0].addons_list[0].max_quantity > newarr[index].quantity) {
  //               this.category_array.map(item => {
  //                 data.selected_addons_category_list.push(item);
  //               });

  //               data.selected_addons_category_list.length === 0
  //                 ? showDialogue(strings('addonsNew.selectItem'), '', [])
  //                 : this.navigateToPrevious(data);
  //             }
  //             else
  //               showValidationAlert(strings("generalNew.maxQuantity") + newarr[index].addons_category_list[0].addons_list[0].max_quantity)
  //           }
  //           else
  //             showValidationAlert(strings("generalNew.noMoreStock"))
  //         }
  //         else {
  //           if (this.category_array[0].addons_list[0].in_stock !== "0") {
  //             this.category_array.map(item => {
  //               data.selected_addons_category_list.push(item);
  //             });
  //             data.selected_addons_category_list.length === 0
  //               ? showDialogue(strings('addonsNew.selectItem'), '', [])
  //               : this.navigateToPrevious(data);
  //           }
  //           else
  //             showValidationAlert(strings("generalNew.noMoreStock"))
  //         }
  //       }
  //       else {
  //         if (this.category_array[0].addons_list[0].in_stock !== "0") {
  //           this.category_array.map(item => {
  //             data.selected_addons_category_list.push(item);
  //           });
  //           data.selected_addons_category_list.length === 0
  //             ? showDialogue(strings('addonsNew.selectItem'), '', [])
  //             : this.navigateToPrevious(data);
  //         }
  //         else
  //           showValidationAlert(strings("generalNew.noMoreStock"))
  //       }
  //     }
  //     else {
  //       if (this.category_array[0].addons_list[0].in_stock !== "0") {
  //         this.category_array.map(item => {
  //           data.selected_addons_category_list.push(item);
  //         });
  //         data.selected_addons_category_list.length === 0
  //           ? showDialogue(strings('addonsNew.selectItem'), '', [])
  //           : this.navigateToPrevious(data);
  //       }
  //       else
  //         showValidationAlert(strings("generalNew.noMoreStock"))
  //     }
  //   }
  //   else
  //     data.selected_addons_category_list.length === 0
  //       ? showDialogue(strings('addonsNew.selectItem'), '', [])
  //       : this.navigateToPrevious(data);
  // };

  onSubmitAction = () => {
    var data = this.props.navigation.state.params.subCategoryArray;
    data.selected_addons_category_list = [];

    this.category_array.map(item => {
      data.selected_addons_category_list.push(item);
    });

    debugLog("THIS.CATEGORYARRAY::::::::::", this.category_array[0].addons_list[0].in_stock !== "0")

    // this.category_array[0].addons_list[0].in_stock === 0 ? showValidationAlert(strings("generalNew.noMoreStock")) :
    if (this.category_array[0].addons_list[0].in_stock !== "0") {
    data.selected_addons_category_list.length === 0
      ? showDialogue(strings('addonsNew.selectItem'), '', [])
      : this.navigateToPrevious(data);
    } else {
      showValidationAlert(strings("generalNew.noMoreStock"))
    }
  };

  categoryComponentAction = item => {
    this.category_array.push(item);
    this.category_array = [
      ...new Map(
        this.category_array.map(item => [item.addons_category_id, item]),
      ).values(),
    ];

    this.category_array.map((value, index) => {
      if (value.addons_list.length === 0) {
        this.category_array.splice(index, 1);
      }
    });
  };

  componentWillUnmount() {
    this.props.navigation.state.params.subCategoryArray = undefined;
  }
}

export default connect(
  state => {
    return {
      currencySymbol: state.contentOperations.currencySymbol,
      lan: state.userOperations.lan,
      cartDetail: state.checkoutReducer.cartDetails,
    };
  },
  () => {
    return {};
  },
)(AddOnsContainer);

const styles = StyleSheet.create({
  containerView: {
    flex: 1,
    backgroundColor: EDColors.white
  },
  viewStyle: {
    // flex: 1,
    padding: 10,
    backgroundColor: EDColors.offWhite,
    // marginTop: 10
  },
  radioGroupStyle: {
    marginTop: 0
  },
  qtystyle: {
    marginHorizontal: 5,
    color: "red"
  },
  mainContainer: {
    backgroundColor: EDColors.white,
  },
  saveView: {
    marginVertical: 20,
    alignSelf: 'center',
  },
  headerAddOnCategoryStyle: {
    fontSize: getProportionalFontSize(16),
    fontFamily: EDFonts.semiBold,
    color: EDColors.black,
    paddingHorizontal: 20,
    // marginBottom:30
  },
  lastBtn: {
    marginHorizontal: 20, paddingVertical: 10, borderRadius: 20, paddingHorizontal: 40, backgroundColor: EDColors.homeButtonColor
  }
});
