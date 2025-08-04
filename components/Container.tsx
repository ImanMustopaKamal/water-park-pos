import { StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Badge,
  Button,
  Chip,
  Dialog,
  Portal,
  Text,
  TextInput,
} from "react-native-paper";
import { useCustomTheme } from "../hooks/useCustomTheme";
import { router } from "expo-router";
import { useState } from "react";
import { checkMembership } from "../database/services/membershipServices";
import { Membership } from "../database/models/Membership";
import { dateFormat } from "../utils/dateFormat";
import { useSnackbar } from "./SnackbarProvider";

type ContainerProps = {
  title: string;
  children: React.ReactNode;
  addButton?: any;
  validateButton?: any;
};

export default function Container({
  title,
  children,
  addButton,
  validateButton,
}: ContainerProps) {
  const { colors } = useCustomTheme();

  const [modal, setModal] = useState<boolean>(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [payload, setPayload] = useState<Membership | null>(null);

  const { showSnackbar } = useSnackbar();

  const handleValidate = async () => {
    try {
      setLoading(true);
      const result = await checkMembership(code);
      if (result) {
        setPayload(result);
        setLoading(false);
      }
    } catch (error: any) {
      setLoading(false);
      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === "string"
          ? error
          : "Terjadi kesalahan pada server";

      showSnackbar(errorMessage, "error");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: 16 }}>
      <Text
        variant="headlineMedium"
        style={{ marginBottom: 16, color: colors.text }}
      >
        {title}
      </Text>
      <View style={{ flexDirection: "row", gap: 15 }}>
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
        {validateButton && (
          <Button
            icon="checkbox-marked-circle-outline"
            mode="contained"
            buttonColor={colors.text}
            textColor={colors.background}
            labelStyle={{ fontWeight: "bold" }}
            onPress={() => setModal(true)}
            style={{ marginVertical: 20 }}
          >
            Check
          </Button>
        )}
      </View>
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
      <Portal>
        <Dialog
          visible={modal}
          onDismiss={() => {
            setPayload(null);
            setModal(false);
          }}
          style={{
            borderRadius: 10,
            width: "55%",
            alignSelf: "center",
            backgroundColor: colors.background,
          }}
        >
          <Dialog.Title>Check Membership</Dialog.Title>
          <Dialog.Content>
            <TextInput
              mode="outlined"
              label="Masukkan Kode Membership"
              value={code}
              onChangeText={setCode}
              style={styles.input}
              theme={{
                colors: {
                  primary: colors.text,
                  text: colors.text,
                  placeholder: colors.text,
                },
              }}
            />
            {payload && (
              <View>
                <Text style={{ marginBottom: 5 }}>Nama: {payload.name}</Text>
                <Text style={{ marginBottom: 5 }}>
                  Membership: {payload.category_name}
                </Text>
                <Text style={{ marginBottom: 5 }}>
                  Tanggal Mulai: {dateFormat(payload.start_at)}
                </Text>
                <Text style={{ marginBottom: 10 }}>
                  Tanggal Akhir: {dateFormat(payload.end_at)}
                </Text>
                <Text
                  style={{
                    backgroundColor:
                      payload.status === 1 ? "#4CAF50" : "#F44336",
                    color: "#fff",
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 10,
                    fontSize: 14,
                    alignSelf: "flex-start",
                  }}
                >
                  {payload.status === 1 ? "Aktif" : "Tidak Aktif"}
                </Text>
              </View>
            )}
            <Button
              mode="contained"
              buttonColor={colors.text}
              textColor={colors.background}
              labelStyle={{ fontWeight: "bold" }}
              onPress={handleValidate}
              style={{ marginTop: 20 }}
              icon={
                loading
                  ? () => <ActivityIndicator color="white" size="small" />
                  : "checkbox-marked-circle-outline"
              }
            >
              Check
            </Button>
          </Dialog.Content>
        </Dialog>
      </Portal>
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
  input: {
    width: "100%",
    marginBottom: 16,
    height: 50,
    alignSelf: "center",
  },
});
