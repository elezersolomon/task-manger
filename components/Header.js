import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Header = ({ title }) => {
  return (
    <View>
      <Text style={styles.text}>{title}</Text>
    </View>
  );
};

Header.defaultProps = {
  title: "TASK MANAGER",
};

const styles = StyleSheet.create({
  text: {
    color: "white",
    fontSize: 25,
    textAlign: "left",
  },
});

export default Header;
