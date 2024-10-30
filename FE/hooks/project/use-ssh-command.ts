import { useState } from "react";
import { AnsiUp } from "ansi_up";
import { initSSHCommand, submitSSHCommand } from "@/api/project/project-api";
import { TerminalInput } from "@/types/project/project-type";

interface UseSSHCommandReturn {
  inputs: TerminalInput[];
  isConnected: boolean;
  setInputs: React.Dispatch<React.SetStateAction<TerminalInput[]>>;
  handleCommandSubmit: (command: string) => Promise<void>;
  resetInputs: () => void;
  connectSocket: () => void;
  disconnectSocket: () => void;
}

export const useSSHCommand = (): UseSSHCommandReturn => {
  const [inputs, setInputs] = useState<TerminalInput[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const ansiUp = new AnsiUp();

  const connectSocket = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket("ws://54.180.252.169:8080/ws");
      setSocket(ws);

      ws.onopen = async () => {
        console.log("WebSocket 연결됨");
        setIsConnected(true);
        try {
          await initSSHCommand(); // 초기 명령 실행
          resolve(); // 연결 및 초기화 성공 시 Promise 완료
        } catch (error) {
          console.error("initSSHCommand 실패: ", error);
          reject(error); // 오류 발생 시 Promise 거부
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket 에러: ", error);
        reject(error); // 소켓 오류 시 Promise 거부
      };

      ws.onmessage = (event) => {
        const cleanedData = event.data.replace(/\]0;[^]*/g, "");
        const htmlOutput = ansiUp.ansi_to_html(cleanedData);
        setInputs((prev) => [...prev, { type: "text", value: htmlOutput }]);
      };

      ws.onclose = () => {
        console.log("WebSocket 연결 종료");
        setIsConnected(false);
      };
    });
  };

  const disconnectSocket = () => {
    if (socket) {
      socket.close();
      console.log("WebSocket 수동으로 종료");
      setSocket(null);
      setIsConnected(false);
      setInputs([]);
    }
  };

  const handleCommandSubmit = async (command: string) => {
    if (!command || !isConnected) return;

    try {
      await submitSSHCommand(command);
    } catch (error) {
      console.error("명령어 전송 실패:", error);
    }
  };

  const resetInputs = () => {
    setInputs([]);
  };

  return {
    inputs,
    isConnected,
    setInputs,
    handleCommandSubmit,
    resetInputs,
    connectSocket,
    disconnectSocket,
  };
};
