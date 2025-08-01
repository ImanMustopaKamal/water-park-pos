import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useCustomTheme } from "../../../hooks/useCustomTheme";

export default function User() {
  const { colors } = useCustomTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Text style={{ color: colors.text }}>Helllo!!</Text>
    </View>
  );
}
