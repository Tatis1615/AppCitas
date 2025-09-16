import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";

const especialidades = [
    { id: "1", nombre: "Psiciatria"},
    { id: "2", nombre: "Cardiologia"},
    { id: "3", nombre: "Neurologia"},
    { id: "4", nombre: "Pediatria"},
    { id: "5", nombre: "Dermatologia"}
];

export default function ListarEspecialidades({ navigation }) {
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22, marginBottom: 10 }}>Lista de Especialidades</Text>
      <FlatList
        data={especialidades}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("DetalleEspecialidad", { especialidad: item })}
            style={{
              padding: 15,
              marginVertical: 5,
              backgroundColor: "#e0f7fa",
              borderRadius: 10,
            }}
          >
            <Text>{item.nombre}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
