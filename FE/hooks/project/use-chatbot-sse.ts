import { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";

interface LogFile {
  name: string;
}

interface UseChatbotSSEProps {
  logFiles: LogFile[];
}

interface UseChatbotSSEReturn {
  question: string;
  logSummary: string;
  isConnected: boolean;
  chatbotMessageList: ChatbotMessage[];
  handleQuestionChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  startSSE: () => Promise<void>;
  stopSSE: () => void;
}

interface ChatbotMessage {
  role: "user" | "system";
  content: string;
}

export const useChatbotSSE = ({
  logFiles,
}: UseChatbotSSEProps): UseChatbotSSEReturn => {
  const [question, setQuestion] = useState<string>("");
  const [logSummary, setLogSummary] = useState<string>("");
  const [isConnected, setIsConnected] = useState(false);
  const [isFirstQuestion, setIsFirstQuestion] = useState(true);
  const [chatbotMessageList, setChatbotMessageList] = useState<
    ChatbotMessage[]
  >([]);

  const eventSourceRef = useRef<ReadableStreamDefaultReader | null>(null);
  const isCancelledRef = useRef<boolean>(false);
  const accumulatedSummary = useRef<string>("");

  const handleQuestionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ): void => setQuestion(event.target.value);

  const startSSE = async () => {
    if (question === "" || logFiles.length === 0) return;
    console.log("isFirstQuestion: ", isFirstQuestion);

    try {
      const accessToken = Cookies.get("accessToken");
      if (!accessToken) {
        throw new Error("Access token is missing");
      }

      const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await fetch(
        `http://54.180.252.169:8000/api/logs/question`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ logFiles, question, isFirstQuestion }),
        }
      );

      if (!response.body) {
        throw new Error("Streaming not supported");
      }

      setChatbotMessageList((prev) => [
        ...prev,
        { role: "user", content: question },
      ]);
      setQuestion("");

      const reader = response.body.getReader();
      eventSourceRef.current = reader;
      setIsConnected(true);

      const decoder = new TextDecoder();
      let done = false;
      accumulatedSummary.current = "";

      while (!done) {
        const { value, done: streamDone } = await reader.read();
        done = streamDone;

        if (value) {
          const chunk = decoder.decode(value);
          accumulatedSummary.current += chunk;
          setLogSummary(accumulatedSummary.current);
        }

        if (isCancelledRef.current) {
          console.log("SSE 중단됨");

          setChatbotMessageList((prev) => [
            ...prev,
            { role: "system", content: accumulatedSummary.current },
          ]);
          setLogSummary("");
          setIsConnected(false);

          isCancelledRef.current = false;

          return;
        }
      }

      if (!isCancelledRef.current) {
        setIsFirstQuestion(false);
        setChatbotMessageList((prev) => [
          ...prev,
          { role: "system", content: accumulatedSummary.current },
        ]);
        setLogSummary("");
        setIsConnected(false);
      }
    } catch (error) {
      console.error("Failed to fetch:", error);
      setIsFirstQuestion(true);
      setIsConnected(false);
    }
  };

  const stopSSE = () => {
    if (eventSourceRef.current) {
      isCancelledRef.current = true;
      eventSourceRef.current.cancel();
    }
    // setIsFirstQuestion(true);
    setIsConnected(false);
  };

  useEffect(() => {
    return () => stopSSE();
  }, []);

  return {
    question,
    logSummary,
    isConnected,
    chatbotMessageList,
    handleQuestionChange,
    startSSE,
    stopSSE,
  };
};
