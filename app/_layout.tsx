import { SafeAreaProvider } from "react-native-safe-area-context";
import { Slot } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import { initDatabase } from "../database/initDB";
import { ThemeProvider, useThemeContext } from "../context/ThemeContext";
import { SnackbarProvider } from "../components/SnackbarProvider";
import { PaperProvider } from "react-native-paper";

// Initialize database
initDatabase();

export default function RootLayout() {
  const { theme } = useThemeContext();
  
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <ThemeProvider>
          <SnackbarProvider>
            <AuthProvider>
              <Slot />
            </AuthProvider>
          </SnackbarProvider>
        </ThemeProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
