import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert 
} from "react-native";
import { Picker } from "@react-native-picker/picker"; // 👈 para el selector
import AsyncStorage from "@react-native-async-storage/async-storage"; 
import API_BASE_URL from "../../Src/Config";

export default function Registro({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(""); 

  const handleRegister = async () => {
    if (!name || !email || !password || !role) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/registrar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Éxito", "Usuario registrado correctamente 💖");
        navigation.navigate("Login");
      } else {
        console.log("Errores:", data);
        Alert.alert("Error", "No se pudo registrar el usuario");
      }
    } catch (error) {
      console.error("Error en el registro:", error);
      Alert.alert("Error", "Hubo un problema con la conexión al servidor");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>✨ Registro ✨</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        placeholderTextColor="#cc6699"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Correo"
        placeholderTextColor="#cc6699"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#cc6699"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Selector de rol */}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={role}
          onValueChange={(itemValue) => setRole(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Selecciona un rol" value="" />
          <Picker.Item label="Administrador" value="admin" />
          <Picker.Item label="Paciente" value="paciente" />
        </Picker>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.buttonText}>Ya tengo cuenta</Text>
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ff99bb",
    borderRadius: 12,
    backgroundColor: "#fff0f5",
    marginVertical: 8,
  },
  picker: {
    color: "#660033",
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
