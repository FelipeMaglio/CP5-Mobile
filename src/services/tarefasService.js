import {
  collection,
  doc,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";

// Estrutura: usuarios/{uid}/registros/{registroId}
function registrosRef(uid) {
  return collection(db, "usuarios", uid, "registros");
}

// CREATE
export async function criarTarefa(uid, dados) {
  return addDoc(registrosRef(uid), {
    ...dados,
    uid,
    criadoEm: serverTimestamp(),
    atualizadoEm: serverTimestamp(),
  });
}

// READ
export async function listarTarefas(uid) {
  const q = query(registrosRef(uid), orderBy("criadoEm", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// UPDATE
export async function atualizarTarefa(uid, id, dados) {
  return updateDoc(doc(db, "usuarios", uid, "registros", id), {
    ...dados,
    atualizadoEm: serverTimestamp(),
  });
}

// DELETE
export async function excluirTarefa(uid, id) {
  return deleteDoc(doc(db, "usuarios", uid, "registros", id));
}
