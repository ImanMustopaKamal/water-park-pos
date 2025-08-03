import * as React from "react";
import { View, Image, StyleSheet, useWindowDimensions } from "react-native";
import { TextInput, Button, Text, Divider } from "react-native-paper";
import { Redirect, router } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { useSnackbar } from "../components/SnackbarProvider";

export default function LoginScreen() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const { user, login } = useAuth();
  const { width } = useWindowDimensions();
  const { showSnackbar } = useSnackbar();

  const handleLogin = async () => {
    try {
      await login(username, password);
      showSnackbar("login berhasil", "success");
      router.replace("/dashboard");
    } catch (error: any) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === "string"
          ? error
          : "Terjadi kesalahan pada server";

      showSnackbar(errorMessage, "error");
      // setError(err.message);
    }
  };

  if (user) {
    return <Redirect href="/dashboard" />;
  }

  return (
    <View style={styles.container}>
      {/* Left: Form */}
      <View style={styles.leftContainer}>
        {/* <Image
          source={{ uri: "https://i.pravatar.cc/100" }}
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            marginRight: 40,
            alignSelf: "center"
          }}
        /> */}
        <Text variant="titleLarge" style={styles.title}>
          Get Started
        </Text>

        <TextInput
          label="Username"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          mode="outlined"
        />

        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          mode="outlined"
        />

        <Button mode="contained" onPress={handleLogin} style={styles.button}>
          LOGIN
        </Button>

        <Divider style={styles.divider} />
        {/* <Text style={styles.orText}>OR</Text>

        <Text style={styles.continueWith}>Continue with:</Text>

        <View style={styles.socialButtons}>
          <Button
            icon={() => (
              <FontAwesome name="facebook" size={20} color="#3b5998" />
            )}
            mode="outlined"
            style={styles.socialBtn}
          >
            Facebook
          </Button>
          <Button
            icon={() => <FontAwesome name="google" size={20} color="#DB4437" />}
            mode="outlined"
            style={styles.socialBtn}
          >
            Google
          </Button>
        </View> */}

        {/* <Text style={styles.footerText}>
          By logging in with my Facebook or Google account I agree to the
          <Text style={styles.link}> Terms of Use</Text>. My personal data will
          be processed in accordance with the
          <Text style={styles.link}> Privacy Statement</Text>.
        </Text> */}
      </View>

      {/* Right: Image */}
      {width > 600 && (
        <View style={styles.rightContainer}>
          <Image
            source={require("../assets/bg-login.jpg")} // Ganti dengan file Anda
            style={styles.image}
            resizeMode="cover"
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flex: 1,
    backgroundColor: "#fff",
  },
  leftContainer: {
    flex: 1,
    paddingHorizontal: 40,
    justifyContent: "center",
  },
  rightContainer: {
    flex: 1,
    backgroundColor: "#fde5dd",
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    fontWeight: "bold",
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginBottom: 12,
  },
  divider: {
    marginVertical: 8,
  },
  footerText: {
    marginTop: 16,
    fontSize: 12,
    color: "#777",
  },
  link: {
    color: "#1e88e5",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
