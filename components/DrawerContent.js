import React from "react";
import { View, StyleSheet } from "react-native";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { Avatar, Caption, Drawer, Title } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useDispatch } from "react-redux";
import { logout } from "../redux/reducers/userReducer";
import AsyncStorage from "@react-native-async-storage/async-storage";

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: "bold",
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  paragraph: {
    fontWeight: "bold",
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: "#f4f4f4",
    borderTopWidth: 1,
  },
  preference: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});

async function removeItemValue(key) {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (exception) {
    return false;
  }
}

export default function DrawerContent(props) {
  const dispatch = useDispatch();

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <Drawer.Section>
            <View style={styles.userInfoSection}>
              <View style={{ flexDirection: "row", marginTop: 15 }}>
                <Avatar.Image
                  source={require("../assets/logo.png")}
                  size={50}
                />
                <View style={{ marginLeft: 15, flexDirection: "column" }}>
                  <Title style={styles.title}>Full Name</Title>
                  <Caption style={styles.caption}>Role</Caption>
                </View>
              </View>
            </View>
          </Drawer.Section>
          <Drawer.Section style={styles.drawerSection}>
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name="home-outline" color={color} size={size} />
              )}
              label="HOME"
              onPress={() => {
                props.navigation.navigate("HOME");
              }}
            />
            <DrawerItem
              icon={({ focused, color, size }) => (
                <Icon
                  name={focused ? "view-list" : "view-list-outline"}
                  color={color}
                  size={size}
                />
              )}
              label="TASKS"
              onPress={() => {
                props.navigation.navigate("TASKS");
              }}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name="bell-ring-outline" color={color} size={size} />
              )}
              label="NOTIFICATIONS"
              onPress={() => {
                props.navigation.navigate("NOTIFICATIONS");
              }}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name="cog-outline" color={color} size={size} />
              )}
              label="SETTINGS"
            />
          </Drawer.Section>
        </View>
      </DrawerContentScrollView>
      <Drawer.Section style={styles.bottomDrawerSection}>
        <DrawerItem
          icon={({ color, size }) => (
            <Icon name="exit-to-app" color={color} size={size} />
          )}
          label="LOGOUT"
          onPress={() => {
            removeItemValue("userData").then(() => {
              dispatch(logout());
              props.navigation.navigate("Main");
            });
          }}
        />
      </Drawer.Section>
    </View>
  );
}
