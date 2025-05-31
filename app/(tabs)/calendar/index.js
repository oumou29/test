import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import moment from "moment";
import { Calendar } from "react-native-calendars";
import axios from "axios";
import { FontAwesome, Feather, MaterialIcons } from "@expo/vector-icons";

const index = () => {
  const today = moment().format("YYYY-MM-DD");
  const [selectedDate, setSelectedDate] = useState(today);
  const [todos, setTodos] = useState([]);

  const fetchCompletedTodos = async () => {
    try {
      const response = await axios.get(
        `http://192.168.1.54:3000/todos/completed/${selectedDate}`
      );

      const completedTodos = response.data.completedTodos || [];
      setTodos(completedTodos);
    } catch (error) {
      console.log("erreur", error);
    }
  };

  useEffect(() => {
    fetchCompletedTodos();
  }, [selectedDate]);

  console.log(todos);

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  const formatSelectedDate = () => {
    return moment(selectedDate).format("dddd DD MMMM YYYY");
  };

  return (
    <View style={styles.container}>
      {/* En-tête */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📅 Mon Calendrier</Text>
        <Text style={styles.headerSubtitle}>
          Gérez vos tâches terminées
        </Text>
      </View>

      {/* Calendrier */}
      <View style={styles.calendarContainer}>
        <Calendar
          onDayPress={handleDayPress}
          markedDates={{
            [selectedDate]: { 
              selected: true, 
              selectedColor: "#667eea",
              selectedTextColor: "#ffffff"
            },
          }}
          theme={{
            backgroundColor: '#ffffff',
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#667eea',
            selectedDayBackgroundColor: '#667eea',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#667eea',
            dayTextColor: '#2d4150',
            textDisabledColor: '#d9e1e8',
            dotColor: '#00adf5',
            selectedDotColor: '#ffffff',
            arrowColor: '#667eea',
            disabledArrowColor: '#d9e1e8',
            monthTextColor: '#2d4150',
            indicatorColor: '#667eea',
            textDayFontWeight: '500',
            textMonthFontWeight: '700',
            textDayHeaderFontWeight: '600',
            textDayFontSize: 16,
            textMonthFontSize: 18,
            textDayHeaderFontSize: 14
          }}
          style={styles.calendar}
        />
      </View>

      {/* Date sélectionnée */}
      <View style={styles.selectedDateContainer}>
        <View style={styles.dateCard}>
          <MaterialIcons name="event" size={24} color="#667eea" />
          <Text style={styles.selectedDateText}>
            {formatSelectedDate()}
          </Text>
        </View>
      </View>

      {/* Section des tâches terminées */}
      <View style={styles.tasksSection}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <View style={styles.iconContainer}>
              <FontAwesome name="check-circle" size={20} color="#ffffff" />
            </View>
            <Text style={styles.sectionTitle}>Tâches terminées</Text>
            <View style={styles.taskCount}>
              <Text style={styles.taskCountText}>{todos.length}</Text>
            </View>
          </View>
          <Pressable style={styles.dropdownButton}>
            <MaterialIcons name="arrow-drop-down" size={24} color="#667eea" />
          </Pressable>
        </View>

        {/* Liste des tâches */}
        <View style={styles.todosList}>
          {todos.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>🎉</Text>
              <Text style={styles.emptyStateTitle}>
                Aucune tâche terminée
              </Text>
              <Text style={styles.emptyStateSubtitle}>
                Les tâches terminées pour cette date apparaîtront ici
              </Text>
            </View>
          ) : (
            todos?.map((item, index) => (
              <Pressable
                style={[
                  styles.todoItem,
                  { backgroundColor: index % 2 === 0 ? "#f1f5f9" : "#e2e8f0" }
                ]}
                key={index}
              >
                <View style={styles.todoContent}>
                  <View style={styles.checkIconContainer}>
                    <FontAwesome name="check-circle" size={20} color="#10b981" />
                  </View>
                  <Text style={styles.todoText}>
                    {item?.title}
                  </Text>
                  <View style={styles.flagContainer}>
                    <Feather name="flag" size={18} color="#64748b" />
                  </View>
                </View>
                <View style={styles.completedBadge}>
                  <Text style={styles.completedBadgeText}>Terminé</Text>
                </View>
              </Pressable>
            ))
          )}
        </View>
      </View>
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    backgroundColor: "#667eea",
    paddingTop: 50,
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: "#667eea",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "500",
  },
  calendarContainer: {
    marginHorizontal: 15,
    marginTop: 20,
    borderRadius: 15,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  calendar: {
    borderRadius: 15,
    paddingBottom: 10,
  },
  selectedDateContainer: {
    marginHorizontal: 15,
    marginTop: 20,
  },
  dateCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 12,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: "#667eea",
  },
  selectedDateText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    textTransform: "capitalize",
  },
  tasksSection: {
    flex: 1,
    marginHorizontal: 15,
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#10b981",
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
  },
  taskCount: {
    backgroundColor: "#e2e8f0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 24,
    alignItems: "center",
  },
  taskCountText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
  },
  dropdownButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#f1f5f9",
  },
  todosList: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 15,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#64748b",
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
    lineHeight: 20,
  },
  todoItem: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  todoContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  checkIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#dcfce7",
    justifyContent: "center",
    alignItems: "center",
  },
  todoText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: "#64748b",
    textDecorationLine: "line-through",
  },
  flagContainer: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: "#f1f5f9",
  },
  completedBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#dcfce7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  completedBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#16a34a",
  },
});