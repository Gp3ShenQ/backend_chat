// ~/server/utils/auth.ts
import jwt from 'jsonwebtoken';
import User from '~/server/models/user_models/User';

interface DecodedToken {
  account: string;
}

export async function verifyToken(token: string) {
  const JWT_SECRET = process.env.JWT_SECRET || 'secret';

  if (!token) {
    throw createError({ statusCode: 400, statusMessage: 'Token 缺失' });
  }

  const decoded = await new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) reject(err);
      resolve(decoded);
    });
  }) as DecodedToken;

  const user = await User.findOne({ account: decoded.account }).select('-password');
  if (!user) {
    throw createError({ statusCode: 404, statusMessage: '用戶不存在' });
  }

  return { decoded, user };
}