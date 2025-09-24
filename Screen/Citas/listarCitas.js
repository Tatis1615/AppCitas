import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../Src/Config";

export default function ListarCitas({ navigation }) {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCitas = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        const response = await fetch(`${API_BASE_URL}/listarCitas`, {
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
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#cc3366" />
        <Text>Cargando citas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Citas</Text>

      <FlatList
        data={citas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("DetalleCita", { id: item.id })}
          >
            <Text style={styles.cardTitle}>{item.fecha_hora}</Text>
            <Text style={styles.cardSubtitle}>Estado: {item.estado}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Botón Crear Paciente */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("CrearCita")}
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
