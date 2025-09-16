import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

export default function EditarMedico({ route, navigation }) {
  const { medico } = route.params;
  const [especialidadId, setEspecialidadId] = useState(
    String(medico.especialidad_id)
  );
  const [nombre, setNombre] = useState(medico.nombre);
  const [edad, setEdad] = useState(String(medico.edad));
  const [telefono, setTelefono] = useState(medico.telefono);

  const handleGuardar = () => {
    Alert.alert(
      "✅ Médico actualizado",
      `Especialidad ID: ${especialidadId}\nNombre: ${nombre}\nEdad: ${edad}\nTeléfono: ${telefono}`
    );
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Médico</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Especialidad ID:</Text>
        <TextInput
          value={especialidadId}
          onChangeText={setEspecialidadId}
          keyboardType="numeric"
          style={styles.input}
        />

        <Text style={styles.label}>Nombre:</Text>
        <TextInput
          value={nombre}
          onChangeText={setNombre}
          style={styles.input}
        />

        <Text style={styles.label}>Edad:</Text>
        <TextInput
          value={edad}
          onChangeText={setEdad}
          keyboardType="numeric"
          style={styles.input}
        />

        <Text style={styles.label}>Teléfono:</Text>
        <TextInput
          value={telefono}
          onChangeText={setTelefono}
          style={styles.input}
        />
      </View>

      {/* Botón Guardar */}
      <TouchableOpacity style={styles.button} onPress={handleGuardar}>
        <Text style={styles.buttonText}>Guardar</Text>
      </TouchableOpacity>

      {/* Botón Cancelar */}
      <TouchableOpacity
        style={[styles.button, styles.cancelButton]}
        onPress={() => navigation.goBack()}
      >
        <Text style={[styles.buttonText, { color: "#cc3366" }]}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff0f5", // fondo pastel
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    fontWeight: "bold",
    color: "#cc3366",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#ffe6f0",
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#444",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "pink",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#cc3366",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
});
