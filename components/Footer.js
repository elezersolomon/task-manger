import * as React from "react";
import { BottomNavigation, Text } from "react-native-paper";

const HomeRoute = () => <Text>Home</Text>;
const TaskRoute = () => <Text>Task</Text>;
const NotificationRoute = () => <Text>Notification</Text>;

export default function Footer() {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "home", title: "Home", icon: "album" },
    { key: "task", title: "Tasks", icon: "album" },
    { key: "notification", title: "Notification", icon: "album" },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: HomeRoute,
    task: TaskRoute,
    notification: NotificationRoute,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
}
