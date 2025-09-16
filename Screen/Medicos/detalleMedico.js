import React from "react";
import { View, Text, Button } from "react-native";

export default function DetalleMedico({ route, navigation }) {
  const { medico } = route.params;

  return (
    <View style={{ flex: 1, padding: 20 }}>
        <Text style={{ fontSize: 22 }}>Detalles del medico</Text>
        <Text>Especialidad ID: {medico.especialidad_id}</Text>
        <Text>Nombre: {medico.nombre}</Text>
        <Text>Edad: {medico.edad}</Text>
        <Text>Telefono: {medico.telefono}</Text>

        <Button
            title="Editar"
            onPress={() => navigation.navigate("EditarMedico", { medico })}
        />
    </View>
  );
}
