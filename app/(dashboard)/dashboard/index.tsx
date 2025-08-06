import { View } from "react-native";
import { Card, Text, ProgressBar, Divider } from "react-native-paper";
import { useCustomTheme } from "../../../hooks/useCustomTheme";
import { useEffect, useState } from "react";
import { getAllUsers } from "../../../database/services/userService";
import { getAllMembers } from "../../../database/services/membershipServices";

export default function Dashboard() {
  const [users, setUsers] = useState<number>(0);
  const [members, setMembers] = useState<number>(0);
  const { colors } = useCustomTheme();

  const loadUser = async () => {
    try {
      const result = await getAllUsers({ page: 0, limit: 2, search: "" });
      if (result) {
        setUsers(result.total);
      }
    } catch (error) {
      console.log("🚀 ~ loadUser ~ error:", error);
    }
  };

  const loadMember = async () => {
    try {
      const result = await getAllMembers({ page: 0, limit: 2, search: "", status: true });
      if (result) {
        setMembers(result.total);
      }
    } catch (error) {
      console.log("🚀 ~ loadMember ~ error:", error);
    }
  };

  useEffect(() => {
    loadUser();
    loadMember();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: 16 }}>
      <Text
        variant="headlineMedium"
        style={{ marginBottom: 16, color: colors.text }}
      >
        Dashboard
      </Text>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 16 }}>
        <StatCard value={members} label="Total Member Aktif" color="blue" />
        <StatCard value={users} label="Total User" color="orange" />
      </View>
    </View>
  );
}

function StatCard({ label, value, color }: any) {
  return (
    <Card style={{ width: "48%", marginBottom: 16 }}>
      <Card.Content>
        <Text variant="headlineSmall" style={{ marginBottom: 10 }}>
          {label}
        </Text>
        <Divider />
        <Text variant="headlineLarge" style={{ color, marginTop: 10 }}>
          {value}
        </Text>
      </Card.Content>
    </Card>
  );
}
