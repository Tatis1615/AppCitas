import React from "react";
import { View, Text, Button } from "react-native";

export default function DetallePaciente({ route, navigation }) {
  const { paciente } = route.params;

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22 }}>Detalles del Paciente</Text>
      <Text>Nombre: {paciente.nombre}</Text>
      <Text>Edad: {paciente.edad}</Text>
      <Text>Documento: {paciente.documento}</Text>
      <Text>Telefono: {paciente.telefono}</Text>
      <Text>Direccion: {paciente.direccion}</Text>
      <Text>Email: {paciente.email}</Text>


      <Button
        title="Editar"
        onPress={() => navigation.navigate("EditarPaciente", { paciente })}
      />
    </View>
  );
}
