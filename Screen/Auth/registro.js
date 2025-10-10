import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  ScrollView,
  Platform
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import API_BASE_URL from "../../Src/Config";

export default function Registro({ navigation }) {
  // Campos básicos
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  // Paciente
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [documento, setDocumento] = useState("");
  const [telefono, setTelefono] = useState("");
  const [emailPaciente, setEmailPaciente] = useState("");
  const [fecha_nacimiento, setFecha_nacimiento] = useState("");
  const [direccion, setDireccion] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Médico
  const [nombreM, setNombreM] = useState("");
  const [apellidoM, setApellidoM] = useState("");
  const [edad, setEdad] = useState("");
  const [telefonoM, setTelefonoM] = useState("");
  const [emailMedico, setEmailMedico] = useState("");
  const [especialidadId, setEspecialidadId] = useState("");

  const handleRegister = async () => {
    if (!name || !email || !password || !role) {
      Alert.alert("Error", "Por favor completa todos los campos básicos");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/registrar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log("Error en registro:", data);
        Alert.alert("Error", data.message || "No se pudo registrar el usuario");
        return;
      }

      await AsyncStorage.setItem("token", data.token);
      const token = data.token;
      const userId = data.user?.id;

      // ===================== PACIENTE =====================
      if (role === "paciente") {
        // Solo crear perfil si llenó al menos 1 campo adicional
        const filledFields = [nombre, apellido, documento, telefono, emailPaciente, direccion, fecha_nacimiento]
          .filter((v) => v.trim() !== "");

        if (filledFields.length > 0) {
          try {
            const responsePaciente = await fetch(`${API_BASE_URL}/crearPaciente`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
              },
              body: JSON.stringify({
                user_id: userId,
                nombre,
                apellido,
                documento,
                telefono,
                email: emailPaciente,
                direccion,
                fecha_nacimiento,
              }),
            });

            const dataPaciente = await responsePaciente.json();

            // Si ya existe o falla, solo muestra aviso pero NO detiene el flujo
            if (!responsePaciente.ok) {
              console.log("Paciente ya existente o error:", dataPaciente);
            }
          } catch (err) {
            console.log("Error al crear paciente:", err);
          }
        }
      }

      // ===================== MÉDICO =====================
      if (role === "medico") {
        // Solo crear perfil si llenó al menos 1 campo adicional
        const filledFields = [nombreM, apellidoM, edad, telefonoM, emailMedico, especialidadId]
          .filter((v) => v.trim() !== "");

        if (filledFields.length > 0) {
          try {
            const responseMedico = await fetch(`${API_BASE_URL}/crearMedico`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
              },
              body: JSON.stringify({
                user_id: userId,
                nombre_m: nombreM,
                apellido_m: apellidoM,
                edad,
                telefono: telefonoM,
                email: emailMedico,
                especialidad_id: especialidadId,
              }),
            });

            const dataMedico = await responseMedico.json();

            // Si ya existe o falla, no detiene el flujo
            if (!responseMedico.ok) {
              console.log("Médico ya existente o error:", dataMedico);
            }
          } catch (err) {
            console.log("Error al crear médico:", err);
          }
        }
      }

      // ✅ Mensaje final — siempre se muestra
      Alert.alert("Éxito", "Usuario registrado correctamente 💖");
      navigation.navigate("Login");

    } catch (error) {
      console.error("Error en el registro:", error);
      Alert.alert("Error", "Hubo un problema con la conexión al servidor");
    }
  };


  const onChangeFecha = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const fechaFormateada = selectedDate.toISOString().split("T")[0];
      setFecha_nacimiento(fechaFormateada);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>✨ Registro ✨</Text>

      {/* Campos básicos */}
      <TextInput
        style={styles.input}
        placeholder="Nombre de usuario"
        placeholderTextColor="#cc6699"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Correo"
        placeholderTextColor="#cc6699"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#cc6699"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Dropdown
        style={styles.dropdown}
        containerStyle={styles.dropdownContainer}
        data={[
          { label: "Administrador", value: "admin" },
          { label: "Paciente", value: "paciente" },
          { label: "Médico", value: "medico" },
        ]}
        labelField="label"
        valueField="value"
        placeholder="Selecciona un rol"
        value={role}
        onChange={(item) => setRole(item.value)}
        placeholderStyle={styles.placeholderStyle}
      />

      {/* Paciente */}
      {role === "paciente" && (
        <View style={styles.extraContainer}>
          <Text style={styles.subtitle}>🩺 Datos del Paciente</Text>

          <TextInput style={styles.input} placeholder="Nombre" value={nombre} onChangeText={setNombre} />
          <TextInput style={styles.input} placeholder="Apellido" value={apellido} onChangeText={setApellido} />
          <TextInput style={styles.input} placeholder="Documento" value={documento} onChangeText={setDocumento} />
          <TextInput style={styles.input} placeholder="Teléfono" value={telefono} onChangeText={setTelefono} />
          <TextInput style={styles.input} placeholder="Email" value={emailPaciente} onChangeText={setEmailPaciente} />
          <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
            <Text style={{ color: fecha_nacimiento ? "#000" : "#707070ff" }}>
              {fecha_nacimiento || "Selecciona fecha de nacimiento"}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onChangeFecha}
              maximumDate={new Date()}
            />
          )}
          <TextInput style={styles.input} placeholder="Dirección" value={direccion} onChangeText={setDireccion} />
        </View>
      )}

      {/* Médico */}
      {role === "medico" && (
        <View style={styles.extraContainer}>
          <Text style={styles.subtitle}>🩺 Datos del Médico</Text>

          <TextInput style={styles.input} placeholder="Nombre" value={nombreM} onChangeText={setNombreM} />
          <TextInput style={styles.input} placeholder="Apellido" value={apellidoM} onChangeText={setApellidoM} />
          <TextInput style={styles.input} placeholder="Edad" value={edad} onChangeText={setEdad} keyboardType="numeric" />
          <TextInput style={styles.input} placeholder="Teléfono" value={telefonoM} onChangeText={setTelefonoM} />
          <TextInput style={styles.input} placeholder="Email" value={emailMedico} onChangeText={setEmailMedico} />
          <TextInput style={styles.input} placeholder="Especialidad ID" value={especialidadId} onChangeText={setEspecialidadId} />
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={() => navigation.navigate("Login")}>
        <Text style={styles.buttonText}>Ya tengo cuenta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffe6f0", padding: 20 },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 20, textAlign: "center", color: "#dd5783ff" },
  subtitle: { fontSize: 20, fontWeight: "bold", color: "#cc3366", marginBottom: 10, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ff99bb",
    backgroundColor: "#fff0f5",
    padding: 12,
    marginVertical: 8,
    borderRadius: 12,
    fontSize: 16,
    color: "#660033",
  },
  extraContainer: { marginTop: 20, backgroundColor: "#fff5f8", padding: 15, borderRadius: 12 },
  button: {
    backgroundColor: "#ff9cbdff",
    paddingVertical: 15,
    borderRadius: 25,
    marginVertical: 10,
    alignItems: "center",
    elevation: 4,
  },
  secondaryButton: { backgroundColor: "#ff7eb2ff" },
  buttonText: { color: "white", fontSize: 18, fontWeight: "600" },
  dropdown: {
    width: "100%",
    borderRadius: 13,
    padding: 13,
    borderWidth: 1,
    borderColor: "#ff99bb",
    backgroundColor: "#fff5f8",
    marginVertical: 8,
  },
  dropdownContainer: { borderRadius: 12, backgroundColor: "#ffe4ec", borderWidth: 1, borderColor: "#ffb6c1" },
  placeholderStyle: { color: "#cc6699", fontSize: 16 },
});
