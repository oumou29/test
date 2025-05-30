import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Keyboard

} from "react-native";
import React, { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { AntDesign, Feather } from "@expo/vector-icons";
import { Entypo, FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { MaterialIcons } from "@expo/vector-icons";

import moment from "moment";
import { useRouter } from "expo-router";

const index = () => {
    const router = useRouter();
  const [todos, setTodos] = useState([]);
  const today = moment().format("MMM Do");
  const [category, setCategory] = useState("All");
  const [todo, setTodo] = useState("");
  const [pendingTodos, setPendingTodos] = useState([]);
  const [completedTodos, setCompletedTodos] = useState([]);
  const [marked, setMarked] = useState(false);


  const sheetRef = useRef(null);
  // Snap points for the sheet (height in % or px)
  const snapPoints = useMemo(() => ['50%'], []);

  const suggestions = [
    {
      id: "0",
      todo: "Drink Water, keep healthy",
    },
    {
      id: "1",
      todo: "Go Excercising",
    },
    {
      id: "2",
      todo: "Go to bed early",
    },
    {
      id: "3",
      todo: "Take pill reminder",
    },
    {
      id: "4",
      todo: "Go Shopping",
    },
    {
      id: "5",
      todo: "finish assignments",
    },
  ];



  const addTodo = async () => {
    try {
      const todoData = {
        title: todo,
        category: category,
      };

    await axios.post(
      "http://192.168.1.54:3000/todos/683657a279faae78728248e7",
      todoData
    );

      await getUserTodos();
        handleClose();
        setTodo("");
    } catch (error) {
      console.log("error", error);
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
    console.log("Open Modal");
    sheetRef.current?.expand();
  };

  const getUserTodos = async () => {
    try {
      const response = await axios.get(
        `http://192.168.1.54:3000/users/683657a279faae78728248e7/todos`
      );
      const recentTodos = response.data.todos.slice(-5)
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
      console.log("error", error);
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
      console.log("error", error);
    }
  };

  console.log("completed", completedTodos);
  console.log("pending", pendingTodos);

  return (
    <>
      <View
        style={{
          marginHorizontal: 10,
          marginVertical: 10,
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          marginBlockStart: 100,
        }}
      >
        <Pressable
          style={{
            backgroundColor: "#7CB9E8",
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 25,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "white", textAlign: "center" }}>All</Text>
        </Pressable>
        <Pressable
          style={{
            backgroundColor: "#7CB9E8",
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 25,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "white", textAlign: "center" }}>Work</Text>
        </Pressable>

        <Pressable
          style={{
            backgroundColor: "#7CB9E8",
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 25,
            alignItems: "center",
            justifyContent: "center",
            marginRight: "auto",
          }}
        >
          <Text style={{ color: "white", textAlign: "center" }}>Personal</Text>
        </Pressable>
        
        <Pressable onPress={handleOpen}>
          <AntDesign name="pluscircle" size={30} color="#007FFF" />
        </Pressable>
      </View>

      <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
        <View style={{ padding: 10 }}>
          {todos?.length > 0 ? (
            <View>
              {pendingTodos?.length > 0 && <Text>Tasks to Do! {today}</Text>}

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
                  style={{
                    backgroundColor: "#E0E0E0",
                    padding: 10,
                    borderRadius: 7,
                    marginVertical: 10,
                  }}
                  key={index}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <Entypo
                      onPress={() => markTodoAsCompleted(item?._id)}
                      name="circle"
                      size={18}
                      color="black"
                    />
                    <Text style={{ flex: 1 }}>{item?.title}</Text>
                    <Feather name="flag" size={20} color="black" />
                  </View>
                </Pressable>
              ))}

              {completedTodos?.length > 0 && (
                <View>
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      margin: 10,
                    }}
                  >
                    <Image
                      style={{ width: 100, height: 100 }}
                      source={{
                        uri: "https://cdn-icons-png.flaticon.com/128/6784/6784655.png",
                      }}
                    />
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 5,
                      marginVertical: 10,
                    }}
                  >
                    <Text>Completed Tasks</Text>
                    <MaterialIcons
                      name="arrow-drop-down"
                      size={24}
                      color="black"
                    />
                  </View>

                  {completedTodos?.map((item, index) => (
                    <Pressable
                      style={{
                        backgroundColor: "#E0E0E0",
                        padding: 10,
                        borderRadius: 7,
                        marginVertical: 10,
                      }}
                      key={index}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <FontAwesome name="circle" size={18} color="gray" />
                        <Text
                          style={{
                            flex: 1,
                            textDecorationLine: "line-through",
                            color: "gray",
                          }}
                        >
                          {item?.title}
                        </Text>
                        <Feather name="flag" size={20} color="gray" />
                      </View>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 130,
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              <Image
                style={{ width: 200, height: 200, resizeMode: "contain" }}
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/128/2387/2387679.png",
                }}
              />
              <Text
                style={{
                  fontSize: 16,
                  marginTop: 15,
                  fontWeight: "600",
                  textAlign: "center",
                }}
              >
                No Tasks for today! add a task
              </Text>
              <Pressable
                onPress={handleClose}
                style={{ marginTop: 15 }}
              >
                <AntDesign name="pluscircle" size={30} color="#007FFF" />
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
    >
      <BottomSheetView>
          <View style={{ padding: 20 }}>
            <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 10 }}>Add a todo</Text>

            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <TextInput
                value={todo}
                onChangeText={setTodo}
                placeholder="Input a new task here"
                style={{
                  padding: 10,
                  borderColor: "#E0E0E0",
                  borderWidth: 1,
                  borderRadius: 5,
                  flex: 1,
                }}
              />
              <Ionicons onPress={addTodo} name="send" size={24} color="#007FFF" />
            </View>

            <Text style={{ marginTop: 15 }}>Choose Category</Text>
            <View style={{ flexDirection: "row", gap: 10, marginVertical: 10 }}>
              {["Work", "Personal", "WishList"].map((cat) => (
                <Pressable
                  key={cat}
                  onPress={() => setCategory(cat)}
                  style={{
                    borderColor: "#E0E0E0",
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderWidth: 1,
                    borderRadius: 25,
                  }}
                >
                  <Text>{cat}</Text>
                </Pressable>
              ))}
            </View>

            <Text>Some suggestions</Text>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 10,
                marginVertical: 10,
              }}
            >
              {suggestions?.map((item, index) => (
                <Pressable
                  key={index}
                  onPress={() => setTodo(item?.todo)}
                  style={{
                    backgroundColor: "#F0F8FF",
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 25,
                  }}
                >
                  <Text>{item?.todo}</Text>
                </Pressable>
              ))}
            </View>
          </View>
       </BottomSheetView>
    </BottomSheet>
    </>
  );
};



export default index;

const styles = StyleSheet.create({});
