import { defineEventHandler } from "h3";
import connectDB from "~/server/db/mongoose";
import User from "~/server/models/user_models/User";

export default defineEventHandler(async (event) => {
  await connectDB();

  const del = event.node.req.method === "DELETE";

  if (del) {
    const result = await User.deleteMany({});
    return { message: `${result.deletedCount} users were deleted.` };
  } else {
    return { message: "Unsupported request method" };
  }
});
