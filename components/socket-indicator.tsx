"use client";

import { useSocket } from "@/components/providers/socket-provider";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/lib/check-language";

export const SocketIndicator = () => {
  const isConnected = useSocket();
  const currentLanguage = useLanguage();

  if (!isConnected) {
    return (
      <Badge 
        variant="outline" 
        className="bg-yellow-600 text-white border-none"
      >
        {currentLanguage.chat_socket_reconnecting}
      </Badge>
    )
  }

  return (
    <Badge 
      variant="outline" 
      className="bg-emerald-600 text-white border-none"
    >
      {currentLanguage.chat_socket_connected}
    </Badge>
  )
}