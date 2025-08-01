import { useSidebar } from "../context/SidebarContext";
import { View, Text, Image, TouchableOpacity } from "react-native";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { Badge } from "react-native-paper";

export default function Topbar() {
  const { toggle } = useSidebar();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#ffffff",
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#dbd8d86b",
      }}
    >
      {/* Left: Toggle + Title */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity
          onPress={toggle}
          style={{ padding: 8 }} // tambah padding agar area sentuh lebih luas
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // opsional: perluas area klik
        >
          <Icon name="menu" size={28} style={{ color: "#324eebff" }} />
        </TouchableOpacity>
        {/* <Text style={{ fontSize: 18, fontWeight: "bold", marginLeft: 12 }}>
          Dashboard
        </Text> */}
      </View>

      {/* Right: Search, Bell, Avatar */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
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

        <Image
          source={{ uri: "https://i.pravatar.cc/100" }}
          style={{ width: 36, height: 36, borderRadius: 18 }}
        />
        {/* <Text style={{ fontSize: 16, fontWeight: "500", marginLeft: 10 }}>hello</Text> */}
      </View>
    </View>
  );
}
