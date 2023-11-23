import { useState, ReactNode, useEffect } from "react";
import { UIContext } from "../Hooks/useUIContext";
import Toast from "../Toast/Toast";
import { useLocation } from "react-router-dom";

interface Props {
  children: ReactNode;
}

function UIContextProvider({ children }: Props) {
  const location = useLocation();
  const [toastActive, setToastActive] = useState(false);
  const [toastText, setToastText] = useState("");
  const [bodyWrap, setBodyWrap] = useState(false);

  const showToast = async (text: string) => {
    setToastActive(true);
    setToastText(text);
    setTimeout(() => setToastActive(false), 3000);
  };

  useEffect(() => {
    if (bodyWrap) {
      document.body.classList.add("display-wrap");
    } else {
      document.body.classList.remove("display-wrap");
    }
  }, [bodyWrap]);

  useEffect(() => {
    setBodyWrap(false);
  }, [location]);

  return (
    <UIContext.Provider value={{ showToast, setBodyWrap }}>
      <Toast active={toastActive} text={toastText} />
      {children}
    </UIContext.Provider>
  );
}

export default UIContextProvider;
