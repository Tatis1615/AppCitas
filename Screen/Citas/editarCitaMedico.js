import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform } from "react-native";
import ModalSelector from "react-native-modal-selector";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../Src/Config";

export default function EditarCitaMedico({ route, navigation }) {
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

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());

  // Función reutilizable para cargar datos
  const fetchData = async (endpoint, setData, entityName) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setData(data);
      } else {
        console.warn(`Error cargando ${entityName}:`, data);
        Alert.alert("Error", `No se pudieron cargar los ${entityName}.`);
      }
    } catch (error) {
      console.error(`Error al cargar ${entityName}:`, error);
      Alert.alert("Error de red", `No fue posible conectar al servidor.`);
    }
  };

  useEffect(() => {
    fetchData("listarPacientes", setPacientes, "pacientes");
    fetchData("listarMedicos", setMedicos, "médicos");
    fetchData("listarConsultorios", setConsultorios, "consultorios");
  }, []);

  const handleGuardar = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/actualizarCita/${cita.id}`, {
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
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Éxito", "Cita actualizada con éxito");
        navigation.navigate("ListarCitas");
      } else {
        console.warn("Error al actualizar:", data);
        Alert.alert("Error", "No se pudo actualizar la cita.");
      }
    } catch (error) {
      console.error("Error de red:", error);
      Alert.alert("Error", "No fue posible conectar con el servidor.");
    }
  };

  const onChangeDate = (_, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setTempDate(selectedDate);
      setShowTimePicker(true);
    }
  };

  const onChangeTime = (_, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const finalDate = new Date(tempDate);
      finalDate.setHours(selectedTime.getHours());
      finalDate.setMinutes(selectedTime.getMinutes());
      const formatted = `${finalDate.toISOString().slice(0, 10)} ${finalDate
        .toTimeString()
        .slice(0, 5)}`;
      setFecha_hora(formatted);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Editar Cita</Text>

      <Text style={styles.label}>Paciente:</Text>
      <SelectInput
        data={pacientes.map((p) => ({ key: p.id, label: p.nombre }))}
        value={paciente_id}
        onChange={setPacienteId}
        placeholder="Seleccione el paciente..."
      />

      <Text style={styles.label}>Médico:</Text>
      <SelectInput
        data={medicos.map((m) => ({
          key: m.id,
          label: `${m.nombre_m} ${m.apellido_m}`,
        }))}
        value={medico_id}
        onChange={setMedicoId}
        placeholder="Seleccione el médico..."
      />

      <Text style={styles.label}>Consultorio:</Text>
      <SelectInput
        data={consultorios.map((c) => ({
          key: c.id,
          label: `Consultorio ${c.numero}`,
        }))}
        value={consultorio_id}
        onChange={setConsultorioId}
        placeholder="Seleccione un consultorio..."
      />

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
          minimumDate={new Date()}
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

      <Text style={styles.label}>Estado:</Text>
      <SelectInput
        data={[
          { key: "pendiente", label: "Pendiente" },
          { key: "confirmada", label: "Confirmada" },
          { key: "cancelada", label: "Cancelada" },
        ]}
        value={estado}
        onChange={setEstado}
        placeholder="Seleccione el estado..."
      />

      <Text style={styles.label}>Motivo:</Text>
      <TextInput
        value={motivo}
        onChangeText={setMotivo}
        style={styles.input}
        placeholder="Ej: Consulta general"
      />

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

  // 🧩 Subcomponente: Selector reutilizable
  function SelectInput({ data, value, onChange, placeholder }) {
    return (
      <ModalSelector
        data={data}
        initValue={placeholder}
        onChange={(option) => onChange(option.key)}
        cancelText="Cancelar"
        optionContainerStyle={{ backgroundColor: "#fff0f5", borderRadius: 20, padding: 10 }}
        optionTextStyle={{ fontSize: 16, color: "#444", paddingVertical: 10 }}
        cancelStyle={{ backgroundColor: "#ffe4e1", borderRadius: 20, marginTop: 10 }}
        cancelTextStyle={{ fontSize: 16, color: "#cc3366", fontWeight: "bold" }}
        overlayStyle={{ backgroundColor: "rgba(0,0,0,0.3)" }}
        initValueTextStyle={{ color: "#888", fontSize: 16 }}
        selectTextStyle={{ color: "#000", fontSize: 16 }}
        style={{ width: "100%", marginVertical: 8 }}
      >
        <View style={styles.inputSelect}>
          <Text style={{ color: value ? "#000" : "#888", fontSize: 16 }}>
            {value ? data.find((d) => d.key === value)?.label : placeholder}
          </Text>
        </View>
      </ModalSelector>
    );
  }
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
    padding: 14,
    borderRadius: 15,
    marginVertical: 15,
    justifyContent: "center",
    elevation: 3,
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
  inputSelect: {
    width: "100%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ffb6c1",
    padding: 14,
    borderRadius: 15,
    marginVertical: 8,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, 
  },
  label: {
    width: "100%",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#444",
  },
  
});
