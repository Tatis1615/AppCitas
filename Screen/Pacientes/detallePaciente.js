import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function DetallePaciente({ route, navigation }) {
  const { paciente } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalles del Paciente</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Nombre:</Text>
        <Text style={styles.value}>{paciente.nombre}</Text>

        <Text style={styles.label}>Edad:</Text>
        <Text style={styles.value}>{paciente.edad}</Text>

        <Text style={styles.label}>Documento:</Text>
        <Text style={styles.value}>{paciente.documento}</Text>

        <Text style={styles.label}>Teléfono:</Text>
        <Text style={styles.value}>{paciente.telefono}</Text>

        <Text style={styles.label}>Dirección:</Text>
        <Text style={styles.value}>{paciente.direccion}</Text>

        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{paciente.email}</Text>
      </View>

      {/* Botón Editar */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("EditarPaciente", { paciente })}
      >
        <Text style={styles.buttonText}>Editar</Text>
      </TouchableOpacity>

      {/* Botón Volver */}
      <TouchableOpacity
        style={[styles.button, styles.cancelButton]}
        onPress={() => navigation.goBack()}
      >
        <Text style={[styles.buttonText, { color: "#cc3366" }]}>Volver</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff0f5", // Fondo pastel rosado
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    fontWeight: "bold",
    color: "#cc3366",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#ffe6f0",
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#444",
  },
  value: {
    fontSize: 16,
    marginBottom: 10,
    color: "#333",
  },
  button: {
    backgroundColor: "pink",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#cc3366",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
