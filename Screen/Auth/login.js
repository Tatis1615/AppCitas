import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../Src/Config";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👈 controlamos visibilidad

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Por favor ingresa los datos");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.access_token) {
        await AsyncStorage.setItem("token", data.access_token);

        if (data.user) {
          await AsyncStorage.setItem("paciente_email", email);
          await AsyncStorage.setItem("user_role", data.user.role);
        }

        alert(data.message);

        if (data.user && data.user.role === "admin") {
          navigation.navigate("Inicio");
        } else if (data.user && data.user.role === "paciente") {
          navigation.navigate("InicioPaciente");
        } else {
          alert("Rol no reconocido, consulta con el administrador.");
        }
      } else {
        alert(data.message || "Error en el login");
      }
    } catch (error) {
      console.error(error);
      alert("No se pudo conectar con el servidor");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💖 Iniciar Sesión 💖</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo"
        placeholderTextColor="#cc6699"
        value={email}
        onChangeText={setEmail}
      />

      {/* Input con botón de mostrar/ocultar contraseña */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.input, { flex: 1, marginVertical: 0 }]}
          placeholder="Contraseña"
          placeholderTextColor="#cc6699"
          secureTextEntry={!showPassword} // 👈 aquí cambia
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          style={styles.eyeButton}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Text style={{ fontSize: 18 }}>
            {showPassword ? "👀" : "🔒"}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Ingresar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={() => navigation.navigate("Registro")}
      >
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffe6f0",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: "#cc3366",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ff99bb",
    backgroundColor: "#fff0f5",
    padding: 12,
    marginVertical: 8,
    borderRadius: 12,
    fontSize: 16,
    color: "#660033",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ff99bb",
    backgroundColor: "#fff0f5",
    borderRadius: 12,
    marginVertical: 8,
    paddingRight: 10,
  },
  eyeButton: {
    padding: 8,
  },
  button: {
    backgroundColor: "#ff80aa",
    paddingVertical: 15,
    borderRadius: 25,
    marginVertical: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  secondaryButton: {
    backgroundColor: "#ff4d94",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});
