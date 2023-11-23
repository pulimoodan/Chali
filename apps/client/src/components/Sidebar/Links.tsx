import { useLocation } from "react-router-dom";
import {
  bookmarksIcon,
  chatIcon,
  createIcon,
  followingIcon,
  homeIcon,
  notificationsIcon,
  trendingIcon,
} from "../../assets";
import { LinkToTop } from "../Link/LinkToTop";
import { useAuthContext } from "../Hooks/useAuthContext";

const Items = [
  [
    { label: "Home", url: "/", icon: homeIcon, requireAuth: false },
    {
      label: "Following",
      url: "/following",
      icon: followingIcon,
      requireAuth: true,
    },
    {
      label: "Trending",
      url: "/trending",
      icon: trendingIcon,
      requireAuth: false,
    },
    {
      label: "Bookmarks",
      url: "/bookmarks",
      icon: bookmarksIcon,
      requireAuth: true,
    },
  ],
  [
    { label: "Chat", url: "/chat", icon: chatIcon, requireAuth: true },
    {
      label: "Notifications",
      url: "/notifications",
      icon: notificationsIcon,
      requireAuth: true,
    },
    { label: "Create", url: "/create", icon: createIcon, requireAuth: true },
  ],
];

function Links() {
  const { authenticated } = useAuthContext();
  const location = useLocation();

  return (
    <div className="links-wrapper">
      {Items.map((section, index) => (
        <div key={index}>
          <ul className="links">
            {section.map(({ label, icon, url, requireAuth }, index) => (
              <li
                className={`${location.pathname == url && "active"}`}
                key={index}
              >
                <LinkToTop to={!authenticated && requireAuth ? "/signin" : url}>
                  <img src={icon} alt="Icon of home" />
                  <p>{label}</p>
                </LinkToTop>
              </li>
            ))}
          </ul>

          {index < Items.length - 1 && <div className="line"></div>}
        </div>
      ))}
    </div>
  );
}

export default Links;
