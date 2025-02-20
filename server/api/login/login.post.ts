import { H3Event, sendError } from "h3";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// 模擬用戶數據
const users = [
  {
    id: 1,
    email: "user@example.com",
    password: "$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  }, // bcrypt 雜湊值
];

const JWT_SECRET = "your-256-bit-secret";

export default async (event: H3Event) => {
  const body = await useBody(event);
  const { email, password } = body;

  const user = users.find((u) => u.email === email);
  if (!user) {
    return sendError(
      event,
      createError({
        statusCode: 401,
        statusMessage: "Invalid email or password",
      })
    );
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return sendError(
      event,
      createError({
        statusCode: 401,
        statusMessage: "Invalid email or password",
      })
    );
  }

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "24h",
  });
  return { token };
};
