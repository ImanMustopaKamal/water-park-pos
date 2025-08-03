import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { TextInput, Button, ActivityIndicator } from "react-native-paper";
import { useCustomTheme } from "../../../hooks/useCustomTheme";
import Container from "../../../components/Container";
import { getAllRole } from "../../../database/services/roleService";
import DropdownComponent from "../../../components/Dropdown";
import { router } from "expo-router";
import { createUser } from "../../../database/services/userService";
import { useSnackbar } from "../../../components/SnackbarProvider";

interface IRoles {
  label: string;
  value: number;
}

export default function UserCreate() {
  const { colors } = useCustomTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [nama, setNama] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [roles, setRoles] = useState<IRoles[]>([{ label: "", value: 0 }]);
  const [role, setRole] = useState<number>(0);

  const { showSnackbar } = useSnackbar();

  const handleSubmit = async () => {
    setLoading(true);
    if (password.length < 4) {
      alert("Password minimal 4 karakter");
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setLoading(false);
      alert("Password dan konfirmasi tidak sama!");
      return;
    }

    const newUser = {
      username,
      name: nama,
      password,
      role_id: role,
    };

    try {
      const result = await createUser(newUser);
      if (result) {
        setLoading(false);
        showSnackbar("Data berhasil disimpan!", "success");
        router.replace("/user");
      }
    } catch (error: any) {
      setLoading(false);
      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === "string"
          ? error
          : "Terjadi kesalahan saat menyimpan data";

      showSnackbar(errorMessage, "error");
    }
  };

  const loadData = async () => {
    const data = await getAllRole();
    if (data.length !== 0) {
      const mapped: IRoles[] = data.map((item) => ({
        label: item.name,
        value: item.id,
      }));
      setRoles(mapped);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Container title="Tambah User">
      <View
        style={{
          marginBottom: 16,
          width: "70%",
          justifyContent: "flex-start",
        }}
      >
        <ScrollView>
          <DropdownComponent
            title="Roles"
            data={roles}
            onChange={(i: any) => setRole(i)}
            value={role}
          />
        </ScrollView>
      </View>

      <TextInput
        mode="outlined"
        label="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        autoCapitalize="none"
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
        value={nama}
        onChangeText={setNama}
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
        label="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        theme={{
          colors: {
            primary: colors.text,
            text: colors.text,
            placeholder: colors.text,
          },
        }}
        secureTextEntry={!showPassword}
        right={
          <TextInput.Icon
            icon={showPassword ? "eye-off" : "eye"}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
      />

      <TextInput
        mode="outlined"
        label="Konfirmasi Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        style={styles.input}
        theme={{
          colors: {
            primary: colors.text,
            text: colors.text,
            placeholder: colors.text,
          },
        }}
        secureTextEntry={!showConfirmPassword}
        right={
          <TextInput.Icon
            icon={showConfirmPassword ? "eye-off" : "eye"}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          />
        }
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
          onPress={() => router.replace("/user")}
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
          {loading ? "Loading..." : "Simpan User"}
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
