import { PaperProvider } from "react-native-paper";
import { View } from "react-native";
import { Redirect, Slot } from "expo-router";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import { SidebarProvider } from "../../context/SidebarContext";
import { useAuth } from "../../context/AuthContext";

export default function Layout() {
  const { user } = useAuth();

  if (!user) {
    return <Redirect href="/" />;
  }

  return (
    <PaperProvider>
      <SidebarProvider>
        <View style={{ flexDirection: "row", flex: 1 }}>
          <Sidebar />
          <View style={{ flex: 1 }}>
            <Topbar />
            <View style={{ flex: 1, paddingHorizontal: 20, paddingVertical: 16 }}>
              <Slot />
            </View>
          </View>
        </View>
      </SidebarProvider>
    </PaperProvider>
  );
}
