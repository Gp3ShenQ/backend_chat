export default defineEventHandler((event) => {
  setResponseHeaders(event, {
    "Access-Control-Allow-Origin": "https://animal-chat.onrender.com",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
  });
  const options = event.node.req.method === "OPTIONS"
  if (options) {
    // 預檢請求，直接回應200，這樣前端的POST請求才能繼續
    return ;
  }
});