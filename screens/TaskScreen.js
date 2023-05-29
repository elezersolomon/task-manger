import React, { useEffect, useState } from "react";
import { Text, StyleSheet, View, FlatList } from "react-native";
import { Button, Searchbar } from "react-native-paper";
import TaskList from "../components/tables/TaskList";
import CreateTask from "../components/forms/CreateTask";
import PaperFAB from "../components/PaperFAB";
import PaperModal from "../components/PaperModal";
import Notification from "../components/Notification";
import { dbFind } from "../backend/home"
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function TaskScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [visible, setVisible] = useState(false);
  const [refetchTasks, setRefetchTasks] = useState(true);
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    severity: "",
  });
  const [taskDetails, setTaskDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const FILTERS = [
    {
      id: "myTasks",
      title: "MY TASKS",
    },
    {
      id: "approval",
      title: "APPROVAL",
    },
    {
      id: "delegated",
      title: "DELEGATED",
    },

  ];
  const [taskData, setTaskData] = useState([]);



  useEffect(() => {
    setTimeout(async () => {
      await fetchTasks();
    }, 3000);
  }, [notify]);
  const fetchTasks = async () => {
    setIsLoading(true);

    var userData = await AsyncStorage.getItem("userData")

    userData = JSON.parse(userData)

    try {
      var result = await dbFind({
        query: {
          taskType: "mainTask",
          "createdBy.id": userData.id,
          "assignedTo.id": userData.id,
        }, user: userData
      });

      // var { result } = await getData("task");
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
      setIsLoading(false);
    } catch (error) {
      console.log("Unable to Fetch Tasks!", error);
    }
  };
  const renderItem = ({ item }) => (
    <Button style={styles.button} mode="outlined">
      {item.title}
    </Button>
  );

  const onChangeSearch = (query) => setSearchQuery(query);

  //   componentWillMount () {
  //     var data = this.getData();
  //     this.setState({data : data});
  // }
  return (

    <View style={styles.root}>

      <View style={styles.search}>
        <Searchbar
          placeholder="Search"
          onChangeText={onChangeSearch}
          value={searchQuery}
        />
      </View>
      <View style={styles.filter}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={true}
          data={FILTERS}
          renderItem={renderItem}
          keyExtractor={(item) => {
          }}
        />
      </View>
      <View style={styles.tableView}>

        <TaskList
          isLoading={isLoading}
          taskData={taskData}
          fetchTasks={fetchTasks}
          setRefetchTasks={setRefetchTasks}
          refetchTasks={refetchTasks}
          navigation={navigation}
          taskDetails={taskDetails}
          setTaskDetails={setTaskDetails}
          notify={notify}
        />
      </View>
      <PaperFAB icon="plus" onPress={() => setVisible(true)} />
      <PaperModal
        title="CREATE TASK"
        visible={visible}
        setVisible={setVisible}
        notify={notify}
        setNotify={setNotify}
      >
        <CreateTask
          fetchTasks={fetchTasks}
          setRefetchTasks={setRefetchTasks}
          setVisible={setVisible}
          notify={notify}
          setNotify={setNotify}
        />
      </PaperModal>
      <Notification notify={notify} setNotify={setNotify} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    height: "100%",
    width: "100%",
    alignItems: "center",
    backgroundColor: "#E1E0E2",
    paddingTop: 10,
    paddingBottom: 10,
  },
  search: {
    width: "95%",
    alignItems: "center",
    backgroundColor: "#E1E0E2",
    paddingTop: 10,
    paddingBottom: 10,
  },
  filter: {
    backgroundColor: "#FFF",
    width: "95%",
    padding: 10,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tableView: {
    backgroundColor: "#FFF",
    width: "95%",
    marginTop: 10,
  },
  button: {
    marginHorizontal: 5,
  },
});
