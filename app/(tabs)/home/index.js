import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Keyboard,
  SafeAreaView
} from "react-native";
import React, { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { AntDesign, Feather } from "@expo/vector-icons";
import { Entypo, FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { MaterialIcons } from "@expo/vector-icons";

import moment from "moment";
import { useRouter } from "expo-router";

// Configuration de Moment.js en français
moment.locale('fr');

const index = () => {
  const router = useRouter();
  const [todos, setTodos] = useState([]);
  const today = moment().format("D MMMM");
  const [category, setCategory] = useState("Toutes");
  const [todo, setTodo] = useState("");
  const [pendingTodos, setPendingTodos] = useState([]);
  const [completedTodos, setCompletedTodos] = useState([]);
  const [marked, setMarked] = useState(false);

  const sheetRef = useRef(null);
  const snapPoints = useMemo(() => ['55%'], []);

  const suggestions = [
    {
      id: "0",
      todo: "Boire de l'eau, rester en bonne santé",
    },
    {
      id: "1",
      todo: "Faire du sport",
    },
    {
      id: "2",
      todo: "Se coucher tôt",
    },
    {
      id: "3",
      todo: "Prendre ses médicaments",
    },
    {
      id: "4",
      todo: "Faire les courses",
    },
    {
      id: "5",
      todo: "Terminer les devoirs",
    },
  ];

  const categories = [
    { key: "Toutes", label: "Toutes", color: "#6366F1" },
    { key: "Travail", label: "Travail", color: "#8B5CF6" },
    { key: "Personnel", label: "Personnel", color: "#06B6D4" },
  ];

  const addTodo = async () => {
    try {
      const todoData = {
        title: todo,
        category: category === "Toutes" ? "Personnel" : category,
      };

      await axios.post(
        "http://192.168.1.54:3000/todos/683657a279faae78728248e7",
        todoData
      );

      await getUserTodos();
      handleClose();
      setTodo("");
    } catch (error) {
      console.log("erreur", error);
    }
  };

  useEffect(() => {
    getUserTodos();
  }, [marked]);
  
  const handleClose = () => {
    sheetRef.current?.close();
    Keyboard.dismiss();
  };

  const handleOpen = () => {
    console.log("Ouvrir Modal");
    sheetRef.current?.expand();
  };

  const getUserTodos = async () => {
    try {
      const response = await axios.get(
        `http://192.168.1.54:3000/users/683657a279faae78728248e7/todos`
      );
      const recentTodos = response.data.todos.slice(-5);
      console.log(recentTodos);
      setTodos(recentTodos);

      const fetchedTodos = recentTodos || [];
      const pending = fetchedTodos.filter(
        (todo) => todo.status !== "completed"
      );

      const completed = fetchedTodos.filter(
        (todo) => todo.status === "completed"
      );

      setPendingTodos(pending);
      setCompletedTodos(completed);
    } catch (error) {
      console.log("erreur", error);
    }
  };

  const markTodoAsCompleted = async (todoId) => {    
    try {
      setMarked(true);
      const response = await axios.patch(
        `http://192.168.1.54:3000/todos/${todoId}/complete`
      );
      console.log(response.data);
    } catch (error) {
      console.log("erreur", error);
    }
  };

  console.log("terminées", completedTodos);
  console.log("en attente", pendingTodos);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>📝 Mes Tâches</Text>
          <Text style={styles.headerDate}>{today}</Text>
        </View>
      </View>

      {/* Filtres de catégories */}
      <View style={styles.categoriesContainer}>
        {categories.map((cat) => (
          <Pressable
            key={cat.key}
            onPress={() => setCategory(cat.key)}
            style={[
              styles.categoryButton,
              { backgroundColor: category === cat.key ? cat.color : "#F1F5F9" }
            ]}
          >
            <Text style={[
              styles.categoryText,
              { color: category === cat.key ? "white" : "#64748B" }
            ]}>
              {cat.label}
            </Text>
          </Pressable>
        ))}
        
        <Pressable onPress={handleOpen} style={styles.addButton}>
          <AntDesign name="plus" size={24} color="white" />
        </Pressable>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {todos?.length > 0 ? (
            <View>
              {pendingTodos?.length > 0 && (
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>
                    🎯 Tâches à faire • {today}
                  </Text>
                  <Text style={styles.sectionCount}>
                    {pendingTodos.length} tâche{pendingTodos.length > 1 ? 's' : ''}
                  </Text>
                </View>
              )}

              {pendingTodos?.map((item, index) => (
                <Pressable
                  onPress={() => {
                    router?.push({
                      pathname: "/home/info",
                      params: {
                        id: item._id,
                        title: item?.title,
                        category: item?.category,
                        createdAt: item?.createdAt,
                        dueDate: item?.dueDate,
                      },
                    });
                  }}
                  style={styles.todoItem}
                  key={index}
                >
                  <View style={styles.todoContent}>
                    <Pressable
                      onPress={() => markTodoAsCompleted(item?._id)}
                      style={styles.checkButton}
                    >
                      <Entypo name="circle" size={20} color="#6366F1" />
                    </Pressable>
                    <Text style={styles.todoText}>{item?.title}</Text>
                    <View style={styles.categoryTag}>
                      <Text style={styles.categoryTagText}>{item?.category}</Text>
                    </View>
                    <Feather name="chevron-right" size={20} color="#9CA3AF" />
                  </View>
                </Pressable>
              ))}

              {completedTodos?.length > 0 && (
                <View style={styles.completedSection}>
                  <View style={styles.completedHeader}>
                    <Image
                      style={styles.completedImage}
                      source={{
                        uri: "https://cdn-icons-png.flaticon.com/128/6784/6784655.png",
                      }}
                    />
                  </View>

                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>
                      ✅ Tâches terminées
                    </Text>
                    <MaterialIcons
                      name="keyboard-arrow-down"
                      size={24}
                      color="#6B7280"
                    />
                  </View>

                  {completedTodos?.map((item, index) => (
                    <View style={styles.completedTodoItem} key={index}>
                      <View style={styles.todoContent}>
                        <FontAwesome name="check-circle" size={20} color="#10B981" />
                        <Text style={styles.completedTodoText}>
                          {item?.title}
                        </Text>
                        <View style={[styles.categoryTag, styles.completedCategoryTag]}>
                          <Text style={styles.completedCategoryTagText}>{item?.category}</Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Image
                style={styles.emptyImage}
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/128/2387/2387679.png",
                }}
              />
              <Text style={styles.emptyTitle}>
                Aucune tâche pour aujourd'hui !
              </Text>
              <Text style={styles.emptySubtitle}>
                Commencez par ajouter votre première tâche
              </Text>
              <Pressable onPress={handleOpen} style={styles.emptyAddButton}>
                <AntDesign name="plus" size={20} color="white" />
                <Text style={styles.emptyAddButtonText}>Ajouter une tâche</Text>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>
      
      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        onClose={handleClose}
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.bottomSheetIndicator}
      >
        <BottomSheetView>
          <View style={styles.bottomSheetContent}>
            <Text style={styles.bottomSheetTitle}>✨ Ajouter une tâche</Text>

            <View style={styles.inputContainer}>
              <TextInput
                value={todo}
                onChangeText={setTodo}
                placeholder="Saisissez votre nouvelle tâche..."
                placeholderTextColor="#9CA3AF"
                style={styles.textInput}
              />
              <Pressable onPress={addTodo} style={styles.sendButton}>
                <Ionicons name="send" size={20} color="white" />
              </Pressable>
            </View>

            <Text style={styles.sectionLabel}>📂 Choisir une catégorie</Text>
            <View style={styles.categorySelector}>
              {["Travail", "Personnel", "Liste de souhaits"].map((cat) => (
                <Pressable
                  key={cat}
                  onPress={() => setCategory(cat)}
                  style={[
                    styles.categoryOption,
                    { backgroundColor: category === cat ? "#6366F1" : "#F8FAFC" }
                  ]}
                >
                  <Text style={[
                    styles.categoryOptionText,
                    { color: category === cat ? "white" : "#64748B" }
                  ]}>
                    {cat}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.sectionLabel}>💡 Suggestions</Text>
            <View style={styles.suggestionsContainer}>
              {suggestions?.map((item, index) => (
                <Pressable
                  key={index}
                  onPress={() => setTodo(item?.todo)}
                  style={styles.suggestionItem}
                >
                  <Text style={styles.suggestionText}>{item?.todo}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </SafeAreaView>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    backgroundColor: "#6366F1",
    paddingTop: 20,
    paddingBottom: 25,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerContent: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "white",
    letterSpacing: 0.5,
  },
  headerDate: {
    fontSize: 14,
    color: "#E0E7FF",
    marginTop: 4,
    fontWeight: "500",
  },
  categoriesContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "600",
  },
  addButton: {
    backgroundColor: "#6366F1",
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "auto",
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
  },
  sectionCount: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  todoItem: {
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  todoContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  checkButton: {
    padding: 4,
  },
  todoText: {
    flex: 1,
    fontSize: 16,
    color: "#374151",
    fontWeight: "500",
  },
  categoryTag: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryTagText: {
    fontSize: 12,
    color: "#6366F1",
    fontWeight: "600",
  },
  completedSection: {
    marginTop: 30,
  },
  completedHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  completedImage: {
    width: 80,
    height: 80,
  },
  completedTodoItem: {
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  completedTodoText: {
    flex: 1,
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
    textDecorationLine: "line-through",
  },
  completedCategoryTag: {
    backgroundColor: "#F3F4F6",
  },
  completedCategoryTagText: {
    color: "#9CA3AF",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyImage: {
    width: 160,
    height: 160,
    marginBottom: 24,
    opacity: 0.8,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 24,
  },
  emptyAddButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6366F1",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  emptyAddButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  bottomSheetBackground: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  bottomSheetIndicator: {
    backgroundColor: "#D1D5DB",
    width: 40,
  },
  bottomSheetContent: {
    padding: 24,
  },
  bottomSheetTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 24,
  },
  textInput: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    color: "#374151",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  sendButton: {
    backgroundColor: "#6366F1",
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
  },
  categorySelector: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 24,
    flexWrap: "wrap",
  },
  categoryOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  categoryOptionText: {
    fontSize: 14,
    fontWeight: "600",
  },
  suggestionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  suggestionItem: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#C7D2FE",
  },
  suggestionText: {
    fontSize: 13,
    color: "#6366F1",
    fontWeight: "500",
  },
});