import { useRef, useState, useEffect } from "react";
import { LinkToTop } from "../Link/LinkToTop";
import { useAuthContext } from "../Hooks/useAuthContext";
import { capitalizeFirstLetter } from "../../lib/generalt";
import { FiMoreVertical } from "react-icons/fi";
import {
  chatIcon,
  createIcon,
  notificationsIcon,
  settingsIcon,
  signOutIcon,
} from "../../assets";
import axios from "axios";
import { useUIContext } from "../Hooks/useUIContext";

function Profile() {
  const { showToast } = useUIContext();
  const { user, authenticated } = useAuthContext();
  const [morePopover, setMorepopover] = useState(false);
  const [mobilePopoverActive, setMobilePopoverActive] = useState(false);
  const popOver = useRef(null);
  const mobilePopOver = useRef(null);

  const handleSignout = async () => {
    await axios.post("/api/auth/signout", {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    showToast("Signed out successfully!");
    setTimeout(
      () => (window.location.href = window.location.origin + "/signin"),
      1000
    );
  };

  useEffect(() => {
    function handleClickOutside(e: Event) {
      if (popOver.current && !(popOver.current as any).contains(e.target)) {
        setMorepopover(false);
      }
      if (
        mobilePopOver.current &&
        !(mobilePopOver.current as any).contains(e.target)
      ) {
        setMobilePopoverActive(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div
        className={`overlay ${mobilePopoverActive == true && "active"}`}
      ></div>
      <div className="profile">
        <LinkToTop to={authenticated ? `/profile/${user.id}` : "/signin"}>
          <img
            src={
              user.profilePic ||
              `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${user.firstName}+${user.lastName}`
            }
            alt="Profile image"
          />
        </LinkToTop>
        <div className="details">
          <LinkToTop to={authenticated ? `/profile/${user.id}` : "/signin"}>
            <h4>
              {capitalizeFirstLetter(user.firstName)}{" "}
              {capitalizeFirstLetter(user.lastName)}
            </h4>
          </LinkToTop>
          <LinkToTop to={authenticated ? `/profile/${user.id}` : "/signin"}>
            <p>@{user.userName}</p>
          </LinkToTop>
        </div>
        <div
          className={`action popover ${morePopover && "active"}`}
          ref={popOver}
        >
          <div onClick={() => setMorepopover((state) => !state)}>
            <FiMoreVertical />
          </div>
          <ul className={`menu ${morePopover && "active"}`}>
            <LinkToTop to="/settings">
              <li>
                <img src={settingsIcon} alt="Icon of share" /> Settings
              </li>
            </LinkToTop>
            <li onClick={handleSignout}>
              <img src={signOutIcon} alt="Icon of copy" /> Sign out
            </li>
          </ul>
        </div>
      </div>

      <div className="profile-mobile">
        <img
          src={
            user.profilePic ||
            `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${user.firstName}+${user.lastName}`
          }
          alt="Profile image"
          onClick={() => setMobilePopoverActive((state) => !state)}
        />
        <div
          className={`mobile-sidenav ${mobilePopoverActive && "active"}`}
          ref={mobilePopOver}
          onClick={() => setMobilePopoverActive(false)}
        >
          <div className="profile">
            <LinkToTop to={authenticated ? `/profile/${user.id}` : "/signin"}>
              <img
                src={
                  user.profilePic ||
                  `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${user.firstName}+${user.lastName}`
                }
                alt="Profile image"
              />
            </LinkToTop>
            <div className="details">
              <LinkToTop to={authenticated ? `/profile/${user.id}` : "/signin"}>
                <h4>
                  {capitalizeFirstLetter(user.firstName)}{" "}
                  {capitalizeFirstLetter(user.lastName)}
                </h4>
              </LinkToTop>
              <LinkToTop to={authenticated ? `/profile/${user.id}` : "/signin"}>
                <p>@{user.userName}</p>
              </LinkToTop>
            </div>
          </div>

          <ul>
            <LinkToTop to="/settings">
              <li>
                <img src={settingsIcon} alt="Icon of share" /> Settings
              </li>
            </LinkToTop>
            <a onClick={handleSignout}>
              <li>
                <img src={signOutIcon} alt="Icon of copy" /> Sign out
              </li>
            </a>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Profile;
