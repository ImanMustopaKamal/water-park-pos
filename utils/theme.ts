import {
  configureFonts,
  MD3DarkTheme,
  MD3LightTheme,
  MD3Theme,
} from "react-native-paper";

type CustomColors = MD3Theme["colors"] & {
  text: string;
  border: string;
  borderInput: string;
};

export type CustomTheme = Omit<MD3Theme, "colors"> & {
  colors: CustomColors;
};

const config = {
  fontFamily: "Poppins-Regular",
};

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#2400eeff",
    secondary: "#1aa570ff",
    background: "#ffffff",
    surface: "#ffffff",
    text: "#020618",
    border: "#e2e8f0",
    borderInput: "#808080c7"
  },
  fonts: configureFonts({ config }),
} as CustomTheme;

export const darkTheme: CustomTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#9886fcff",
    secondary: "#a7fc86ff",
    background: "#020618",
    surface: "#1f1f1f",
    text: "#ffffff",
    border: "#ffffff77",
    borderInput: "#808080c7"
  },
  fonts: configureFonts({ config }),
} as CustomTheme;
