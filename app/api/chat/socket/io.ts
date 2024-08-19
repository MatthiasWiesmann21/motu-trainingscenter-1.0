import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";

import { NextApiResponseServerIo } from "@/types";

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (!res.socket.server.io) {
    const path = "/api/chat/socket/io";
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: path,
      addTrailingSlash: false,
      pingInterval: 10000,
      pingTimeout: 5000,
      adapter: require("socket.io-mysql")({
        connectionLimit: 100, // Set the maximum number of active connections
        maxConnectionAge: 1000 * 60 * 60,
      }),
    });
    res.socket.server.io = io;
  }

  res.end();
}

export default ioHandler;
