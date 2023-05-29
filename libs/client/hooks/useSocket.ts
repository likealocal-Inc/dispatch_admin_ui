import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

export function useSocket(url: string) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const s = io(url);
    s.on("message", ({ data }) => {
      console.log(data);
    });

    s.emit("message", { data: "test" });

    function cleanup() {
      s.disconnect();
    }

    return cleanup;
  }, []);
  return socket;
}
