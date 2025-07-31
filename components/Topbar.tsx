import { Appbar, Avatar, Badge } from "react-native-paper";
import { useSidebar } from "../context/SidebarContext";
import { View } from "react-native";

export default function Topbar() {
  const { toggle } = useSidebar();

  return (
    <Appbar.Header style={{ backgroundColor: "#fff", elevation: 2 }}>
      <Appbar.Action icon="menu" onPress={toggle} />
      <Appbar.Content title="Dashboard" />
      <Appbar.Action icon="magnify" />
      <View style={{ position: "relative", marginRight: 10 }}>
        <Appbar.Action icon="bell-outline" />
        <Badge visible size={8} style={{ position: "absolute", top: 8, right: 8 }} />
      </View>
      <Avatar.Image
        size={36}
        source={{ uri: "https://i.pravatar.cc/100" }}
        style={{ marginRight: 10 }}
      />
    </Appbar.Header>
  );
}
