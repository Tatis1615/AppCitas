import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";

export default function EditarConsultorio({ route, navigation }) {
  const { consultorio } = route.params;
  const [numero, setNumero] = useState(consultorio.numero);
  const [ubicacion, setUbicacion] = useState(consultorio.ubicacion);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22 }}>Editar Consultorio</Text>

      <Text>Nombre:</Text>
      <TextInput
        value={numero}
        onChangeText={setNumero}
        style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
      />
      <Text>Ubicacion:</Text>
        <TextInput
        value={ubicacion}
        onChangeText={setUbicacion}
        style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
      />

      <Button
        title="Guardar"
        onPress={() => {
          // Aquí podrías guardar cambios en una BD, por ahora simulamos:
          alert(`Consultorio actualizado: ${numero}, Ubicacion: ${ubicacion}`);
          navigation.goBack();
        }}
      />
    </View>
  );
}
