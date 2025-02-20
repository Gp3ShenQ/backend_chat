import { H3Event, sendError } from "h3";
import bcrypt from "bcrypt";

import connectDB from "~/server/db/mongoose";
import User from "~/server/models/user_models/User";

const saltRounds = 10;

export default defineEventHandler(async (event: H3Event) => {
  await connectDB();

  const post = event.node.req.method === "POST";

  try {
    if (post) {
      const body = await readBody(event);
      const { account, email, password } = body;
      const salt = await bcrypt.genSalt(saltRounds);
      const hash = await bcrypt.hash(password, salt);

      const newUser = new User({
        account,
        email,
        password: hash,
      });

      await newUser.save();
      return { message: "註冊成功" };
    }
  } catch (err) {
    return sendError(
      event,
      createError({ statusCode: 500, statusMessage: err.message })
    );
  }
});
