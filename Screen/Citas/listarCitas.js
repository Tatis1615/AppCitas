import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";

const citas = [
  { id: "1", paciente_id: "1", medico_id: "2", consultorio_id: "2", fecha_hora: "2025-09-13", estado: "Pendiente", motivo: "Consulta general"},
  { id: "2", paciente_id: "2", medico_id: "1", consultorio_id: "1", fecha_hora: "2025-09-14", estado: "Confirmada", motivo: "Revisión anual"},
  { id: "3", paciente_id: "3", medico_id: "3", consultorio_id: "3", fecha_hora: "2025-09-15", estado: "Cancelada", motivo: "Dolor de cabeza"},
  { id: "4", paciente_id: "4", medico_id: "4", consultorio_id: "4", fecha_hora: "2025-09-16", estado: "Pendiente", motivo: "Chequeo pediátrico"}
];

export default function ListarCitas({ navigation }) {
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22, marginBottom: 10 }}>Lista de Citas</Text>
      <FlatList
        data={citas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("DetalleCita", { cita: item })}
            style={{
              padding: 15,
              marginVertical: 5,
              backgroundColor: "#e0f7fa",
              borderRadius: 10,
            }}
          >
            <Text>{item.estado}</Text>
            <Text>Fecha y hora: {item.fecha_hora}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
