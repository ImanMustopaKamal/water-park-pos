import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { TextInput, Button, ActivityIndicator } from "react-native-paper";
import { useCustomTheme } from "../../../hooks/useCustomTheme";
import Container from "../../../components/Container";
import DropdownComponent from "../../../components/Dropdown";
import { router } from "expo-router";
import { useSnackbar } from "../../../components/SnackbarProvider";
import { getAllMemberCatogories } from "../../../database/services/MemberCategoryServices";
import { createMembership, generateMembershipCode } from "../../../database/services/membershipServices";

interface IDropdown {
  label: string;
  value: number;
}

export default function MembershipCreate() {
  const { colors } = useCustomTheme();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const [mcCategory, setMcCategory] = useState<IDropdown[]>([
    { label: "", value: 0 },
  ]);
  const [category, setCategory] = useState<number>(0);

  const { showSnackbar } = useSnackbar();

  const handleSubmit = async () => {
    setLoading(true);
    const payload = {
      name,
      description,
      category_id: category,
      code
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

  const loadData = async () => {
    const data = await getAllMemberCatogories();
    if (data.length !== 0) {
      const mapped: IDropdown[] = data.map((item) => ({
        label: item.name,
        value: item.id,
      }));
      setMcCategory(mapped);
    }
  };

  const generateCode = async () => {
    try {
      const genetedCode = await generateMembershipCode();
      if(genetedCode) {
        setCode(genetedCode)
      }
      // console.log("🚀 ~ generateCode ~ code:", code)
    } catch (error) {
      console.log("error: ", error)
    }
  };

  useEffect(() => {
    loadData();
    generateCode();
  }, []);

  return (
    <Container title="Tambah Membership">
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
          {loading ? "Loading..." : "Simpan Membership"}
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
