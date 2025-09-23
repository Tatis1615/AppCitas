import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../Src/Config";

export default function CrearConsultorio({ navigation }) {
  const [numero, setNumero] = useState("");
  const [ubicacion, setUbicacion] = useState("");

  const handleCrear = async () => {
    if (!numero || !ubicacion) {
      Alet.alert("Por favor completa todos los campos");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");

      const response = await fetch(`${API_BASE_URL}/crearConsultorio`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({ numero, ubicacion }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Éxito", "✅ Consultorio creada correctamente");
        navigation.navigate("ListarConsultorios");
      } else {
        console.log("Errores:", data);
        Alert.alert("Error", data.message || "No se pudo crear la cita");
      }
    } catch (error) {
      console.error("Error en crear cita:", error);
      Alert.alert("Error", "Hubo un problema al conectar con el servidor");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Registrar Nuevo Consultorio</Text>

      <TextInput
        style={styles.input}
        placeholder="Número del consultorio"
        value={numero}
        onChangeText={setNumero}
      />
      <TextInput
        style={styles.input}
        placeholder="Ubicación"
        value={ubicacion}
        onChangeText={setUbicacion}
      />

      <TouchableOpacity style={styles.button} onPress={handleCrear}>
        <Text style={styles.buttonText}>Crear Consultorio</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={() => navigation.goBack()}
      >
        <Text style={[styles.buttonText, { color: "#cc3366" }]}>Cancelar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff0f5", // Fondo pastel suave
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#cc3366",
    textAlign: "center",
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ffb6c1",
    padding: 12,
    marginVertical: 8,
    borderRadius: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: "pink",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 15,
    width: "100%",
  },
  secondaryButton: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#cc3366",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
});

