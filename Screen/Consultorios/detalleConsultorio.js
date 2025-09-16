import React from "react";
import { View, Text, Button } from "react-native";

export default function DetalleConsultorio({ route, navigation }) {
  const { consultorio } = route.params;

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22 }}>Detalles del Consultorio</Text>
      <Text>Nombre: {consultorio.nombre}</Text>
      <Text>Edad: {consultorio.edad}</Text>

      <Button
        title="Editar"
        onPress={() => navigation.navigate("EditarConsultorio", { consultorio })}
      />
    </View>
  );
}
