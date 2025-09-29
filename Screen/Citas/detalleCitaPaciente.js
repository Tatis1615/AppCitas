import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../Src/Config";

export default function DetalleCitaPaciente({ route, navigation }) {
  const { cita } = route.params;
  const [medico, setMedico] = useState(null);
  const [consultorio, setConsultorioNumero] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetalles = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        // Traer médico
        if (cita.medico_id) {
          const res = await fetch(`${API_BASE_URL}/medicos/${cita.medico_id}`, {
            headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
          });
          if (res.ok) setMedico(await res.json());
        }

        // Traer consultorio
        if (cita.consultorio_id) {
          const resConsultorio = await fetch(`${API_BASE_URL}/consultorios/${cita.consultorio_id}`,
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
        console.error("❌ Error cargando detalles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetalles();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#cc3366" />
        <Text>Cargando cita...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalles de la Cita</Text>

      <View style={styles.card}>

        <Text style={styles.label}>Médico:</Text>
        <Text style={styles.value}>
          {medico ? `${medico.nombre_m} ${medico.apellido_m}` : "No disponible"}
        </Text>

        <Text style={styles.label}>Consultorio:</Text>
        <Text style={styles.value}>{consultorio?.numero || "No disponible"}</Text>

        <Text style={styles.label}>Fecha y hora:</Text>
        <Text style={styles.value}>{cita.fecha_hora}</Text>

        <Text style={styles.label}>Estado:</Text>
        <Text style={styles.value}>{cita.estado}</Text>

        <Text style={styles.label}>Motivo:</Text>
        <Text style={styles.value}>{cita.motivo}</Text>
      </View>

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
  container: { flex: 1, padding: 20, backgroundColor: "#fff0f5" },
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
  label: { fontSize: 16, fontWeight: "bold", color: "#444" },
  value: { fontSize: 16, marginBottom: 10, color: "#333" },
  button: {
    backgroundColor: "pink",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 10,
  },
  cancelButton: { backgroundColor: "white", borderWidth: 1, borderColor: "#cc3366" },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },
});
