import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";

export default function EditarEspecialidad({ route, navigation }) {
  const { especialidad } = route.params;
  const [nombre, setNombre] = useState(especialidad.nombre);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22 }}>Editar Especialidad</Text>

      <Text>Nombre:</Text>
      <TextInput
        value={nombre}
        onChangeText={setNombre}
        style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
      />

      <Button
        title="Guardar"
        onPress={() => {
          // Aquí podrías guardar cambios en una BD, por ahora simulamos:
          alert(`Especialidad actualizada: ${nombre}, Edad: ${edad}`);
          navigation.goBack();
        }}
      />
    </View>
  );
}
