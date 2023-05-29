import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, FlatList, ActivityIndicator, } from "react-native";
import { Text } from "react-native-paper";
import moment from "moment";
import API from "../api";
import { dbFind } from "../backend/home"
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ItemView = ({ item }) => {
  return (
    <View style={styles.task}>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <View style={{ width: "90%" }}>
          <View style={{ padding: 5 }}>
            <Text size={20}>{item.taskName}</Text>
          </View>
          <View style={{ padding: 5 }}>
            <Text
              size={20}
              style={{
                flex: 1,
                flexWrap: "wrap",
                fontSize: 12,
              }}
            >
              {item.taskDate}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default function HomeScreen() {
  const user = useSelector((state) => state.user.value);

  const { getData } = API();
  const [counts, setCounts] = useState({});
  const [taskData, setTaskData] = useState({
    page: 0,
    tasks: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   setTimeout(() => {
  //     taskCounts();
  //     fetchTasks();
  //     addRecords(0);
  //   }, 2000);
  // }, []);

  const addRecords = (page) => {
    if (taskData.tasks) {
      const newRecords = [];
      for (
        var i = page * 12, il = i + 12;
        i < il && i < taskData.tasks.length;
        i++
      ) {
        newRecords.push(taskData.tasks[i]);
      }
      setTaskData({
        tasks: [...taskData.tasks, ...newRecords],
      });
    }
  };

  const taskCounts = async () => {
    try {
      const { result: totalTasks } = await getData("task");
      const { result: inProgress } = await getData(
        "task?status=inProgress&isTaskArchived=false"
      );
      const { result: completed } = await getData(
        "task?status=completed&isTaskArchived=false"
      );
      const { result: pending } = await getData(
        "task?status=pending&isTaskArchived=false"
      );
      const { result: archived } = await getData("task?isTaskArchived=true");
      setCounts({
        totalTasks: totalTasks.length,
        inProgress: inProgress.length,
        completed: completed.length,
        pending: pending.length,
        archived: archived.length,
      });
    } catch (error) {
      console.log("consoleData_countError", error);
    }
  };

  const fetchTasks = async () => {
    setIsLoading(true)
    var userData = await AsyncStorage.getItem("userData")
    userData = JSON.parse(userData)
    try {
      var result = await dbFind( { query: {  taskType: "mainTask",
      "createdBy.id": userData.id,
      "assignedTo.id": userData.id,}, user: user.token });
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
      setTaskData({ tasks: result });

    } catch (error) {
      console.log("Unable to Fetch Tasks!", error);
    }
    setIsLoading(false);
  };

  const onScrollHandler = () => {
    // setTaskData(
    //   {
    //     page: taskData.page + 1,
    //   },
    //   () => {
    //     addRecords(taskData.page);
    //   }
    // );
  };
  useEffect(() => {
    // setTimeout(() => {
      // taskCounts();
      fetchTasks();
      // addRecords(0);
    // }, 3000);
  }, []);
  return (
    <View
      style={{
        flex: 1,
        height: "100%",
      }}
    >
      <View style={styles.dashboardCards}>
        <View style={styles.dashboardCard}>
          <Text style={styles.dashboardCardNumbers}>{counts.totalTasks}</Text>
          <Text style={styles.dashboardCardTitles}>TOTAL TASKS</Text>
        </View>
        <View style={styles.dashboardCard}>
          <Text style={styles.dashboardCardNumbers}>{counts.inProgress}</Text>
          <Text style={styles.dashboardCardTitles}>IN PROGRESS</Text>
        </View>
      </View>
      <View style={styles.dashboardCards}>
        <View style={styles.dashboardCard}>
          <Text style={styles.dashboardCardNumbers}>{counts.completed}</Text>
          <Text style={styles.dashboardCardTitles}>COMPLETED</Text>
        </View>
        <View style={styles.dashboardCard}>
          <Text style={styles.dashboardCardNumbers}>{counts.pending}</Text>
          <Text style={styles.dashboardCardTitles}>PENDING</Text>
        </View>
        <View style={styles.dashboardCard}>
          <Text style={styles.dashboardCardNumbers}>{counts.archived}</Text>
          <Text style={styles.dashboardCardTitles}>ARCHIVED</Text>
        </View>
      </View>
      <View style={styles.otherContent}>
        <Text style={{ marginBottom: 10, fontSize: 18 }}>Recent Tasks</Text>
        <ScrollView>
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
        ) : taskData.tasks ?
      //   <FlatList
//             style={styles.tasks}
//             data={taskData.tasks}
//             keyExtractor={(item, index) => index.toString()}
//             enableEmptySections={true}
//             renderItem={ItemView}
//             onEndReached={onScrollHandler}
//             onEndThreshold={0}
        //  /> 

      
     
  taskData.tasks.map((task)=>{
return (
    <View
    style={{
      backgroundColor: "gray",
      padding: 10,
      paddingBottom:5,
      borderRadius: 10,
      margin: 2,
    }}
    >
   <Text style={{
     fontSize :20,
   }}>
     {task.taskName}
   </Text>
     <Text>
     {task.taskDate}
     
   </Text>
   </View>
)
  })

     : null}

        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  task: {
    backgroundColor: "#E1E0E2",
    borderWidth: 0,
    marginBottom: 0,
    padding: 5,
    borderRadius: 10,
  },
  dashboardCards: {
    flexDirection: "row",
    justifyContent: "center",
  },
  dashboardCard: {
    flexGrow: 1,
    elevation: 5,
    padding: 5,
    margin: 10,
    height: 120,
    backgroundColor: "#FEFEFE",
    borderRadius: 10,
  },
  dashboardCardTitles: {
    fontSize: 14,
    padding: 10,
    bottom: 0,
    right: 0,
    position: "absolute",
  },
  dashboardCardNumbers: {
    fontSize: 40,
    padding: 10,
  },
  otherContent: {
    height: "58%",
    borderStyle: "solid",
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#FEFEFE",
  },
});
