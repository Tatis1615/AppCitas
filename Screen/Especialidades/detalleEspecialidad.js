import React from "react";
import { View, Text, Button } from "react-native";

export default function DetalleEspecialidad({ route, navigation }) {
  const { especialidad } = route.params;

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22 }}>Detalles del especialidad</Text>
      <Text>Nombre: {especialidad.nombre}</Text>


      <Button
        title="Editar"
        onPress={() => navigation.navigate("EditarEspecialidad", { especialidad })}
      />
    </View>
  );
}
