import React from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";

import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import HomeScreen from "../screens/HomeScreen";
import TarefasListScreen from "../screens/TarefasListScreen";
import TarefaFormScreen from "../screens/TarefaFormScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Stack = createNativeStackNavigator();

// Rotas acessíveis apenas SEM autenticação
function PublicStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
}

// Rotas acessíveis apenas COM autenticação
function PrivateStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Início" }} />
      <Stack.Screen name="Lista" component={TarefasListScreen} options={{ title: "Minhas tarefas" }} />
      <Stack.Screen
        name="Form"
        component={TarefaFormScreen}
        options={({ route }) => ({ title: route.params?.tarefa ? "Editar tarefa" : "Nova tarefa" })}
      />
      <Stack.Screen name="Perfil" component={ProfileScreen} options={{ title: "Minha conta" }} />
    </Stack.Navigator>
  );
}

export default function RootNavigation() {
  const { user, initializing } = useAuth();

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <PrivateStack /> : <PublicStack />}
    </NavigationContainer>
  );
}
