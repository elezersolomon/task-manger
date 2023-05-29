import React from "react";
import SnackBar from "react-native-snackbar-component";

const Notification = ({ setNotify, notify }) => {
  // setNotify({
  //   isOpen: false,
  //   message: "",
  //   severity: "",
  // })
  return (
    <SnackBar
      visible={notify.isOpen}
      textMessage={notify.message}
      autoHidingTime={5000}
      // distanceCallbac={() => {
      //   console.log('consoleData_distance call back',)
      //   setNotify({
      //     isOpen: false,
      //     message: "",
      //     severity: "",
      //   })
      // }}
      
      backgroundColor={
        notify.severity === "success"
          ? "#357A38"
          : notify.severity === "error"
            ? "#AB003C"
            : "#ffeb3b"
      }

      messageColor={
        notify.severity === "success"
          ? "#FFF"
          : notify.severity === "error"
            ? "#fff"
            : "#000"
      }

    />

  );

};

export default Notification;
