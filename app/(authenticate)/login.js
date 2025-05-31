import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (token) {
          router.replace("/(tabs)/home");
        }
      } catch (error) {
        console.log(error);
      }
    };
    checkLoginStatus();
  }, []);
  
  const handleLogin = () => {
    const user = {
      email: email,
      password: password,
    };

    axios.post("http://192.168.1.54:3000/login", user)
    .then((response) => {
      const token = response.data.token;
      console.log("token", token);
      AsyncStorage.setItem("authToken", token);
      router.replace("/(tabs)/home");
    })
    .catch((error) => {
      Alert.alert("Erreur de connexion", "Email ou mot de passe incorrect");
      console.log("erreur", error);
    });
  };
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Header avec gradient visuel */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.appTitle}>
            📝 GESTIONNAIRE DE TÂCHES
          </Text>
          <Text style={styles.subtitle}>
            Organisez votre quotidien
          </Text>
        </View>
      </View>
      
      <KeyboardAvoidingView style={styles.keyboardView}>
        <View style={styles.formContainer}>
          <Text style={styles.welcomeText}>
            Bon retour !
          </Text>
          <Text style={styles.descriptionText}>
            Connectez-vous à votre compte
          </Text>
        </View>

        <View style={styles.inputContainer}>
          {/* Champ Email */}
          <View style={styles.inputWrapper}>
            <MaterialIcons
              style={styles.inputIcon}
              name="email"
              size={22}
              color="#6366F1"
            />
            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={styles.textInput}
              placeholder="Votre adresse email"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Champ Mot de passe */}
          <View style={styles.inputWrapper}>
            <AntDesign
              style={styles.inputIcon}
              name="lock1"
              size={22}
              color="#6366F1"
            />
            <TextInput
              value={password}
              secureTextEntry={true}
              onChangeText={(text) => setPassword(text)}
              style={styles.textInput}
              placeholder="Votre mot de passe"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Options de connexion */}
          <View style={styles.optionsContainer}>
            <Text style={styles.keepLoggedText}>
              Rester connecté
            </Text>
            <Pressable>
              <Text style={styles.forgotPasswordText}>
                Mot de passe oublié ?
              </Text>
            </Pressable>
          </View>

          {/* Bouton de connexion */}
          <Pressable
            onPress={handleLogin}
            style={({ pressed }) => [
              styles.loginButton,
              pressed && styles.buttonPressed
            ]}
          >
            <Text style={styles.loginButtonText}>
              Se connecter
            </Text>
          </Pressable>

          {/* Lien vers inscription */}
          <Pressable
            onPress={() => router.replace("/register")}
            style={styles.registerLink}
          >
            <Text style={styles.registerLinkText}>
              Pas encore de compte ?
              <Text style={styles.registerLinkHighlight}> S'inscrire</Text>
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    backgroundColor: "#6366F1",
    paddingTop: 40,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#6366F1",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerContent: {
    alignItems: "center",
  },
  appTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "white",
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    color: "#E0E7FF",
    marginTop: 4,
    fontWeight: "500",
  },
  keyboardView: {
    flex: 1,
    justifyContent: "center",
  },
  formContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
  inputContainer: {
    paddingHorizontal: 30,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 20,
    paddingVertical: 4,
    paddingHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  inputIcon: {
    marginLeft: 16,
    marginRight: 4,
  },
  textInput: {
    flex: 1,
    color: "#374151",
    fontSize: 16,
    paddingVertical: 16,
    paddingHorizontal: 12,
    fontWeight: "500",
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 20,
  },
  keepLoggedText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  forgotPasswordText: {
    fontSize: 14,
    color: "#6366F1",
    fontWeight: "600",
  },
  loginButton: {
    backgroundColor: "#6366F1",
    paddingVertical: 18,
    borderRadius: 16,
    marginTop: 20,
    marginBottom: 20,
    shadowColor: "#6366F1",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonPressed: {
    backgroundColor: "#5B5BD6",
    transform: [{ scale: 0.98 }],
  },
  loginButtonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "700",
    fontSize: 18,
    letterSpacing: 0.5,
  },
  registerLink: {
    alignItems: "center",
    paddingVertical: 12,
  },
  registerLinkText: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  registerLinkHighlight: {
    color: "#6366F1",
    fontWeight: "700",
  },
});