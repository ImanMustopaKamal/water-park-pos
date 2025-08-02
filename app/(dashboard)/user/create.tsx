import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text, TextInput, Button, HelperText, Menu } from "react-native-paper";
import { useCustomTheme } from "../../../hooks/useCustomTheme";
import Container from "../../../components/Container";

export default function UserCreate() {
  const { colors } = useCustomTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [username, setUsername] = useState("");
  const [nama, setNama] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [role, setRole] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);

  const roles = ["OWNER", "ADMIN", "SPV", "KASIR"];

  const handleSubmit = () => {
    if (password !== confirmPassword) {
      alert("Password dan konfirmasi tidak sama!");
      return;
    }

    const newUser = {
      username,
      nama,
      password,
      role,
    };

    console.log("Submit user:", newUser);
    // TODO: kirim ke backend
  };

  return (
    <Container title="Tambah User">
      <TextInput
        mode="outlined"
        label="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        mode="outlined"
        label="Nama Lengkap"
        value={nama}
        onChangeText={setNama}
        style={styles.input}
        theme={{
          colors: {
            primary: colors.text
          },
        }}
      />
      <TextInput
        mode="outlined"
        label="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
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
        secureTextEntry={!showConfirmPassword}
        right={
          <TextInput.Icon
            icon={showConfirmPassword ? "eye-off" : "eye"}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          />
        }
      />

      <View style={{ marginBottom: 16, width: "70%" }}>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <TextInput
              mode="outlined"
              label="Role"
              value={role}
              onFocus={() => setMenuVisible(true)}
              style={styles.input}
              editable={false}
            />
          }
        >
          {roles.map((item) => (
            <Menu.Item
              key={item}
              onPress={() => {
                setRole(item);
                setMenuVisible(false);
              }}
              title={item}
            />
          ))}
        </Menu>
      </View>

      <Button
        mode="contained"
        onPress={handleSubmit}
        style={{ width: "70%", marginTop: 16 }}
      >
        Simpan User
      </Button>
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
