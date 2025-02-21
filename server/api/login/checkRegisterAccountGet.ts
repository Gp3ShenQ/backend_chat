import { defineEventHandler } from "h3";
import connectDB from "~/server/db/mongoose";
import Login from "~/server/models/user_models/Login";

export default defineEventHandler(async (event) => {
  await connectDB();

  const get = event.node.req.method === "GET";

  if (get) {
    const LoginAccount = await Login.find({}, { account: 1, _id: 0 });
    return { ...LoginAccount };
  }
});
