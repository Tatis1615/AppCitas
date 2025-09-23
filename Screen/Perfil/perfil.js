import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";
import API_BASE_URL from "../../Src/Config";
import { Image } from "react-native"; // 👈 agrega esta importación

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
        <ActivityIndicator size="large" color="#f7b2c4" />
        <Text style={styles.loadingText}>Cargando tu perfil...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {user ? (
        <View style={styles.panel}>
          {/* Encabezado en el panel */}
          <View style={styles.header}>
            <Image
              source={{
                uri: "https://i.pinimg.com/1200x/55/f4/4f/55f44f72c699b296c43ca80743dc3173.jpg" 
              }}
              style={styles.profileImage}
            />
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.role}>{user.role}</Text>
          </View>

          {/* Secciones dentro del panel */}
          <View style={styles.section}>
            <Text style={styles.label}>Nombre</Text>
            <Text style={styles.value}>{user.name}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{user.email}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Rol</Text>
            <Text style={styles.value}>{user.role}</Text>
          </View>

          {/* Botón cerrar sesión */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#fff" />
            <Text style={styles.logoutText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.errorText}>No se pudieron cargar los datos.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffeef6", // Fondo rosa pastel muy suave
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffeef6",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#e38ea8",
  },
  panel: {
    backgroundColor: "#fff",
    margin: 20,
    borderRadius: 25,
    padding: 25,
    shadowColor: "#e5a4c4",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  header: {
    alignItems: "center",
    marginBottom: 25,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#e38ea8",
    marginTop: 8,
  },
  role: {
    fontSize: 15,
    color: "#f2a9c9",
  },
  section: {
    backgroundColor: "#fff6fa",
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#fbd6e3",
  },
  label: {
    fontSize: 14,
    color: "#c77d94",
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
    color: "#444",
  },
  logoutButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7b2c4", // rosa pastel más suave
    paddingVertical: 14,
    borderRadius: 20,
    marginTop: 20,
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
    color: "#d87093",
    fontSize: 16,
  },
  profileImage: {
  width: 110,
  height: 110,
  borderRadius: 55, // círculo
  borderWidth: 3,
  borderColor: "#f7b2c4",
  marginBottom: 12,
  backgroundColor: "#ffeef6",
},

});
