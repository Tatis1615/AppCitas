import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

// Pantalla de menú principal
import InicioPaciente from "../../Screen/Inicio/inicioPaciente"; 

// Importa los stacks de cada módulo
import PacientesStack from "./pacientesStack";
import MedicosStack from "./medicosStack";
import CitasStackPaciente from "./citasStackPaciente";

const Stack = createStackNavigator();

export default function InicioStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="InicioPaciente" 
        component={InicioPaciente} 
        options={{ title: "Inicio" }} 
      />
      <Stack.Screen 
        name="Pacientes" 
        component={PacientesStack} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Medicos" 
        component={MedicosStack} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="CitasPaciente" 
        component={CitasStackPaciente} 
        options={{ headerShown: false }} 
      />
    </Stack.Navigator>
  );
}