import { SafeAreaProvider } from "react-native-safe-area-context";
import { Slot } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import { PaperProvider } from "react-native-paper";
import { initDatabase } from "../database/initDB";
import { ThemeProvider } from "../context/ThemeContext";

// Initialize database
initDatabase();

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <Slot />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
