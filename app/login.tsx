import { useState } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  Image,
  Pressable,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebaseConfig";

export default function LoginScreen({ navigation }: { navigation: any }) {
  // const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ username: "", password: "" });
  const [authError, setAuthError] = useState("");

  const validateFields = () => {
    let valid = true;
    const newErrors = { username: "", password: "" };
    if (!username) {
      newErrors.username = "No has ingresado un usuario";
      valid = false;
    }

    if (!username.includes("@")) {
      // setErrors({...errors, email: 'Debe ingresar un correo electrónico válido.' });
      newErrors.username = "Debe ingresar un correo electrónico";
      valid = false;
    }

    if (!password) {
      newErrors.password = "Falta la contraseña";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleLogin = () => {
    if (validateFields()) {
      // Continue with login logic if fields are valid
      signInWithEmailAndPassword(auth, username, password)
        .then(() => {
          navigation.navigate("MainTabs" as never);
          setUsername("");
          setPassword("");
        })
        .catch((error: any) => {
          setAuthError("Usuario o contraseña incorrectos.");
          console.error("Error signing in:", error);
        });
    }
  };

  const goToRegister = () => {
    handleRestartForm();
    navigation.navigate("Register" as never);
  };

  const handleRestartForm = () => {
    setUsername("");
    setPassword("");
    setErrors({ username: "", password: "" });
    setAuthError("");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
        />
      </View>

      <View style={styles.inputUsernameContainer}>
        <Text style={styles.label}>Usuario</Text>
        <TextInput
          placeholder="Usuario"
          style={[styles.input, errors.username ? styles.inputError : null]}
          autoCapitalize="none"
          keyboardType="email-address"
          value={username}
          onChangeText={(text) => setUsername(text)}
        />
        {errors.username ? (
          <Text style={styles.errorText}>{errors.username}</Text>
        ) : null}
      </View>

      <View style={styles.inputPasswordContainer}>
        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          placeholder="Contraseña"
          style={[styles.input, errors.password ? styles.inputError : null]}
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        {errors.password ? (
          <Text style={styles.errorText}>{errors.password}</Text>
        ) : null}
        {/* Autentication error */}
        {authError ? <Text style={styles.authError}>{authError}</Text> : null}
      </View>

      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={handleLogin}>
          <Text style={styles.textButton}>Ingresar</Text>
        </Pressable>
      </View>

      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>¿No tienes una cuenta? </Text>
        <TouchableOpacity onPress={goToRegister}>
          <Text style={styles.registerLink}>Crear</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  header: {
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 190,
    height: 150,
    marginTop: 0,
    marginBottom: 30,
  },
  input: {
    width: "100%",
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ECECF3",
    borderRadius: 5,
    backgroundColor: "#ECECF3",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 50,
    elevation: 3,
    backgroundColor: "#36AEBE",
    marginTop: 20,
    width: "60%",
  },
  textButton: {
    fontSize: 18,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  registerContainer: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 25,
    justifyContent: "center",
  },
  registerText: {
    color: "#000000",
  },
  registerLink: {
    color: "#0000ff",
    textDecorationLine: "underline",
  },
  inputError: {
    borderColor: "#e74c3c",
  },
  errorText: {
    color: "#e74c3c",
    marginBottom: 10,
    textAlign: "left",
  },
  authError: {
    color: "#e74c3c",
    marginBottom: 10,
    textAlign: "left",
  },
  inputUsernameContainer: {
    marginBottom: 20,
  },
  inputPasswordContainer: {
    marginBottom: 0,
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4, // space between label and input
    textAlign: "left",
    fontWeight: "bold",
  },
});
