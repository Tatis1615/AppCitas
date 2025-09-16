import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";

const pacientes = [
  { id: "1", nombre: "Juan Pérez", edad: 30, documento: "12345678", telefono: "555-1234", direccion: "Calle Falsa 123", email: "perez@gmail.com"},
  { id: "2", nombre: "María López", edad: 45, documento: "87654321", telefono: "555-5678", direccion: "Avenida Siempre Viva 742", email: "maria123@gmail.com"},
  { id: "3", nombre: "Carlos Ruiz", edad: 28, documento: "11223344", telefono: "555-8765", direccion: "Boulevard Central 456", email: "ruiz@gmail.com"},
  { id: "4", nombre: "Ana Gómez", edad: 35, documento: "44332211", telefono: "555-4321", direccion: "Calle Luna 789", email: "anag321@gmail.com"}
];

export default function ListarPacientes({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Pacientes</Text>

      {/* Lista de Pacientes */}
      <FlatList
        data={pacientes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("DetallePaciente", { paciente: item })}
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
        onPress={() => navigation.navigate("CrearPaciente")}
      >
        <Text style={styles.buttonText}>+ Crear Paciente</Text>
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
