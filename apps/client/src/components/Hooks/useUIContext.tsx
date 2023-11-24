import { createContext, useContext } from "react";

export interface UIData {
  showToast: (text: string) => void;
}

export const UIContext = createContext<UIData>({
  showToast: () => {},
});

export const useUIContext = () => useContext(UIContext);
