import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";

const pacientes = [
  { id: "1", nombre: "Juan Pérez", edad: 30, documento: "12345678", telefono: "555-1234", direccion: "Calle Falsa 123", 
    email: "perez@gmail.com"},
  { id: "2", nombre: "María López", edad: 45, documento: "87654321", telefono: "555-5678", direccion: "Avenida Siempre Viva 742", 
    email: "maria123@gmail.com"},
  { id: "3", nombre: "Carlos Ruiz", edad: 28, documento: "11223344", telefono: "555-8765", direccion: "Boulevard Central 456", 
    email: "ruiz@gmail.com"},
  { id: "4", nombre: "Ana Gómez", edad: 35, documento: "44332211", telefono: "555-4321", direccion: "Calle Luna 789", 
    email: "anag321@gmail.com"}
];

export default function ListarPacientes({ navigation }) {
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22, marginBottom: 10 }}>Lista de Pacientes</Text>
      <FlatList
        data={pacientes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("DetallePaciente", { paciente: item })}
            style={{
              padding: 15,
              marginVertical: 5,
              backgroundColor: "#e0f7fa",
              borderRadius: 10,
            }}
          >
            <Text>{item.nombre}</Text>
            <Text>Edad: {item.edad}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
