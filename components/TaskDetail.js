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
import { dbUpdate, dbFind, dbQuery } from "../backend/home"
import SnackBar from "react-native-snackbar-component";
import AsyncStorage from "@react-native-async-storage/async-storage";

const status = "inProgress";

const TaskList = ({ navigation }) => {
  const [taskData, setTaskData] = useState({});
  // const [task, setTask] = useState({})
  const [visible, setVisible] = useState(false);
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    severity: "",
  });
  const [userData, setUserData] = useState({

  })
  const task = useSelector((state) => state.task.value);

  const user = useSelector((state) => state.user.value);


  const { getData } = API();

  useEffect(() => {
    const fetchTasks = async () => {
      var userData = await AsyncStorage.getItem("userData")
      userData = JSON.parse(userData)
      await setUserData(userData)


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

  const findSubTasks = async ({ parameter }) => {
    var mainTask = await dbFind({ query: { type: "task", _id: parameter.id } });


    var childTaskIds = mainTask[0].allChildTaskIds;
    var query = { type: "task", $or: [] };

    for (var j = 0; j < childTaskIds.length; j++) {
      var childTaskId = childTaskIds[j];
      query.$or.push({ _id: childTaskId });
    }


    var subtasks = await dbFind({ query: query })

    var subtaskList = [];
    for (var k = 0; k < subtasks.length; k++) {
      var subtask = subtasks[k];
      var newSubtask = { id: subtask._id, ...subtask };
      // delete newSubtask._id;
      // delete newSubtask._rev;
      subtaskList.push(newSubtask);
    }

    return subtaskList;
  };

  const checkSubTasks = async ({ task }) => {

    var subTasks = await findSubTasks({ parameter: { id: task.id } });

    var status = false;
    if (subTasks.length > 0) {
      for (var i = 0; i < subTasks.length; i++) {
        var subTask = subTasks[i];
        if (subTask.status !== "completed") {
          status = true;
        }
      }
    }

    return status;
  };


  const completeTask = async ({ formertask }) => {

    var task = { ...formertask }
    task.tag.id = 100
    var checkSubtasks = await checkSubTasks({ task });
    if (checkSubtasks) {

      // throw new Error("Task has subtasks which are not completed yet!");
      setNotify({
        isOpen: true,
        message: "Task has subtasks which are not completed yet!",
        severity: "error",
      })
    }
    else if (task.taskType === "mainTask") {
      if (task.allChildTaskIds.length === 0) {
        try {
          task.taskProgress.totalProgress = 100;
        }
        catch (e) { console.log('consoleData_error', e) }

      }

      if (task.isTaskDelegated && task.assignedTo.id === task.createdBy.id) {

        task.status = "completed";
      } else if (
        task.isTaskDelegated &&
        task.assignedTo.id !== task.createdBy.id
      ) {
        task.status = "pending";
      }
      taskarray = {};

      var taskarray = { _id: task.id, ...task };
      delete taskarray.id;


      var result = await dbUpdate(taskarray);

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

    // else if (task.taskType === "subTask") {
    //   var mainTask = await findItemById({
    //     id: task.parentTaskId,
    //     type: "task",
    //   });


    //   if (task.isTaskDelegated && task.assignedTo.id === task.createdBy.id) {
    //     task.status = "completed";
    //     mainTask.taskProgress.completedSubtaskCount++;
    //     mainTask.taskProgress.totalProgress =
    //       (mainTask.taskProgress.completedSubtaskCount * 100) /
    //       mainTask.taskProgress.subtaskCount;
    //     await db.update(mainTask);
    //   } else if (
    //     task.isTaskDelegated &&
    //     task.assignedTo.id !== task.createdBy.id
    //   ) {
    //     task.status = "pending";
    //   }
    //   var result = await db.update(task);
    //   var updatedTask = { id: result._id, ...result };
    //   delete updatedTask._id;
    //   delete updatedTask._rev;
    //   return updatedTask;
    // }
  };



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
  } else if (userData.id) {
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
                completeTask(
                  { formertask: { ...task } })
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
                  completeTask(
                    { formertask: { ...task } })
                }}
              >
                COMPLETE
              </Button>
            ) : null}
          <Button
            style={{
              marginTop: 15,
              marginRight: 10,
              marginLeft: 10,
              width: "40%",
              backgroundColor: "#1D3557",
            }}
            mode="filled"
            icon="plus"
            color="#FFF"
            onPress={() => setVisible(true)}
          >
            SUBTASK
          </Button>
        </View>
        <View
          style={{
            height: 2,
            width: "85%",
            backgroundColor: "#313135",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: "7.5%",
            marginTop: 15,
          }}
        />
        <View center style={styles.subtaskContainer}>
          <ScrollView>
            <FlatList
              style={styles.tasks}
              data={taskData}
              keyExtractor={(item, index) => index.toString()}
              enableEmptySections={true}
              renderItem={ItemView}
            />
          </ScrollView>
        </View>
        <PaperModal
          title="CREATE SUBTASK"
          visible={visible}
          setVisible={setVisible}
          notify={notify}
          setNotify={setNotify}
        >
          <CreateSubtask
            parentTaskData={task}
            setVisible={setVisible}
            notify={notify}
            setNotify={setNotify}
          />
        </PaperModal>
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
  else {
    return (<View></View>)
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

export default TaskList;
