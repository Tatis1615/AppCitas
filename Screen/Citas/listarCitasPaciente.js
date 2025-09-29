import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import API_BASE_URL from "../../Src/Config";

export default function ListarCitasPaciente({ navigation }) {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Estado claro: true = sí es paciente, false = no es paciente, null = aún no sé
  const [isPaciente, setIsPaciente] = useState(null);
  const [pacienteEmail, setPacienteEmail] = useState(null);
  const [pacienteId, setPacienteId] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          setLoading(false);
          Alert.alert("Sesión requerida", "Debes iniciar sesión para ver tus citas");
          setIsPaciente(false);
          return;
        }

        // 1) Llamada a /me para obtener email del usuario autenticado (fallback si backend no devuelve email)
        let userEmail = null;
        try {
          const meRes = await fetch(`${API_BASE_URL}/me`, {
            headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
          });
          if (meRes.ok) {
            const meJson = await meRes.json();
            const user = meJson.user ?? meJson;
            userEmail = user?.email ?? null;
            if (userEmail) {
              await AsyncStorage.setItem("user_email", userEmail);
            }
          } else {
            // no critically failing — seguimos para intentar listar citas
            console.log("/me returned", meRes.status);
          }
        } catch (e) {
          console.warn("Error fetching /me:", e);
        }

        // 2) Llamada a listarCitasPaciente (tu backend) — este endpoint debería devolver:
        // { success: true, data: [...], email: "paciente@...", paciente_id: 123 } ó success:false si no es paciente
        const res = await fetch(`${API_BASE_URL}/listarCitasPaciente`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        });

        const json = await res.json().catch(() => ({}));
        console.log("listarCitasPaciente response:", json);

        if (res.ok && json.success) {
          // Backend OK -> lo tomo como paciente
          setCitas(json.data ?? []);
          // extraigo email/id si vienen
          const emailFromResp = json.email ?? json.paciente?.email ?? null;
          const idFromResp = json.paciente_id ?? json.paciente?.id ?? null;

          if (emailFromResp) {
            setPacienteEmail(emailFromResp);
            await AsyncStorage.setItem("paciente_email", emailFromResp);
          } else if (userEmail) {
            // si backend no devolvió email, uso el email de /me si existe
            setPacienteEmail(userEmail);
            await AsyncStorage.setItem("paciente_email", userEmail);
          }

          if (idFromResp) {
            setPacienteId(String(idFromResp));
            await AsyncStorage.setItem("paciente_id", String(idFromResp));
          }

          setIsPaciente(true);
        } else {
          // No es paciente (o backend devolvió error). Asegurarse de limpiar cualquier dato previo.
          setCitas([]);
          setIsPaciente(false);
          await AsyncStorage.removeItem("paciente_email");
          await AsyncStorage.removeItem("paciente_id");

          // Muestra alerta solo si la respuesta fue explícita
          if (res.ok && json.success === false) {
            // backend explicitó que no es paciente
            console.log("Backend indica que no es paciente");
          } else {
            // si la petición devolvió error (401/500) o formato inesperado, mostrar info en consola
            console.warn("listarCitasPaciente no devolvió success:true", res.status, json);
          }
        }
      } catch (error) {
        console.error("error obteniendo citas:", error);
        Alert.alert("Error", "Ocurrió un problema al cargar tus citas.");
        setIsPaciente(false);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const handleDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      const isoDate = date.toISOString().split("T")[0];
      setSelectedDate(isoDate);
    }
  };

  const handleCrearCita = async () => {
    // Si todavía no sabemos si es paciente, pedimos que espere
    if (isPaciente === null) {
      Alert.alert("Espere", "Comprobando registro de paciente, inténtalo en un momento.");
      return;
    }

    if (!isPaciente) {
      // No es paciente → redirigir a registrar
      Alert.alert(
        "Registro requerido",
        "Debes registrarte como paciente antes de crear una cita."
      );
      navigation.navigate("CrearPacienteCita");
      return;
    }

    // Si es paciente, pasar los datos al formulario de crear cita.
    // Preferimos enviar paciente_id si existe, sino el email.
    const payloadPacienteId = await AsyncStorage.getItem("paciente_id");
    const payloadEmail = (await AsyncStorage.getItem("paciente_email")) ?? pacienteEmail;

    navigation.navigate("CrearCitaPaciente", {
      paciente_id: payloadPacienteId ?? null,
      paciente_email: payloadEmail ?? null,
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#706180ff" />
        <Text style={{ marginTop: 10, color: "#706180ff" }}>Cargando citas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis citas</Text>

      {citas.length === 0 ? (
        <Text style={styles.warningText}>
          {isPaciente ? "No tienes citas pendientes" : "No estás registrado como paciente"}
        </Text>
      ) : (
        <FlatList
          data={citas}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate("DetalleCitaPaciente", { cita: item })}
            >
              <View style={styles.cardContent}>
                <Ionicons
                  name="calendar-outline"
                  size={28}
                  color="#ffb6c1"
                  style={{ marginRight: 10 }}
                />
                <View>
                  <Text style={styles.date}>{item.fecha_hora}</Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.doctor}>
                      {item.medicos?.nombre_m ?? item.medico?.nombre_m ?? "Médico"}
                      {" "}
                      {item.medicos?.apellido_m ?? item.medico?.apellido_m ?? ""}
                    </Text>
                    <View
                      style={[
                        styles.estadoBadge,
                        item.estado === "pendiente"
                          ? { backgroundColor: "#fff4b3" }
                          : item.estado === "confirmada"
                          ? { backgroundColor: "#c6f6d5" }
                          : { backgroundColor: "#feb2b2" },
                      ]}
                    >
                      <Text style={styles.estadoText}>{(item.estado ?? "").toUpperCase()}</Text>
                    </View>
                  </View>
                </View>
              </View>

              <Ionicons name="chevron-forward-outline" size={24} color="#ffb6c1" />
            </TouchableOpacity>
          )}
        />
      )}

      {/* Crear cita: habilitado sólo si isPaciente === true */}
      <TouchableOpacity
        style={[
          styles.addButton,
          { backgroundColor: isPaciente ? "#f58eb0ff" : "#aaa" },
        ]}
        disabled={!isPaciente}
        onPress={handleCrearCita}
      >
        <Ionicons name="add-circle-outline" size={24} color="#fff" />
        <Text style={styles.addButtonText}>Crear cita</Text>
      </TouchableOpacity>

      {/* Registrarme como paciente: habilitado sólo si isPaciente === false */}
      <TouchableOpacity
        style={[
          styles.addButton,
          { backgroundColor: isPaciente ? "#aaa" : "#f58eb0ff" },
        ]}
        disabled={isPaciente}
        onPress={() => navigation.navigate("CrearPacienteCita")}
      >
        <Ionicons name="person-add-outline" size={24} color="#fff" />
        <Text style={styles.addButtonText}>Registrarme como paciente</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate ? new Date(selectedDate) : new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateChange}
        />
      )}
    </View>
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
    marginBottom: 10, 
    fontWeight: "bold", 
    color: "#cc3366", 
    textAlign: "center", 
  }, 
  button: { 
    backgroundColor: "pink",
    paddingVertical: 12, 
    paddingHorizontal: 20, 
    borderRadius: 25, 
    alignItems: "center", 
    marginBottom: 250, 
  }, 
  buttonText: { 
    color: "white", 
    fontWeight: "bold", 
    fontSize: 16, 
  }, 
  card: { 
    padding: 15, 
    marginVertical: 5, 
    borderRadius: 15, 
    borderWidth: 1, 
    borderColor: "#ffb6c1", 
    backgroundColor: "#fff", 
    marginBottom: 12, 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between", 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 3 }, 
    shadowOpacity: 0.15, 
    shadowRadius: 4, 
    elevation: 4, 
  }, 
  cardTitle: { 
    fontWeight: "bold", 
    fontSize: 16, 
    color: "#333", 
  }, 
  cardSubtitle: { 
    color: "#555", 
  }, 
  addButtonText: { 
    color: "#fff", 
    fontSize: 16, 
    fontWeight: "bold", 
    marginLeft: 8 
  }, 
  addButton: { 
    backgroundColor: "#f58eb0ff", 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "center", 
    paddingVertical: 15, 
    borderRadius: 20, 
    marginTop: 15, 
    marginBottom: 10, 
  }, 
  estadoBadge: { 
    paddingVertical: 2, 
    paddingHorizontal: 8, 
    borderRadius: 15, 
    marginLeft: 8, 
  }, 
});