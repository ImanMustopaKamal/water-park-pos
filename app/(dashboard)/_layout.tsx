import { PaperProvider } from "react-native-paper";
import { View } from "react-native";
import { Redirect, Slot } from "expo-router";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import { SidebarProvider } from "../../context/SidebarContext";
import { useAuth } from "../../context/AuthContext";
import { ThemeProvider, useThemeContext } from "../../context/ThemeContext";
import { useCustomTheme } from "../../hooks/useCustomTheme";

export default function Layout() {
  const { user } = useAuth();
  const { theme } = useThemeContext();
  const { colors } = useCustomTheme();

  if (!user) {
    return <Redirect href="/" />;
  }

  return (
    <PaperProvider theme={theme}>
      <SidebarProvider>
        <View style={{ flexDirection: "row", flex: 1 }}>
          <Sidebar />
          <View style={{ flex: 1 }}>
            <Topbar />
            <View
              style={{ flex: 1 }}
            >
              <Slot />
            </View>
          </View>
        </View>
      </SidebarProvider>
    </PaperProvider>
  );
}
