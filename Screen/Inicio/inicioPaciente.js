import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  Animated,
  Linking,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../../Src/Config";

const { width } = Dimensions.get("window");

export default function InicioPaciente({ navigation }) {
  const [userName, setUserName] = useState("");
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scrollX = useRef(new Animated.Value(0)).current;

  // Imágenes del carrusel (puedes cambiarlas)
  const images = [
    "https://rautomation.es/wp-content/uploads/2023/12/especialista-biotecnologia-laboratorio-realizando-experimentos-1-1024x683.jpg",
    "https://www.nosequeestudiar.net/site/assets/files/1695520/medicina-medico-estetoscopio.jpg",
    "https://magnetosur.com/wp-content/uploads/2021/11/En-que-casos-se-debe-recurrir-a-la-medicina-general.jpg",
  ];

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
          setUserName(data.user?.name || "Usuario");
        } else {
          console.log("Error al obtener usuario:", data);
        }
      } catch (error) {
        console.error("Error obteniendo usuario:", error);
      }
    };

    fetchUser();

    // Fade-in al cargar la pantalla
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 900,
      useNativeDriver: true,
    }).start();
  }, []);

  // llamadas de contacto
  const handleCall = async (phone) => {
    try {
      const url = `tel:${phone}`;
      const supported = await Linking.canOpenURL(url);
      if (supported) await Linking.openURL(url);
      else Alert.alert("No se puede realizar la llamada");
    } catch (err) {
      Alert.alert("Error", "No se pudo iniciar la llamada");
    }
  };

  const handleOpenWeb = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) await Linking.openURL(url);
      else Alert.alert("No se puede abrir el enlace");
    } catch (err) {
      Alert.alert("Error", "No se pudo abrir el enlace");
    }
  };

  // Render del carrusel (ScrollView horizontal)
  const renderCarousel = () => (
    <View style={styles.carouselWrapper}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {images.map((uri, i) => (
          <View key={i} style={{ width, justifyContent: "center", alignItems: "center" }}>
            <Image source={{ uri }} style={styles.carouselImage} resizeMode="cover" />
          </View>
        ))}
      </ScrollView>

      {/* Dots indicator */}
      <View style={styles.dots}>
        {images.map((_, i) => {
          const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: "clamp",
          });
          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.9, 1.15, 0.9],
            extrapolate: "clamp",
          });
          return (
            <Animated.View
              key={`dot-${i}`}
              style={[styles.dot, { opacity, transform: [{ scale }] }]}
            />
          );
        })}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {renderCarousel()}

      <Animated.View style={{ opacity: fadeAnim }}>
        <Text style={styles.title}>🎀 Bienvenida {userName} 🎀</Text>
      </Animated.View>

      <Animated.View style={[styles.servicesSection, { opacity: fadeAnim }]}>
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
      </Animated.View>

      <Animated.View style={[styles.epsCard, { opacity: fadeAnim }]}>
        <Text style={styles.sectionTitle}>Sobre EPS Vida Salud</Text>
        <Text style={styles.sectionText}>
          Nuestra EPS SaludVida Plus es un sistema de atención en salud diseñado para brindar
          confianza, bienestar y acompañamiento integral a cada uno de nuestros afiliados. Nuestro
          compromiso es garantizar el acceso oportuno a servicios médicos de calidad, con un enfoque
          humano y cercano.
        </Text>
      </Animated.View>

      <View style={styles.grid}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Especialidades", { screen: "ListarEspecialidadesPaciente" })}
        >
          <Ionicons name="business-outline" size={40} color="#e38ea8" />
          <Text style={styles.cardTitle}>Especialidades</Text>
          <Text style={styles.cardDesc}>Gestión de especialidades</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Medicos", { screen: "ListarMedicos" })}
        >
          <Ionicons name="medkit-outline" size={40} color="#e38ea8" />
          <Text style={styles.cardTitle}>Médicos</Text>
          <Text style={styles.cardDesc}>Ver médicos disponibles</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contactSection}>
        <Text style={styles.sectionTitle}>Contáctanos</Text>

        <View style={styles.contactItem}>
          <Ionicons name="call-outline" size={24} color="#e38ea8" />
          <TouchableOpacity onPress={() => handleCall("+573165678901")}>
            <Text style={styles.contactText}>+57 316 567 8901</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.contactItem}>
          <Ionicons name="location-outline" size={24} color="#e38ea8" />
          <Text style={styles.contactText}>Calle 123 #45-67, Bogotá</Text>
        </View>

        <View style={styles.contactItem}>
          <Ionicons name="globe-outline" size={24} color="#e38ea8" />
          <TouchableOpacity onPress={() => handleOpenWeb("https://vida-salud-example.com")}>
            <Text style={styles.contactText}>Visitar sitio web</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff0f5" },

  carouselWrapper: {
    height: 260,
    marginTop: 12,
    marginBottom: 8,
  },
  carouselImage: {
    width: width - 40,
    height: 240,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#eee",
  },
  dots: {
    position: "absolute",
    bottom: 8,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 8,
    backgroundColor: "#cc3366",
    marginHorizontal: 6,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 14,
    color: "#e38ea8",
    textAlign: "center",
  },

  servicesSection: { paddingHorizontal: 20, marginBottom: 18 },
  serviceGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  serviceItem: {
    width: "48%",
    alignItems: "center",
    backgroundColor: "#ffe6f0",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  serviceLabel: { marginTop: 8, fontSize: 14, color: "#333", textAlign: "center" },

  epsCard: {
    backgroundColor: "#ffe6f0",
    padding: 18,
    borderRadius: 18,
    marginBottom: 18,
    marginHorizontal: 18,
    borderWidth: 1,
    borderColor: "#ffb6c1",
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#cc3366", marginBottom: 8 },
  sectionText: { fontSize: 14, color: "#444", lineHeight: 20 },

  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 12, marginBottom: 18 },
  card: {
    width: "40%",
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 18,
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  cardTitle: { fontSize: 16, fontWeight: "bold", marginTop: 8, color: "#333" },
  cardDesc: { fontSize: 13, color: "#666", textAlign: "center", marginTop: 6 },

  contactSection: { paddingHorizontal: 20, marginBottom: 30 },
  contactItem: { flexDirection: "row", alignItems: "center", marginVertical: 6 },
  contactText: { marginLeft: 10, fontSize: 15, color: "#555" },
});
