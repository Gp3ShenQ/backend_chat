import { defineEventHandler } from 'h3';
import Message from '~/server/models/messages';
import { verifyToken } from '~/server/utils/auth';

export default defineEventHandler(async (event) => {
  if (event.node.req.headers['upgrade'] !== 'websocket') {
    throw createError({ statusCode: 400, statusMessage: 'Not a WebSocket request' });
  }

  const url = new URL(event.node.req.url || '', 'http://localhost');
  const token = url.searchParams.get('token'); 

  let userId: string;
  let username: string;
  try {
    const { user } = await verifyToken(token);
    userId = user._id.toString();
    username = user.account;
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 401,
      statusMessage: error.statusMessage || 'Token 驗證失敗',
    });
  }

  const wss = event.context.nitroApp.context.wss;

  wss.on('connection', (ws) => {
    console.log(`User ${username} connected`);

    Message.find()
      .sort({ timestamp: -1 })
      .limit(50)
      .populate('sender', 'account')
      .then((messages) => {
        const history = messages.map((msg) => ({
          sender: msg.sender?.account || 'Unknown User',
          content: msg.content,
          timestamp: msg.timestamp,
        }));
        ws.send(JSON.stringify({ type: 'history', messages: history }));
      })
      .catch((error) => {
        console.error('Error loading history:', error);
        ws.send(JSON.stringify({ error: 'Failed to load history' }));
      });

    ws.on('message', async (data) => {
      const messageContent = data.toString();
      try {
        const message = new Message({
          sender: userId,
          content: messageContent,
          timestamp: new Date(),
        });
        await message.save();

        const broadcastMessage = JSON.stringify({
          type: 'message',
          sender: username,
          content: messageContent,
          timestamp: message.timestamp,
        });
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) { 
            client.send(broadcastMessage);
          }
        });
      } catch (error) {
        console.error('Error saving message:', error);
        ws.send(JSON.stringify({ error: 'Failed to send message' }));
      }
    });

    ws.on('close', () => {
      console.log(`User ${username} disconnected`);
    });
  });

  return { ws: true };
});