import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";

export default function EditarPaciente({ route, navigation }) {
  const { paciente } = route.params;
  const [nombre, setNombre] = useState(paciente.nombre);
  const [edad, setEdad] = useState(String(paciente.edad));
  const [documento, setDocumento] = useState(paciente.documento);
  const [telefono, setTelefono] = useState(paciente.telefono);
  const [direccion, setDireccion] = useState(paciente.direccion);
  const [email, setEmail] = useState(paciente.email);

    return (
        <View style={{ flex: 1, padding: 20 }}>
        <Text style={{ fontSize: 22 }}>Editar Paciente</Text>

        <Text>Nombre:</Text>
        <TextInput
            value={nombre}
            onChangeText={setNombre}
            style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
        />

        <Text>Edad:</Text>
        <TextInput
            value={edad}
            onChangeText={setEdad}
            keyboardType="numeric"
            style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
        />
        <Text>Documento:</Text>
        <TextInput
            value={paciente.documento}
            onChangeText={setDocumento}
            style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
        />
        <Text>Telefono:</Text>
        <TextInput
            value={paciente.telefono}
            onChangeText={setTelefono}
            style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
        />
        <Text>Direccion:</Text> 
        <TextInput
            value={paciente.direccion}
            onChangeText={setDireccion}
            style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
        />
        <Text>Email:</Text>
        <TextInput
            value={paciente.email}
            onChangeText={setEmail}
            style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
        />


      <Button
        title="Guardar"
        onPress={() => {
          // Aquí podrías guardar cambios en una BD, por ahora simulamos:
          alert(`Paciente actualizado: ${nombre}, Edad: ${edad}, Documento: ${documento}, Telefono: ${telefono}, Direccion: ${direccion}, 
            Email: ${email}`);
          navigation.goBack();
        }}
      />
    </View>
  );
}
