import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";
import API_BASE_URL from "../../Src/Config";
import { Image } from "react-native";

export default function Perfil({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  // Campos de usuario
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Campos del paciente
  const [pacienteData, setPacienteData] = useState({
    nombre: "",
    apellido: "",
    documento: "",
    telefono: "",
    direccion: "",
    fecha_nacimiento: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) return;

        // Obtener usuario
        const resUser = await fetch(`${API_BASE_URL}/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        const userData = await resUser.json();

        if (resUser.ok) {
          setUser(userData.user);
          setName(userData.user.name);
          setEmail(userData.user.email);

          // Si es paciente, obtener sus datos
          if (userData.user.role === "paciente") {
            const resPaciente = await fetch(`${API_BASE_URL}/pacientes/${userData.user.id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
              },
            });
            const pacienteInfo = await resPaciente.json();

            if (resPaciente.ok) {
              setPacienteData({
                nombre: pacienteInfo.nombre || "",
                apellido: pacienteInfo.apellido || "",
                documento: pacienteInfo.documento || "",
                telefono: pacienteInfo.telefono || "",
                direccion: pacienteInfo.direccion || "",
                fecha_nacimiento: pacienteInfo.fecha_nacimiento || "",
              });
            }
          }
        }
      } catch (error) {
        console.error("❌ Error cargando perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      // Actualizar tabla users
      await fetch(`${API_BASE_URL}/editarUsuario/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email, password }),
      });

      // Actualizar tabla pacientes (solo si es paciente)
      if (user.role === "paciente") {
        await fetch(`${API_BASE_URL}/actualizarPaciente/${user.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(pacienteData),
        });
      }

      Alert.alert("✅ Perfil actualizado con éxito");
      setEditing(false);
    } catch (error) {
      console.error("Error al guardar:", error);
      Alert.alert("❌ No se pudo guardar la información");
    }
  };

  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      await fetch(`${API_BASE_URL}/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      await AsyncStorage.removeItem("token");
      navigation.replace("Login");
    } catch (error) {
      Alert.alert("Error", "No se pudo cerrar sesión");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f7b2c4" />
        <Text style={styles.loadingText}>Cargando perfil...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {user ? (
        <View style={styles.panel}>
          <View style={styles.header}>
            <Image
              source={{
                uri: "https://i.pinimg.com/1200x/55/f4/4f/55f44f72c699b296c43ca80743dc3173.jpg",
              }}
              style={styles.profileImage}
            />
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.role}>{user.role}</Text>
          </View>

          {/* ===================== DATOS USUARIO ===================== */}
          <Text style={styles.sectionTitle}>Datos de Usuario</Text>

          <Text style={styles.label}>Nombre de usuario</Text>
          <TextInput
            editable={editing}
            style={[styles.input, !editing && styles.readOnly]}
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Correo electrónico</Text>
          <TextInput
            editable={editing}
            style={[styles.input, !editing && styles.readOnly]}
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Nueva contraseña</Text>
          <TextInput
            editable={editing}
            secureTextEntry
            placeholder="•••••••"
            style={[styles.input, !editing && styles.readOnly]}
            value={password}
            onChangeText={setPassword}
          />

          {/* ===================== DATOS PACIENTE ===================== */}
          {user.role === "paciente" && (
            <>
              <Text style={styles.sectionTitle}>Datos del Paciente</Text>

              {[
                { label: "Nombre", key: "nombre" },
                { label: "Apellido", key: "apellido" },
                { label: "Documento", key: "documento" },
                { label: "Teléfono", key: "telefono" },
                { label: "Dirección", key: "direccion" },
                { label: "Fecha de nacimiento", key: "fecha_nacimiento" },
              ].map((field) => (
                <View key={field.key}>
                  <Text style={styles.label}>{field.label}</Text>
                  <TextInput
                    editable={editing}
                    style={[styles.input, !editing && styles.readOnly]}
                    value={pacienteData[field.key]}
                    onChangeText={(v) =>
                      setPacienteData({ ...pacienteData, [field.key]: v })
                    }
                  />
                </View>
              ))}
            </>
          )}

          {/* ===================== BOTONES ===================== */}
          {editing ? (
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Ionicons name="save-outline" size={20} color="#fff" />
              <Text style={styles.logoutText}>Guardar cambios</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setEditing(true)}
            >
              <Ionicons name="create-outline" size={20} color="#fff" />
              <Text style={styles.logoutText}>Editar perfil</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#fff" />
            <Text style={styles.logoutText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.errorText}>No se pudieron cargar tus datos.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffeef6" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: { color: "#e38ea8", marginTop: 10 },
  panel: {
    backgroundColor: "#fff",
    margin: 20,
    borderRadius: 25,
    padding: 25,
    elevation: 5,
  },
  header: { alignItems: "center", marginBottom: 25 },
  name: { fontSize: 22, fontWeight: "bold", color: "#e38ea8" },
  role: { fontSize: 15, color: "#f2a9c9" },
  sectionTitle: {
    fontSize: 18,
    color: "#e38ea8",
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
  },
  label: { fontSize: 14, color: "#c77d94", marginBottom: 4 },
  input: {
    backgroundColor: "#fff6fa",
    borderWidth: 1,
    borderColor: "#fbd6e3",
    borderRadius: 15,
    padding: 10,
    marginBottom: 10,
    color: "#444",
  },
  readOnly: {
    backgroundColor: "#f9f9f9",
    color: "#666",
  },
  editButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7b2c4",
    paddingVertical: 14,
    borderRadius: 20,
    marginTop: 10,
  },
  saveButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e38ea8",
    paddingVertical: 14,
    borderRadius: 20,
    marginTop: 10,
  },
  logoutButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7b2c4",
    paddingVertical: 14,
    borderRadius: 20,
    marginTop: 20,
  },
  logoutText: { color: "#fff", fontSize: 16, fontWeight: "bold", marginLeft: 8 },
  errorText: { textAlign: "center", color: "#d87093", fontSize: 16 },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: "#f7b2c4",
    marginBottom: 12,
    backgroundColor: "#ffeef6",
  },
});
