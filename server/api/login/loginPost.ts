import { defineEventHandler, readBody } from "h3";
import connectDB from "~/server/db/mongoose";
import User from "~/server/models/user_models/User";
import jwt from "jsonwebtoken"; // 假設使用 JWT 進行身份驗證
import bcrypt from "bcrypt"; // 假設使用 bcrypt 進行密碼加密驗證

export default defineEventHandler(async (event) => {
  await connectDB();

  const post = event.node.req.method === "POST";

  try {
    if (post) {
      const body = await readBody(event);
      const { account, email, password } = body;

      // 查找用戶（根據帳號或電子郵件）
      const user = await User.findOne({
        $or: [{ account: account }, { email: email }],
      });
      console.log("user", user);
      if (!user) {
        return {
          statusCode: 404,
          statusMessage: "無此帳號或電子郵件",
        };
      }

      // 驗證密碼
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return {
          statusCode: 401,
          statusMessage: "密碼錯誤",
        };
      }

      // 生成 JWT token
      const token = jwt.sign(
        { id: user._id, account: user.account },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return {
        statusCode: 200,
        statusMessage: "登入成功",
        token, // 返回 token 給用戶
        user: {
          id: user._id,
          account: user.account,
          email: user.email,
          name: user.name,
          age: user.age,
        },
      };
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      statusMessage: "伺服器內部錯誤",
    };
  }
});
