import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { TextInput, Button, ActivityIndicator } from "react-native-paper";
import { useCustomTheme } from "../../../hooks/useCustomTheme";
import Container from "../../../components/Container";
import { getAllRole } from "../../../database/services/roleService";
import DropdownComponent from "../../../components/Dropdown";
import { router, useLocalSearchParams } from "expo-router";
import {
  getUser,
  updateUser,
} from "../../../database/services/userService";
import { useSnackbar } from "../../../components/SnackbarProvider";

interface IDropdown {
  label: string;
  value: number;
}

export default function UserEdit() {
  const { id } = useLocalSearchParams();
  const selectedId = Array.isArray(id) ? id[0] : id;
  const { colors } = useCustomTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [nama, setNama] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [roles, setRoles] = useState<IDropdown[]>([{ label: "", value: 0 }]);
  const [role, setRole] = useState<number>(0);

  const { showSnackbar } = useSnackbar();

  const handleSubmit = async () => {
    setLoading(true);
    if (password !== "" && confirmPassword !== "") {
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
    }

    const newUser = {
      id: selectedId,
      username,
      name: nama,
      password: password,
      oldPassword,
      role_id: role,
    };
    console.log("🚀 ~ handleSubmit ~ newUser:", newUser);

    try {
      const result = await updateUser(newUser);
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
          : "Terjadi kesalahan pada server";

      showSnackbar(errorMessage, "error");
    }
  };

  const getRole = async () => {
    const data = await getAllRole();
    if (data.length !== 0) {
      const mapped: IDropdown[] = data.map((item) => ({
        label: item.name,
        value: item.id,
      }));
      setRoles(mapped);
    }
  };

  const loadData = async (id: string) => {
    try {
      const result = await getUser(id);
      if (result) {
        setUsername(result.username);
        setNama(result.name);
        setRole(result.role_id);
        setOldPassword(result.password);
      }
      console.log("🚀 ~ loadData ~ result:", result);
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

  useEffect(() => {
    if (selectedId) {
      getRole();
      loadData(selectedId); 
    }
  }, [selectedId]);

  return (
    <Container title="Edit User">
      <View
        style={{
          marginBottom: 16,
          width: "70%",
          justifyContent: "flex-start",
          zIndex: 10,
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
        readOnly
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
        label="Password Baru"
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
        label="Konfirmasi Password Baru"
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
              ? () => <ActivityIndicator color={colors.background} size="small" />
              : undefined
          }
        >
          {loading ? "Loading..." : "Ubah User"}
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
