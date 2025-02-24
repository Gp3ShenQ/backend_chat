import { defineEventHandler } from "h3";
import connectDB from "~/server/db/mongoose";
import User from "~/server/models/user_models/User";

export default defineEventHandler(async (event) => {
  await connectDB();

  if (event.node.req.method === "POST") {
    const body = await readBody(event);
    const result = await User.findOne({ account: body.account });

    try {
      if (result) {
        return {
          statusCode: 200,
          message: `User with name ${body.name} was deleted.`,
        };
      }
    } catch (error) {
      return sendError(
        event,
        createError({ statusCode: 500, statusMessage: err.message })
      );
    }
  }
});
