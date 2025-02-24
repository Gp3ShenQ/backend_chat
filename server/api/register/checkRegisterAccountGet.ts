import { defineEventHandler } from "h3";
import connectDB from "~/server/db/mongoose";
import User from "~/server/models/user_models/User";

export default defineEventHandler(async (event) => {
  await connectDB();

  const get = event.node.req.method === "GET";

  if (get) {
    const UserAccount = await User.find({}, { account: 1, _id: 0 });
    return { ...UserAccount };
  }
});
