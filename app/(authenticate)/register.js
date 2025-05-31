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
  import React, { useState } from "react";
  import { MaterialIcons } from "@expo/vector-icons";
  import { AntDesign, Ionicons } from "@expo/vector-icons";
  import { useRouter } from "expo-router";
  import axios from "axios";
  
  const register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    
    const handleRegister = () => {
        const user = { 
            name: name,
            email: email,
            password: password
        }

        axios.post("http://192.168.1.54:3000/register", user).then((response) => {
            console.log(response);
            Alert.alert("Succès", "Votre compte a été créé avec succès !");
            setEmail("");
            setPassword("");
            setName("");
        }).catch((error) => {
            Alert.alert("Erreur d'inscription", "Une erreur s'est produite lors de l'inscription");
            console.log("erreur", error)
        })
    }
    
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
              Créer votre compte
            </Text>
            <Text style={styles.descriptionText}>
              Rejoignez-nous pour organiser vos tâches
            </Text>
          </View>
  
          <View style={styles.inputContainer}>
            {/* Champ Nom */}
            <View style={styles.inputWrapper}>
              <Ionicons style={styles.inputIcon} name="person" size={22} color="#6366F1" />
              <TextInput
                value={name}
                onChangeText={(text) => setName(text)}
                style={styles.textInput}
                placeholder="Votre nom complet"
                placeholderTextColor="#9CA3AF"
              />
            </View>
            
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
  
            {/* Bouton d'inscription */}
            <Pressable
              onPress={handleRegister}
              style={({ pressed }) => [
                styles.registerButton,
                pressed && styles.buttonPressed
              ]}
            >
              <Text style={styles.registerButtonText}>
                S'inscrire
              </Text>
            </Pressable>
  
            {/* Lien vers connexion */}
            <Pressable 
              onPress={() => router.replace("/login")} 
              style={styles.loginLink}
            >
              <Text style={styles.loginLinkText}>
                Déjà un compte ? 
                <Text style={styles.loginLinkHighlight}> Se connecter</Text>
              </Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  };
  
  export default register;
  
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
    registerButton: {
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
    registerButtonText: {
      textAlign: "center",
      color: "white",
      fontWeight: "700",
      fontSize: 18,
      letterSpacing: 0.5,
    },
    loginLink: {
      alignItems: "center",
      paddingVertical: 12,
    },
    loginLinkText: {
      fontSize: 16,
      color: "#6B7280",
      fontWeight: "500",
    },
    loginLinkHighlight: {
      color: "#6366F1",
      fontWeight: "700",
    },
  });