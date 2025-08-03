import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useCustomTheme } from "../hooks/useCustomTheme";

interface RowData {
  [key: string]: string | number;
}

interface DropdownProp {
  data: any;
  title: string;
  value: number;
  onChange: (item: RowData) => void;
}

const DropdownComponent = (prop: DropdownProp) => {
  const [isFocus, setIsFocus] = useState(false);
  const { colors } = useCustomTheme();

  // const renderLabel = () => {
  //   if (value || isFocus) {
  //     return (
  //       <Text style={[styles.label, isFocus && { color: "blue" }]}>
  //         {prop.title}
  //       </Text>
  //     );
  //   }
  //   return null;
  // };

  return (
    <View style={{ backgroundColor: colors.background }}>
      {/* {renderLabel()} */}
      <Dropdown
        mode="modal"
        style={{ ...styles.dropdown, borderColor: colors.borderInput }}
        placeholderStyle={{
          ...styles.placeholderStyle,
          backgroundColor: colors.background,
          color: colors.text,
        }}
        selectedTextStyle={{
          ...styles.selectedTextStyle,
          backgroundColor: colors.background,
          color: colors.text,
        }}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={prop.data}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? prop.title : "..."}
        searchPlaceholder="Search..."
        value={prop.value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          prop.onChange(item.value);
          // setValue(item);
          setIsFocus(false);
        }}
        // renderLeftIcon={() => (
        //   <AntDesign
        //     style={styles.icon}
        //     color={isFocus ? "blue" : "black"}
        //     name="Safety"
        //     size={20}
        //   />
        // )}
      />
    </View>
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  dropdown: {
    height: 54,
    // borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    // backgroundColor: "white",
    left: 0,
    top: 0,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
    paddingLeft: 7,
  },
  selectedTextStyle: {
    fontSize: 16,
    paddingLeft: 7,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
