import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import API_BASE_URL from "../../Src/Config"; // Import de tu URL base

export default function ListarEspecialidades({ navigation }) {
  const [especialidades, setEspecialidades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEspecialidades = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/especialidades`);
        const data = await response.json();
        setEspecialidades(data);
      } catch (error) {
        console.error("Error al obtener especialidades:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEspecialidades();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#cc3366" />
        <Text style={{ marginTop: 10, color: "#cc3366" }}>Cargando especialidades...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Especialidades</Text>

      <FlatList
        data={especialidades}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("DetalleEspecialidad", { especialidad: item })}
            style={styles.card}
          >
            <Text style={styles.cardTitle}>{item.nombre}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Botón Crear Especialidad */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("CrearEspecialidad")}
      >
        <Text style={styles.buttonText}>+ Crear Especialidad</Text>
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
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    marginTop: 15,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  card: {
    padding: 15,
    marginVertical: 6,
    backgroundColor: "#ffe6f0",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ffb6c1",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
  },
});
