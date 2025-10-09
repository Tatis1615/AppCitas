import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../Src/Config";

export default function DetallePaciente({ route, navigation }) {
  const { id } = route.params;
  const [paciente, setPaciente] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaciente = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/pacientes/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!response.ok) throw new Error("No se pudo cargar el paciente");

        const data = await response.json();
        setPaciente(data);
      } catch (error) {
        console.error(error);
        Alert.alert("❌ No se pudo cargar el paciente");
      } finally {
        setLoading(false);
      }
    };

    fetchPaciente();
  }, [id]);

  // 🔹 Función para eliminar paciente
  const eliminarPaciente = async () => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Estás segura de que deseas eliminar este paciente?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("token");
              const response = await fetch(`${API_BASE_URL}/eliminarPaciente/${id}`, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`,
                  Accept: "application/json",
                },
              });

              const data = await response.json();

              if (response.ok) {
                Alert.alert("✅ Paciente eliminado correctamente");
                navigation.navigate("ListarPacientes"); // 🔹 Redirige a la lista
              } else {
                console.error("Error del servidor:", data);
                Alert.alert("❌ Error", data.message || "No se pudo eliminar el paciente");
              }
            } catch (error) {
              console.error("Error eliminando paciente:", error);
              Alert.alert("❌ Error de conexión con el servidor");
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#cc3366" />
        <Text>Cargando paciente...</Text>
      </View>
    );
  }

  if (!paciente) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "red" }}>⚠️ No se encontró información</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalles del Paciente</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Nombre:</Text>
        <Text style={styles.value}>{paciente.nombre}</Text>

        <Text style={styles.label}>Apellido:</Text>
        <Text style={styles.value}>{paciente.apellido}</Text>

        <Text style={styles.label}>Documento:</Text>
        <Text style={styles.value}>{paciente.documento}</Text>

        <Text style={styles.label}>Teléfono:</Text>
        <Text style={styles.value}>{paciente.telefono}</Text>

        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{paciente.email}</Text>

        <Text style={styles.label}>Fecha de nacimiento:</Text>
        <Text style={styles.value}>{paciente.fecha_nacimiento}</Text>

        <Text style={styles.label}>Dirección:</Text>
        <Text style={styles.value}>{paciente.direccion}</Text>
      </View>

      {/* 🔹 Botón Editar */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("EditarPaciente", { paciente })}
      >
        <Text style={styles.buttonText}>Editar</Text>
      </TouchableOpacity>

      {/* 🔹 Botón Eliminar */}
      <TouchableOpacity
        style={[styles.button, styles.deleteButton]}
        onPress={eliminarPaciente}
      >
        <Text style={[styles.buttonText, { color: "white" }]}>Eliminar</Text>
      </TouchableOpacity>

      {/* 🔹 Botón Volver */}
      <TouchableOpacity
        style={[styles.button, styles.cancelButton]}
        onPress={() => navigation.goBack()}
      >
        <Text style={[styles.buttonText, { color: "#cc3366" }]}>Volver</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff0f5",
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    fontWeight: "bold",
    color: "#e38ea8",
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
    color: "#444",
  },
  value: {
    fontSize: 16,
    marginBottom: 10,
    color: "#333",
  },
  button: {
    backgroundColor: "#f7b2c4",
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
  deleteButton: {
    backgroundColor: "#d67693ff",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
