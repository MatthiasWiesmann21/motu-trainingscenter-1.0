import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIO, Namespace } from "socket.io";
import { db } from "@/lib/db";

export const config = {
  api: {
    bodyParser: false,
  },
};

const ACTIVE_STATUSES = ["Online", "Not Available", "Do Not Disturb"];

const ioHandler = (req: NextApiRequest, res: any) => {
  if (!res.socket.server.io) {
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: "/api/socket",
      transports: ["websocket", "polling"],
    });

    const userNamespace: Namespace = io.of("/userCount");
    const chatNamespace: Namespace = io.of("/chat");

    // Handling user counts
    userNamespace.on("connection", (socket) => {
      console.log("User count namespace connected");

      socket.on("join", async ({ profileId }) => {
        try {
          const profile = await db.profile.findUnique({
            where: { id: profileId },
          });
          if (!profile) return;
          console.log(`User with profile IDzz ${profileId} has joined.`);

          if (profile.isOnline === "Offline") {
            await db.profile.update({
              where: { id: profileId },
              data: { isOnline: "Online" },
            });
          }
          // Emit the updated online user count
          const onlineUsersCount = await db.profile.count({
            where: { isOnline: { in: ACTIVE_STATUSES } },
          });
          userNamespace.emit("userCount", onlineUsersCount);
          // Store the profileId in the socket instance for reference on disconnect
          socket.data.profileId = profileId;
        } catch (error) {
          console.error("Error fetching or updating profile:", error);
        }
      });

      // Listen for `statusUpdate` event and update the status
      socket.on("statusUpdate", async ({ profileId, newStatus }) => {
        await db.profile.update({
          where: { id: profileId },
          data: { isOnline: newStatus },
        });

        // Broadcast the updated online user count to all clients
        const onlineUsersCount = await db.profile.count({
          where: { isOnline: { in: ACTIVE_STATUSES } },
        });
        userNamespace.emit("userCount", onlineUsersCount);
      });

      // Listen for disconnections
      socket.on("disconnect", async () => {
        const profileId = socket.data.profileId;
        if (!profileId) return;

        console.log(`Client with profile ID ${profileId} disconnected.`);

        // Update the profile status to "Offline" on disconnect
        const profile = await db.profile.findUnique({
          where: { id: profileId },
        });
        if (!profile) return;

        if (profile.isOnline === "Online") {
          await db.profile.update({
            where: { id: profileId },
            data: { isOnline: "Offline" },
          });

          // Emit the updated online user count after disconnection
          const onlineUsersCountAfterDisconnect = await db.profile.count({
            where: { isOnline: { in: ACTIVE_STATUSES } },
          });
          io.emit("userCount", onlineUsersCountAfterDisconnect);
        }
      });
    });

    // Handling chat messages
    chatNamespace.on("connection", (socket) => {
      console.log("Chat namespace connected");

      socket.on("message", (message) => {
        chatNamespace.emit("message", message); // Emit to other users in chat namespace
      });
    });

    res.socket.server.io = io;
  } else {
    console.log("Socket.IO already initialized");
  }
  res.end();
};

export default ioHandler;
