import { useTheme } from "react-native-paper";
import { CustomTheme } from "../utils/theme";

export function useCustomTheme() {
  return useTheme() as CustomTheme;
}
