import * as React from "react";
import { StyleSheet } from "react-native";
import { FAB } from "react-native-paper";

const PaperFAB = ({ icon, onPress }) => (
  <FAB style={styles.fab} icon={icon} onPress={onPress} />
);

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 15,
    right: 0,
    bottom: 0,
    backgroundColor: "#1D3557",
    elevation: 0,
  },
});

export default PaperFAB;
