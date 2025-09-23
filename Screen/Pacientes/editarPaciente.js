import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";

export default function EditarPaciente({ route, navigation }) {
  const { paciente } = route.params;
  const [nombre, setNombre] = useState(paciente.nombre);
  const [edad, setEdad] = useState(String(paciente.edad));
  const [documento, setDocumento] = useState(paciente.documento);
  const [telefono, setTelefono] = useState(paciente.telefono);
  const [direccion, setDireccion] = useState(paciente.direccion);
  const [email, setEmail] = useState(paciente.email);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Editar Paciente</Text>

      {/* Campos de formulario */}
      {[
        { label: "Nombre", value: nombre, setter: setNombre },
        { label: "Edad", value: edad, setter: setEdad, keyboardType: "numeric" },
        { label: "Documento", value: documento, setter: setDocumento },
        { label: "Teléfono", value: telefono, setter: setTelefono },
        { label: "Dirección", value: direccion, setter: setDireccion },
        { label: "Email", value: email, setter: setEmail },
      ].map((campo, index) => (
        <View key={index} style={styles.inputGroup}>
          <Text style={styles.label}>{campo.label}:</Text>
          <TextInput
            value={campo.value}
            onChangeText={campo.setter}
            keyboardType={campo.keyboardType || "default"}
            style={styles.input}
          />
        </View>
      ))}

      {/* Botón Guardar */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          alert(
            `Paciente actualizado:\n\nNombre: ${nombre}\nEdad: ${edad}\nDocumento: ${documento}\nTeléfono: ${telefono}\nDirección: ${direccion}\nEmail: ${email}`
          );
          navigation.goBack();
        }}
      >
        <Text style={styles.buttonText}>Guardar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff0f5", // fondo pastel
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#cc3366",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#ffe6f0",
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#444",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ffb6c1",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#fff",
    fontSize: 16,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "pink",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 12,
  },
  secondaryButton: {
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
