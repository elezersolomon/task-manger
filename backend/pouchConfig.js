import PouchDB from "pouchdb-react-native";
// PouchDB.plugin(require("pouchdb-adapter-asyncstorage").default);
import pouchdbFind from "pouchdb-find"
import PouchAuth from 'pouchdb-authentication';
const remoteDB = new PouchDB(
    'http://192.168.1.3:5984/task_manager_data',
    { skip_setup: true }
);
PouchDB.plugin(PouchAuth);
export default function makeDbSetup() {
    // PouchDB.plugin(require('pouchdb-adapter-asyncstorage').default)
    const db = new PouchDB('test2')

    PouchDB.plugin(pouchdbFind);




    const syncStates = [
        'change',
        'paused',
        'active',
        'denied',
        'complete',
        'error',
    ];



    //db.post(generalManagerTask).then((value) => { console.log("consoleData_postvalue") })

    // // db.put((generalManager), function (err, res) {
    //     if (err) {
    //         console.log("errror", err)
    //     } else {
    //         console.log("Document created", res)
    //     }
    // })

    // db.find({ selector: { "type": "task"} }).then((doc) => {
    //     return doc
    // }, (error) => console.log("dataa base error find", error));

    // db.allDocs(function (err, doc) {
    //     if (err) {
    //         console.log('consoleData_dbb err', err)
    //     }
    //     if (doc) {
    //         console.log('consoleData_dbb doc', doc)
    //     }
    // })
    const dbb = syncDatabase(db, syncStates)

    // replicateDatabase(db)


    // dbb.find({ selector: { "type": "task" } }).then((doc) => {
    //     console.log('consoleData_doccc', doc)
    //     return doc
    // }, (error) => console.log("dataa base error find", error));

    return db
}


const syncDatabase = (db, syncStates) => {

    console.log(db.adapter)
    const sync = db.sync(remoteDB, {
        live: true,
        retry: true,
    })

    syncStates.forEach((state) => {

        sync.on(state, setCurrentState.bind(this, state));
        function setCurrentState(state) {
            console.log('[Syncc:' + state + ']');
        }
    });
    return db

}

// const replicateDatabase = async(db) => {
//     var url ='http://192.168.1.239:5985/task_management'
//     var opts = { live: true, retry: true };
//     remoteDB.login('username', 'password').then(function () {
//     await db.replicate.from(url).on('complete', function(info) {
//         console.log('consoleData_say something',info)
//         // then two-way, continuous, retriable sync
//         db.sync(url, opts)
//           .on('change', (onSyncChange)=> console.log('consoleData_onchange',onSyncChange))
//           .on('paused', (onSyncPaused)=> console.log('consoleData_paused',onSyncPaused))
//           .on('error', (onSyncError)=> console.log('consoleData_error',onSyncError));
//       }).on('error', (onSyncError)=> console.log('consoleData_replicateerror',onSyncError));
//     return db

// } )};

// remoteDB.login('username', 'password').then(function () {
//   const sync = db.sync(remoteDB, {
//       live: true,
//        retry: true,
//   });
//   syncStates.forEach((state) => {
//       sync.on(state, setCurrentState.bind(this, state));
//       function setCurrentState(state) {
//           console.log('[Syncc:' + state + ']');
//       }
//   });
// });




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

const generalManager = {
    _id: "32fae125-9e25-437c-8ff0-02871dbf3f15",
    type: "user",
    systemTag: "adminUser",
    fullName: "General Manager",
    userName: "generalmanager",
    password: "$2a$10$TBc13ZZ2lWOZVvtAlPQ8tOl.ji9AY5ApL1McbEHVEk/Mo1Hxe3miS",
    isActive: true,
    role: [],
    roles: [
        {
            id: "a0c7bb14-4029-4c17-8433-ac3080fa33d8",
            roleName: "General Manager"
        }
    ],
    createdBy: {
        id: "system",
        fullName: "system",
        userName: "system"
    },
    createdDate: {
        timeStamp: 1640247758380,
        isoStringDate: "2021-12-23T08:22:38.381Z",
        stringDate: "2021/12/23"
    }
}



//



// db.allDocs(function (err, doc) {
//     if (err) {
//         console.log('consoleData_dbb err', err)
//     }
//     if (doc) {
//         console.log('consoleData_dbb doc', doc)
//     }
// })

// db.find({ selector: { "createdBy.id": "32fae125-9e25-437c-8ff0-02871dbf3f15" } }).then((doc) => {

// }, (error) => console.log("dataa base error find", error));

// var remoteDb = new PouchDB("http://localhost:5985/task_management_mobile", { skip_setup: true });
