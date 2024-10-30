import { useState, useEffect } from "react";

export default function useTimer(initialTime: number = 180) {
  const [timer, setTimer] = useState<number>(initialTime);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);

  const startTimer = (startTime: number = initialTime) => {
    setTimer(startTime);
    if (timerId) clearInterval(timerId);
    const id = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer === 0) {
          clearInterval(id);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
    setTimerId(id);
  };

  const resetTimer = () => {
    if (timerId) {
      clearInterval(timerId);
    }
    setTimer(initialTime);
  };

  const setTimerToZero = () => {
    if (timerId) {
      clearInterval(timerId);
    }
    setTimer(0);
  };

  useEffect(() => {
    return () => {
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, [timerId]);

  return { timer, startTimer, resetTimer, setTimerToZero };
}
