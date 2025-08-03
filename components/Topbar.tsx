import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import * as Sharing from "expo-sharing";
import { useSidebar } from "../context/SidebarContext";
import { View, Text, Image, TouchableOpacity } from "react-native";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { Badge, Menu } from "react-native-paper";
import { useThemeContext } from "../context/ThemeContext";
import { useCustomTheme } from "../hooks/useCustomTheme";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

import { ActivityIndicator, Modal } from "react-native";

export default function Topbar() {
  const { toggle } = useSidebar();
  const { toggleTheme, isDark } = useThemeContext();
  const { colors } = useCustomTheme();
  const { logout, user } = useAuth();

  const [menuVisible, setMenuVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const exportDatabase = async () => {
    setLoading(true);
    try {
      const dbUri = `${FileSystem.documentDirectory}SQLite/app.db`;
      const fileInfo = await FileSystem.getInfoAsync(dbUri);

      if (!fileInfo.exists) {
        alert("Database tidak ditemukan.");
        return;
      }

      await Sharing.shareAsync(dbUri);
    } catch (error) {
      alert("Gagal ekspor database.");
    } finally {
      setLoading(false);
    }
  };

  const importDatabase = async () => {
    setLoading(true);
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: "*/*" });
      if (result.canceled) return;

      const sourceUri = result.assets[0].uri;
      const destUri = `${FileSystem.documentDirectory}SQLite/app.db`;

      await FileSystem.copyAsync({ from: sourceUri, to: destUri });
      alert("Database berhasil diimpor.");
    } catch (error) {
      alert("Gagal impor database.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: colors.background,
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}
    >
      {/* Left: Toggle + Title */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity
          onPress={toggle}
          style={{ padding: 8 }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="menu" size={28} style={{ color: colors.text }} />
        </TouchableOpacity>
      </View>

      {/* Right: Search, Bell, Avatar */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity
          onPress={toggleTheme}
          style={{ padding: 8, marginRight: 30 }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon
            name={isDark ? "white-balance-sunny" : "moon-waning-crescent"}
            size={24}
            style={{ color: colors.text }}
          />
        </TouchableOpacity>
        {/* <TouchableOpacity style={{ marginRight: 16 }}>
          <Icon name="magnify" size={24} color="#333" />
        </TouchableOpacity>

        <View style={{ position: "relative", marginRight: 16 }}>
          <TouchableOpacity>
            <Icon name="bell-outline" size={24} color="#333" />
          </TouchableOpacity>
          <Badge
            visible
            size={8}
            style={{ position: "absolute", top: 0, right: 0 }}
          />
        </View> */}

        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          anchor={
            <TouchableOpacity onPress={openMenu}>
              <Image
                source={{ uri: "https://i.pravatar.cc/100" }}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  marginRight: 40,
                }}
              />
            </TouchableOpacity>
          }
        >
          {["admin", "owner"].includes(user.role_name) && (
            <>
              <Menu.Item
                onPress={() => {
                  closeMenu();
                  exportDatabase();
                }}
                title="Export Data"
                leadingIcon="database-export"
              />
              <Menu.Item
                onPress={() => {
                  closeMenu();
                  importDatabase();
                }}
                title="Import Data"
                leadingIcon="database-import"
              />
            </>
          )}
          <Menu.Item
            onPress={() => {
              closeMenu();
              logout();
            }}
            title="Logout"
            leadingIcon="logout"
          />
        </Menu>
      </View>
      <Modal visible={loading} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color="#fff" />
          <Text style={{ color: "#fff", marginTop: 10 }}>Memproses...</Text>
        </View>
      </Modal>
    </View>
  );
}
