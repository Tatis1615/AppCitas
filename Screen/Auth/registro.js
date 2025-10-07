import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  ScrollView,
  Platform
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import API_BASE_URL from "../../Src/Config";

export default function Registro({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  // Campos adicionales del paciente
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [documento, setDocumento] = useState("");
  const [telefono, setTelefono] = useState("");
  const [emailPaciente, setEmailPaciente] = useState("");
  const [fecha_nacimiento, setFecha_nacimiento] = useState("");
  const [direccion, setDireccion] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password || !role) {
      Alert.alert("Error", "Por favor completa todos los campos básicos");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/registrar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log("Error en registro:", data);
        Alert.alert("Error", data.message || "No se pudo registrar el usuario");
        return;
      }

      await AsyncStorage.setItem("token", data.token);
      const userId = data.user?.id;

      if (role === "paciente") {
        if (!nombre || !apellido || !documento || !telefono || !emailPaciente || !direccion || !fecha_nacimiento) {
          Alert.alert("Error", "Por favor completa todos los datos adicionales del paciente");
          return;
        }

        const token = data.token;
        const responsePaciente = await fetch(`${API_BASE_URL}/crearPaciente`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            Accept: "application/json",
          },
          body: JSON.stringify({
            user_id: userId,
            nombre,
            apellido,
            documento,
            telefono,
            email: emailPaciente,
            fecha_nacimiento,
            direccion,
          }),
        });

        const dataPaciente = await responsePaciente.json();

        if (!responsePaciente.ok) {
          console.log("Error paciente:", dataPaciente);
          Alert.alert("Error", "No se pudo crear el perfil del paciente");
          return;
        }

        Alert.alert("Éxito", "Paciente registrado correctamente 💖");
        navigation.navigate("Login");
        return;
      }

      Alert.alert("Éxito", "Usuario registrado correctamente 💖");
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error en el registro:", error);
      Alert.alert("Error", "Hubo un problema con la conexión al servidor");
    }
  };

  const onChangeFecha = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const fechaFormateada = selectedDate.toISOString().split("T")[0];
      setFecha_nacimiento(fechaFormateada);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>✨ Registro ✨</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre de usuario"
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

      <Picker
        selectedValue={role}
        onValueChange={(itemValue) => setRole(itemValue)}
        style={styles.input}
      >
        <Picker.Item label="Selecciona un rol" value="" />
        <Picker.Item label="Administrador" value="admin" />
        <Picker.Item label="Paciente" value="paciente" />
      </Picker>

      {/* 🔹 FORMULARIO EXTRA SI ES PACIENTE */}
      {role === "paciente" && (
        <View style={styles.extraContainer}>
          <Text style={styles.subtitle}>🩺 Datos adicionales del paciente</Text>

          <TextInput 
            style={styles.input} 
            placeholder="Nombre" 
            value={nombre} 
            onChangeText={setNombre} 
          />
          <TextInput 
            style={styles.input} 
            placeholder="Apellido" 
            value={apellido} 
            onChangeText={setApellido} 
          />
          <TextInput 
            style={styles.input} 
            placeholder="Documento" 
            value={documento} 
            onChangeText={setDocumento} 
          />
          <TextInput 
            style={styles.input} 
            placeholder="Teléfono" 
            value={telefono} 
            onChangeText={setTelefono} 
          />
          <TextInput 
            style={styles.input} 
            placeholder="Email" 
            value={emailPaciente} 
            onChangeText={setEmailPaciente} 
            keyboardType="email-address" 
          />

          <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
            <Text style={{ color: fecha_nacimiento ? "#000" : "#707070ff" }}>
              {fecha_nacimiento || "Selecciona fecha de nacimiento"}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onChangeFecha}
              maximumDate={new Date()}
            />
          )}
          <TextInput 
            style={styles.input} 
            placeholder="Dirección" 
            value={direccion} 
            onChangeText={setDireccion} 
          />
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.buttonText}>Ya tengo cuenta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffe6f0",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#cc3366",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#cc3366",
    marginBottom: 10,
    textAlign: "center",
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
  extraContainer: {
    marginTop: 20,
    backgroundColor: "#fff5f8",
    padding: 15,
    borderRadius: 12,
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
