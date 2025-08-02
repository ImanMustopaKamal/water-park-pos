import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { useCustomTheme } from "../hooks/useCustomTheme";
import { router } from "expo-router";

type ContainerProps = {
  title: string;
  children: React.ReactNode;
  addButton?: any;
};

export default function Container({
  title,
  children,
  addButton,
}: ContainerProps) {
  const { colors } = useCustomTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: 16 }}>
      <Text
        variant="headlineMedium"
        style={{ marginBottom: 16, color: colors.text }}
      >
        {title}
      </Text>
      {addButton && (
        <Button
          icon="plus"
          mode="contained"
          buttonColor={colors.text}
          textColor={colors.background}
          labelStyle={{ fontWeight: "bold" }}
          onPress={() => router.push(`/${addButton.path}/create`)}
          style={{ alignSelf: "flex-start", marginVertical: 20 }}
        >
          {addButton.name}
        </Button>
      )}
      <View
        style={{
          ...styles.wrapper,
          shadowColor: colors.text,
          backgroundColor: colors.background,
        }}
      >
        <View style={{ ...styles.content, backgroundColor: colors.background }}>
          {children}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 1,
    elevation: 2,
    borderRadius: 15,
    width: "100%",
  },
  content: {
    padding: 20,
    alignItems: "center",
    width: "100%",
    borderRadius: 15,
  },
});
