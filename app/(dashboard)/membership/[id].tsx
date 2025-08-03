import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { TextInput, Button, ActivityIndicator } from "react-native-paper";
import { useCustomTheme } from "../../../hooks/useCustomTheme";
import Container from "../../../components/Container";
import DropdownComponent from "../../../components/Dropdown";
import { router, useLocalSearchParams } from "expo-router";
import { useSnackbar } from "../../../components/SnackbarProvider";
import { getAllMemberCatogories } from "../../../database/services/MemberCategoryServices";
import {
  createMembership,
  getMembership,
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
  const [description, setDescription] = useState("");
  const [expire, setExpire] = useState("");
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<number>(0);
  const [categoryOld, setCategoryOld] = useState<number>(0);

  const [mcCategory, setMcCategory] = useState<IDropdown[]>([
    { label: "", value: 0 },
  ]);

  const { showSnackbar } = useSnackbar();

  const handleSubmit = async () => {
    setLoading(true);
    const payload = {
      name,
      description,
      category_id: category,
    };

    try {
      const result = await createMembership(payload);
      if (result) {
        setLoading(false);
        showSnackbar("Data berhasil disimpan!", "success");
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
        setCategoryOld(result.category_id)
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
    console.log("🚀 ~ handleChangeCategory ~ item:", item)
    setCategory(item)
  }

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
            onChange={handleChangeCategory}
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
        readOnly
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
        readOnly
        theme={{
          colors: {
            primary: colors.text,
            text: colors.text,
            placeholder: colors.text,
          },
        }}
      />

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
              ? () => <ActivityIndicator color="white" size="small" />
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
