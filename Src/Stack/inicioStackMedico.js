import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

// Pantalla de menú principal
import InicioMenu from "../../Screen/Inicio/inicioMedico"; 

// Importa los stacks de cada módulo
import PacientesStackMedico from "./pacienteStackMedico";
import ConsultoriosStackMedico from "./consultoriosStackMedico";
import EspecialidadesStackMedico from "./especialidadesStackMedico";
import CitasStackMedico from "./citasStackMedico";

const Stack = createStackNavigator();

export default function InicioStackMedico() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="InicioMenu" 
        component={InicioMenu} 
        options={{ title: "Inicio" }} 
      />
      <Stack.Screen 
        name="Pacientes" 
        component={PacientesStackMedico} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Consultorios" 
        component={ConsultoriosStackMedico} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Especialidades" 
        component={EspecialidadesStackMedico} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Citas" 
        component={CitasStackMedico} 
        options={{ headerShown: false }} 
      />
    </Stack.Navigator>
  );
}