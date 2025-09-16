import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";

const medicos = [
  { id: "1", especialidad_id: "1", nombre: "Juan Pérez", edad: 30, telefono: "123456789" },
  { id: "2", especialidad_id: "2", nombre: "María López", edad: 45, telefono: "987654321" },
  { id: "3", especialidad_id: "3", nombre: "Carlos Ruiz", edad: 28, telefono: "456123789" },
  { id: "4", especialidad_id: "1", nombre: "Ana Gómez", edad: 35, telefono: "321654987" }
];

export default function ListarMedicos({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Medicos</Text>


      <FlatList
        data={medicos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("DetalleMedico", { medico: item })}
            style={styles.card}
          >
            <Text style={styles.cardTitle}>{item.nombre}</Text>
            <Text style={styles.cardSubtitle}>Edad: {item.edad}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Botón Crear Paciente */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("CrearMedico")}
      >
        <Text style={styles.buttonText}>+ Crear Medico</Text>
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
