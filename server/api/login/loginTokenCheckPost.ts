import { defineEventHandler, readBody } from 'h3';
import connectDB from '~/server/db/mongoose';
import User from '~/server/models/user_models/User';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
  await connectDB();

  const post = event.node.req.method === 'POST';

  try {
    if (post) {
      const body = await readBody(event);
      const { token } = body;
      console.log('backend', token);

      // 使用 Promise 封裝 jwt.verify
      const verifyToken = (token) => {
        return new Promise((resolve, reject) => {
          jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
              reject({ statusCode: 401, statusMessage: 'Token 無效' });
            } else {
              resolve(decoded);
            }
          });
        });
      };

      try {
        const decoded = await verifyToken(token);

        // 根據解碼後的 account 查找完整的用戶資料
        const user = await User.findOne({ account: decoded.account });
        console.log('backend_user', user);

        if (!user) {
          return { statusCode: 404, statusMessage: '用戶不存在' };
        }

        return {
          statusCode: 200,
          statusMessage: 'Token 驗證成功',
          user,
        };
      } catch (verificationError) {
        return verificationError;
      }
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      statusMessage: '伺服器內部錯誤',
    };
  }
});
