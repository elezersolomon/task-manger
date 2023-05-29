import { useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { dbFind } from "../backend/home"
export default function API() {
  const BASE_URL = "http://192.168.1.149:3051/api/";
  // const BASE_URL = "http://192.168.0.145:3051/api/";

  useEffect(() => {
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem("userData");
        if (value !== null) {
          const { result } = JSON.parse(value);
          axios.defaults.headers.common["Authorization"] = result;
          axios.defaults.headers.post["Content-Type"] = "application/json";
          return result;
        }
      } catch (error) {
        console.log("getDataError", error);
      }
    };
    getData();
  }, []);

  const postData = async ({ body, url }) => {
    try {
      const data = await axios.post(`${BASE_URL}${url}`, body);
      return { message: "success", data: data.data };
    } catch (error) {
      return {
        message: "error",
        data: error,
      };
    }
  };

  const getData = async (url) => {
    const data = await axios.get(`${BASE_URL}${url}`);
    return data.data;
  };

  const isAuthenticated = () => {
    if (authData.isAuthenticated) {
      return true;
    } else {
      return false;
    }
  };

  const logoutUser = () => {
    setAuthData({ tokenData: "", isAuthenticated: false });
    localStorage.removeItem("tokenData");
  };

  return { postData, getData, isAuthenticated, logoutUser };
}
