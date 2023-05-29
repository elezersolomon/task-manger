// import jwt from "jsonwebtoken"
import PouchDB from 'pouchdb-react-native'

import bcrypt from "bcryptjs"
import makeDbSetup from "./pouchConfig"
export const db = makeDbSetup("db")



const generalManagerTask = {

    type: "task",
    taskType: "mainTask",
    parentTaskId: "",
    allParentTaskIds: [],
    allChildTaskIds: [],
    taskName: "general to general",
    description: "",
    startDate: "2021-12-23T08:52:16.683Z",
    endDate: "2021-12-23T08:52:16.683Z",
    status: "inProgress",
    priority: "",
    isTaskDelegated: true,
    isTaskArchive: false,
    isTaskRepeatin: false,
    taskRepetitionInterval: "",
    isReminderEnabled: false,
    reminderDate: "",
    tag: {
        id: "",
        color: ""
    },
    assignedTo: {
        id: "32fae125-9e25-437c-8ff0-02871dbf3f15",
        fullName: "General Manager",
        role: []
    },
    approvedBy: {
        i: "a7556f21-204a-4205-a4d6-eb7f219a739b",
        fullNam: "",
        rol: ""
    },
    createdBy: {
        id: "32fae125-9e25-437c-8ff0-02871dbf3f15",
        fullName: "General Manager",
        avatar: ""
    },
    createdAt: {
        timestamp: 1640250577976,
        stringDate: "2021/12/23",
        isoStringDate: "2021-12-23T09:09:37.976Z"
    }
  }
  
export default signIn = async ({ formValue }) => {
    var validatedUser = validateSignIn({ formValue });
  
 
    var userData = await checkUserInfo({ user: validatedUser });

    return userData;
};





const validateSignIn = ({ formValue }) => {

    if (checkEmptyAndUndefined(formValue.userName)) {

        throw new Error(`User name can't be empty`);
    } else if (checkEmptyAndUndefined(formValue.password)) {

        throw new Error(`Password can't be empty`);
    }

    var user = {
        userName: formValue.userName.toString().trim(),
        password: formValue.password.toString().trim(),
    };

    return user;
};


const checkUserInfo = async ({ user }) => {

  

    var { userName, password } = user;
 
    var userData = await db.find({ selector: { type : "user", userName }}).then((doc) => {
        console.log('consoleData_signin',doc)
        return doc
    }, (error) => console.log("dataa base error find", error));


    if (userData.length == 0) {
        throw new Error("Invalid user name or password");
    }

    var isPasswordValid = await comparePassword(password, userData.docs[0].password);
    if (!isPasswordValid) {
        throw new Error("Invalid user name or password");
    }
    userData = userData.docs[0];
    if (!userData.isActive) {
        throw new Error("Deactivated user");
    }

    var userInformation = {
        id: userData._id,
        systemTag: userData.systemTag,
        fullName: userData.fullName,
        userName: userData.userName,
        role: userData.roles,
    };
    return userInformation;
};

const checkEmptyAndUndefined = (field) => {

    if (field == "" || field == undefined) return true;
    return false;
};

const generateToken = (data, expTime) => {
    return new Promise((resolve, reject) => {
        //     jwt.sign(
        //         { data },
        //         env.api.secret,
        //         { expiresIn: expTime },
        //         (err, token) => {
        //             resolve(`Bearer ${token}`);
        //         }
        //     );
    });
};

const comparePassword = (plainTextPassword, hashedPassword) => {

    return new Promise((resolve, reject) => {
        bcrypt.compare(plainTextPassword, hashedPassword, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
};


