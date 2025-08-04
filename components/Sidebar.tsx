import { View, Text, Image } from "react-native";
import { useRouter, usePathname } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useSidebar } from "../context/SidebarContext";
import { useAuth } from "../context/AuthContext";
import { useCustomTheme } from "../hooks/useCustomTheme";

const menuItems = [
  {
    label: "Dashboard",
    icon: "view-dashboard",
    path: "/dashboard",
    roles: ["admin", "owner", "spv", "cashier"],
  },
  {
    label: "Membership",
    icon: "wallet-membership",
    path: "/membership",
    roles: ["admin", "owner", "spv", "cashier"],
  },
  {
    label: "Manajemen User",
    icon: "account-multiple",
    path: "/user",
    roles: ["admin", "owner", "spv"],
  },
  // {
  //   label: "Transaksi",
  //   icon: "cash-register",
  //   path: "/transaction",
  //   roles: ["admin", "owner", "spv", "cashier"],
  // },
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
  const { colors } = useCustomTheme();

  const visibleMenus = menuItems.filter((item) =>
    item.roles.includes(user?.role_name || "kasir")
  );

  return (
    <View
      style={{
        width: collapsed ? 64 : 220,
        backgroundColor: colors.background,
        height: "100%",
        paddingTop: 10,
        paddingHorizontal: 8,
        borderRightWidth: 1,
        borderRightColor: colors.border,
      }}
    >
      <View style={{ alignItems: "center", marginVertical: 10 }}>
        <Image
          source={
            collapsed
              ? require("../assets/logo.png")
              : require("../assets/logo-text.png")
          }
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
            backgroundColor: pathname.split("/").includes(item.path.replaceAll('/', ''))
              ? colors.text
              : "transparent",
            borderRadius: 8,
          }}
          onTouchEnd={() => router.push(item.path)}
        >
          <MaterialCommunityIcons
            name={item.icon as any}
            size={26}
            style={{
              color: pathname.split("/").includes(item.path.replaceAll('/', ''))
                ? colors.background
                : colors.text,
            }}
          />
          {!collapsed && (
            <Text
              style={{
                color: pathname.split("/").includes(item.path.replaceAll('/', ''))
                  ? colors.background
                  : colors.text,
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
