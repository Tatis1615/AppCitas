import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../Src/Config";

export default function ListarCitasPaciente({ navigation }) {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchCitas = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userId = await AsyncStorage.getItem("user_id"); // 👈 recuperamos el id

      const response = await fetch(`${API_BASE_URL}/listarCitas/${userId}`, { // 👈 se manda en la URL
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setCitas(data);
      } else {
        console.log("Error al obtener citas:", data);
      }
    } catch (error) {
      console.error("Error en fetchCitas:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchCitas();
}, []);


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

      <FlatList
        data={citas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("DetalleCita", { cita: item })}
            style={styles.card}
          >
            <Text style={styles.cardTitle}>{item.fecha_hora}</Text>
            <Text style={styles.cardSubtitle}>Estado: {item.estado}</Text>
            <Text style={styles.cardSubtitle}>Motivo: {item.motivo}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", color: "#888", marginTop: 20 }}>
            No tienes citas registradas.
          </Text>
        }
      />

      {/* Botón Crear Cita */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("CrearCitaPaciente")}
      >
        <Text style={styles.buttonText}>+ Crear Cita</Text>
      </TouchableOpacity>
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
});
