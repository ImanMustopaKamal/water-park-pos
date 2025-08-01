import { View, Text, Image } from "react-native";
import { useRouter, usePathname } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useSidebar } from "../context/SidebarContext";
import { useAuth } from "../context/AuthContext";

const menuItems = [
  {
    label: "Dashboard",
    icon: "view-dashboard",
    path: "/dashboard",
    roles: ["admin", "kasir", "spv"],
  },
  {
    label: "Membership",
    icon: "wallet-membership",
    path: "/dashboard/membership",
    roles: ["admin"],
  },
  {
    label: "Manajemen User",
    icon: "account-multiple",
    path: "/dashboard/user",
    roles: ["admin"],
  },
  { label: "Transaksi", icon: "cash-register", path: "/dashboard/transaction", roles: ["kasir", "admin"] },
  // {
  //   label: "Laporan",
  //   icon: "file-chart",
  //   path: "/dashboard/laporan",
  //   roles: ["admin", "spv"],
  // },
];

export default function Sidebar() {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { collapsed } = useSidebar();

  const visibleMenus = menuItems.filter((item) =>
    item.roles.includes(user?.role_name || "admin")
  );

  return (
    <View
      style={{
        width: collapsed ? 64 : 220,
        backgroundColor: "#ffffffff",
        height: "100%",
        paddingTop: 10,
        paddingHorizontal: 8,
        elevation: 2
      }}
    >
      <View style={{ alignItems: "center", marginVertical: 10 }}>
        <Image
          source={collapsed ? require("../assets/logo.png") : require("../assets/logo-text.png")} // ganti path ini sesuai lokasi logomu
          style={{
            width: collapsed ? 40 : 120,
            height: collapsed ? 40 : 60,
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
            paddingHorizontal: 12,
            // paddingLeft: 12,
            backgroundColor:
              pathname === item.path ? "#324eebff" : "transparent",
            borderRadius: 8,
          }}
          onTouchEnd={() => router.push(item.path)}
        >
          <MaterialCommunityIcons
            name={item.icon as any}
            size={26}
            style={{ color: pathname === item.path ? "#ffffff" : "#324eebff" }}
          />
          {!collapsed && (
            <Text
              style={{
                color: pathname === item.path ? "#ffffff" : "#3254ebff",
                marginLeft: 12,
                flex: 1,
              }}
            >
              {item.label}
            </Text>
          )}
        </View>
      ))}
    </View>
  );
}
