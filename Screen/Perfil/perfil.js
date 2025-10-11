import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, ScrollView, TextInput, Image } from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";
import API_BASE_URL from "../../Src/Config";

export default function Perfil({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [especialidades, setEspecialidades] = useState([]);

  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [pacienteData, setPacienteData] = useState({});
  const [medicoData, setMedicoData] = useState({});

  const apiRequest = async (endpoint, method = "GET", body = null) => {
    const token = await AsyncStorage.getItem("token");
    const options = {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    if (body) options.body = JSON.stringify(body);

    const res = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Error en la solicitud");
    return data;
  };

  useEffect(() => {
    const init = async () => {
      try {
        const especialidadesRes = await apiRequest("/listarEspecialidades");
        const lista =
          Array.isArray(especialidadesRes)
            ? especialidadesRes
            : especialidadesRes.data || [];
        setEspecialidades(lista);

        const userRes = await apiRequest("/me");
        const currentUser = userRes.user;
        setUser(currentUser);
        setUserInfo({
          name: currentUser.name,
          email: currentUser.email,
          password: "",
        });

        if (currentUser.role === "paciente") {
          const p = await apiRequest(
            `/pacientePorEmail/${encodeURIComponent(currentUser.email)}`
          );
          if (p.success) setPacienteData(p.data);
        }

        if (currentUser.role === "medico") {
          const m = await apiRequest(
            `/medicoPorEmail/${encodeURIComponent(currentUser.email)}`
          );
          if (m.success)
            setMedicoData({
              ...m.data,
              especialidad_id: m.data.especialidad_id?.toString() || "",
            });
        }
      } catch (err) {
        console.error("Error cargando datos:", err);
        Alert.alert("Error", "No se pudieron cargar tus datos");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleSave = async () => {
    try {
      if (!user) return Alert.alert("Error", "Usuario no cargado");

      await apiRequest(`/editarUsuario/${user.id}`, "PUT", userInfo);

      if (user.role === "paciente")
        await apiRequest(
          `/actualizarPacienteEmail/${encodeURIComponent(user.email)}`,
          "PUT",
          pacienteData
        );

      if (user.role === "medico")
        await apiRequest(
          `/actualizarMedicoEmail/${encodeURIComponent(user.email)}`,
          "PUT",
          medicoData
        );

      Alert.alert("Éxito", "Perfil actualizado con éxito");
      setEditing(false);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "No se pudo guardar la información");
    }
  };

  const handleLogout = async () => {
    try {
      await apiRequest("/logout", "POST");
      await AsyncStorage.removeItem("token");
      navigation.replace("Login");
    } catch {
      Alert.alert("Error", "No se pudo cerrar sesión");
    }
  };

  if (loading)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f7b2c4" />
        <Text style={styles.loadingText}>Cargando perfil...</Text>
      </View>
    );

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
            <Text style={styles.name}>{userInfo.name}</Text>
            <Text style={styles.role}>{user.role}</Text>
          </View>

          <Text style={styles.sectionTitle}>Datos de Usuario</Text>

          {[
            { label: "Nombre de usuario", key: "name" },
            { label: "Correo electrónico", key: "email" },
          ].map((f) => (
            <View key={f.key}>
              <Text style={styles.label}>{f.label}</Text>
              <TextInput
                editable={editing}
                style={[styles.input, !editing && styles.readOnly]}
                value={userInfo[f.key]}
                onChangeText={(v) => setUserInfo({ ...userInfo, [f.key]: v })}
              />
            </View>
          ))}

          <Text style={styles.label}>Nueva contraseña</Text>
          <TextInput
            editable={editing}
            secureTextEntry
            placeholder="•••••••"
            style={[styles.input, !editing && styles.readOnly]}
            value={userInfo.password}
            onChangeText={(v) => setUserInfo({ ...userInfo, password: v })}
          />

          {user.role === "paciente" && (
            <>
              <Text style={styles.sectionTitle}>Datos del Paciente</Text>
              {Object.entries({
                nombre: "Nombre",
                apellido: "Apellido",
                documento: "Documento",
                telefono: "Teléfono",
                direccion: "Dirección",
                fecha_nacimiento: "Fecha de nacimiento",
              }).map(([key, label]) => (
                <View key={key}>
                  <Text style={styles.label}>{label}</Text>
                  <TextInput
                    editable={editing}
                    style={[styles.input, !editing && styles.readOnly]}
                    value={pacienteData[key] || ""}
                    onChangeText={(v) =>
                      setPacienteData({ ...pacienteData, [key]: v })
                    }
                  />
                </View>
              ))}
            </>
          )}

          {user.role === "medico" && (
            <>
              <Text style={styles.sectionTitle}>Datos del Médico</Text>

              {Object.entries({
                nombre_m: "Nombre",
                apellido_m: "Apellido",
                edad: "Edad",
                telefono: "Teléfono",
                email: "Correo",
              }).map(([key, label]) => (
                <View key={key}>
                  <Text style={styles.label}>{label}</Text>
                  <TextInput
                    editable={editing}
                    style={[styles.input, !editing && styles.readOnly]}
                    value={medicoData[key] || ""}
                    onChangeText={(v) =>
                      setMedicoData({ ...medicoData, [key]: v })
                    }
                  />
                </View>
              ))}

              <Text style={styles.label}>Especialidad</Text>
              {editing ? (
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={medicoData.especialidad_id}
                    onValueChange={(value) =>
                      setMedicoData({ ...medicoData, especialidad_id: value })
                    }
                    style={styles.picker}
                  >
                    <Picker.Item
                      label="Seleccionar especialidad..."
                      value=""
                    />
                    {especialidades.map((esp) => (
                      <Picker.Item
                        key={esp.id}
                        label={esp.nombre_e}
                        value={esp.id.toString()}
                      />
                    ))}
                  </Picker>
                </View>
              ) : (
                <TextInput
                  editable={false}
                  style={[styles.input, styles.readOnly]}
                  value={
                    especialidades.find(
                      (e) => e.id.toString() === medicoData.especialidad_id
                    )?.nombre_e || ""
                  }
                />
              )}
            </>
          )}

          {editing ? (
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.saveButton, { flex: 1, marginRight: 8 }]}
                onPress={handleSave}
              >
                <Ionicons name="save-outline" size={20} color="#fff" />
                <Text style={styles.logoutText}>Guardar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.cancelButton, { flex: 1, marginLeft: 8 }]}
                onPress={() => setEditing(false)}
              >
                <Ionicons name="close-circle-outline" size={20} color="#fff" />
                <Text style={styles.logoutText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
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
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
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
  readOnly: { backgroundColor: "#f9f9f9", color: "#666" },
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
    backgroundColor: "#d67693ff",
    paddingVertical: 14,
    borderRadius: 20,
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: "#cc3366",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 20,
    marginTop: 10,
  },
  buttonRow: { flexDirection: "row", justifyContent: "space-between" },
  logoutButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7b2c4",
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
  pickerContainer: {
    backgroundColor: "#fff6fa",
    borderWidth: 1,
    borderColor: "#fbd6e3",
    borderRadius: 15,
    marginBottom: 10,
  },
  picker: { height: 50, color: "#444" },
});
