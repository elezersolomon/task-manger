import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
} from "react-native";
import { Button } from "react-native-paper";
import TextAvatar from "react-native-text-avatar";
import moment from "moment";
import API from "../api";
import PaperModal from "../components/PaperModal";
import Notification from "../components/Notification";
import CreateSubtask from "./forms/CreateSubtask";
import { useSelector } from "react-redux";
import SubtaskListCard from "./SubtaskListCard";
import { dbFind, dbPost, dbUpdate } from "../backend/home"
import SnackBar from "react-native-snackbar-component";
import { subTaskSlice } from "../redux/reducers/taskReducer";
import AsyncStorage from "@react-native-async-storage/async-storage";

const status = "inProgress";
const SubtaskDtail = ({ navigation }) => {

  const [taskData, setTaskData] = useState({});
  const [visible, setVisible] = useState(false);
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    severity: "",
  });
  const [userData, setUserData] = useState({

  })

  const task = useSelector((state) => state.subtask.value);
  // const task = useState({})
  const { getData } = API();
  useEffect(() => {

    const fetchTasks = async () => {
      var userData = await AsyncStorage.getItem("userData")
      userData = JSON.parse(userData)
      setUserData(userData)
      try {
        var result = await dbFind({ query: { taskType: "subTask", parentTaskId: task.id } })

        if (result.length > 0) {
          result.map((task) => {
            task.id = task.id;
            task.taskName = task.taskName;
            task.taskDate =
              moment(task.startDate).format("MMM d, yyyy") +
              " - " +
              moment(task.endDate).format("MMM d, yyyy");
            return task;
          });
        }
        setTaskData(result);
      } catch (error) {
        console.log("Unable to Fetch Tasks!", error);
      }
    };
    fetchTasks();
  }, [notify]);


  const completeSubTask = async ({ task }) => {

    if (task.taskType === "subTask") {

      var mainTask = await dbFind({ query: { taskType: "mainTask", _id: "01802ba2-c3fd-4c19-8669-5b1b93ce457d" } })
      mainTask = mainTask[0]


      if (task.isTaskDelegated && task.assignedTo.id === task.createdBy.id) {

        task.status = "completed";
        setNotify({
          isOpen: true,
          message: "Task Completed!",
          severity: "success",
        })

        mainTask.taskProgress.completedSubtaskCount++;

        mainTask.taskProgress.totalProgress =
          (mainTask.taskProgress.completedSubtaskCount * 100) /
          mainTask.taskProgress.subtaskCount;
        mainTask._id = mainTask.id
        delete mainTask.id

        await dbUpdate(mainTask);
      } else if (
        task.isTaskDelegated &&
        task.assignedTo.id !== task.createdBy.id
      ) {
        task.status = "pending";
      }
    
      task._id = task.id
      delete task.id
      var result = await dbUpdate(task);
      setNotify({
        isOpen: true,
        message: "Task Completed!",
        severity: "success",
      })
      var updatedTask = { id: result._id, ...result };
      delete updatedTask._id;
      delete updatedTask._rev;
      return updatedTask;
    }
  }


  const ItemView = ({ item }) => {
    return (
      <View style={styles.task}>
        <SubtaskListCard navigation={navigation} item={item} horizontal />
      </View>
    );
  };

  if (task.length === 0) {
    return (
      <View style={styles.container}>
        <Text>No Task</Text>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.textTitle}>{task.taskName}</Text>
          <Text style={styles.textBody}>{task.description}</Text>
          <View
            style={{
              height: 2,
              backgroundColor: "#A8DADC",
              marginTop: 15,
            }}
          />
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                marginTop: 15,
                marginRight: 30,
                marginLeft: 30,
              }}
            >
              <Text>ASSIGNED TO</Text>
              <View style={{ marginTop: 10, marginBottom: 5 }}>
                <TextAvatar
                  backgroundColor={"#1D3557"}
                  textColor={"#A8DADC"}
                  size={60}
                  type={"circle"}
                >
                  {task.assignedTo.fullName}
                </TextAvatar>
              </View>
              <Text>{task.taskDate}</Text>
              <View
                style={
                  status === "inProgress"
                    ? styles.progress
                    : status === "pending"
                      ? styles.pending
                      : styles.completed
                }
              >
                <Text
                  style={
                    status === "inProgress"
                      ? styles.blackText
                      : styles.whiteText
                  }
                >
                  {status === "inProgress"
                    ? "IN PROGRESS"
                    : status === "pending"
                      ? "PENDING"
                      : "COMPLETED"}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 10,
          }}
        >

          {userData?.id == task.createdBy.id &&
            task.createdBy.id !== task?.assignedTo.id ? (
            <Button
              style={{
                marginTop: 15,
                marginRight: 10,
                marginLeft: 10,
                width: "40%",
              }}
              mode="outlined"
              icon="plus"
              onPress={() => {
                completeSubTask(
                  { formertask: task })
              }}
            >
              APPROVE
            </Button>
          ) : userData?.id == task.assignedTo.id ?
            (
              <Button
                style={{
                  marginTop: 15,
                  marginRight: 10,
                  marginLeft: 10,
                  width: "40%",
                }}
                mode="outlined"
                icon="plus"
                onPress={() => {

                  completeSubTask({ task: { ...task } })
                }}
              >
                COMPLETE
              </Button>
            ) : null}


        </View>
        <Notification notify={notify} setNotify={setNotify} />
        {/* <SnackBar
          visible={notify.isOpen}
          textMessage={notify.message}
          autoHidingTime={3000}
          backgroundColor="#357A38"
          messageColor="#FFF"
        /> */}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    backgroundColor: "#FFF",
    padding: 10,
  },
  tasks: {
    width: "100%",
  },
  task: {
    paddingBottom: 10,
  },
  subtaskContainer: {
    marginTop: 10,
    height: "45%",
    width: "100%",
    backgroundColor: "#FFF",
  },
  card: {
    width: "100%",
    backgroundColor: "#F1FAEE",
    paddingTop: 15,
    paddingBottom: 15,
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: "#A8DADC",
  },
  textTitle: {
    paddingLeft: 10,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 20,
    fontWeight: "bold",
  },
  textBody: {
    paddingLeft: 30,
    fontSize: 18,
  },
  footer: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  loadMoreBtn: {
    position: "absolute",
    backgroundColor: "#1D3557",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    padding: 10,
    margin: 15,
    right: 0,
    top: 0,
  },
  btnText: {
    color: "white",
    fontSize: 15,
    textAlign: "center",
  },
  item: {
    padding: 10,
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
    paddingLeft: 20,
    paddingRight: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    marginTop: 15,
    height: 25,
    width: "100%",
  },
  pending: {
    backgroundColor: "#456149",
    width: "30%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    marginTop: 15,
    height: 25,
    width: "100%",
  },
  completed: {
    backgroundColor: "#1D3557",
    width: "30%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    marginTop: 15,
    height: 25,
    width: "100%",
  },
});

export default SubtaskDtail;
