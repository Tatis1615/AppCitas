// CitasStack.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ListarCitasPaciente from "../../Screen/Citas/listarCitasPaciente";
import CrearCita from "../../Screen/Citas/crearCita";
import DetalleCitaPaciente from "../../Screen/Citas/detalleCitaPaciente";
import EditarCita from "../../Screen/Citas/editarCita";

const Stack = createStackNavigator();

export default function CitasStackPaciente() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ListarCitasPaciente"
        component={ListarCitasPaciente}
        options={{ title: "Citas Agendadas" }}
      />
      <Stack.Screen
        name="CrearCita"
        component={CrearCita}
        options={{ title: "Agendar Cita" }}
      />
      <Stack.Screen
        name="EditarCita"
        component={EditarCita}
        options={{ title: "Editar Cita" }}
      />
      <Stack.Screen
        name="DetalleCitaPaciente"
        component={DetalleCitaPaciente}
        options={{ title: "Detalle de la Cita" }}
      />
    </Stack.Navigator>
  );
}
