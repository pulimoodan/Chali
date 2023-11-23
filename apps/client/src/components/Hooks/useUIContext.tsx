import { createContext, useContext } from "react";

export interface UIData {
  showToast: (text: string) => void;
  setBodyWrap: (value: boolean) => void;
}

export const UIContext = createContext<UIData>({
  showToast: () => {},
  setBodyWrap: () => {},
});

export const useUIContext = () => useContext(UIContext);
