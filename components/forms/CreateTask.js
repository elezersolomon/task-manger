import React, { useState, useEffect } from "react";
import { StyleSheet, View, Picker, TextInput } from "react-native";
import { Button } from "react-native-paper";
import DatePicker from "react-native-datepicker";
import API from "../../api";
import { setStatusBarBackgroundColor } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { dbFind, dbPost } from "../../backend/home"

const CreateTask = ({ setVisible, notify, setNotify, fetchTasks }) => {


  const [formValue, setFormValue] = useState({

    type: "task",
    taskType: "mainTask",
    parentTaskId: "",
    allParentTaskIds: [],
    allChildTaskIds: [],
    taskName: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "inProgress",
    taskProgress: {
      subtaskCount: 0,
      completedSubtaskCount: 0,
      totalProgress: 0
    },
    priority: "",
    isTaskDelegated: true,
    isTaskArchived: false,
    isTaskRepeating: false,
    taskRepetitionInterval: "",
    isReminderEnabled: false,
    reminderDate: "",
    tag: {
      id: "",
      color: ""
    },
    assignedTo: {
      id: "",
      fullName: "",
      role: [
        ""
      ]
    },
    approvedBy: {
      id: "",
      fullName: "",
      role: ""
    },
    createdBy: {
      id: "",
      fullName: "",
      avatar: ""
    },
    createdAt: {
      timestamp: 1644477940052,
      stringDate: "2022/2/10",
      isoStringDate: "2022-02-10T07:25:40.052Z"
    }
  });

  var userData = AsyncStorage.getItem("userData").then((value) => {
    var userData = JSON.parse(value)
    formValue.createdBy.id = userData.id
  }
  )


  const [participantNames, setParticipantNames] = useState([]);

  // const { getData, postData } = API();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      var result = await dbFind({ query: { type: "user" } })

      let users = result.map((user) => {
        return (
          <Picker.Item key={user.id} label={user.fullName} value={user.id} />
        );
      });
      setParticipantNames(users);
    } catch (error) {
      console.log("Unable to Fetch Users!", error);
    }
  };

  const createTask = async () => {


    await dbPost(formValue)
      .then((res) => {
        fetchTasks()
        setNotify({
          isOpen: true,
          message: "Task Created Successfully",
          severity: "success",
        });

      })
      .catch((err) => {
        console.log("create_task_error", err); //TODO: remove this line
      });
    setVisible(false);
  };

  return (
    <View>
      <View style={styles.containerStyle}>
        <Picker
          mode="dropdown"
          selectedValue={formValue.assignedTo}
          style={{ height: 50, width: "100%" }}
          onValueChange={(value) =>
            setFormValue({ ...formValue, assignedTo: { ...formValue.assignedTo, id: value } })
          }
        >
          {participantNames}
        </Picker>
      </View>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setFormValue({ ...formValue, taskName: text })}
        value={formValue.taskName}
        placeholder="Task"
      />
      <TextInput
        style={styles.input}
        onChangeText={(text) =>
          setFormValue({ ...formValue, description: text })
        }
        value={formValue.description}
        placeholder="Description"
        multiline
        numberOfLines={4}
      />
      <DatePicker
        placeholder="Start Date"
        style={styles.datePickerStyle}
        date={formValue.startDate}
        mode="date"
        format="YYYY-MM-DD"
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        customStyles={{
          dateInput: {
            color: "#000",
            borderWidth: 1,
            borderRadius: 4,
            borderColor: "#000",
            alignItems: "flex-start",
            padding: 10,
            height: 60,
          },
          dateIcon: {
            position: "absolute",
            left: "85%",
            top: 4,
            alignItems: "flex-end",
          },
        }}
        onDateChange={(date) => setFormValue({ ...formValue, startDate: date })}
      />
      <DatePicker
        placeholder="End Date"
        style={styles.datePickerStyle}
        date={formValue.endDate}
        mode="date"
        format="YYYY-MM-DD"
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        customStyles={{
          dateInput: {
            borderWidth: 1,
            borderRadius: 4,
            borderColor: "#000",
            alignItems: "flex-start",
            padding: 10,
            height: 55,
          },
          dateIcon: {
            position: "absolute",
            left: "85%",
            top: 4,
            alignItems: "flex-end",
          },
        }}
        onDateChange={(date) => setFormValue({ ...formValue, endDate: date })}
      />
      <View style={{ marginTop: 15 }}>
        <Button
          style={{ width: "50%" }}
          mode="outlined"
          // onPress={() => console.log(formValue)}
          onPress={createTask}
        >
          SUBMIT
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  datePickerStyle: {
    width: "100%",
    marginTop: 10,
    marginBottom: 10,
    paddingBottom: 10,
  },
  containerStyle: {
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 4,
  },
  input: {
    width: "100%",
    height: 55,
    marginBottom: 10,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
});

export default CreateTask;
