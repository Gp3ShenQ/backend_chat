import { defineEventHandler, readBody } from "h3";
import connectDB from "~/server/db/mongoose";
import addUser from "~/server/models/user_models/addUserModels";

export default defineEventHandler(async (event) => {
  await connectDB();

  const post = event.node.req.method === "POST";

  if (post) {
    const body = await readBody(event);
    const newAddUser = new addUser({ name: body.name, age: body.age });
    await newAddUser.save();
    return { message: `Hello, ${newAddUser.name}! User saved to DB.` };
  } else {
    return { message: "Unsupported request method" };
  }
});
