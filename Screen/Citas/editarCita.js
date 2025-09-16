import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

export default function EditarCita({ route, navigation }) {
  const { cita } = route.params;
  const [paciente_id, setPacienteId] = useState(cita.paciente_id);
  const [medico_id, setMedicoId] = useState(cita.medico_id);
  const [consultorio_id, setConsultorioId] = useState(cita.consultorio_id);
  const [fecha_hora, setFecha_hora] = useState(cita.fecha_hora);
  const [estado, setEstado] = useState(cita.estado);
  const [motivo, setMotivo] = useState(cita.motivo);

  const handleGuardar = () => {
    alert(
      `Cita actualizada:\nPaciente: ${paciente_id}\nMédico: ${medico_id}\nConsultorio: ${consultorio_id}\nFecha/Hora: ${fecha_hora}\nEstado: ${estado}\nMotivo: ${motivo}`
    );
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Editar Cita</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Paciente ID:</Text>
        <TextInput
          value={String(paciente_id)}
          onChangeText={setPacienteId}
          keyboardType="numeric"
          style={styles.input}
        />

        <Text style={styles.label}>Médico ID:</Text>
        <TextInput
          value={String(medico_id)}
          onChangeText={setMedicoId}
          keyboardType="numeric"
          style={styles.input}
        />

        <Text style={styles.label}>Consultorio ID:</Text>
        <TextInput
          value={String(consultorio_id)}
          onChangeText={setConsultorioId}
          keyboardType="numeric"
          style={styles.input}
        />

        <Text style={styles.label}>Fecha y Hora:</Text>
        <TextInput
          value={fecha_hora}
          onChangeText={setFecha_hora}
          style={styles.input}
          placeholder="YYYY-MM-DD HH:mm"
        />

        <Text style={styles.label}>Estado:</Text>
        <TextInput
          value={estado}
          onChangeText={setEstado}
          style={styles.input}
          placeholder="Ej: Confirmada, Pendiente"
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
