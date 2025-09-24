import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../Src/Config";

export default function CrearCita({ navigation }) {
  const [pacientes, setPacientes] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [consultorios, setConsultorios] = useState([]);
  const [paciente_id, setPacienteId] = useState("")
  const [medico_id, setMedicoId] = useState("");
  const [consultorio_id, setConsultorioId] = useState("");
  const [fecha_hora, setFecha_hora] = useState("");
  const [estado, setEstado] = useState("Pendiente"); // valor por defecto
  const [motivo, setMotivo] = useState("");

  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/listarPacientes`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!response.ok) throw new Error("No se pudieron cargar los pacientes");

        const data = await response.json();
        setPacientes(data); // guardamos la lista
      } catch (error) {
        console.error("Error cargando pacientes:", error);
        alert("❌ Error al cargar pacientes");
      }
    };

    fetchPacientes();
  }, []);

  useEffect(() => {
    const fetchMedicos = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/listarMedicos`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!response.ok) throw new Error("No se pudieron cargar los medicos");

        const data = await response.json();
        setMedicos(data); // guardamos la lista
      } catch (error) {
        console.error("Error cargando medicos:", error);
        alert("❌ Error al cargar medicos");
      }
    };

    fetchMedicos();
  }, []);

  useEffect(() => {
    const fetchConsultorios = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/listarConsultorios`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!response.ok) throw new Error("No se pudieron cargar los consultorios");

        const data = await response.json();
        setConsultorios(data); // guardamos la lista
      } catch (error) {
        console.error("Error cargando consultorios:", error);
        alert("❌ Error al cargar consultorios");
      }
    };

    fetchConsultorios();
  }, []);


  const handleCrear = async () => {
    if (!paciente_id || !medico_id || !consultorio_id || !fecha_hora || !estado || !motivo) {
      alert("Error", "Por favor completa todos los campos");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");

      const response = await fetch(`${API_BASE_URL}/crearCita`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({
          paciente_id,
          medico_id,
          consultorio_id,
          fecha_hora,
          estado,
          motivo,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Éxito", "✅ Cita creada correctamente");
        navigation.navigate("ListarCitas");
      } else {
        console.log("Errores:", data);
        alert("Error", data.message || "No se pudo crear la cita");
      }
    } catch (error) {
      console.error("Error en crear cita:", error);
      alert("Error", "Hubo un problema al conectar con el servidor");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Agendar Nueva Cita</Text>

      <Picker
        selectedValue={paciente_id}
        onValueChange={(itemValue) => setPacienteId(itemValue)}
        style={styles.input}
      >
        <Picker.Item label="Seleccione el paciente..." value="" />
        {pacientes.map((esp) => (
          <Picker.Item key={esp.id} label={esp.nombre} value={esp.id} />
        ))}
      </Picker>

      <Picker
        selectedValue={medico_id}
        onValueChange={(itemValue) => setMedicoId(itemValue)}
        style={styles.input}
      >
        <Picker.Item label="Seleccione el medico..." value="" />
        {medicos.map((esp) => (
          <Picker.Item key={esp.id} label={esp.nombre_m} value={esp.id} />
        ))}
      </Picker>

      <Picker
        selectedValue={consultorio_id}
        onValueChange={(itemValue) => setConsultorioId(itemValue)}
        style={styles.input}
      >
        <Picker.Item label="Seleccione un consultorio..." value="" />
        {consultorios.map((esp) => (
          <Picker.Item key={esp.id} label={esp.numero} value={esp.id} />
        ))}
      </Picker>

      <TextInput
        style={styles.input}
        placeholder="Fecha y Hora (YYYY-MM-DD HH:MM)"
        value={fecha_hora}
        onChangeText={setFecha_hora}
      />
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
    backgroundColor: "#fff0f5", // Fondo pastel suave
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
