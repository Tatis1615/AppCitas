import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../Src/Config";

export default function CrearMedico({ navigation }) {
  const [especialidades, setEspecialidades] = useState([]); // lista de especialidades
  const [especialidad_id, setEspecialidadId] = useState(""); 
  const [nombre_m, setNombre] = useState("");
  const [apellido_m, setApellido] = useState("");
  const [edad, setEdad] = useState("");
  const [telefono, setTelefono] = useState("");

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

        if (!response.ok) throw new Error("No se pudieron cargar las especialidades");

        const data = await response.json();
        setEspecialidades(data); // guardamos la lista
      } catch (error) {
        console.error("Error cargando especialidades:", error);
        alert("❌ Error al cargar especialidades");
      }
    };

    fetchEspecialidades();
  }, []);

  const handleCrear = async () => {
    if (!especialidad_id || !nombre_m || !apellido_m || !edad || !telefono) {
      alert("⚠️ Por favor completa todos los campos");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");

      const response = await fetch(`${API_BASE_URL}/crearMedico`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({ especialidad_id, nombre_m, apellido_m, edad, telefono }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Médico creado correctamente");
        navigation.navigate("ListarMedicos");
      } else {
        console.log("Errores:", data);
        alert("❌ " + (data.message || "No se pudo crear el médico"));
      }
    } catch (error) {
      console.error("Error en crear médico:", error);
      alert("⚠️ Hubo un problema al conectar con el servidor");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Registrar Nuevo Médico</Text>


      <Picker
        selectedValue={especialidad_id}
        onValueChange={(itemValue) => setEspecialidadId(itemValue)}
        style={styles.input}
      >
        <Picker.Item label="Seleccione una especialidad..." value="" />
        {especialidades.map((esp) => (
          <Picker.Item key={esp.id} label={esp.nombre_e} value={esp.id} />
        ))}
      </Picker>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre_m}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Apellido"
        value={apellido_m}
        onChangeText={setApellido}
      />
      <TextInput
        style={styles.input}
        placeholder="Edad"
        value={edad}
        onChangeText={setEdad}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Teléfono"
        value={telefono}
        onChangeText={setTelefono}
      />

      {/* Botón Crear */}
      <TouchableOpacity style={styles.button} onPress={handleCrear}>
        <Text style={styles.buttonText}>Crear Médico</Text>
      </TouchableOpacity>

      {/* Botón Volver */}
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

