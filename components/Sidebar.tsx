import { View, Text, Image } from "react-native";
import { useRouter, usePathname } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useSidebar } from "../context/SidebarContext";
import { useAuth } from "../context/AuthContext";

const menuItems = [
  {
    label: "Dashboard",
    icon: "view-dashboard",
    path: "/",
    roles: ["admin", "kasir", "spv"],
  },
  { label: "Transaksi", icon: "cart", path: "/transaksi", roles: ["kasir"] },
  {
    label: "Manajemen User",
    icon: "account-multiple",
    path: "/users",
    roles: ["admin"],
  },
  {
    label: "Laporan",
    icon: "file-chart",
    path: "/laporan",
    roles: ["admin", "spv"],
  },
];

export default function Sidebar() {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { collapsed } = useSidebar();

  const visibleMenus = menuItems.filter((item) =>
    item.roles.includes(user?.role_name || 'admin')
  );

  return (
    <View
      style={{
        width: collapsed ? 64 : 240,
        backgroundColor: "#1F1F2E",
        height: "100%",
        paddingTop: 40,
        paddingHorizontal: 8,
      }}
    >
      <View style={{ alignItems: "center", marginBottom: 24 }}>
        <Image
          source={require("../assets/logo.jpg")} // ganti path ini sesuai lokasi logomu
          style={{
            width: collapsed ? 40 : 120,
            height: 40,
            resizeMode: "contain",
          }}
        />
      </View>
      {visibleMenus.map((item) => (
        <View
          key={item.path}
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 12,
            paddingHorizontal: 8,
            backgroundColor: pathname === item.path ? "#333" : "transparent",
            borderRadius: 8,
          }}
          onTouchEnd={() => router.push(item.path)}
        >
          <MaterialCommunityIcons
            name={item.icon as any}
            size={24}
            color="white"
          />
          {!collapsed && (
            <Text style={{ color: "white", marginLeft: 12 }}>{item.label}</Text>
          )}
        </View>
      ))}
    </View>
  );
}
