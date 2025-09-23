import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../Src/Config";

export default function CrearCita({ navigation }) {
  const [medico_id, setMedicoId] = useState("");
  const [consultorio_id, setConsultorioId] = useState("");
  const [fecha_hora, setFecha_hora] = useState("");
  const [estado, setEstado] = useState("Pendiente"); // valor por defecto
  const [motivo, setMotivo] = useState("");

  const handleCrear = async () => {
    if (!medico_id || !consultorio_id || !fecha_hora || !estado || !motivo) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");

      const response = await fetch(`${API_BASE_URL}/crearCita`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({
          medico_id,
          consultorio_id,
          fecha_hora,
          estado,
          motivo,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Éxito", "✅ Cita creada correctamente");
        navigation.navigate("ListarCitas");
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
      <Text style={styles.title}>Agendar Nueva Cita</Text>

      <TextInput
        style={styles.input}
        placeholder="ID del Médico"
        value={medico_id}
        onChangeText={setMedicoId}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="ID del Consultorio"
        value={consultorio_id}
        onChangeText={setConsultorioId}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Fecha y Hora (YYYY-MM-DD HH:MM)"
        value={fecha_hora}
        onChangeText={setFecha_hora}
      />
      <TextInput
        style={styles.input}
        placeholder="Estado (ej: Pendiente, Confirmada)"
        value={estado}
        onChangeText={setEstado}
      />
      <TextInput
        style={styles.input}
        placeholder="Motivo de la cita"
        value={motivo}
        onChangeText={setMotivo}
      />

      {/* Botón Crear */}
      <TouchableOpacity style={styles.button} onPress={handleCrear}>
        <Text style={styles.buttonText}>Crear Cita</Text>
      </TouchableOpacity>

      {/* Botón Cancelar */}
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
