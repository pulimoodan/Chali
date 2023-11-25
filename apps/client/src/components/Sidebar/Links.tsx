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

const MobileItems = [
  {
    label: "Home",
    url: "/",
    activeLinks: ["/", "/following", "/trending", "/bookmarks"],
    icon: homeIcon,
    requireAuth: false,
  },
  {
    label: "Chat",
    url: "/chat",
    icon: chatIcon,
    activeLinks: ["/chat"],
    requireAuth: true,
  },
  {
    label: "Notifications",
    url: "/notifications",
    activeLinks: ["/notifications"],
    icon: notificationsIcon,
    requireAuth: true,
  },
  {
    label: "Create",
    url: "/create",
    icon: createIcon,
    activeLinks: ["/create"],
    requireAuth: true,
  },
];

const TabItems = [
  { label: "Recent", url: "/", requireAuth: false },
  {
    label: "Following",
    url: "/following",
    requireAuth: true,
  },
  {
    label: "Trending",
    url: "/trending",
    requireAuth: false,
  },
  {
    label: "Bookmarks",
    url: "/bookmarks",
    requireAuth: true,
  },
];

function Links() {
  const { authenticated } = useAuthContext();
  const location = useLocation();

  return (
    <div className="links-wrapper">
      <div
        className={`tabs ${
          MobileItems[0].activeLinks.includes(location.pathname) && "active"
        }`}
      >
        <ul>
          {TabItems.map(({ label, url, requireAuth }, index) => (
            <li
              className={`${location.pathname == url && "active"}`}
              key={index}
            >
              <LinkToTop to={!authenticated && requireAuth ? "/signin" : url}>
                <p>{label}</p>
              </LinkToTop>
            </li>
          ))}
        </ul>
      </div>

      <div className="mobile-links">
        <ul className="links">
          {MobileItems.map(
            ({ label, icon, url, requireAuth, activeLinks }, index) => (
              <li
                className={`${
                  activeLinks.includes(location.pathname) && "active"
                }`}
                key={index}
              >
                <LinkToTop to={!authenticated && requireAuth ? "/signin" : url}>
                  <img src={icon} alt="Icon of home" />
                  <p>{label}</p>
                </LinkToTop>
              </li>
            )
          )}
        </ul>
      </div>

      {Items.map((section, index) => (
        <div key={index} className="desktop-links">
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
