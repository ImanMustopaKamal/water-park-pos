import { View } from "react-native";
import { Card, Text, ProgressBar } from "react-native-paper";
import { useCustomTheme } from "../../../hooks/useCustomTheme";

export default function Dashboard() {
  const { colors } = useCustomTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: 16 }}>
      <Text
        variant="headlineMedium"
        style={{ marginBottom: 16, color: colors.text }}
      >
        Dashboard
      </Text>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 16 }}>
        <StatCard
          label="Invoices Awaiting Payment"
          value="45/76"
          amount="$5,569"
          progress={0.56}
          color="blue"
        />
        <StatCard
          label="Converted Leads"
          value="48/86"
          amount="52 Completed"
          progress={0.63}
          color="orange"
        />
        <StatCard
          label="Projects In Progress"
          value="16/20"
          amount="16 Completed"
          progress={0.78}
          color="green"
        />
        <StatCard
          label="Conversion Rate"
          value="46.59%"
          amount="$2,254"
          progress={0.46}
          color="red"
        />
      </View>
    </View>
  );
}

function StatCard({ label, value, amount, progress, color }: any) {
  return (
    <Card style={{ width: "48%", marginBottom: 16 }}>
      <Card.Content>
        <Text variant="titleLarge">{value}</Text>
        <Text>{label}</Text>
        <ProgressBar
          progress={progress}
          color={color}
          style={{ marginTop: 8, height: 6, borderRadius: 4 }}
        />
        <Text style={{ marginTop: 4 }}>{amount}</Text>
      </Card.Content>
    </Card>
  );
}
