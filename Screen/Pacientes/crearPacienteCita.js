import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import API_BASE_URL from "../../Src/Config";

export default function CrearPacienteCita({ navigation }) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [documento, setDocumento] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [fecha_nacimiento, setFecha_nacimiento] = useState("");
  const [direccion, setDireccion] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState(""); // 🔹 Nuevo estado

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) return;

        const res = await fetch(`${API_BASE_URL}/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          console.log("/me responded not ok", res.status);
          return;
        }

        const data = await res.json();
        const user = data.user || data;

        setRole(user?.role ?? null);
        setUserId(user?.id ?? null);
        setUserEmail(user?.email ?? ""); // 🔹 Guardamos email del login
        setEmail(user?.email ?? "");     // 🔹 Fijamos también en tu campo email
      } catch (err) {
        console.error("Error fetching /me:", err);
      }
    };

    fetchMe();
  }, []);


  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const fechaISO = selectedDate.toISOString().split("T")[0]; // YYYY-MM-DD
      setFecha_nacimiento(fechaISO);
    }
  };

  const handleCrear = async () => {
    // Validaciones mínimas
    if (
      !nombre ||
      !apellido ||
      !documento ||
      !telefono ||
      !email ||
      !fecha_nacimiento ||
      !direccion
    ) {
      Alert.alert("⚠️ Falta información", "Por favor completa todos los campos");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("No autenticado", "Debes iniciar sesión para crear pacientes");
        navigation.navigate("Login");
        return;
      }

      // Si no tenemos rol en estado, pedir /me en el momento (fallback)
      let currentRole = role;
      if (!currentRole) {
        try {
          const res = await fetch(`${API_BASE_URL}/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          });
          if (res.ok) {
            const dd = await res.json();
            const user = dd.user || dd;
            currentRole = user?.role;
            setRole(currentRole);
            setUserId(user?.id ?? null);
          } else {
            console.log("/me fallback failed", res.status);
          }
        } catch (e) {
          console.error("Error fetching /me in fallback:", e);
        }
      }

      // Normalizar cadena y validar (case-insensitive)
      const roleStr = (currentRole ?? "").toString().toLowerCase();
      if (!(roleStr === "admin" || roleStr === "paciente")) {
        Alert.alert(
          "Permisos insuficientes",
          `Solo usuarios con rol "admin" o "paciente" pueden crear pacientes. Rol actual: "${currentRole ?? "desconocido"}"`
        );
        return;
      }

      // Enviar creación al backend
      const response = await fetch(`${API_BASE_URL}/crearPaciente`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre,
          apellido,
          documento,
          telefono,
          email,
          fecha_nacimiento,
          direccion,
        }),
      });

      const body = await response.json().catch(() => ({}));

      if (response.ok) {
        Alert.alert("✅ Éxito", body.message || "Paciente creado correctamente");

        // Guardar paciente_id si backend lo devuelve
        const newId = body.data?.id ?? body.id ?? null;
        if (newId) {
          await AsyncStorage.setItem("paciente_id", String(newId));
          console.log("paciente_id guardado:", newId);
        }

        // Navegar a la pantalla deseada (puedes cambiar destino)
        navigation.navigate("ListarCitasPaciente", { paciente: body.data ?? body });
        return;
      }

      // Si no ok, mostrar errores (validaciones)
      if (body.errors) {
        // Laravel usually returns errors object
        const firstKey = Object.keys(body.errors)[0];
        const msg = Array.isArray(body.errors[firstKey])
          ? body.errors[firstKey].join("\n")
          : body.errors[firstKey];
        Alert.alert("Error", msg);
      } else {
        Alert.alert("Error", body.message || JSON.stringify(body));
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      Alert.alert("Error", "Ocurrió un error al conectar con el servidor");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Nuevo Paciente</Text>

        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Juan"
          value={nombre}
          onChangeText={setNombre}
          placeholderTextColor="#b0b0b0"
        />

        <Text style={styles.label}>Apellido</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Pérez"
          value={apellido}
          onChangeText={setApellido}
          placeholderTextColor="#b0b0b0"
        />

        <Text style={styles.label}>Documento</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: 12345678"
          value={documento}
          onChangeText={setDocumento}
          keyboardType="numeric"
          placeholderTextColor="#b0b0b0"
        />

        <Text style={styles.label}>Teléfono</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: 3001234567"
          value={telefono}
          onChangeText={setTelefono}
          keyboardType="phone-pad"
          placeholderTextColor="#b0b0b0"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[
            styles.input,
            role?.toLowerCase() === "paciente" && { backgroundColor: "#e6e6e6" }, // gris si bloqueado
          ]}
          placeholder="Ej: correo@ejemplo.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholderTextColor="#b0b0b0"
          editable={role?.toLowerCase() !== "paciente"} // 🔹 bloquea si paciente
        />


        <Text style={styles.label}>Fecha de nacimiento</Text>
        <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
          <Text style={{ color: fecha_nacimiento ? "#333" : "#b0b0b0" }}>
            {fecha_nacimiento || "Seleccione una fecha"}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={fecha_nacimiento ? new Date(fecha_nacimiento) : new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleDateChange}
          />
        )}

        <Text style={styles.label}>Dirección</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Calle 123 #45-67"
          value={direccion}
          onChangeText={setDireccion}
          placeholderTextColor="#b0b0b0"
        />

        <TouchableOpacity style={styles.button} onPress={handleCrear}>
          <Text style={styles.buttonText}>Crear Paciente</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3e9f7",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#9b59b6",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 5,
    color: "#444",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1b3ff",
    padding: 12,
    marginBottom: 15,
    borderRadius: 12,
    backgroundColor: "#fafafa",
    color: "#333",
  },
  button: {
    backgroundColor: "#a564d3",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
