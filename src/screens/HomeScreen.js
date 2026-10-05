import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const nome = user?.displayName || "usuário";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Olá, {nome}!</Text>
      <Text style={styles.subtitle}>Gerencie suas tarefas</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Form")}>
        <Text style={styles.buttonText}>Nova tarefa</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Lista")}>
        <Text style={styles.buttonText}>Minhas tarefas</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonSecondary} onPress={() => navigation.navigate("Perfil")}>
        <Text style={styles.buttonSecondaryText}>Minha conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#fff" },
  title: { fontSize: 28, fontWeight: "bold", marginTop: 40 },
  subtitle: { fontSize: 16, color: "#6b7280", marginBottom: 32 },
  button: { backgroundColor: "#2563eb", borderRadius: 8, padding: 14, alignItems: "center", marginBottom: 16 },
  buttonText: { color: "#fff", fontWeight: "bold" },
  buttonSecondary: { borderWidth: 1, borderColor: "#2563eb", borderRadius: 8, padding: 14, alignItems: "center" },
  buttonSecondaryText: { color: "#2563eb", fontWeight: "bold" },
});
