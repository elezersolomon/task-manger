import React from "react";
import { Text, StyleSheet, View, FlatList } from "react-native";
import NotificationList from "../components/tables/NotificationList";

export default function Dashboard() {
  return (
    <View style={styles.root}>
      <View style={styles.tableView}>
        <NotificationList />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    height: "100%",
    width: "100%",
    alignItems: "center",
    backgroundColor: "#E1E0E2",
  },
  tableView: {
    backgroundColor: "#FFF",
    width: "100%",
    height: "100%",
  },
  button: {
    marginHorizontal: 5,
  },
});
