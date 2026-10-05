import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert,
  ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { criarTarefa, atualizarTarefa } from "../services/tarefasService";

const STATUS = ["Pendente", "Em andamento", "Concluída"];
const DATA_REGEX = /^(\d{2})\/(\d{2})\/(\d{4})$/;

function dataValida(texto) {
  const m = DATA_REGEX.exec(texto);
  if (!m) return false;
  const [, d, mes, a] = m.map(Number);
  const dt = new Date(a, mes - 1, d);
  return dt.getFullYear() === a && dt.getMonth() === mes - 1 && dt.getDate() === d;
}

// Recebe route.params.tarefa quando for edição
export default function TarefaFormScreen({ route, navigation }) {
  const { user } = useAuth();
  const tarefa = route.params?.tarefa;
  const editando = !!tarefa;

  const [titulo, setTitulo] = useState(tarefa?.titulo || "");
  const [descricao, setDescricao] = useState(tarefa?.descricao || "");
  const [data, setData] = useState(tarefa?.data || "");
  const [status, setStatus] = useState(tarefa?.status || STATUS[0]);
  const [loading, setLoading] = useState(false);

  function formatarData(texto) {
    const n = texto.replace(/\D/g, "").slice(0, 8);
    let out = n;
    if (n.length > 4) out = `${n.slice(0, 2)}/${n.slice(2, 4)}/${n.slice(4)}`;
    else if (n.length > 2) out = `${n.slice(0, 2)}/${n.slice(2)}`;
    setData(out);
  }

  async function handleSalvar() {
    if (!titulo.trim() || !descricao.trim() || !data.trim()) {
      Alert.alert("Atenção", "Preencha todos os campos.");
      return;
    }
    if (!dataValida(data)) {
      Alert.alert("Atenção", "Informe uma data válida no formato DD/MM/AAAA.");
      return;
    }

    setLoading(true);
    try {
      const dados = { titulo: titulo.trim(), descricao: descricao.trim(), data, status };
      if (editando) {
        await atualizarTarefa(user.uid, tarefa.id, dados);
      } else {
        await criarTarefa(user.uid, dados);
      }
      Alert.alert("Sucesso", editando ? "Tarefa atualizada!" : "Tarefa cadastrada!", [
        { text: "OK", onPress: () => navigation.navigate("Lista") },
      ]);
    } catch (e) {
      Alert.alert("Erro", "Não foi possível salvar a tarefa. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>Título</Text>
        <TextInput style={styles.input} value={titulo} onChangeText={setTitulo} placeholder="Ex.: Estudar Firestore" />

        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={[styles.input, { height: 90, textAlignVertical: "top" }]}
          value={descricao}
          onChangeText={setDescricao}
          placeholder="Detalhes da tarefa"
          multiline
        />

        <Text style={styles.label}>Data</Text>
        <TextInput
          style={styles.input}
          value={data}
          onChangeText={formatarData}
          placeholder="DD/MM/AAAA"
          keyboardType="numeric"
          maxLength={10}
        />

        <Text style={styles.label}>Status</Text>
        <View style={styles.statusRow}>
          {STATUS.map((s) => (
            <TouchableOpacity
              key={s}
              style={[styles.chip, status === s && styles.chipActive]}
              onPress={() => setStatus(s)}
            >
              <Text style={[styles.chipText, status === s && styles.chipTextActive]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSalvar} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>{editando ? "Salvar alterações" : "Cadastrar tarefa"}</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, backgroundColor: "#fff", flexGrow: 1 },
  label: { fontSize: 14, color: "#374151", marginBottom: 6, marginTop: 12 },
  input: { borderWidth: 1, borderColor: "#d1d5db", borderRadius: 8, padding: 12, fontSize: 16 },
  statusRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { borderWidth: 1, borderColor: "#2563eb", borderRadius: 16, paddingVertical: 8, paddingHorizontal: 12 },
  chipActive: { backgroundColor: "#2563eb" },
  chipText: { color: "#2563eb" },
  chipTextActive: { color: "#fff", fontWeight: "bold" },
  button: { backgroundColor: "#2563eb", borderRadius: 8, padding: 14, alignItems: "center", marginTop: 28 },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
