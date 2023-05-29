export default function makeController({ db }) {
  const createTask = async ({ data, isAuthorized }) => {
    const task = await db.save(data);
    return task;
  };

  const findTasks = async ({ query, }) => {
    const tasks = await db.find(query);
    return tasks;
  };

const signIn = async ({ formValue }) => {

    var validatedUser = validateSignIn({ formValue });

    var userData = await checkUserInfo({ user: validatedUser });
    var token = generateToken(userData, "168H");
    console.log("promise", token)
    return token;
};

  const findTasksById  = async ({query, parameter, isAuthorized})=>{}

  return { signIn, createTask, findTasks };
}
