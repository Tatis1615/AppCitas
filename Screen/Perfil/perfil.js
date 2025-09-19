import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";
import API_BASE_URL from "../../Src/Config";

export default function Perfil({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) return;

        const response = await fetch(`${API_BASE_URL}/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        const data = await response.json();

        if (response.ok) {
          setUser(data.user);
        } else {
          console.log("Error en la respuesta:", data);
        }
      } catch (error) {
        console.error("Error obteniendo usuario:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.removeItem("token");
        Alert.alert("👋 Hasta pronto", data.message);
        navigation.replace("Login");
      } else {
        Alert.alert("Error", data.message || "No se pudo cerrar sesión");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Ocurrió un problema al cerrar sesión");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6f42c1" />
        <Text style={styles.loadingText}>Cargando tu perfil...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {user ? (
        <>
          {/* Encabezado tipo banner */}
          <View style={styles.header}>
            <Ionicons name="person-circle" size={100} color="#6c757d" />
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.role}>{user.role}</Text>
          </View>

          {/* Caja estilo card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Información del Usuario</Text>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Nombre</Text>
              <Text style={styles.value}>{user.name}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{user.email}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Rol</Text>
              <Text style={styles.value}>{user.role}</Text>
            </View>
          </View>

          {/* Botón estilo Bootstrap */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#fff" />
            <Text style={styles.logoutText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.errorText}>No se pudieron cargar los datos.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa", // gris claro tipo bootstrap
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#6c757d",
  },
  header: {
    backgroundColor: "#c4bcd4ff",
    paddingVertical: 40,
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 10,
  },
  role: {
    fontSize: 16,
    color: "#e0d7f7",
  },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 30,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#343a40",
    textAlign: "center",
  },
  infoRow: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: "#6c757d",
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212529",
  },
  logoutButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#7e6ea3ff", // rojo bootstrap
    marginHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 18,
    marginBottom: 40,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  errorText: {
    textAlign: "center",
    marginTop: 20,
    color: "#904f4fff",
    fontSize: 16,
  },
});
