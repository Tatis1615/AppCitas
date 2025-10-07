import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Dropdown } from "react-native-element-dropdown";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import API_BASE_URL from "../../Src/Config";

export default function CrearCitaPaciente({ route, navigation }) {
  const { paciente_id } = route.params;
  const [medicos, setMedicos] = useState([]);
  const [consultorios, setConsultorios] = useState([]);
  const [especialidades, setEspecialidades] = useState([]); // <- agregado
  const [loading, setLoading] = useState(true);

  const [idMedico, setIdMedico] = useState("");
  const [idConsultorio, setIdConsultorio] = useState("");
  const [fecha_hora, setFecha_hora] = useState("");
  const [estado, setEstado] = useState("Pendiente");
  const [motivo, setMotivo] = useState("");
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pacienteEmail, setPacienteEmail] = useState("");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const [medRes, conRes, espRes] = await Promise.all([
          fetch(`${API_BASE_URL}/listarMedicos`, {
            headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
          }),
          fetch(`${API_BASE_URL}/listarConsultorios`, {
            headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
          }),
          fetch(`${API_BASE_URL}/listarEspecialidades`, {
            headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
          }),
        ]);

        const medJson = medRes.ok ? await medRes.json() : [];
        const conJson = conRes.ok ? await conRes.json() : [];
        const espJson = espRes.ok ? await espRes.json() : [];

        setMedicos(Array.isArray(medJson) ? medJson : []);
        setConsultorios(Array.isArray(conJson) ? conJson : []);
        setEspecialidades(Array.isArray(espJson) ? espJson : []);

        // Selección aleatoria inicial si quieres
        if (Array.isArray(medJson) && medJson.length > 0) {
          setIdMedico(medJson[0].id);
        }
        if (Array.isArray(conJson) && conJson.length > 0) {
          setIdConsultorio(conJson[0].id);
        }
      } catch (e) {
        console.error("Error cargando medicos/consultorios/especialidades:", e);
        alert("Error cargando datos. Revisa la consola.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  useEffect(() => {
    const fetchPacienteId = async () => {
      if (!paciente_id) {
        const storedId = await AsyncStorage.getItem("paciente_id");
        if (storedId) {
          console.log("📦 paciente_id recuperado de AsyncStorage:", storedId);
          route.params = { ...route.params, paciente_id: storedId };
        } else {
          alert("No se encontró el ID del paciente. Inicia sesión nuevamente.");
        }
      }
    };
    fetchPacienteId();
  }, []);


  useEffect(() => {
    const getEmail = async () => {
      try {
        const email = await AsyncStorage.getItem("paciente_email");
        if (email) {
          setPacienteEmail(email);
          console.log("Paciente email cargado:", email);
        } else {
          if (paciente_id) {
            const token = await AsyncStorage.getItem("token");
            if (token) {
              try {
                const res = await fetch(`${API_BASE_URL}/pacientes/${paciente_id}`, {
                  headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
                });
                if (res.ok) {
                  const json = await res.json();
                  const fetchedEmail = json.email || json.data?.email;
                  if (fetchedEmail) {
                    setPacienteEmail(fetchedEmail);
                    await AsyncStorage.setItem("paciente_email", fetchedEmail);
                  }
                }
              } catch (err) {
                console.warn("No se pudo obtener email por paciente_id:", err);
              }
            }
          }
        }
      } catch (err) {
        console.error("Error leyendo paciente_email:", err);
      }
    };
    getEmail();
  }, [paciente_id]);

  const handleCrear = async () => {
    if (!pacienteEmail) {
      alert("⚠️ No se encontró el email del paciente. Vuelve a iniciar sesión o regístrate.");
      return;
    }
    if (!idMedico || !idConsultorio || !motivo || !fecha_hora) {
      alert("⚠️ Completa todos los campos");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
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
          fecha_hora,
          estado,
          motivo,
        }),

      });

      const body = await response.json().catch(() => ({}));
      console.log("crearCita -> response body:", body);

      if (response.ok) {
        alert("✅ Cita creada correctamente");
        navigation.navigate("ListarCitasPaciente");
      } else {
        alert("❌ Error: " + (body.message || JSON.stringify(body)));
      }
    } catch (e) {
      console.error(e);
      alert("Error de conexión con el servidor");
    }
  };

  // date/time pickers
  const [tempDate, setTempDate] = useState(new Date());
  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setTempDate(selectedDate);
      setShowTimePicker(true);
    }
  };
  const onChangeTime = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const finalDate = new Date(tempDate);
      finalDate.setHours(selectedTime.getHours());
      finalDate.setMinutes(selectedTime.getMinutes());
      const fechaFormateada =
        finalDate.toISOString().slice(0, 10) + " " + finalDate.toTimeString().slice(0, 5);
      setFecha_hora(fechaFormateada);
    }
  };

  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#fdacd2" />
        <Text style={{ marginTop: 10 }}>Cargando datos...</Text>
      </View>
    );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Agendar Nueva Cita</Text>

      {/* médicos */}
      <Text style={styles.label}>Selecciona un médico</Text>
      <Dropdown
        style={styles.dropdown}
        containerStyle={styles.dropdownContainer}
        data={medicos.map((m) => {
          const especialidadNombre =
            especialidades.find((e) => String(e.id) === String(m.especialidad_id))?.nombre_e ||
            "Sin especialidad";
          return {
            label: `${m.nombre_m} ${m.apellido_m} — ${especialidadNombre}`,
            value: m.id,
          };
        })}
        labelField="label"
        valueField="value"
        placeholder="Selecciona un médico..."
        value={idMedico}
        onChange={(item) => setIdMedico(item.value)}
      />

      {/* consultorios */}
      <Text style={styles.label}>Selecciona consultorio</Text>
      <Dropdown
        style={styles.dropdown}
        containerStyle={styles.dropdownContainer}
        data={consultorios.map((c) => ({
          label: `Consultorio ${c.numero}`,
          value: c.id,
        }))}
        labelField="label"
        valueField="value"
        placeholder="Selecciona un consultorio..."
        value={idConsultorio}
        onChange={(item) => setIdConsultorio(item.value)}
      />




      {/* Fecha/hora */}
      <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
        <Text style={{ color: fecha_hora ? "#000" : "#888" }}>{fecha_hora || "Selecciona fecha y hora"}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker value={new Date()} mode="date" display={Platform.OS === "ios" ? "spinner" : "default"} onChange={onChangeDate} minimumDate={new Date()} />
      )}
      {showTimePicker && <DateTimePicker value={tempDate} mode="time" display={Platform.OS === "ios" ? "spinner" : "default"} onChange={onChangeTime} />}

      <TextInput style={styles.input} placeholder="Motivo de la cita" value={motivo} onChangeText={setMotivo} />

      <TouchableOpacity style={styles.button} onPress={handleCrear}>
        <Text style={styles.buttonText}>Crear Cita</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={() => navigation.goBack()}>
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
  selectButton: { 
    width: "100%",
    borderWidth: 1, 
    borderColor: "#ffb6c1", 
    borderRadius: 10, 
    padding: 12, 
    marginBottom: 8, 
    backgroundColor: "#fff", 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center" 
  },
  selectWrapper: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ffb6c1",
    borderRadius: 12,
    backgroundColor: "#fff",
    marginVertical: 8,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  picker: {
    width: "100%",
    height: 50,
    color: "#333",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#444",
    width: "100%",
  },

  dropdown: {
    width: "100%",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#ffb6c1",
    backgroundColor: "#fff",
    marginVertical: 8,
  },
  dropdownContainer: {
    borderRadius: 16,
    backgroundColor: "#ffe4ec", 
    borderWidth: 1,
    borderColor: "#ffb6c1",
  },
});