import { useState } from "react";

export default function useToggleButton(initialState = false) {
  const [isToggled, setIsToggled] = useState(initialState);

  const handleToggle = () => {
    setIsToggled((prev) => !prev);
  };

  return {
    isToggled,
    handleToggle,
  };
}
