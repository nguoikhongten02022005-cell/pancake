import type { Server as SocketIOServer } from 'socket.io';

declare global {
  var __io: SocketIOServer | undefined;
}

export function emitToRoom(room: string, event: string, payload: unknown) {
  globalThis.__io?.to(room).emit(event, payload);
}

export function emitToConversation(conversationId: string, event: string, payload: unknown) {
  emitToRoom(`conversation:${conversationId}`, event, payload);
}
