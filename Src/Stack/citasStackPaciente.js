// CitasStack.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ListarCitasPaciente from "../../Screen/Citas/listarCitasPaciente";
import CrearCitaPaciente from "../../Screen/Citas/crearCitaPaciente";
import DetalleCitaPaciente from "../../Screen/Citas/detalleCitaPaciente";

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
        name="CrearCitaPaciente"
        component={CrearCitaPaciente}
        options={{ title: "Agendar Cita" }}
      />
      <Stack.Screen
        name="DetalleCitaPaciente"
        component={DetalleCitaPaciente}
        options={{ title: "Detalle de la Cita" }}
      />
    </Stack.Navigator>
  );
}
