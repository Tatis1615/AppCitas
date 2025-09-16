import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";

const consultorios = [
  { id: "1", numero: "508", ubicacion: "3 piso" },
  { id: "2", numero: "309", ubicacion: "2 piso" },
  { id: "3", numero: "101", ubicacion: "1 piso" },
  { id: "4", numero: "202", ubicacion: "2 piso" },
  { id: "5", numero: "404", ubicacion: "4 piso" }

];

export default function ListarConsultorio({ navigation }) {
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22, marginBottom: 10 }}>Lista de Consultorios</Text>
      <FlatList
        data={consultorios}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("DetalleConsultorio", { consultorio: item })}
            style={{
              padding: 15,
              marginVertical: 5,
              backgroundColor: "#e0f7fa",
              borderRadius: 10,
            }}
          >
            <Text>Numero: {item.numero}</Text>
            <Text>Ubicacion: {item.ubicacion}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
