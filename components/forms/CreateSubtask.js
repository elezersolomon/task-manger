import React, { useState, useEffect } from "react";
import { StyleSheet, View, Picker, TextInput } from "react-native";
import { Button } from "react-native-paper";
import DatePicker from "react-native-datepicker";
import API from "../../api";
import { useSelector } from "react-redux";
import { dbSave,dbget, dbUpdate, dbFind, dbPost, findItemById, updateTask } from "../../backend/home"
import AsyncStorage from "@react-native-async-storage/async-storage";
const CreateSubtask = ({ setVisible, setNotify, parentTaskData }) => {
  const [formValue, setFormValue] = useState({
    type: "task",
    taskType: "subTask",
    parentTaskId: parentTaskData.id,
    allParentTaskIds: [],
    allChildTaskIds: [],
    taskName: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "inProgress",
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
      fullName: ""
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
    }
  });
  const si =
  {
  }
  AsyncStorage.getItem("userData").then((value) => {
    var userData = JSON.parse(value)
    formValue.createdBy.id = userData.id
  })
  const [participantNames, setParticipantNames] = useState([]);
  const task = useSelector((state) => state.task.value);


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
    } r
  };

  const createSubtask = async () => {
    await dbPost(formValue)
      // fetchTasks()
      .then(async (res) => {
        var mainTask = await dbget( parentTaskData.id);
         mainTask.allChildTaskIds.push(res.id)
      
        await dbUpdate(mainTask)
        setNotify({
          isOpen: true,
          message: "Subtask Created Successfully",
          severity: "success",
        });
        setVisible(false);
      })
      .catch((err) => {
        console.log("create_task_error", err); //TODO: remove this line
      });
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
        value={formValue.name}
        placeholder="Subtask"
      />
      <TextInput
        style={styles.input}
        onChangeText={(text) =>
          setFormValue({ ...formValue, description: text })
        }
        value={formValue.description}
        placeholder="Description (optional)"
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
          style={{ width: "30%", backgroundColor: "#1D3557" }}
          mode="outlined"
          color="#FFF"
          onPress={createSubtask}
        >
          create
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

export default CreateSubtask;
