import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator ,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons"
import DateTimePicker from "@react-native-community/datetimepicker"
import API_BASE_URL from "../../Src/Config";

export default function ListarCitasPaciente({ navigation }) {
  const [citas, setCitas] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(null)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [idPaciente, setIdPaciente] = useState(null)

  useEffect(() => {
  const fetchCitas = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

        if (!token) {
          setLoading(false)
          alert("sesión requerida", "Debes iniciar sesión para ver tus citas")
          return
        }

      const response = await fetch(`${API_BASE_URL}/listarCitas/`, { // 👈 se manda en la URL
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
          setCitas(data.data ?? [])
          setIdPaciente(data.paciente_id)
        } else {
          alert("registro requerido", "No estás registrado como paciente")
        }
      } catch (error) {
        console.error("error obteniendo citas:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchCitas()
  }, [])

  const handleDateChange = (event, date) => {
    setShowDatePicker(false)
    if (date) {
      const isoDate = date.toISOString().split("T")[0]
      setSelectedDate(isoDate)
    }
  }

  const handleCrearCita = () => {
    if (!idPaciente) {
      alert("registro requerido", "Debes registrarte primero como paciente para poder crear una cita.")
      return
    }
    navigation.navigate("CrearCitaP", { idPaciente })
  }



  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#cc3366" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📅 Mis Citas</Text>

    {citas.length === 0 ? (
      <Text style={styles.warningText}>No tienes citas pendientes</Text>
    ) : (

      <FlatList
        data={citas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("DetalleCita", { cita: item })}
            style={styles.card}
          >
            <View style={styles.cardContent}>
              <Ionicons name="calendar-outline" size={28} color="#b2a3c0ff" style={{ marginRight: 10 }} />
              <View>
                <Text style={styles.date}>
                  {item.fecha} - {item.hora}
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={styles.doctor}>
                    👨‍⚕️ {item.medico?.nombre_m} {item.medico?.apellido_m}
                  </Text>
                  <View
                    style={[
                      styles.estadoBadge,
                      item.estado === "pendiente"
                        ? { backgroundColor: "#fff4b3" } // amarillo claro
                        : item.estado === "confirmada"
                        ? { backgroundColor: "#c6f6d5" } // verde claro
                        : { backgroundColor: "#feb2b2" }, // rojo claro
                    ]}
                  >
                    <Text style={styles.estadoText}>{item.estado.toUpperCase()}</Text>
                  </View>
                </View>
              </View>
            </View>

              <Ionicons name="chevron-forward-outline" size={24} color="#706180ff" />
            </TouchableOpacity>
          )}
        />
      )}

      {/* botón crear cita */}
      <TouchableOpacity style={styles.addButton} onPress={handleCrearCita}>
        <Text style={styles.addButtonText}>Crear mi cita</Text>
      </TouchableOpacity>

      {/* botón registrarme como paciente */}
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: "#fe7ea9ff" }]}
        onPress={() => {
          if (idPaciente) {
            Alert.alert("Ya registrado", "Ya estás registrado como paciente, no es necesario hacerlo de nuevo")
          } else {
            navigation.navigate("CrearPacienteCita")
          }
        }}
      >

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
    backgroundColor: "#ffe6f0",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ffb6c1",
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
