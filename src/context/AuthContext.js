import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  deleteUser,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../config/firebase";

const SESSION_KEY = "@cp5_session_active";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Verifica sessão salva localmente e escuta mudanças de autenticação do Firebase
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await AsyncStorage.setItem(SESSION_KEY, firebaseUser.uid);
      }
      setInitializing(false);
    });
    return unsubscribe;
  }, []);

  async function signUp(name, email, password) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    await AsyncStorage.setItem(SESSION_KEY, cred.user.uid);
    setUser({ ...cred.user, displayName: name });
    return cred.user;
  }

  async function login(email, password) {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    await AsyncStorage.setItem(SESSION_KEY, cred.user.uid);
    return cred.user;
  }

  async function logout() {
    await signOut(auth);
    await AsyncStorage.removeItem(SESSION_KEY);
    setUser(null);
  }

  async function resetPassword(email) {
    await sendPasswordResetEmail(auth, email);
  }

  async function deleteAccount() {
    if (!auth.currentUser) return;
    await deleteUser(auth.currentUser);
    await AsyncStorage.removeItem(SESSION_KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        initializing,
        signUp,
        login,
        logout,
        resetPassword,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
