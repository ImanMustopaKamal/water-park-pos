import { MD3DarkTheme, MD3LightTheme, MD3Theme } from "react-native-paper";

type CustomColors = MD3Theme["colors"] & {
  text: string;
};

export type CustomTheme = Omit<MD3Theme, "colors"> & {
  colors: CustomColors;
};

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#6200ee",
    background: "#ffffff",
    surface: "#ffffff",
    text: "#020618",
  },
} as CustomTheme;

export const darkTheme: CustomTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#bb86fc",
    background: "#020618",
    surface: "#1f1f1f",
    text: "#ffffff",
  },
} as CustomTheme;
