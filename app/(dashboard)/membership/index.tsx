import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { useCustomTheme } from "../../../hooks/useCustomTheme";
import Container from "../../../components/Container";

export default function UserCreate() {
  return (
    <Container
      title="List Membership"
      addButton={{ name: "Buat Membership", path: "membership" }}
    >
      <Text>test</Text>
    </Container>
  );
}
