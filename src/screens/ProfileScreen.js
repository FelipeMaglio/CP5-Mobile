import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function ProfileScreen() {
  const { user, logout, deleteAccount } = useAuth();
  const [loading, setLoading] = useState(false);

  function confirmDelete() {
    Alert.alert(
      "Excluir conta",
      "Tem certeza que deseja excluir sua conta? Essa ação não poderá ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: handleDelete },
      ]
    );
  }

  async function handleDelete() {
    setLoading(true);
    try {
      await deleteAccount();
    } catch (e) {
      Alert.alert("Erro", "Não foi possível excluir a conta. Faça login novamente e tente de novo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Nome</Text>
        <Text style={styles.value}>{user?.displayName || "Não informado"}</Text>
        <Text style={styles.label}>E-mail</Text>
        <Text style={styles.value}>{user?.email}</Text>
      </View>

      <TouchableOpacity style={styles.buttonSecondary} onPress={logout}>
        <Text style={styles.buttonSecondaryText}>Sair (Logout)</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonDanger} onPress={confirmDelete} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Excluir conta</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#fff" },
  card: { backgroundColor: "#f3f4f6", borderRadius: 8, padding: 16, marginBottom: 32 },
  label: { fontSize: 12, color: "#6b7280", marginTop: 8 },
  value: { fontSize: 16, color: "#111827", fontWeight: "500" },
  buttonSecondary: { borderWidth: 1, borderColor: "#2563eb", borderRadius: 8, padding: 14, alignItems: "center", marginBottom: 16 },
  buttonSecondaryText: { color: "#2563eb", fontWeight: "bold" },
  buttonDanger: { backgroundColor: "#dc2626", borderRadius: 8, padding: 14, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
