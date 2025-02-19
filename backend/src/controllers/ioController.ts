import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";

interface Message {
  id: string;
  senderId: number;
  receiverId: number;
  content: string;
  createdAt: Date;
}

const prisma = new PrismaClient();

export const ioConnection = (io: Server) => {
  io.on("connection", (socket) => {
    console.log(
      `🟢 Użytkownik połączony: ${socket.id} (userId: ${socket.data.userId})`
    );
  });
};

export const sendMessage = (socket: any, io: Server) => {
  socket.on("sendMessage", async (messageData: Message) => {
    console.log("📩 Nowa wiadomość:", messageData);
    const senderId = socket.data.userId;
    const receiverId = messageData.receiverId;
    const content = messageData.content;

    if (!senderId || !receiverId || !content) {
      return socket.emit.json({
        error: "Required data to send message is invalid.",
      });
    }
    try {
      const newMessage = await prisma.message.create({
        data: {
          senderId,
          receiverId,
          content,
        },
      });

      io.emit("message", { message: newMessage });
    } catch (error) {
      console.error("Saving message error: ", error);
      socket.emit.json({ error: "Cannot send a message" });
    }
  });
};

export const ioDisconnect = (socket: any) => {
  socket.on("disconnect", () => {
    console.log(`🔴 Użytkownik rozłączony: ${socket.id}`);
    socket.emit.json({ message: `User disconnected, id: ${socket.id}` });
  });
};
