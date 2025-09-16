import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";

export default function CrearCita({ navigation }) {
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [medico, setMedico] = useState("");
  const [motivo, setMotivo] = useState("");

  const handleCrear = () => {
    if (fecha && hora && medico && motivo) {
      alert("✅ Cita creada (simulado)");
      navigation.navigate("ListarCitas");
    } else {
      alert("Por favor completa todos los campos");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agendar Nueva Cita</Text>
      <TextInput
        style={styles.input}
        placeholder="Fecha (YYYY-MM-DD)"
        value={fecha}
        onChangeText={setFecha}
      />
      <TextInput
        style={styles.input}
        placeholder="Hora (HH:MM)"
        value={hora}
        onChangeText={setHora}
      />
      <TextInput
        style={styles.input}
        placeholder="Médico"
        value={medico}
        onChangeText={setMedico}
      />
      <TextInput
        style={styles.input}
        placeholder="Motivo"
        value={motivo}
        onChangeText={setMotivo}
      />
      <Button title="Crear Cita" onPress={handleCrear} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 22, marginBottom: 20, textAlign: "center" },
  input: {
    borderWidth: 1,
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
  },
});
