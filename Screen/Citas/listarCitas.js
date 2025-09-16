import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";

const citas = [
  { id: "1", paciente_id: "1", medico_id: "2", consultorio_id: "2", fecha_hora: "2025-09-13", estado: "Pendiente", motivo: "Consulta general"},
  { id: "2", paciente_id: "2", medico_id: "1", consultorio_id: "1", fecha_hora: "2025-09-14", estado: "Confirmada", motivo: "Revisión anual"},
  { id: "3", paciente_id: "3", medico_id: "3", consultorio_id: "3", fecha_hora: "2025-09-15", estado: "Cancelada", motivo: "Dolor de cabeza"},
  { id: "4", paciente_id: "4", medico_id: "4", consultorio_id: "4", fecha_hora: "2025-09-16", estado: "Pendiente", motivo: "Chequeo pediátrico"}
];

export default function ListarCitas({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Citas</Text>

      <FlatList
        data={citas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("DetalleCita", { cita: item })}
            style={styles.card}
          >
            <Text style={styles.cardTitle}>{item.fecha_hora}</Text>
            <Text style={styles.cardSubtitle}>Estado: {item.estado}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Botón Crear Paciente */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("CrearCita")}
      >
        <Text style={styles.buttonText}>+ Crear Cita</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff0f5",
  },
  title: {
    fontSize: 22,
    marginBottom: 10,
    fontWeight: "bold",
    color: "#cc3366",
    textAlign: "center",
  },
  button: {
    backgroundColor: "pink",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 250,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  card: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: "#ffe6f0",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ffb6c1",
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
  },
  cardSubtitle: {
    color: "#555",
  },
});
