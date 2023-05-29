import React from "react";
import PropTypes from "prop-types";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";

import { useDispatch } from "react-redux";
import { subTaskDetail } from "../redux/reducers/subtaskReducer";

const SubtaskListCard = (props) => {
  const { item, horizontal, style, navigation } = props;
  const cardContainer = [styles.card, styles.shadow, style];
  const dispatch = useDispatch();

  const handleDetail = () => {
   
     dispatch(subTaskDetail(item));
  
     navigation.navigate("SUBTASK_DETAIL");
  };
  return (
    <View row={horizontal} card style={cardContainer}>
      <TouchableOpacity onPress={handleDetail}>
        <View space="between" style={styles.cardDescription}>
          <Text size={20} style={styles.taskName}>
            {item.taskName?.toUpperCase()}
          </Text>
          <View
            style={{
              height: 1,
              width: "100%",
              backgroundColor: "#C8C8C8",
            }}
          />
          <Text size={14} style={styles.cardTitle}>
            {item.description}
          </Text>
          <Text size={14} style={styles.cardTitle}>
            {item.taskDate}
          </Text>
          <Text size={14} style={styles.cardTitle}>
            Created By {item.createdBy.fullName}
          </Text>
          <View
            style={
              item.status === "inProgress"
                ? styles.progress
                : item.status === "pending"
                  ? styles.pending
                  : styles.completed
            }
          >
            <Text
              style={
                item.status === "inProgress"
                  ? styles.blackText
                  : styles.whiteText
              }
            >
              {item.status === "inProgress"
                ? "IN PROGRESS"
                : item.status === "pending"
                  ? "PENDING"
                  : "COMPLETED"}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

SubtaskListCard.propTypes = {
  item: PropTypes.object,
  horizontal: PropTypes.bool,
  full: PropTypes.bool,
  ctaColor: PropTypes.string,
  imageStyle: PropTypes.any,
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    marginVertical: 10,
    borderWidth: 0,
    minHeight: 114,
    marginBottom: 0,
  },
  taskName: {
    flex: 1,
    flexWrap: "wrap",
    paddingBottom: 6,
    fontSize: 20,
    fontWeight: "bold",
  },
  cardTitle: {
    flex: 1,
    flexWrap: "wrap",
    paddingBottom: 6,
    fontSize: 16,
  },
  cardDescription: {
    padding: 10,
  },
  imageContainer: {
    borderRadius: 3,
    elevation: 1,
    overflow: "hidden",
  },
  horizontalImage: {
    height: 122,
    width: "auto",
  },
  horizontalStyles: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  verticalStyles: {
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
  },
  shadow: {
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 2,
  },
  button: {
    backgroundColor: "#1D3557",
    width: "25%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 10,
    padding: 5,
  },
  btnText: {
    color: "white",
    fontSize: 15,
    textAlign: "center",
  },
  whiteText: {
    color: "#FFF",
  },
  blackText: {
    color: "#000",
  },
  progress: {
    backgroundColor: "#A8DADC",
    width: "40%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  pending: {
    backgroundColor: "#456149",
    width: "40%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  completed: {
    backgroundColor: "#1D3557",
    width: "40%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
});

export default SubtaskListCard;
