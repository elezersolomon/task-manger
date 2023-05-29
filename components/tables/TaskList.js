import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import API from "../../api";
import TaskListCard from "../TaskListCard";
// import makeDbSetup from "../../backend/pouchConfig"
// export const db = makeDbSetup("db")



const TaskList = ({ navigation, notify , refetchTasks,setRefetchTasks,fetchTasks,isLoading,taskData }) => {

  const ItemView = ({ item }) => {
    return (
      <View style={styles.task}>
        <TaskListCard navigation={navigation} item={item} horizontal />
      </View>
    );
  };

  return (
    <View center style={styles.container}>
      {isLoading ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color="#1D3557" />
        </View>
      ) : (
        <ScrollView>
          <FlatList
            style={styles.tasks}
            data={taskData}
            keyExtractor={(item, index) => index.toString()}
            enableEmptySections={true}
            renderItem={ItemView}
          />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  tasks: {
    width: "100%",
  },
  task: {
    paddingBottom: 10,
  },
  container: {
    height: "90%",
    width: "100%",
    backgroundColor: "#FFF",
  },
  btnText: {
    color: "white",
    fontSize: 15,
    textAlign: "center",
  },
  taskName: {
    fontSize: 25,
    fontWeight: "bold",
    paddingBottom: 5,
  },
  description: {
    fontSize: 20,
    paddingBottom: 5,
  },
  itemText: {
    paddingBottom: 5,
  },
  whiteText: {
    color: "#FFF",
  },
  blackText: {
    color: "#000",
  },
  progress: {
    backgroundColor: "#A8DADC",
    width: "30%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  pending: {
    backgroundColor: "#456149",
    width: "30%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  completed: {
    backgroundColor: "#1D3557",
    width: "30%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
});

export default TaskList;
