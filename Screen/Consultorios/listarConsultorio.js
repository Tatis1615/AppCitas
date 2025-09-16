import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";

const consultorios = [
  { id: "1", numero: "508", ubicacion: "3 piso" },
  { id: "2", numero: "309", ubicacion: "2 piso" },
  { id: "3", numero: "101", ubicacion: "1 piso" },
  { id: "4", numero: "202", ubicacion: "2 piso" },
  { id: "5", numero: "404", ubicacion: "4 piso" }
];

export default function ListarConsultorios({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Consultorios</Text>

      <FlatList
        data={consultorios}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("DetalleConsultorio", { consultorio: item })}
            style={styles.card}
          >
            <Text style={styles.cardTitle}>{item.numero}</Text>
            <Text style={styles.cardSubtitle}>Ubicación: {item.ubicacion}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Botón Crear Paciente */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("CrearConsultorio")}
      >
        <Text style={styles.buttonText}>+ Crear Consultorio</Text>
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
