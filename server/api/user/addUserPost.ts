import { defineEventHandler, readBody } from "h3";
import connectDB from "~/server/db/mongoose";
import User from "~/server/models/user_models/User";

export default defineEventHandler(async (event) => {
  await connectDB();
  console.log("成功連接db");

  const post = event.node.req.method === "POST";

  console.log(event.node.req.method, "method");

  try {
    if (post) {
      console.log("新增資料...");
      const body = await readBody(event);
      const newUser = new User({
        name: body.name,
        age: body.age,
        email: body.email,
      });
      await newUser.save();
      return { message: `Hello, ${newUser.name}! User saved to DB.` };
    }
  } catch (error) {
    return error;
  }
});
