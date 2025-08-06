import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { TextInput, Button, ActivityIndicator, Text } from "react-native-paper";
import { useCustomTheme } from "../../../hooks/useCustomTheme";
import Container from "../../../components/Container";
import DropdownComponent from "../../../components/Dropdown";
import { router, useLocalSearchParams } from "expo-router";
import { useSnackbar } from "../../../components/SnackbarProvider";
import { getAllMemberCatogories } from "../../../database/services/MemberCategoryServices";
import {
  getMembership,
  updateMembership,
} from "../../../database/services/membershipServices";
import { dateFormat } from "../../../utils/dateFormat";

interface IDropdown {
  label: string;
  value: number;
}

export default function MembershipCreate() {
  const { colors } = useCustomTheme();
  const { id } = useLocalSearchParams();
  const selectedId = Array.isArray(id) ? id[0] : id;
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<number>(1);
  const [description, setDescription] = useState("");
  const [expire, setExpire] = useState("");
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState(0);
  const [extendPeriod, setExtendPeriod] = useState("");

  const [mcCategory, setMcCategory] = useState<IDropdown[]>([
    { label: "", value: 0 },
  ]);

  const { showSnackbar } = useSnackbar();

  const handleSubmit = async () => {
    if (name === "") {
      alert("Masukan nama member");
      return;
    }
    if (code === "") {
      alert("Masukan kode member");
      return;
    }
    if (category === 0) {
      alert("Pilih kategori member");
      return;
    }
    setLoading(true);
    const payload = {
      name,
      description,
      category_id: category,
      code,
      extendPeriod,
      phone,
      id: selectedId,
    };
    console.log("🚀 ~ handleSubmit ~ payload:", payload);

    try {
      const result = await updateMembership(payload);
      console.log("🚀 ~ handleSubmit ~ result:", result);
      if (result) {
        setLoading(false);
        showSnackbar("Data berhasil diupdate!", "success");
        router.replace("/membership");
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

  const loadData = async (id: string) => {
    try {
      const result = await getMembership(id);
      if (result) {
        const endAt = await dateFormat(result.end_at);
        setCategory(result.category_id);
        setName(result.name);
        setDescription(result.description);
        setCode(result.code);
        setExpire(endAt);
        setStatus(result.status);
        setPhone(result?.phone || "");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === "string"
          ? error
          : "Terjadi kesalahan pada server";

      showSnackbar(errorMessage, "error");
    }
  };

  const getCategory = async () => {
    const data = await getAllMemberCatogories();
    if (data.length !== 0) {
      const mapped: IDropdown[] = data.map((item) => ({
        label: item.name,
        value: item.id,
      }));
      setMcCategory(mapped);
    }
  };

  const handleChangeCategory = async (item: any) => {
    console.log("🚀 ~ handleChangeCategory ~ item:", item);
    setCategory(item);
  };

  useEffect(() => {
    if (selectedId) {
      getCategory();
      loadData(selectedId);
    }
  }, [selectedId]);

  return (
    <Container title="Ubah Membership">
      <View
        style={{
          marginBottom: 16,
          width: "70%",
          justifyContent: "flex-start",
        }}
      >
        <ScrollView>
          <DropdownComponent
            title="Kategori Member"
            data={mcCategory}
            onChange={(i: any) => setCategory(i)}
            value={category}
          />
        </ScrollView>
      </View>

      <TextInput
        mode="outlined"
        label="Kode Membership"
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

      <TextInput
        mode="outlined"
        label="Nama Lengkap"
        value={name}
        onChangeText={setName}
        style={styles.input}
        theme={{
          colors: {
            primary: colors.text,
            text: colors.text,
            placeholder: colors.text,
          },
        }}
      />

      <TextInput
        mode="outlined"
        label="No Telepon"
        value={phone}
        onChangeText={setPhone}
        style={styles.input}
        theme={{
          colors: {
            primary: colors.text,
            text: colors.text,
            placeholder: colors.text,
          },
        }}
      />

      <TextInput
        mode="outlined"
        label="Keterangan"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        style={{ ...styles.input, height: 120 }}
        theme={{
          colors: {
            primary: colors.text,
            text: colors.text,
            placeholder: colors.text,
          },
        }}
      />

      <TextInput
        mode="outlined"
        label="Berlaku sampai"
        value={expire}
        onChangeText={setExpire}
        style={styles.input}
        theme={{
          colors: {
            primary: colors.text,
            text: colors.text,
            placeholder: colors.text,
          },
        }}
      />

      <TextInput
        mode="outlined"
        label="Perpanjang masa aktif"
        inputMode="numeric"
        value={extendPeriod}
        onChangeText={setExtendPeriod}
        style={styles.input}
        theme={{
          colors: {
            primary: colors.text,
            text: colors.text,
            placeholder: colors.text,
          },
        }}
      />
      <View style={{ width: "70%" }}>
        <Text
          style={{
            backgroundColor: status === 1 ? "#4CAF50" : "#F44336",
            color: "#fff",
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 10,
            fontSize: 14,
            // width: "70%",
            alignSelf: "flex-start",
          }}
        >
          {status === 1 ? "Aktif" : "Expired"}
        </Text>
      </View>

      <View
        style={{
          width: "70%",
          justifyContent: "flex-end",
          flexDirection: "row",
          gap: 20,
        }}
      >
        <Button
          mode="outlined"
          onPress={() => router.replace("/membership")}
          style={{ width: "30%", marginTop: 16 }}
        >
          Kembali
        </Button>
        <Button
          mode="contained"
          onPress={handleSubmit}
          disabled={loading}
          style={{ width: "30%", marginTop: 16 }}
          icon={
            loading
              ? () => (
                  <ActivityIndicator color={colors.background} size="small" />
                )
              : undefined
          }
        >
          {loading ? "Loading..." : "Ubah Membership"}
        </Button>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  input: {
    width: "70%",
    marginBottom: 16,
    height: 50,
  },
});
