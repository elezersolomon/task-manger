import makeDbSetup from "./pouchConfig";
import { db } from "../backend/indexCopy"
//  db.info().then((info) => {
//      console.log("info", info)
//  })


export const dbFind = async ({ query, user }) => {



    var myTasks = await db.find({
        selector: {
            ...query,
        }
    });


    var assignedTasks = await db.find({
        selector: {
            ...query,
        }
    });
    var allTasks = [...myTasks.docs];
    var taskList = [];
    allTasks.map((task) => {
        var newTask = { id: task._id, ...task };
        delete newTask._id;
        // delete newTask._rev;
        taskList.push(newTask);
    });
    return taskList;
};

export const dbQuery = async ({ query }) => {



    var myTasks = await db.find({ selector: { query } });


    // var allTasks = [...myTasks.docs];
    // var taskList = [];
    // allTasks.map((task) => {
    //     var newTask = { id: task._id, ...task };
    //     delete newTask._id;
    //     delete newTask._rev;
    //     taskList.push(newTask);
    // });
    return myTasks;
};

export const dbPost = async (item) => {


    const result = await db.post(item)

    return result

};
export const dbget = async (id) => {

    const result = await db.get(id)

    return result

};
export const findItemById = async ({ type, id }) => {
    var data = await db.find({ type, _id: id });

    if (data.length == 0) {
        throw new Error(`Invalid ID`);
    }

    return data[0];
};
export const dbSave = async (subTask) => {

    var result = await db.save(subTask)
    return result
}
export const dbUpdate = async (updateTask) => {

    var result = await db.put(updateTask);
  
    return result;
};



// module.exports = {
//     findTasks
// }