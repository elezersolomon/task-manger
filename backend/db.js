export default function makeDbQuery({ db }) {
  const save = async (doc) => {
    var data = await db.post(doc);
    return data;
  };

  const find = async (query) => {
    var data = await db.find({ selector: JSON.stringify(query) });
    console.log("data.docs");
    console.log(data.docs);
    return data.docs;
  };

  const update = async (id) => {};

  const findAll = async () => {
    var data = await db.allDocs();
    console.log(data);
    return data;
  };

  return { save, find, findAll, update };
}
