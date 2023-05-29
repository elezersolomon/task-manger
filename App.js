import React, { useState, useEffect } from "react";
import "react-native-gesture-handler";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { View, StyleSheet, LogBox, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "./redux/reducers/userReducer";
import LoginScreen from "./screens/Login";
import Header from "./components/Header";
import HomeScreen from "./screens/HomeScreen";
import NotificationScreen from "./screens/Notification";
import TaskScreen from "./screens/TaskScreen";
import TaskDetail from "./components/TaskDetail";
import DrawerContent from "./components/DrawerContent";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SubtaskDetail from "./components/subtaskDetail"
LogBox.ignoreAllLogs();
console.warn = console.error = () => { };

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function TabsScreen({ navigation }) {
  return (
    <Tab.Navigator
      tabBarOptions={{
        keyboardHidesTabBar: true,
      }}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "HOME") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "TASKS") {
            iconName = focused ? "view-list" : "view-list-outline";
          } else if (route.name === "NOTIFICATIONS") {
            iconName = focused ? "bell-ring" : "bell-ring-outline";
          } else if (route.name === "DETAIL") {
            iconName = focused ? "account-details" : "account-details-outline";
          }
          return (
            <MaterialCommunityIcons name={iconName} size={size} color={color} />
          );
        },
        tabBarActiveTintColor: "#1D3557",
        tabBarActiveBackgroundColor: "#A8DADC",
        tabBarInactiveTintColor: "#A8DADC",
        tabBarStyle: { backgroundColor: "#1D3557" },
        headerStyle: { backgroundColor: "#A8DADC" },
        headerShown: false,
      })}
    >
      <Tab.Screen name="HOME" component={HomeScreen} />
      <Tab.Screen name="TASKS" component={DetailStack} />
      <Tab.Screen name="NOTIFICATIONS" component={NotificationScreen} />
    </Tab.Navigator>
  );
}

function DetailStack({ navigation }) {
  navigation.setOptions({ tabBarVisible: false });
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="TASKS" component={TaskScreen} />
      <Stack.Screen name="DETAIL" component={TaskDetail} />
      <Stack.Screen name="SUBTASK_DETAIL" component={SubtaskDetail} />
    </Stack.Navigator>
  );
}

function DrawerScreen() {
  return (
    <Drawer.Navigator
      drawerContentOptions={{
        activeTintColor: "#1D3557",
        inactiveTintColor: "#A8DADC",
        activeBackgroundColor: "#A8DADC",
        inactiveBackgroundColor: "#1D3557",
        labelStyle: {
          fontSize: 20,
          fontWeight: "bold",
          marginLeft: 20,
        },
      }}
      drawerStyle={{
        backgroundColor: "#1D3557",
      }}
      drawerContent={(props) => <DrawerContent {...props} />}
    >
      <Drawer.Screen
        name="TASK MANAGER"
        component={TabsScreen}
        options={{
          headerStyle: {
            backgroundColor: "#1D3557",
          },
          headerTintColor: "#FFFFFF",
          headerTitle: () => <Header title="TASK MANAGER" />,
        }}
      />
      <Drawer.Screen name="NOTIFICATIONS" component={NotificationScreen} />
    </Drawer.Navigator>
  );
}

function Auth() {
  // 
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  useEffect(() => {

    const getData = async () => {

      try {
        const value = await AsyncStorage.getItem("userData");

        dispatch(login({ token: value }));
      } catch (e) {
        console.log("AsyncStorage getItem Error", e);
      }
    };
    const tokenData = getData();
    if (tokenData) {
      dispatch(login({ token: tokenData }));
    }
    setIsLoading(false);
  }, []);

  return (
    <Stack.Navigator initialRouteName="LoginScreen">
      {user.token != null ? (
        <Stack.Screen
          name="DrawerScreen"
          component={DrawerScreen}
          options={{ headerShown: false }}
        />
      ) : (
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <View style={styles.container}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Auth">
            <Stack.Screen
              name="Main"
              component={Auth}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 25,
    marginBottom: 0,
  },
});
