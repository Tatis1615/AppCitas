import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function DetalleCitaPaciente({ route, navigation }) {
  const { cita } = route.params;

  return (
    <View style={styles.container}>
          <Text style={styles.title}>Detalles de la Cita</Text>
    
          <View style={styles.card}>
            <Text style={styles.label}>ID del paciente:</Text>
            <Text style={styles.value}>{cita.paciente_id}</Text>
    
            <Text style={styles.label}>ID del medico:</Text>
            <Text style={styles.value}>{cita.medico_id}</Text>
    
            <Text style={styles.label}>ID del consultorio:</Text>
            <Text style={styles.value}>{cita.consultorio_id}</Text>
    
            <Text style={styles.label}>Fecha y hora de la cita:</Text>
            <Text style={styles.value}>{cita.fecha_hora}</Text>
    
            <Text style={styles.label}>Estado:</Text>
            <Text style={styles.value}>{cita.estado}</Text>
    
            <Text style={styles.label}>Motivo:</Text>
            <Text style={styles.value}>{cita.motivo}</Text>
          </View>
    
          {/* Botón Editar */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("EditarCita", { cita })}
          >
            <Text style={styles.buttonText}>Editar</Text>
          </TouchableOpacity>
    
          {/* Botón Volver */}
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.buttonText, { color: "#cc3366" }]}>Volver</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff0f5", // Fondo pastel rosado
      },
      title: {
        fontSize: 22,
        marginBottom: 20,
        fontWeight: "bold",
        color: "#cc3366",
        textAlign: "center",
      },
      card: {
        backgroundColor: "#ffe6f0",
        padding: 15,
        borderRadius: 15,
        marginBottom: 20,
      },
      label: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#444",
      },
      value: {
        fontSize: 16,
        marginBottom: 10,
        color: "#333",
      },
      button: {
        backgroundColor: "pink",
        paddingVertical: 12,
        borderRadius: 25,
        alignItems: "center",
        marginBottom: 10,
      },
      cancelButton: {
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "#cc3366",
      },
      buttonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
      },
    });



