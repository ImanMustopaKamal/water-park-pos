import {
  configureFonts,
  MD3DarkTheme,
  MD3LightTheme,
  MD3Theme,
} from "react-native-paper";

type CustomColors = MD3Theme["colors"] & {
  text: string;
  border: string;
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
    primary: "#6200ee",
    background: "#ffffff",
    surface: "#ffffff",
    text: "#020618",
    border: "#e2e8f0",
  },
  fonts: configureFonts({ config }),
} as CustomTheme;

export const darkTheme: CustomTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#bb86fc",
    background: "#020618",
    surface: "#1f1f1f",
    text: "#ffffff",
    border: "#ffffff1a",
  },
  fonts: configureFonts({ config }),
} as CustomTheme;
