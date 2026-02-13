import { createServer } from 'node:http';
import next from 'next';
import { Server as SocketIOServer } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
const host = process.env.HOSTNAME || '0.0.0.0';
const port = Number(process.env.PORT || 3000);

const app = next({ dev, hostname: host, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    handle(req, res);
  });

  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  globalThis.__io = io;

  io.on('connection', (socket) => {
    socket.on('join:page', ({ pageId }) => {
      if (!pageId) return;
      socket.join(`page:${pageId}`);
    });

    socket.on('join:conversation', ({ conversationId }) => {
      if (!conversationId) return;
      socket.join(`conversation:${conversationId}`);
    });
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${host}:${port}`);
  });
});
