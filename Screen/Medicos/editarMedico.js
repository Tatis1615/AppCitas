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

export default function EditarMedico({ route, navigation }) {
  const { medico } = route.params;
  const [especialidad_id, setEspecialidadId] = useState(medico.especialidad_id);
  const [nombre_m, setNombre] = useState(medico.nombre_m);
  const [apellido_m, setApellido] = useState(medico.apellido_m);
  const [edad, setEdad] = useState(String(medico.edad));
  const [telefono, setTelefono] = useState(medico.telefono);
  const [especialidades, setEspecialidades] = useState([]);

  useEffect(() => {
    const fetchEspecialidades = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/listarEspecialidades`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        const data = await response.json();

        if (response.ok) {
          setEspecialidades(data); // 👈 Guardar especialidades en el estado
        } else {
          console.log("⚠️ Error cargando especialidades:", data);
          alert("No se pudieron cargar las especialidades");
        }
      } catch (error) {
        console.error("⚡ Error de red:", error);
        alert("Error al conectar con el servidor");
      }
    };

    fetchEspecialidades();
  }, []);

  const handleGuardar = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/actualizarMedico/${medico.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: JSON.stringify({
            especialidad_id,
            nombre_m,
            apellido_m,
            edad,
            telefono,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("✅ Médico actualizado con éxito");
        navigation.navigate("ListarMedicos");
      } else {
        console.log("⚠️ Backend respondió con error:", data);
        alert("❌ Error al actualizar el médico");
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
      <Text style={styles.title}>Editar Médico</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Especialidad:</Text>
          <Picker
            selectedValue={especialidad_id}
            onValueChange={(itemValue) => setEspecialidadId(itemValue)}
            style={styles.input}
          >
            <Picker.Item label="Seleccione una especialidad" value="" />
            {especialidades.map((esp) => (
              <Picker.Item
                key={esp.id}
                label={esp.nombre_e}
                value={esp.id}
              />
            ))}
          </Picker>


        <Text style={styles.label}>Nombre:</Text>
        <TextInput
          value={nombre_m}
          onChangeText={setNombre}
          style={styles.input}
        />

        <Text style={styles.label}>Apellido:</Text>
        <TextInput
          value={apellido_m}
          onChangeText={setApellido}
          style={styles.input}
        />

        <Text style={styles.label}>Edad:</Text>
        <TextInput
          value={edad}
          onChangeText={setEdad}
          keyboardType="numeric"
          style={styles.input}
        />

        <Text style={styles.label}>Teléfono:</Text>
        <TextInput
          value={telefono}
          onChangeText={setTelefono}
          style={styles.input}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleGuardar}>
        <Text style={styles.buttonText}>Guardar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.cancelButton]}
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
    padding: 20,
    backgroundColor: "#fff0f5",
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
    marginBottom: 5,
    color: "#444",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
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
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
});
