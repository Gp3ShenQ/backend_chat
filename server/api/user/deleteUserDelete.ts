import { defineEventHandler, sendError } from "h3";
import connectDB from "~/server/db/mongoose";
import User from "~/server/models/user_models/User";

export default defineEventHandler(async (event) => {
  await connectDB();

  if (event.node.req.method === "DELETE") {
    const body = await readBody(event);
    const result = await User.deleteOne({ name: body.name });

    if (result.deletedCount > 0) {
      return {
        statusCode: 200,
        message: `User with name ${body.name} was deleted.`,
      };
    } else {
      return sendError(event, {
        statusCode: 404,
        statusMessage: `用戶 ${body.name} 不存在`,
      });
    }
  }
});
