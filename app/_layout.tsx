import { SafeAreaProvider } from "react-native-safe-area-context";
import { Slot } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import { PaperProvider } from "react-native-paper";
import { initDatabase } from "../database/initDB";

// Initialize database
initDatabase();

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <AuthProvider>
          <Slot />
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
