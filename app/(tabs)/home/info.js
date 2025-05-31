import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Ionicons, Entypo } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { AntDesign, Feather } from "@expo/vector-icons";
import { SimpleLineIcons } from '@expo/vector-icons';

const info = () => {
  const params = useLocalSearchParams();
  return (
    <View style={styles.container}>
      {/* En-tête avec navigation */}
      <View style={styles.header}>
        <Pressable style={styles.backButton}>
          <Ionicons name="md-arrow-back" size={24} color="#FFFFFF" />
        </Pressable>
        <Pressable style={styles.menuButton}>
          <Entypo name="dots-three-vertical" size={24} color="#FFFFFF" />
        </Pressable>
      </View>

      {/* Catégorie */}
      <View style={styles.categoryContainer}>
        <Text style={styles.categoryText}>
          Catégorie - {params?.category || "Général"}
        </Text>
      </View>

      {/* Titre de la tâche */}
      <Text style={styles.taskTitle}>
        {params?.title || "Titre de la tâche"}
      </Text>

      <View style={styles.spacer} />

      {/* Bouton Ajouter une sous-tâche */}
      <Pressable style={styles.addSubtaskButton}>
        <AntDesign name="plus" size={24} color="#FFFFFF" />
        <Text style={styles.addSubtaskText}>
          Ajouter une sous-tâche
        </Text>
      </Pressable>

      {/* Options de configuration */}
      <View style={styles.optionsContainer}>
        
        {/* Date d'échéance */}
        <View style={styles.optionRow}>
          <View style={styles.optionLeft}>
            <View style={[styles.iconContainer, {backgroundColor: '#FF6B6B'}]}>
              <AntDesign name="calendar" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.optionText}>Date d'échéance</Text>
          </View>
          <Pressable style={[styles.optionValue, {backgroundColor: '#FFE5E5'}]}>
            <Text style={[styles.optionValueText, {color: '#FF6B6B'}]}>
              {params?.dueDate || "Non définie"}
            </Text>
          </Pressable>
        </View>

        {/* Heure et rappel */}
        <View style={styles.optionRow}>
          <View style={styles.optionLeft}>
            <View style={[styles.iconContainer, {backgroundColor: '#4ECDC4'}]}>
              <Ionicons name="time-sharp" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.optionText}>Heure et rappel</Text>
          </View>
          <Pressable style={[styles.optionValue, {backgroundColor: '#E5F9F6'}]}>
            <Text style={[styles.optionValueText, {color: '#4ECDC4'}]}>
              Non défini
            </Text>
          </Pressable>
        </View>

        {/* Répéter la tâche */}
        <View style={styles.optionRow}>
          <View style={styles.optionLeft}>
            <View style={[styles.iconContainer, {backgroundColor: '#95E1D3'}]}>
              <Feather name="repeat" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.optionText}>Répéter la tâche</Text>
          </View>
          <Pressable style={[styles.optionValue, {backgroundColor: '#F0FCE5'}]}>
            <Text style={[styles.optionValueText, {color: '#95E1D3'}]}>
              Non
            </Text>
          </Pressable>
        </View>

        {/* Notes */}
        <View style={styles.optionRow}>
          <View style={styles.optionLeft}>
            <View style={[styles.iconContainer, {backgroundColor: '#F38BA8'}]}>
              <SimpleLineIcons name="note" size={18} color="#FFFFFF" />
            </View>
            <Text style={styles.optionText}>Notes</Text>
          </View>
          <Pressable style={[styles.optionValue, {backgroundColor: '#FFF0F5'}]}>
            <Text style={[styles.optionValueText, {color: '#F38BA8'}]}>
              Non ajoutées
            </Text>
          </Pressable>
        </View>

      </View>
    </View>
  );
};

export default info;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#6C5CE7",
    paddingHorizontal: 15,
    paddingVertical: 15,
    paddingTop: 50,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 8,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  menuButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  categoryContainer: {
    marginTop: 20,
    marginHorizontal: 15,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6C5CE7",
    backgroundColor: "#E8E5FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    alignSelf: "flex-start",
  },
  taskTitle: {
    marginTop: 15,
    marginHorizontal: 15,
    fontSize: 24,
    fontWeight: "700",
    color: "#2D3436",
    lineHeight: 30,
  },
  spacer: {
    marginTop: 30,
  },
  addSubtaskButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginHorizontal: 15,
    backgroundColor: "#00B894",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: "#00B894",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  addSubtaskText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  optionsContainer: {
    marginTop: 25,
    marginHorizontal: 15,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    padding: 18,
    marginBottom: 12,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  optionText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#2D3436",
  },
  optionValue: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    minWidth: 80,
    alignItems: "center",
  },
  optionValueText: {
    fontSize: 14,
    fontWeight: "600",
  },
});