import { defineEventHandler, readBody, getQuery } from "h3";
import connectDB from "~/server/db/mongoose";
import User from "~/server/models/user_models/User";

export default defineEventHandler(async (event) => {
  await connectDB();

  const post = event.node.req.method === "POST";
  const get = event.node.req.method === "GET";

  if (post) {
    const body = await readBody(event);
    const newUser = new User({ name: body.name, age: body.age });
    await newUser.save();
    return { message: `Hello, ${newUser.name}! User saved to DB.` };
  } else if (get) {
    const query = getQuery(event);
    if (query.name) {
      const user = await User.findOne({ name: query.name });
      if (user) {
        return { message: `Hello, ${user.name}!` };
      } else {
        return { message: `User not found.` };
      }
    } else {
      const users = await User.find({});
      return { users };
    }
  } else {
    return { message: "Unsupported request method" };
  }
});
