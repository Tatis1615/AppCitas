import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../Src/Config";

export default function EditarCita({ route, navigation }) {
  const { cita } = route.params;
  const [paciente_id, setPacienteId] = useState(cita.paciente_id);
  const [medico_id, setMedicoId] = useState(cita.medico_id);
  const [consultorio_id, setConsultorioId] = useState(cita.consultorio_id);
  const [fecha_hora, setFecha_hora] = useState(cita.fecha_hora);
  const [estado, setEstado] = useState(cita.estado);
  const [motivo, setMotivo] = useState(cita.motivo);
  const [pacientes, setPacientes] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [consultorios, setConsultorios] = useState([]);


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

        const data = await response.json();

        if (response.ok) {
          setPacientes(data); 
        } else {
          console.log("⚠️ Error cargando pacientes:", data);
          alert("No se pudieron cargar las pacientes");
        }
      } catch (error) {
        console.error("⚡ Error de red:", error);
        alert("Error al conectar con el servidor");
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

        const data = await response.json();

        if (response.ok) {
          setMedicos(data); 
        } else {
          console.log("⚠️ Error cargando medicos:", data);
          alert("No se pudieron cargar las medicos");
        }
      } catch (error) {
        console.error("⚡ Error de red:", error);
        alert("Error al conectar con el servidor");
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

        const data = await response.json();

        if (response.ok) {
          setConsultorios(data); 
        } else {
          console.log("⚠️ Error cargando consultorios:", data);
          alert("No se pudieron cargar las consultorios");
        }
      } catch (error) {
        console.error("⚡ Error de red:", error);
        alert("Error al conectar con el servidor");
      }
    };

    fetchConsultorios();
  }, []);

  const handleGuardar = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/actualizarCita/${cita.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("✅ Cita actualizado con éxito");
        navigation.navigate("ListarCitas");
      } else {
        console.log("⚠️ Backend respondió con error:", data);
        alert("❌ Error al actualizar la cita");
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

      <Text style={styles.title}>Editar Cita</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Paciente ID:</Text>
          <Picker
            selectedValue={paciente_id}
            onValueChange={(itemValue) => setPacienteId(itemValue)}
            style={styles.input}
          >
            <Picker.Item label="Seleccione el paciente" value="" />
            {pacientes.map((esp) => (
              <Picker.Item
                key={esp.id}
                label={esp.nombre}
                value={esp.id}
              />
            ))}
          </Picker>

        <Text style={styles.label}>Médico ID:</Text>
          <Picker
            selectedValue={medico_id}
            onValueChange={(itemValue) => setMedicoId(itemValue)}
            style={styles.input}
          >
            <Picker.Item label="Seleccione el medicos" value="" />
            {medicos.map((esp) => (
              <Picker.Item
                key={esp.id}
                label={esp.nombre_m}
                value={esp.id}
              />
            ))}
          </Picker>

        <Text style={styles.label}>Consultorio ID:</Text>
          <Picker
            selectedValue={consultorio_id}
            onValueChange={(itemValue) => setConsultorioId(itemValue)}
            style={styles.input}
          >
            <Picker.Item label="Seleccione un consultorio" value="" />
            {consultorios.map((esp) => (
              <Picker.Item
                key={esp.id}
                label={esp.numero}
                value={esp.id}
              />
            ))}
          </Picker>

        <Text style={styles.label}>Fecha y Hora:</Text>
        <TextInput
          value={fecha_hora}
          onChangeText={setFecha_hora}
          style={styles.input}
          placeholder="YYYY-MM-DD HH:mm"
        />

        <Text style={styles.label}>Estado de la cita:</Text>
        <TextInput
          value={estado}
          onChangeText={setEstado}
          style={styles.input}
          placeholder="Estado"
        />

        <Text style={styles.label}>Motivo:</Text>
        <TextInput
          value={motivo}
          onChangeText={setMotivo}
          style={styles.input}
          placeholder="Ej: Consulta general"
        />
      </View>

      {/* Botón Guardar */}
      <TouchableOpacity style={styles.button} onPress={handleGuardar}>
        <Text style={styles.buttonText}>Guardar</Text>
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
