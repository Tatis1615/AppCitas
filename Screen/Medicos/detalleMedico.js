import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export default function DetalleMedico({ route, navigation }) {
  const { medico } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalles del Médico</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Especialidad ID:</Text>
        <Text style={styles.value}>{medico.especialidad_id}</Text>

        <Text style={styles.label}>Nombre:</Text>
        <Text style={styles.value}>{medico.nombre}</Text>

        <Text style={styles.label}>Edad:</Text>
        <Text style={styles.value}>{medico.edad}</Text>

        <Text style={styles.label}>Teléfono:</Text>
        <Text style={styles.value}>{medico.telefono}</Text>
      </View>

      {/* Botón Editar */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("EditarMedico", { medico })}
      >
        <Text style={styles.buttonText}>Editar</Text>
      </TouchableOpacity>

      {/* Botón Volver */}
      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
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
    backgroundColor: "#fff0f5", // fondo pastel suave
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#cc3366",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#ffe6f0",
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#444",
  },
  value: {
    fontSize: 16,
    marginBottom: 12,
    color: "#333",
  },
  button: {
    backgroundColor: "pink",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 10,
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
