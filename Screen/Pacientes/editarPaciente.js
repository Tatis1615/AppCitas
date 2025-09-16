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
    padding: 20,
    backgroundColor: "#fff0f5", // fondo rosadito
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    fontWeight: "bold",
    color: "#cc3366",
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ffb6c1",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#ffe6f0",
  },
  button: {
    backgroundColor: "pink",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
