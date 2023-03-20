import React from "react";
import { Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { widthPercentageToDP } from "react-native-responsive-screen";
import EDRTLView from "./EDRTLView";
import { EDColors } from "../utils/EDColors";
import { EDFonts } from "../utils/EDFontConstants";
import { isRTLCheck, getProportionalFontSize } from "../utils/EDConstants";

export default class EDMenuCategoryComponent extends React.PureComponent {
    render() {
        return (
            <FlatList
                style={isRTLCheck() ? style.flatListLeftStyle : style.flatListRightStyle}
                data={this.props.menuItemArray}
                keyExtractor={(item, index) => item + index}
                renderItem={(item, index) => {
                    return (
                        <TouchableOpacity
                            style={{ flexDirection: isRTLCheck() ? 'row-reverse' : 'row' }}
                            onPress={() => this.props.onScrolltoSectionList(item, index)}
                        >
                            <EDRTLView style={style.categoryStyle}>
                                <Text style={[style.textStyle, { marginLeft: isRTLCheck() ? 5 : 0 }]}>
                                    {item.item.title}
                                </Text>
                                <Text style={[style.textStyle, { marginLeft: isRTLCheck() ? 0 : 5 }]}>
                                    {"(" + item.item.data.length + ")"}
                                </Text>
                            </EDRTLView>
                        </TouchableOpacity>
                    )
                }
                }
                ListFooterComponent={() =>
                    <EDRTLView>
                        <TouchableOpacity
                            onPress={this.props.onRequestClose}
                            style={style.closeMenuStyle}
                        >
                            <Text>{"Close"}</Text>
                        </TouchableOpacity>
                    </EDRTLView>
                }
            />
        )
    }
}

//#region STYLES
const style = StyleSheet.create({
    closeMenuStyle: {
        backgroundColor: EDColors.white,
        borderRadius: 25,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginBottom: 10
    },
    categoryStyle: {
        borderWidth: 1,
        borderColor: EDColors.primary,
        backgroundColor: EDColors.white,
        marginBottom: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5
    },
    textStyle: {
        fontFamily: EDFonts.bold,
        color: EDColors.black,
        fontSize: getProportionalFontSize(12)
    },
    flatListLeftStyle: {
        position: 'absolute', bottom: widthPercentageToDP("4.0%"), left: 10, alignSelf: isRTLCheck() ? 'flex-start' : 'flex-end'
    },
    flatListRightStyle: {
        position: 'absolute', bottom: widthPercentageToDP("4.0%"), right: 10, alignSelf: isRTLCheck() ? 'flex-start' : 'flex-end'
    }
})
//#endregion