import { defineEventHandler, getQuery } from "h3";
import connectDB from "~/server/db/mongoose";
import deleteUser from "~/server/models/user_models/deleteUserModels";

export default defineEventHandler(async (event) => {
  await connectDB();

  const del = event.node.req.method === "DELETE";

  if (del) {
    const query = getQuery(event);
    const result = await deleteUser.deleteOne({ name: query.name });
    if (result.deletedCount > 0) {
      return { message: `User with name ${query.name} was deleted.` };
    } else {
      return { message: `User with name ${query.name} was not found.` };
    }
  } else {
    return { message: "Unsupported request method" };
  }
});
