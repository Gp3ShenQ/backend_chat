import { defineEventHandler } from "h3";
import connectDB from "~/server/db/mongoose";
import User from "~/server/models/user_models/User";

export default defineEventHandler(async (event) => {
  await connectDB();

  const del = event.node.req.method === "DELETE";

  if (del) {
    const body = await readBody(event);
    const result = await User.deleteOne({ name: body.name });
    if (result.deletedCount > 0) {
      return { message: `User with name ${body.name} was deleted.` };
    } else {
      return { message: `User with name ${body.name} was not found.` };
    }
  } else {
    return { message: "Unsupported request method" };
  }
});
