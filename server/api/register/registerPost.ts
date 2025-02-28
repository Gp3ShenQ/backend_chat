import { sendError, readBody, defineEventHandler } from "h3";
import bcrypt from "bcrypt";

import connectDB from "~/server/db/mongoose";
import User from "~/server/models/user_models/User";

const saltRounds = 10;

export default defineEventHandler(async (event) => {
  await connectDB();

  const post = event.node.req.method === "POST";

  const body = await readBody(event);
  const { account } = body;
  console.log(body.account, typeof body.account);

  const existingUser = await User.findOne({ account });
  console.log("existingUser", existingUser);
  if (existingUser) {
    return sendError(
      event,
      createError({ statusCode: 409, statusMessage: "帳號已存在" })
    );
  }

  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(body.password, salt);

  try {
    if (post) {
      const newUser = new User({
        account: body.account || undefined,
        email: body.email || undefined,
        password: hash,
      });

      await newUser.save();
      return { statusCode: 200, message: "註冊成功" };
    }
  } catch (err) {
    return sendError(
      event,
      createError({ statusCode: 500, statusMessage: err.message })
    );
  }
});
