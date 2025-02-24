import { defineEventHandler } from "h3";
import connectDB from "~/server/db/mongoose";
import User from "~/server/models/user_models/User";

export default defineEventHandler(async (event) => {
  await connectDB();
  const body = await readBody(event);

  const post = event.node.req.method === "POST";

  if (post) {
    const users = await User.findOne(body.account);
    return { ...users };
  }
});
