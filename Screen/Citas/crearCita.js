import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform, TextInput } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import ModalSelector from "react-native-modal-selector";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../Src/Config";

export default function CrearCita({ navigation }) {
  const [pacientes, setPacientes] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [consultorios, setConsultorios] = useState([]);
  const [paciente_id, setPacienteId] = useState("");
  const [medico_id, setMedicoId] = useState("");
  const [consultorio_id, setConsultorioId] = useState("");
  const [fecha_hora, setFecha_hora] = useState(""); // formato final
  const [estado, setEstado] = useState("Pendiente");
  const [motivo, setMotivo] = useState("");

  // Estados para el picker
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());

  // Cargar pacientes
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
        setPacientes(data);
      } catch (error) {
        console.error("Error cargando pacientes:", error);
        alert("❌ Error al cargar pacientes");
      }
    };
    fetchPacientes();
  }, []);

  // Cargar médicos
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
        setMedicos(data);
      } catch (error) {
        console.error("Error cargando medicos:", error);
        alert("❌ Error al cargar medicos");
      }
    };
    fetchMedicos();
  }, []);

  // Cargar consultorios
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
        setConsultorios(data);
      } catch (error) {
        console.error("Error cargando consultorios:", error);
        alert("❌ Error al cargar consultorios");
      }
    };
    fetchConsultorios();
  }, []);

  // Guardar cita
  const handleCrear = async () => {
    if (!paciente_id || !medico_id || !consultorio_id || !fecha_hora || !estado || !motivo) {
      alert("⚠️ Por favor completa todos los campos");
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
          fecha_hora, // YYYY-MM-DD HH:mm
          estado,
          motivo,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Cita creada correctamente");
        navigation.navigate("ListarCitas");
      } else {
        console.log("Errores:", data);
        alert("❌ " + (data.message || "No se pudo crear la cita"));
      }
    } catch (error) {
      console.error("Error en crear cita:", error);
      alert("❌ Hubo un problema al conectar con el servidor");
    }
  };

  // Manejar selección de fecha
  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setTempDate(selectedDate);
      setShowTimePicker(true); // después de la fecha, mostrar hora
    }
  };

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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Agendar Nueva Cita</Text>

      {/* Paciente */}
      <SelectInput
        data={pacientes.map((esp) => ({ key: esp.id, label: esp.nombre }))}
        value={paciente_id}
        onChange={setPacienteId}
        placeholder="Seleccione el paciente..."
      />


      {/* Médico */}
      <SelectInput
        data={medicos.map((esp) => ({ key: esp.id, label: esp.nombre_m }))}
        value={medico_id}
        onChange={setMedicoId}
        placeholder="Seleccione el médico..."
      />

      {/* Consultorio */}
      <SelectInput
        data={consultorios.map((esp) => ({ key: esp.id, label: `Consultorio ${esp.numero}` }))}
        value={consultorio_id}
        onChange={setConsultorioId}
        placeholder="Seleccione un consultorio..."
      />

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

      {/* Estado */}
      <TextInput 
        style={styles.input} 
        placeholder="Estado de la cita" 
        value={estado} 
        onChangeText={setEstado} 
      />

      {/* Motivo */}
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



  function SelectInput({ data, value, onChange, placeholder }) {
  return (
    <ModalSelector
      data={data}
      initValue={placeholder}
      onChange={(option) => onChange(option.key)}
      cancelText="Cancelar"

      optionContainerStyle={{
        backgroundColor: "#fff0f5", // pastel rosa muy claro
        borderRadius: 20,
        padding: 10,
      }}
      optionTextStyle={{
        fontSize: 16,
        color: "#444",
        paddingVertical: 10,
      }}
      cancelStyle={{
        backgroundColor: "#ffe4e1", // rosa pastel
        borderRadius: 20,
        marginTop: 10,
      }}
      cancelTextStyle={{
        fontSize: 16,
        color: "#cc3366",
        fontWeight: "bold",
      }}
      overlayStyle={{ backgroundColor: "rgba(0,0,0,0.3)" }}
      initValueTextStyle={{ color: "#888", fontSize: 16 }}
      selectTextStyle={{ color: "#000", fontSize: 16 }}
      style={{ width: "100%", marginVertical: 8 }}
    >
      <View style={styles.inputSelect}>
        <Text style={{ color: value ? "#000" : "#888", fontSize: 16 }}>
          {value
            ? data.find((d) => d.key === value)?.label
            : placeholder}
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
    elevation: 3, // sombra en Android
  },

  
});
