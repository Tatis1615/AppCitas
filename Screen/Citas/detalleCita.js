import React from "react";
import { View, Text, Button } from "react-native";

export default function DetalleCita({ route, navigation }) {
  const { cita } = route.params;

  return (
    <View style={{ flex: 1, padding: 20 }}>
        <Text style={{ fontSize: 22 }}>Detalles de la cita</Text>
        <Text>Paciente ID: {cita.paciente_id}</Text>
        <Text>Medico ID: {cita.medico_id}</Text>
        <Text>Consultorio ID: {cita.consultorio_id}</Text>
        <Text>Fecha y Hora: {cita.fecha_hora}</Text>
        <Text>Estado: {cita.estado}</Text>
        <Text>Motivo: {cita.motivo}</Text>

        <Button
            title="Editar"
            onPress={() => navigation.navigate("EditarCita", { cita })}
        />
    </View>
  );
}



