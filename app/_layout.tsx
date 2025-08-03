import { SafeAreaProvider } from "react-native-safe-area-context";
import { Slot } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import { initDatabase } from "../database/initDB";
import { ThemeProvider } from "../context/ThemeContext";
import { SnackbarProvider } from "../components/SnackbarProvider";

// Initialize database
initDatabase();

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <SnackbarProvider>
          <AuthProvider>
            <Slot />
          </AuthProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
