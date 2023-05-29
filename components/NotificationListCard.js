import React from "react";
import PropTypes from "prop-types";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";

import { useDispatch } from "react-redux";
import { taskDetail } from "../redux/reducers/taskReducer";
import { IconButton, Colors } from "react-native-paper";

const NotificationListCard = (props) => {
  const { item, horizontal, style, navigation } = props;
  const cardContainer = [styles.card, styles.shadow, style];
  const dispatch = useDispatch();

  const handleDetail = () => {
    dispatch(taskDetail(item));
    navigation.navigate("DETAIL");
  };
  return (
    <View row={horizontal} card style={cardContainer}>
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
          <View style={styles.cardDescription}>
            <Text size={20} style={styles.notificationMain}>
              {item.message}
            </Text>
          </View>
          <View style={styles.timeMain}>
            <Text size={20} style={styles.time}>
              {item.time}
            </Text>
          </View>
        </View>
        <View>
          <IconButton
            icon="close"
            size={20}
            onPress={() => console.log(item.id)}
            color="#1D3557"
            style={{ backgroundColor: "#A8DADC" }}
          />
        </View>
      </View>
    </View>
  );
};

NotificationListCard.propTypes = {
  item: PropTypes.object,
  horizontal: PropTypes.bool,
  full: PropTypes.bool,
  ctaColor: PropTypes.string,
  imageStyle: PropTypes.any,
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderWidth: 0,
    marginBottom: 0,
    padding: 5,
  },
  notificationMain: {
    flex: 1,
    flexWrap: "wrap",
    fontSize: 16,
  },
  timeMain: {
    position: "relative",
    bottom: 0,
    paddingLeft: 5,
  },
  time: {
    flex: 1,
    flexWrap: "wrap",
    fontSize: 12,
  },
  cardTitle: {
    flex: 1,
    flexWrap: "wrap",
    paddingBottom: 6,
    fontSize: 16,
  },
  cardDescription: {
    padding: 5,
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
});

export default NotificationListCard;
