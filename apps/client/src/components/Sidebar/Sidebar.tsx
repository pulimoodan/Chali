import { logoIcon, searchIcon } from "../../assets";
import "./Sidebar.css";
import { useEffect, useRef } from "react";
import Links from "./Links";
import Profile from "./Profile";

interface Props {
  search: string;
  setSearch: (a: string) => void;
}

function Sidebar({ search, setSearch }: Props) {
  const elem = useRef(null);

  useEffect(() => {
    // stick the navbar to the view but allow scrolling
    let prevScrollY = window.scrollY;
    const handleScroll = () => {
      const sidebar = elem.current as HTMLDivElement | null;
      if (!sidebar) return;
      if (window.innerWidth < 800) return;

      const sidebarHeight = sidebar.offsetHeight;
      const windowScrollY = window.scrollY;
      const maxScroll = sidebarHeight - window.innerHeight;

      const scrollDirection = prevScrollY < windowScrollY ? "down" : "up";
      const currentTop = parseInt(sidebar.style.top) || 0;

      if (
        (windowScrollY < currentTop && scrollDirection === "up") ||
        maxScroll <= 0
      ) {
        sidebar.style.top = `${windowScrollY}px`;
      } else if (scrollDirection === "up" && currentTop > 0) {
        const newTopPosition = Math.max(
          currentTop - (windowScrollY - prevScrollY),
          0
        );
        sidebar.style.top = `${newTopPosition}px`;
      } else if (windowScrollY > maxScroll) {
        const topPosition = windowScrollY - maxScroll;
        sidebar.style.top = `${topPosition}px`;
      }

      prevScrollY = windowScrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav style={{ position: "relative" }} ref={elem}>
      <div className="logo">
        <img src={logoIcon} alt="Logo of chali" />
        <h3>Chali</h3>
      </div>
      <div className="search">
        <img src={searchIcon} alt="Icon of magnifying glass" />
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <Links />
      <Profile />
    </nav>
  );
}

export default Sidebar;
