import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../Src/Config";

export default function EditarPaciente({ route, navigation }) {
  const { paciente } = route.params;
  const [nombre, setNombre] = useState(paciente.nombre);
  const [ apellido, setApellido ] = useState(paciente.apellido);
  const [documento, setDocumento] = useState(paciente.documento);
  const [telefono, setTelefono] = useState(paciente.telefono);
  const [email, setEmail] = useState(paciente.email);
  const [fecha_nacimiento, setFecha_nacimiento] = useState(paciente.fecha_nacimiento);
  const [direccion, setDireccion] = useState(paciente.direccion);


const handleGuardar = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/actualizarPaciente/${paciente.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        Accept: "application/json",
      },
      body: JSON.stringify({ nombre, apellido, documento, telefono, email, fecha_nacimiento, direccion }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("✅ Paciente actualizado con éxito");
      navigation.navigate("ListarPacientes");
    } else {
      console.log("⚠️ Backend respondió con error:", data);
      alert("❌ Error al actualizar el paciente");
    }
  } catch (error) {
    console.error("⚡ Error de red:", error);
    alert("⚠️ Error de conexión con el servidor");
  }
};



  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Editar Paciente</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Nombre:</Text>
        <TextInput
          value={nombre}
          onChangeText={setNombre}
          style={styles.input}
          placeholder="Nombre"
        />

        <Text style={styles.label}>Apellido:</Text>
        <TextInput
          value={apellido}
          onChangeText={setApellido}
          style={styles.input}
          placeholder="Apellido"
        />
        <Text style={styles.label}>Documento:</Text>
        <TextInput
          value={documento}
          onChangeText={setDocumento}
          style={styles.input}
          placeholder="Documetno"
        />
        <Text style={styles.label}>Telefono:</Text>
        <TextInput
          value={telefono}
          onChangeText={setTelefono}
          style={styles.input}
          placeholder="Telefono"
        />
        <Text style={styles.label}>Email:</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          placeholder="Email"
        />
        <Text style={styles.label}>Fecha de nacimiento:</Text>
        <TextInput
          value={fecha_nacimiento}
          onChangeText={setFecha_nacimiento}
          style={styles.input}
          placeholder="Fecha nacimiento"
        />
        <Text style={styles.label}>Dirección:</Text>
        <TextInput
          value={direccion}
          onChangeText={setDireccion}
          style={styles.input}
          placeholder="Direccion"
        />
        
      </View>

      {/* Botón Guardar */}
      <TouchableOpacity style={styles.button} onPress={handleGuardar}>
        <Text style={styles.buttonText}>Guardar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={() => navigation.goBack()}
      >
        <Text style={[styles.buttonText, { color: "#cc3366" }]}>Cancelar</Text>
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
