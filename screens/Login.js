import React, { useState, createRef } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  Image,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/reducers/userReducer";
import API from "../api";
// import { sign } from "jsonwebtoken";
import signIn from "../backend/indexCopy"
const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const [formValue, setFormValue] = useState({
    userName: "",
    password: "",
    errorText: "",
  });
  const { postData } = API();

  const passwordInputRef = createRef();

  const handleSubmit = async () => {

    setFormValue({ ...formValue, errorText: "" });

    if (!formValue.userName || !formValue.password) {
   
      setFormValue({
        ...formValue,
        errorText: "Please Fill Your Username and Password.",
      });
      return;
    }
    var userData = await signIn({ formValue })

    //  console.log('consoleData_authorized', userData)
    if (userData) {
       console.log('consoleData_userdata', userData)
      await AsyncStorage.setItem("userData", JSON.stringify(userData))
      // console.log('consoleData_async',)


      dispatch(login({ token: userData }));
    }

  };

  return (
    <View style={styles.mainBody}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flex: 1,
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <View>
          <KeyboardAvoidingView enabled>
            <View style={{ alignItems: "center" }}>
              <Image
                source={require("../assets/taskManager.png")}
                style={{
                  width: "50%",
                  height: 100,
                  resizeMode: "contain",
                  margin: 30,
                }}
              />
            </View>
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={(text) =>
                  setFormValue({ ...formValue, userName: text })
                }
                value={formValue.userName}
                placeholder="Username"
                placeholderTextColor="#8b9cb5"
                autoCapitalize="none"
                keyboardType="default"
                returnKeyType="next"
                onSubmitEditing={() =>
                  passwordInputRef.current && passwordInputRef.current.focus()
                }
                underlineColorAndroid="#f000"
                blurOnSubmit={false}
              />
            </View>
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={(text) =>
                  setFormValue({ ...formValue, password: text })
                }
                value={formValue.password}
                placeholder="Password"
                placeholderTextColor="#8b9cb5"
                autoCapitalize="none"
                keyboardType="default"
                ref={passwordInputRef}
                onSubmitEditing={Keyboard.dismiss}
                blurOnSubmit={false}
                secureTextEntry={true}
                underlineColorAndroid="#f000"
                returnKeyType="next"
              />
            </View>
            {formValue.errorText != "" ? (
              <Text style={styles.errorTextStyle}>{formValue.errorText}</Text>
            ) : null}
            <TouchableOpacity
              style={styles.buttonStyle}
              activeOpacity={0.5}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonTextStyle}>LOGIN</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </View>
  );
};
export default LoginScreen;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#A8DADC",
    alignContent: "center",
  },
  SectionStyle: {
    flexDirection: "row",
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  buttonStyle: {
    backgroundColor: "#1D3557",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "#1D3557",
    height: 45,
    alignItems: "center",
    borderRadius: 5,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 15,
    marginBottom: 25,
  },
  buttonTextStyle: {
    color: "#FFFFFF",
    paddingVertical: 10,
    fontSize: 20,
  },
  inputStyle: {
    flex: 1,
    color: "white",
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 5,
    height: 50,
    fontSize: 20,
    borderColor: "#1D3557",
    backgroundColor: "#FFFFFF",
    color: "#1D3557",
    textAlign: "center",
  },
  registerTextStyle: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 14,
    alignSelf: "center",
    padding: 10,
  },
  errorTextStyle: {
    color: "red",
    textAlign: "center",
    fontSize: 16,
    marginTop: 15,
  },
});
