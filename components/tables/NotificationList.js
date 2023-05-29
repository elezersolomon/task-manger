import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Text,
} from "react-native";
import moment from "moment-timezone";
import API from "../../api";
import NotificationListCard from "../NotificationListCard";

const NotificationList = ({ navigation }) => {
  const [notifications, setNotifications] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(true);
  const { getData } = API();

  useEffect(() => {
    fetchNotifications();
    setTimeout(() => {
      fetchNotifications();
    }, 120000);
  }, []);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      var { result } = await getData("notification");
      const notifications = result.map((notification) => {
        return {
          id: notification.id,
          message: notification.message,
          time: moment
            .tz(notification.createdAt, "Africa/Addis_Ababa")
            .fromNow(),
        };
      });
      setNotifications(notifications);
    } catch (error) {
  
    }
    setIsLoading(false);
    setRefreshing(false);
  };

  const ItemView = ({ item }) => {
    return (
      <View style={styles.task}>
        <NotificationListCard item={item} />
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
      ) : notifications.length === 0 ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>No Notifications</Text>
        </View>
      ) : (
        <ScrollView>
          {refreshing ? <ActivityIndicator /> : null}
          <FlatList
            style={styles.tasks}
            data={notifications}
            keyExtractor={(item, index) => index.toString()}
            enableEmptySections={true}
            renderItem={ItemView}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={console.log("")}
              />
            }
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
    height: "100%",
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

export default NotificationList;
