import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../Src/Config";

export default function InicioPaciente({ navigation }) {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        if (!token) {
          console.log("No hay token guardado");
          return;
        }

        const response = await fetch(`${API_BASE_URL}/me`, {
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

  return (
    <ScrollView style={styles.container}>
        <View style={styles.banner}>
        <Image
          source={{ uri: "https://i.pinimg.com/736x/ba/b5/77/bab577ba83c49715dab31ba7d050d1dc.jpg" }} 
          style={styles.bannerImage}
        />
      </View>
      {/* Encabezado */}
      <Text style={styles.title}>🎀 Bienvenida {userName} 🎀</Text>


        {/* Servicios Destacados */}
      <View style={styles.servicesSection}>
        <Text style={styles.sectionTitle}>Nuestros Servicios</Text>
        <View style={styles.serviceGrid}>
          <View style={styles.serviceItem}>
            <Ionicons name="medical-outline" size={32} color="#cc3366" />
            <Text style={styles.serviceLabel}>Consulta General</Text>
          </View>
          <View style={styles.serviceItem}>
            <Ionicons name="flask-outline" size={32} color="#cc3366" />
            <Text style={styles.serviceLabel}>Laboratorio</Text>
          </View>
          <View style={styles.serviceItem}>
            <Ionicons name="medkit-outline" size={32} color="#cc3366" />
            <Text style={styles.serviceLabel}>Especialistas</Text>
          </View>
          <View style={styles.serviceItem}>
            <Ionicons name="time-outline" size={32} color="#cc3366" />
            <Text style={styles.serviceLabel}>Horarios Flexibles</Text>
          </View>
        </View>
      </View>


      {/* Panel EPS con imagen */}
      <View style={styles.epsCard}>
        {/* Sección “Nosotros / Sobre EPS” */}
        <Text style={styles.sectionTitle}>Sobre EPS Vida Salud</Text>
        <Text style={styles.sectionText}>
            Nuestra EPS SaludVida Plus es un sistema de atención en salud diseñado para brindar 
            confianza, bienestar y acompañamiento integral a cada uno de nuestros afiliados. Nuestro compromiso 
            es garantizar el acceso oportuno a servicios médicos de calidad, con un enfoque humano y cercano.

            Contamos con una red amplia de hospitales, clínicas, laboratorios y especialistas en diferentes 
            áreas de la salud, lo que nos permite ofrecer una cobertura nacional con altos estándares de atención.
            Nuestra prioridad es que los pacientes reciban un servicio seguro, oportuno y con la mejor experiencia posible.

            En nuestra EPS creemos que cada persona merece una atención cálida y respetuosa, por eso hemos creado 
            plataformas digitales que permiten agendar citas fácilmente, consultar resultados médicos y comunicarse 
            directamente con profesionales de la salud, todo desde la comodidad del hogar.

            Con más de 20 años de experiencia en el sector salud, trabajamos día a día para ser un aliado en la 
            vida de nuestros usuarios, acompañándolos en cada etapa de su bienestar físico, mental y emocional.
        </Text>
      </View>

      

      {/* Grid de accesos */}
      <View style={styles.grid}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Pacientes", { screen: "ListarPacientes" })}
        >
          <Ionicons name="person-add-outline" size={40} color="#cc3366" />
          <Text style={styles.cardTitle}>Pacientes</Text>
          <Text style={styles.cardDesc}>Gestión de pacientes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Medicos", { screen: "ListarMedicos" })}
        >
          <Ionicons name="medkit-outline" size={40} color="#cc3366" />
          <Text style={styles.cardTitle}>Médicos</Text>
          <Text style={styles.cardDesc}>Ver médicos disponibles</Text>
        </TouchableOpacity>
      </View>



      {/* Información de contacto */}
      <View style={styles.contactSection}>
        <Text style={styles.sectionTitle}>Contáctanos</Text>
        <View style={styles.contactItem}>
          <Ionicons name="call-outline" size={24} color="#cc3366" />
          <TouchableOpacity onPress={() => handleCall("+573165678901")}>
            <Text style={styles.contactText}>+57 316 567 8901</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.contactItem}>
          <Ionicons name="location-outline" size={24} color="#cc3366" />
          <Text style={styles.contactText}>Calle 123 #45-67, Bogotá</Text>
        </View>
        <View style={styles.contactItem}>
          <Ionicons name="globe-outline" size={24} color="#cc3366" />
          <TouchableOpacity onPress={() => handleOpenWeb("https://vida-salud-example.com")}>
            <Text style={styles.contactText}>Visitar sitio web</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff0f5", // pastel rosado
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#cc3366",
    textAlign: "center",
  },
  epsCard: {
    backgroundColor: "#ffe6f0",
    padding: 20,
    borderRadius: 25,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "#ffb6c1",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    alignItems: "center",
  },
  epsImage: {
    width: 100,
    height: 100,
    marginBottom: 15,
  },
  epsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#cc3366",
    marginBottom: 10,
    textAlign: "center",
  },
  epsDesc: {
    fontSize: 15,
    color: "#444",
    textAlign: "center",
    marginBottom: 15,
    lineHeight: 22,
  },
  epsList: {
    alignItems: "flex-start",
    width: "100%",
  },
  epsItem: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
  },
  card: {
    width: "40%",
    backgroundColor: "#fff",
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
  banner: {
    position: "relative",
    height: 300,
    marginBottom: 20,
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },


  infoSection: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#cc3366",
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 15,
    color: "#444",
    lineHeight: 22,
  },
  servicesSection: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  serviceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  serviceItem: {
    width: "45%",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#ffe6f0",
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
  },
  serviceLabel: {
    marginTop: 8,
    fontSize: 14,
    color: "#333",
    textAlign: "center",
  },
  contactSection: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  contactText: {
    marginLeft: 10,
    fontSize: 15,
    color: "#555",
  },

  
});
