import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text, Switch, useTheme } from "react-native-paper";

interface ISwitchWithLabel {
  value: boolean;
  handleChange: (val: boolean) => void;
}

export default function SwitchWithLabel({
  value,
  handleChange,
}: ISwitchWithLabel) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Status: </Text>
      <Text style={styles.label}>{value ? "Aktif" : "Expired"}</Text>
      <Switch
        value={value}
        onValueChange={handleChange}
        color={theme.colors.secondary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  label: {
    fontSize: 14,
  },
});
