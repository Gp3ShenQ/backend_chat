import { defineEventHandler } from "h3";
import connectDB from "~/server/db/mongoose";
import User from "~/server/models/user_models/addUserModels";

export default defineEventHandler(async (event) => {
  await connectDB();

  if (event.node.req.method === "ShenDeleteAll") {
    const result = await User.deleteMany({});
    return { message: `${result.deletedCount} users were deleted.` };
  } else {
    return { message: "Unsupported request method" };
  }
});
