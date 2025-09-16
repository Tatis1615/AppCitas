import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";

const especialidades = [
    { id: "1", nombre: "Psiciatria"},
    { id: "2", nombre: "Cardiologia"},
    { id: "3", nombre: "Neurologia"},
    { id: "4", nombre: "Pediatria"},
    { id: "5", nombre: "Dermatologia"}
];

export default function ListarEspecialidades({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Especialidades</Text>

      <FlatList
        data={especialidades}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("DetalleEspecialidad", { especialidad: item })}
            style={styles.card}
          >
            <Text style={styles.cardTitle}>{item.nombre}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Botón Crear Paciente */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("CrearEspecialidad")}
      >
        <Text style={styles.buttonText}>+ Crear Especialidad</Text>
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
