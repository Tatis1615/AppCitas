import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Para usar íconos bonitos
import AsyncStorage from "@react-native-async-storage/async-storage"; // ✅ Importar librería

export default function Inicio({ navigation }) {


const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem("token"); // 🔑 recuperar token

        if (!token) {
          console.log("No hay token guardado");
          return;
        }

        const response = await fetch("http://10.2.233.141:8000/api/me", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        const data = await response.json();

        if (response.ok) {
          setUserName(data.user?.name || "Usuario");
        } else {
          console.log("Error en la respuesta:", data);
        }
      } catch (error) {
        console.error("Error obteniendo usuario:", error);
      }
    };

    fetchUser();
  }, []);

    const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem("token"); // el token que guardaste en el login
      const response = await fetch("http://10.2.233.141:8000/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.removeItem("token"); // borra el token local
        Alert.alert("Éxito", data.message);
        navigation.replace("Login"); // redirige al login
      } else {
        Alert.alert("Error", data.message || "No se pudo cerrar sesión");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Ocurrió un problema al cerrar sesión");
    }
  };




  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎀 Bienvenido al sistema de Citas 🎀 {userName}</Text>

      <View style={styles.grid}>
        {/* Recuadro 1 */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("ListarCitas")}
        >
          <Ionicons name="calendar-outline" size={40} color="#cc3366" />
          <Text style={styles.cardTitle}>Citas</Text>
          <Text style={styles.cardDesc}>Ver y gestionar citas</Text>
        </TouchableOpacity>

        {/* Recuadro 2 */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("ListarPacientes")}
        >
          <Ionicons name="person-add-outline" size={40} color="#cc3366" />
          <Text style={styles.cardTitle}>Pacientes</Text>
          <Text style={styles.cardDesc}>Ver pacientes</Text>
        </TouchableOpacity>

        {/* Recuadro 3 */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Medicos")}
        >
          <Ionicons name="medkit-outline" size={40} color="#cc3366" />
          <Text style={styles.cardTitle}>Médicos</Text>
          <Text style={styles.cardDesc}>Ver listado de médicos</Text>
        </TouchableOpacity>

        {/* Recuadro 4 */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Consultorios")}
        >
          <Ionicons name="business-outline" size={40} color="#cc3366" />
          <Text style={styles.cardTitle}>Consultorios</Text>
          <Text style={styles.cardDesc}>Gestión de consultorios</Text>
        </TouchableOpacity>

        {/* Recuadro 4 */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Especialidades")}
        >
          <Ionicons name="business-outline" size={40} color="#cc3366" />
          <Text style={styles.cardTitle}>Especialidades</Text>
          <Text style={styles.cardDesc}>Gestión de especialidades</Text>
        </TouchableOpacity>
      </View>

      {/* Botón Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff0f5", // Fondo rosado suave
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#cc3366",
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
  },
  card: {
    width: "40%", // 2 tarjetas por fila
    backgroundColor: "white",
    padding: 20,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#eee",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    color: "#333",
  },
  cardDesc: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
    marginTop: 5,
  },

  logoutButton: {
    backgroundColor: "#cc3366",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginBottom: 30,
    marginTop: 35,
    width: 150,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
