import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Importar pantallas
import Login from "./Screen/Auth/login";
import Registro from "./Screen/Auth/registro";
import Inicio from "./Screen/Inicio/inicio";

import ListarCitas from "./Screen/Citas/listarCitas";
// import CrearCita from "./Screen/Citas/crearCita";
import EditarCita from "./Screen/Citas/editarCita";
import DetalleCita from "./Screen/Citas/detalleCita";

import ListarPacientes from "./Screen/Pacientes/listarPaciente";
import DetallePaciente from "./Screen/Pacientes/detallePaciente";
import EditarPaciente from "./Screen/Pacientes/editarPaciente";

import ListarMedicos from "./Screen/Medicos/listarMedico";
import DetalleMedico from "./Screen/Medicos/detalleMedico";
import EditarMedico from "./Screen/Medicos/editarMedico";

import ListarConsultorios from "./Screen/Consultorios/listarConsultorio";
import DetalleConsultorio from "./Screen/Consultorios/detalleConsultorio";
import EditarConsultorio from "./Screen/Consultorios/editarConsultorio";

import ListarEspecialidades from "./Screen/Especialidades/listarEspecialidad";
import DetalleEspecialidad from "./Screen/Especialidades/detalleEspecialidad";
import EditarEspecialidad from "./Screen/Especialidades/editarEspecialidad";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ title: "Iniciar Sesión" }}
        />
        <Stack.Screen
          name="Registro"
          component={Registro}
          options={{ title: "Registro" }}
        />
        <Stack.Screen
          name="Inicio"
          component={Inicio}
          options={{ title: "Menú Principal" }}
        />


        <Stack.Screen
          name="ListarCitas"
          component={ListarCitas}
          options={{ title: "Citas Agendadas" }}
        />
        {/* <Stack.Screen
          name="CrearCita"
          component={CrearCita}
          options={{ title: "Agendar Cita" }}
        /> */}
        <Stack.Screen
          name="EditarCita"
          component={EditarCita}
          options={{ title: "Editar Cita" }}
        />
        <Stack.Screen
          name="DetalleCita"
          component={DetalleCita}
          options={{ title: "Detalle de la Cita" }}
        />


        <Stack.Screen
          name="ListarPacientes"
          component={ListarPacientes}
          options={{ title: "Listado de Pacientes" }}
        />
        <Stack.Screen
          name="DetallePaciente"
          component={DetallePaciente}
          options={{ title: "Detalle del Paciente" }}
        />
        <Stack.Screen
          name="EditarPaciente"
          component={EditarPaciente}
          options={{ title: "Editar Paciente" }}
        />


        <Stack.Screen
          name="ListarMedicos"
          component={ListarMedicos}
          options={{ title: "Listado de Médicos" }}
        />
        <Stack.Screen
          name="DetalleMedico"
          component={DetalleMedico}
          options={{ title: "Detalle del Médico" }}
        />
        <Stack.Screen
          name="EditarMedico"
          component={EditarMedico}
          options={{ title: "Editar Médico" }}
        />


        <Stack.Screen
          name="  ListarConsultorios"
          component={ListarConsultorios}
          options={{ title: "Listado de Consultorios" }}
        />
        <Stack.Screen
          name="DetalleConsultorio"
          component={DetalleConsultorio}
          options={{ title: "Detalle del Consultorio" }}
        />
        <Stack.Screen
          name="EditarConsultorio"
          component={EditarConsultorio}
          options={{ title: "Editar Consultorio" }}
        />


        <Stack.Screen
          name="ListarEspecialidades"
          component={ListarEspecialidades}
          options={{ title: "Listado de Especialidades" }}
        />
        <Stack.Screen
          name="DetalleEspecialidad"
          component={DetalleEspecialidad}
          options={{ title: "Detalle de la Especialidad" }}
        />
        <Stack.Screen
          name="EditarEspecialidad"
          component={EditarEspecialidad}
          options={{ title: "Editar Especialidad" }}
        />  


      </Stack.Navigator>
    </NavigationContainer>
  );
}
