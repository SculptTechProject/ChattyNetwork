import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";

const activeUsers = new Map<
  number,
  { id: number; firstName: string; lastName: string }
>();

interface Message {
  id: string;
  senderId: number;
  receiverId: number;
  content: string;
  createdAt: Date;
}

const prisma = new PrismaClient();

export const ioConnection = (io: Server) => {
  io.on("connection", async (socket) => {
    console.log(
      `🟢 Użytkownik połączony: ${socket.id} (userId: ${socket.data.userId})`
    );

    const userId = socket.data.userId;
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      });

      if (user) {
        activeUsers.set(user.id, {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
        });

        io.emit("activeUsers", Array.from(activeUsers.values()));
      }
    }
    sendMessage(socket, io);
    ioDisconnect(socket, io);
  });
};

export const sendMessage = (socket: any, io: Server) => {
  socket.on("sendMessage", async (messageData: Message) => {
    console.log(
      `📩 Nowa wiadomość (userId: ${socket.data.userId}):`,
      messageData
    );
    const senderId = socket.data.userId;
    const receiverId = messageData.receiverId;
    const content = messageData.content;

    if (!senderId || !receiverId || !content) {
      return socket.emit("ErrorMessage:", {
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
      socket.emit("ErrorMessage:", { error: "Cannot send a message" });
    }
  });
};

export const ioDisconnect = (socket: any, io: Server) => {
  socket.on("disconnect", () => {
    console.log(`🔴 Użytkownik rozłączony: ${socket.id}`);
    socket.emit("ErrorMessage", {
      message: `User disconnected, id: ${socket.id}`,
    });

    activeUsers.delete(socket.data.userId);

    io.emit("activeUsers", Array.from(activeUsers));
  });
};
