import React, { useCallback, useState } from "react";
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, Alert,
  ActivityIndicator, RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { listarTarefas, excluirTarefa } from "../services/tarefasService";

export default function TarefasListScreen({ navigation }) {
  const { user } = useAuth();
  const [tarefas, setTarefas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const carregar = useCallback(async () => {
    try {
      setTarefas(await listarTarefas(user.uid));
    } catch (e) {
      Alert.alert("Erro", "Não foi possível carregar as tarefas.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user.uid]);

  // Recarrega sempre que a tela ganha foco (após criar/editar)
  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  function confirmarExclusao(item) {
    Alert.alert("Excluir", "Tem certeza que deseja excluir este registro?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await excluirTarefa(user.uid, item.id);
            setTarefas((prev) => prev.filter((t) => t.id !== item.id));
            Alert.alert("Sucesso", "Registro excluído com sucesso!");
          } catch (e) {
            Alert.alert("Erro", "Não foi possível excluir o registro.");
          }
        },
      },
    ]);
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={tarefas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={tarefas.length === 0 && styles.center}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); carregar(); }} />
        }
        ListEmptyComponent={<Text style={styles.empty}>Nenhum registro encontrado.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.titulo}</Text>
            <Text style={styles.cardText}>{item.descricao}</Text>
            <Text style={styles.cardMeta}>📅 {item.data}   •   {item.status}</Text>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate("Form", { tarefa: item })}>
                <Text style={styles.editText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.delBtn} onPress={() => confirmarExclusao(item)}>
                <Text style={styles.delText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate("Form")}>
        <Text style={styles.fabText}>+ Nova tarefa</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  empty: { color: "#6b7280", fontSize: 16 },
  card: { backgroundColor: "#f3f4f6", borderRadius: 8, padding: 16, marginBottom: 12 },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#111827" },
  cardText: { color: "#374151", marginTop: 4 },
  cardMeta: { color: "#6b7280", marginTop: 8, fontSize: 13 },
  actions: { flexDirection: "row", gap: 12, marginTop: 12 },
  editBtn: { borderWidth: 1, borderColor: "#2563eb", borderRadius: 6, paddingVertical: 8, paddingHorizontal: 16 },
  editText: { color: "#2563eb", fontWeight: "bold" },
  delBtn: { backgroundColor: "#dc2626", borderRadius: 6, paddingVertical: 8, paddingHorizontal: 16 },
  delText: { color: "#fff", fontWeight: "bold" },
  fab: { backgroundColor: "#2563eb", borderRadius: 8, padding: 14, alignItems: "center", marginTop: 8 },
  fabText: { color: "#fff", fontWeight: "bold" },
});
