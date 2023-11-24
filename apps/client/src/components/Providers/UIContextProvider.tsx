import { useState, ReactNode } from "react";
import { UIContext } from "../Hooks/useUIContext";
import Toast from "../Toast/Toast";

interface Props {
  children: ReactNode;
}

function UIContextProvider({ children }: Props) {
  const [toastActive, setToastActive] = useState(false);
  const [toastText, setToastText] = useState("");

  const showToast = async (text: string) => {
    setToastActive(true);
    setToastText(text);
    setTimeout(() => setToastActive(false), 3000);
  };

  return (
    <UIContext.Provider value={{ showToast }}>
      <Toast active={toastActive} text={toastText} />
      {children}
    </UIContext.Provider>
  );
}

export default UIContextProvider;
