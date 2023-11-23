import "./Settings.css";
import { useEffect, useState } from "react";

type THEME = "light" | "dark";

function Theme() {
  const [value, setValue] = useState<THEME>("light");

  const handleThemeChange = (value: string) => {
    setValue(value as THEME);
    try {
      localStorage.setItem("theme", value);
    } catch (_error) {}
    if (value == "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  };

  useEffect(() => {
    try {
      setValue((localStorage.getItem("theme") as THEME) || "light");
    } catch (_error) {}
  }, []);

  return (
    <div className="settings-item">
      <div className="details">
        <h3>Theme</h3>
        <p>Choose between dark or light mode</p>
      </div>
      <div className="action">
        <select
          name="theme"
          onChange={(e) => handleThemeChange(e.target.value)}
          value={value}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>
    </div>
  );
}

export default Theme;
