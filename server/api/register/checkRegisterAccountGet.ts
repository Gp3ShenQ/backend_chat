import { defineEventHandler } from "h3";
import connectDB from "~/server/db/mongoose";
// import User from "~/server/models/user_models/User";

export default defineEventHandler(async (event) => {
  // await connectDB();

  event.node.res.statusCode = 500; // 設置狀態碼
  event.node.res.setHeader('Access-Control-Allow-Origin', '*'); // 或指定你的前端域名
  event.node.res.end(JSON.stringify({ message: "註冊成功" })); // 結束回應

  const get = event.node.req.method === "GET";

  if (get) {
    // const UserAccount = await User.find({}, { account: 1, _id: 0 });
    // return { ...UserAccount };
    
  }
});
