import { defineEventHandler } from "h3";
import connectDB from "~/server/db/mongoose";
import User from "~/server/models/user_models/User";

export default defineEventHandler(async (event) => {
  await connectDB();

  if (event.node.req.method === "POST") {
    const body = await readBody(event);

    const _result = await User.findOne({
      $or: [{ account: body.account }, { email: body.email }],
    });

    try {
      if (_result) {
        return {
          statusCode: 200,
          message: `User with name ${body.name} was deleted.`,
          user: _result,
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
