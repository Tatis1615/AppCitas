import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import API_BASE_URL from "../../Src/Config";

export default function CrearPacienteCita({ navigation }) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [documento, setDocumento] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [fecha_nacimiento, setFecha_nacimiento] = useState("");
  const [direccion, setDireccion] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleCrear = async () => {
    if (!nombre || !apellido || !documento || !telefono || !email || !fecha_nacimiento || !direccion) {
      alert("⚠️ Por favor completa todos los campos");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      const role = await AsyncStorage.getItem("role");

      if (!token) {
        alert("No autenticado", "Debes iniciar sesión para crear pacientes");
        navigation.navigate("Login");
        return;
      }

      if (role !== "admin" && role !== "paciente") {
        alert("Permisos insuficientes", "Solo usuarios con rol 'admin' o 'paciente' pueden crear pacientes");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/crearPaciente`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre,
          apellido,
          documento,
          telefono,
          email,
          fecha_nacimiento,
          direccion,
        }),
      });

      const body = await response.json();

      if (response.ok) {
        Alert.alert("✅ Éxito", body.message || "Paciente creado correctamente");

        // Guardamos el id del paciente en AsyncStorage
        if (body.data?.id) {
          await AsyncStorage.setItem("paciente_id", body.data.id.toString());
          console.log("✅ paciente_id guardado:", body.data.id);
        }

        // Pasamos el paciente como parámetro a ListarMisCitas
        navigation.navigate("ListarCitasPaciente", { paciente: body.data });
        return;
      }

      Alert.alert("Error", body.message || "No se pudo crear el paciente");

    } catch (error) {
      console.error("Error de conexión:", error);
      Alert.alert("Error", "Ocurrió un error al conectar con el servidor");
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFecha_nacimiento(selectedDate.toISOString().split("T")[0]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Nuevo Paciente</Text>

        <Text style={styles.label}>Nombre</Text>
        <TextInput 
            style={styles.input} 
            placeholder="Ej: Juan" 
            value={nombre} 
            onChangeText={setNombre} 
            placeholderTextColor="#b0b0b0"
        />

        <Text style={styles.label}>Apellido</Text>
        <TextInput 
            style={styles.input} 
            placeholder="Ej: Pérez" 
            value={apellido} 
            onChangeText={setApellido} 
            placeholderTextColor="#b0b0b0"
        />

        <Text style={styles.label}>Documento</Text>
        <TextInput 
            style={styles.input} 
            placeholder="Ej: 12345678" 
            value={documento} 
            onChangeText={setDocumento} 
            keyboardType="numeric" 
            placeholderTextColor="#b0b0b0"
        />

        <Text style={styles.label}>Teléfono</Text>
        <TextInput 
            style={styles.input} 
            placeholder="Ej: 3001234567" 
            value={telefono} 
            onChangeText={setTelefono} 
            keyboardType="phone-pad" 
            placeholderTextColor="#b0b0b0"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput 
            style={styles.input} 
            placeholder="Ej: correo@ejemplo.com" 
            value={email} 
            onChangeText={setEmail} 
            keyboardType="email-address" 
            placeholderTextColor="#b0b0b0"
        />

        <Text style={styles.label}>Fecha de nacimiento</Text>
        <TouchableOpacity 
        style={styles.input} 
        onPress={() => setShowDatePicker(true)}>
            
          <Text style={{ color: fecha_nacimiento ? "#333" : "#b0b0b0" }}>{fecha_nacimiento || "Seleccione una fecha"}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker value={fecha_nacimiento ? new Date(fecha_nacimiento) : new Date()} mode="date" display={Platform.OS === "ios" ? "spinner" : "default"} onChange={handleDateChange}/>
        )}

        <Text style={styles.label}>Dirección</Text>
        <TextInput 
            style={styles.input} 
            placeholder="Ej: Calle 123 #45-67" 
            value={direccion} 
            onChangeText={setDireccion} 
            placeholderTextColor="#b0b0b0"
        />

        <TouchableOpacity style={styles.button} onPress={handleCrear}>
          <Text style={styles.buttonText}>Crear Paciente</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3e9f7",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#9b59b6",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 5,
    color: "#444",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1b3ff",
    padding: 12,
    marginBottom: 15,
    borderRadius: 12,
    backgroundColor: "#fafafa",
    color: "#333",
  },
  button: {
    backgroundColor: "#a564d3",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});