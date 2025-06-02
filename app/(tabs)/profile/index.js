import { Image, StyleSheet, Text, View, Dimensions } from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { LineChart } from "react-native-chart-kit";

const index = () => {
  const [completedTasks, setCompletedTasks] = useState(0);
  const [pendingTasks, setPendingTasks] = useState(0);

  const fetchTaskData = async () => {
    try {
      const response = await axios.get("http://192.168.1.54:3000/todos/count");
      const { totalCompletedTodos, totalPendingTodos } = response.data;
      setCompletedTasks(totalCompletedTodos);
      setPendingTasks(totalPendingTodos);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchTaskData();
  }, []);

  console.log("terminé", completedTasks);
  console.log("en attente", pendingTasks);

  return (
    <View style={styles.container}>
      {/* En-tête avec profil utilisateur */}
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              style={styles.avatar}
              source={{
                uri: "",
              }}
            />
            <View style={styles.statusIndicator} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.welcomeText}>
              Planifiez vos 15 prochains jours
            </Text>
            <Text style={styles.subtitleText}>
              Sélectionnez vos catégories
            </Text>
          </View>
        </View>
      </View>

      {/* Aperçu des tâches */}
      <View style={styles.overviewSection}>
        <Text style={styles.sectionTitle}>Aperçu des tâches</Text>
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, styles.completedCard]}>
            <View style={styles.statIconContainer}>
              <Text style={styles.statIcon}>✓</Text>
            </View>
            <Text style={styles.statNumber}>
              {completedTasks}
            </Text>
            <Text style={styles.statLabel}>tâches terminées</Text>
          </View>

          <View style={[styles.statCard, styles.pendingCard]}>
            <View style={styles.statIconContainer}>
              <Text style={styles.statIcon}>⏳</Text>
            </View>
            <Text style={styles.statNumber}>
              {pendingTasks}
            </Text>
            <Text style={styles.statLabel}>tâches en attente</Text>
          </View>
        </View>
      </View>

      {/* Graphique */}
      <View style={styles.chartSection}>
        <Text style={styles.chartTitle}>Progression des tâches</Text>
        <View style={styles.chartContainer}>
          <LineChart
            data={{
              labels: ["En attente", "Terminées"],
              datasets: [
                {
                  data: [pendingTasks, completedTasks],
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  strokeWidth: 3,
                },
              ],
            }}
            width={Dimensions.get("window").width - 40}
            height={200}
            yAxisInterval={2}
            chartConfig={{
              backgroundColor: "#667eea",
              backgroundGradientFrom: "#667eea",
              backgroundGradientTo: "#764ba2",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 20,
              },
              propsForDots: {
                r: "8",
                strokeWidth: "3",
                stroke: "#ffffff",
                fill: "#667eea",
              },
            }}
            bezier
            style={styles.chart}
          />
        </View>
      </View>

      {/* Section des prochaines tâches */}
      <View style={styles.upcomingSection}>
        <View style={styles.upcomingCard}>
          <View style={styles.upcomingHeader}>
            <Text style={styles.upcomingTitle}>📅</Text>
            <Text style={styles.upcomingText}>
              Tâches des 7 prochains jours
            </Text>
          </View>
        </View>
      </View>

      {/* Image de motivation */}
      <View style={styles.motivationSection}>
        <View style={styles.imageContainer}>
          <Image
            style={styles.motivationImage}
            source={{
              uri: "https://cdn-icons-png.flaticon.com/128/9537/9537221.png",
            }}
          />
          <Text style={styles.motivationText}>
            Restez organisé et productif ! 🚀
          </Text>
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
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    borderWidth: 3,
    borderColor: "#ffffff",
  },
  statusIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#00d4aa",
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  profileInfo: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 2,
  },
  subtitleText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "500",
  },
  overviewSection: {
    paddingHorizontal: 20,
    marginTop: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 15,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  completedCard: {
    backgroundColor: "#10b981",
    backgroundGradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
  },
  pendingCard: {
    backgroundColor: "#f59e0b",
    backgroundGradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
  },
  statIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  statIcon: {
    fontSize: 20,
    color: "#ffffff",
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 13,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "600",
    textAlign: "center",
  },
  chartSection: {
    paddingHorizontal: 20,
    marginTop: 25,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 15,
    textAlign: "center",
  },
  chartContainer: {
    alignItems: "center",
  },
  chart: {
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  upcomingSection: {
    paddingHorizontal: 20,
    marginTop: 25,
  },
  upcomingCard: {
    backgroundColor: "#6366f1",
    padding: 18,
    borderRadius: 16,
    shadowColor: "#6366f1",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  upcomingHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  upcomingTitle: {
    fontSize: 24,
  },
  upcomingText: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "600",
    flex: 1,
  },
  motivationSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  imageContainer: {
    alignItems: "center",
  },
  motivationImage: {
    width: 100,
    height: 100,
    marginBottom: 15,
  },
  motivationText: {
    fontSize: 16,
    color: "#64748b",
    fontWeight: "600",
    textAlign: "center",
  },
});