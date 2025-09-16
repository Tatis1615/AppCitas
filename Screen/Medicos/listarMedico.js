import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";

const medicos = [
  { id: "1", especialidad_id: "1", nombre: "Juan Pérez", edad: 30, telefono: "123456789" },
  { id: "2", especialidad_id: "2", nombre: "María López", edad: 45, telefono: "987654321" },
  { id: "3", especialidad_id: "3", nombre: "Carlos Ruiz", edad: 28, telefono: "456123789" },
  { id: "4", especialidad_id: "1", nombre: "Ana Gómez", edad: 35, telefono: "321654987" }
];

export default function ListarMedicos({ navigation }) {
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22, marginBottom: 10 }}>Lista de Medicos</Text>
      <FlatList
        data={medicos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("DetalleMedico", { medico: item })}
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
