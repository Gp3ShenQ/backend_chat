import { defineEventHandler, sendError, createError } from "h3";
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
      // 使用 createError 函式來創建 Error 物件
      return sendError(
        event,
        createError({
          statusCode: 404,
          statusMessage: `用戶 ${body.name} 不存在`,
        })
      );
    }
  }
});
