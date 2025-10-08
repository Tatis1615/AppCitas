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

export default function DetalleCita({ route, navigation }) {
  const { id } = route.params;
  const [cita, setCita] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pacienteNombre, setPacienteNombre] = useState("");
  const [medicoNombre, setMedicoNombre] = useState("");
  const [consultorioNumero, setConsultorioNumero] = useState("");

  useEffect(() => {
    const fetchCita = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/citas/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!response.ok) throw new Error("No se pudo cargar la cita");

        const data = await response.json();
        setCita(data);

        // Traer nombre del paciente
        if (data.paciente_id) {
          const resPaciente = await fetch(
            `${API_BASE_URL}/pacientes/${data.paciente_id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
              },
            }
          );
          if (resPaciente.ok) {
            const paciente = await resPaciente.json();
            setPacienteNombre(paciente.nombre);
          }
        }

        // Traer nombre del médico
        if (data.medico_id) {
          const resMedico = await fetch(
            `${API_BASE_URL}/medicos/${data.medico_id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
              },
            }
          );
          if (resMedico.ok) {
            const medico = await resMedico.json();
            setMedicoNombre(medico.nombre_m);
          }
        }

        // Traer número del consultorio
        if (data.consultorio_id) {
          const resConsultorio = await fetch(
            `${API_BASE_URL}/consultorios/${data.consultorio_id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
              },
            }
          );
          if (resConsultorio.ok) {
            const consultorio = await resConsultorio.json();
            setConsultorioNumero(consultorio.numero);
          }
        }
      } catch (error) {
        console.error(error);
        alert("❌ No se pudo cargar la cita");
      } finally {
        setLoading(false);
      }
    };

    fetchCita();
  }, [id]);

  const eliminarCita = async () => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Estás segura de que deseas eliminar esta cita?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("token");
              const response = await fetch(`${API_BASE_URL}/eliminarCita/${id}`, {
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
                navigation.navigate("ListarCitas"); 
              } else {
                console.error("Error del servidor:", data);
                Alert.alert("❌ Error", data.message || "No se pudo eliminar la cita");
              }
            } catch (error) {
              console.error("Error eliminando cita:", error);
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
        <Text>Cargando cita...</Text>
      </View>
    );
  }

  if (!cita) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "red" }}>⚠️ No se encontró la información de la cita</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalles de la Cita</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Paciente:</Text>
        <Text style={styles.value}>{pacienteNombre || "Cargando..."}</Text>

        <Text style={styles.label}>Médico:</Text>
        <Text style={styles.value}>{medicoNombre || "Cargando..."}</Text>

        <Text style={styles.label}>Consultorio:</Text>
        <Text style={styles.value}>{consultorioNumero || "Cargando..."}</Text>

        <Text style={styles.label}>Fecha y hora:</Text>
        <Text style={styles.value}>{cita.fecha_hora}</Text>

        <Text style={styles.label}>Estado:</Text>
        <Text style={styles.value}>{cita.estado}</Text>

        <Text style={styles.label}>Motivo:</Text>
        <Text style={styles.value}>{cita.motivo}</Text>
      </View>

      {/* Botón Editar */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("EditarCita", { cita })}
      >
        <Text style={styles.buttonText}>Editar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.deleteButton]}
        onPress={eliminarCita}
      >
        <Text style={[styles.buttonText, { color: "white" }]}>Eliminar</Text>
      </TouchableOpacity>

      {/* Botón Volver */}
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
    backgroundColor: "#fff0f5", // Fondo pastel rosado
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
    color: "#444",
  },
  value: {
    fontSize: 16,
    marginBottom: 10,
    color: "#333",
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
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: "#ff4d4d",
  },
});
