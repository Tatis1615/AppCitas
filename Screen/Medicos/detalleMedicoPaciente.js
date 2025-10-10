import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../Src/Config";

export default function DetalleMedicoPaciente({ route, navigation }) {
  const { id } = route.params;
  const [medico, setMedico] = useState(null);
  const [loading, setLoading] = useState(true);
  const [especialidadNombre, setEspecialidadNombre] = useState("");

useEffect(() => {
  const fetchMedico = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/medicos/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) throw new Error("No se pudo cargar el medico");

      const data = await response.json();
      setMedico(data);

      if (data.especialidad_id) {
        const espRes = await fetch(`${API_BASE_URL}/especialidades/${data.especialidad_id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (espRes.ok) {
          const espData = await espRes.json();
          setEspecialidadNombre(espData.nombre_e);
        }
      }
    } catch (error) {
      console.error(error);
      alert("No se pudo cargar el médico");
    } finally {
      setLoading(false);
    }
  };

  fetchMedico();
}, [id]);


  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#cc3366" />
        <Text>Cargando medico...</Text>
      </View>
    );
  }

  if (!medico) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "red" }}>No se encontró información</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalles del Médico</Text>


      <View style={styles.card}>
        <Text style={styles.label}>Especialidad:</Text>
        <Text style={styles.value}>
          {especialidadNombre || "Cargando..."}
        </Text>

        <Text style={styles.label}>Nombre:</Text>
        <Text style={styles.value}>{medico.nombre_m}</Text>

        <Text style={styles.label}>Apellido:</Text>
        <Text style={styles.value}>{medico.apellido_m}</Text>

        <Text style={styles.label}>Edad:</Text>
        <Text style={styles.value}>{medico.edad}</Text>

        <Text style={styles.label}>Teléfono:</Text>
        <Text style={styles.value}>{medico.telefono}</Text>

        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{medico.email}</Text>
      </View>


      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
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
    backgroundColor: "#fff0f5", 
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
    color: "#444",
  },
  value: {
    fontSize: 16,
    marginBottom: 12,
    color: "#333",
  },
  button: {
    backgroundColor: "pink",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 10,
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
