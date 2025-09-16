import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";

export default function EditarMedico({ route, navigation }) {
  const { medico } = route.params;
  conts [especialidadId, setEspecialidadId] = useState(String(medico.especialidad_id));
  const [nombre, setNombre] = useState(medico.nombre);
  const [edad, setEdad] = useState(String(medico.edad));
  const [telefono, setTelefono] = useState(medico.telefono);

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <Text style={{ fontSize: 22 }}>Editar Medico</Text>

            <Text>Especialidad ID:</Text>
            <TextInput
                value={String(medico.especialidad_id)}
                onChangeText={setEspecialidadId}
                keyboardType="numeric"
                style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
            />

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
            <Text>Telefono:</Text>
            <TextInput
                value={telefono}
                onChangeText={setTelefono}
                style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
            />

        <Button
            title="Guardar"
            onPress={() => {
            // Aquí podrías guardar cambios en una BD, por ahora simulamos:
            alert(`Medico actualizado: especialidad_id: ${especialidad_id} ${nombre}, Edad: ${edad}, Telefono: ${telefono}`);
            navigation.goBack();
            }}
        />
        </View>
  );
}
