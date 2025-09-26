import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../Src/Config";

export default function CrearCitaPaciente({ route, navigation }) {
  const { paciente_id } = route.params
  const [medicos, setMedicos] = useState([]);
  const [consultorios, setConsultorios] = useState([]);
  const [loading, setLoading] = useState(true)

  const [idMedico, setIdMedico] = useState("")
  const [idConsultorio, setIdConsultorio] = useState("")
  const [fecha_hora, setFecha_hora] = useState(""); // formato final
  const [estado, setEstado] = useState("Pendiente"); // valor por defecto
  const [motivo, setMotivo] = useState("");
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("token")
        const [medRes, conRes] = await Promise.all([
          fetch(`${API_BASE_URL}/listarMedicos`, { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } }),
          fetch(`${API_BASE_URL}/listarConsultorios`, { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } }),
        ])
        const medJson = await medRes.json()
        const conJson = await conRes.json()
        setMedicos(medJson)
        setConsultorios(conJson)

        if (medJson.length > 0) {
          const randomMedico = medJson[Math.floor(Math.random() * medJson.length)]
          setIdMedico(randomMedico.id)
        }
        if (conJson.length > 0) {
          const randomConsultorio = conJson[Math.floor(Math.random() * conJson.length)]
          setIdConsultorio(randomConsultorio.id)
        }
        setEstado("Pendiente")
      } catch (e) {
        console.error("Error cargando datos:", e)
        alert("Error", "No se pudieron cargar médicos o consultorios")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleCrear = async () => {
    if (!idMedico || !idConsultorio || !fecha_hora) {
      alert("⚠️ Completa todos los campos")
      return
    }

    try {
      const token = await AsyncStorage.getItem("token")
      const response = await fetch(`${API_BASE_URL}/crearCita`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          paciente_id: paciente_id,
          medico_id: idMedico,
          consultorio_id: idConsultorio,
          fecha,
          hora,
          estado,
          motivo,
        }),
      })

      const body = await response.json()
      if (response.ok) {
        alert("Cita creada correctamente")
        navigation.navigate("ListarCitasPaciente")
      } else {
        alert("Error", body.message || "Error creando cita")
      }
    } catch (e) {
      console.error(e)
      alert("Error", "Error de conexión")
    }
  }

  // Manejar selección de hora
  const onChangeTime = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const finalDate = new Date(tempDate);
      finalDate.setHours(selectedTime.getHours());
      finalDate.setMinutes(selectedTime.getMinutes());

      // Formato YYYY-MM-DD HH:mm
      const fechaFormateada =
        finalDate.toISOString().slice(0, 10) +
        " " +
        finalDate.toTimeString().slice(0, 5);

      setFecha_hora(fechaFormateada);
    }
  };

  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#fdacd2" />
        <Text style={{ marginTop: 10 }}>Cargando datos...</Text>
      </View>
    )

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Agendar Nueva Cita</Text>

       {/* Médico */}
        <Text style={styles.label}>Médico asignado</Text>
        <View style={styles.selectButton}>
          <Text style={styles.selectText}>
            {idMedico ? `${medicos.find((m) => m.id === idMedico)?.nombre_m} ${medicos.find((m) => m.id === idMedico)?.apellido_m}` : "Seleccionando médico..."}
          </Text>
        </View>

        {/* Consultorio */}
        <Text style={styles.label}>Consultorio asignado</Text>
        <View style={styles.selectButton}>
          <Text style={styles.selectText}>
            {idConsultorio ? `Consultorio ${consultorios.find((c) => c.id === idConsultorio)?.numero}` : "Seleccionando consultorio..."}
          </Text>
        </View>


      {/* 📅 Selección de fecha y hora */}
      <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
        <Text style={{ color: fecha_hora ? "#000" : "#888" }}>
          {fecha_hora || "Selecciona fecha y hora"}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onChangeDate}
          minimumDate={new Date()} // evita fechas pasadas
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={tempDate}
          mode="time"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onChangeTime}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Estado de la cita"
        value={estado}
        onChangeText={setEstado}
      />

      <TextInput
        style={styles.input}
        placeholder="Motivo de la cita"
        value={motivo}
        onChangeText={setMotivo}
      />

      {/* Botón Crear */}
      <TouchableOpacity style={styles.button} onPress={handleCrear}>
        <Text style={styles.buttonText}>Crear Cita</Text>
      </TouchableOpacity>

      {/* Botón Cancelar */}
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
    flexGrow: 1,
    backgroundColor: "#fff0f5",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#cc3366",
    textAlign: "center",
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ffb6c1",
    padding: 12,
    marginVertical: 8,
    borderRadius: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: "pink",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 15,
    width: "100%",
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
