import { defineEventHandler, readBody, sendError, createError } from "h3";
import connectDB from "~/server/db/mongoose";
import User from "~/server/models/user_models/User";
import jwt from "jsonwebtoken"; // 使用 JWT 進行身份驗證

export default defineEventHandler(async (event) => {
  await connectDB();

  const post = event.node.req.method === "POST";

  const body = await readBody(event);

  const token = body.token;

  if (!token) {
    return sendError(
      event,
      createError({
        statusCode: 401,
        statusMessage: "未提供 token",
      })
    );
  }

  try {
    // 驗證 token 並獲取用戶資料
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userEmail = decoded.email;
    const userAccount = decoded.account;

    if (post) {
      // 查找現有使用者
      const existingUser = await User.findOne({
        $or: [{ account: userAccount }, { email: userEmail }],
      });

      if (existingUser) {
        // 更新現有使用者資料

        existingUser.name = existingUser.name || body.name;
        existingUser.age = existingUser.age || body.age;
        existingUser.email = existingUser.email || body.email;
        existingUser.account = existingUser.account || body.account;

        await existingUser.save();
        return { message: `Hello, ${existingUser.name}! User updated in DB.` };
      } else {
        return sendError(
          event,
          createError({
            statusCode: 404,
            statusMessage: "使用者未找到",
          })
        );
      }
    }
  } catch (error) {
    return sendError(
      event,
      createError({
        statusCode: 500,
        statusMessage: error.message,
      })
    );
  }
});
