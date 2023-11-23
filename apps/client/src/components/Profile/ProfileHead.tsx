import { FiMoreHorizontal, FiUpload } from "react-icons/fi";
import "./Profile.css";
import { useState, useRef, useEffect, ChangeEvent } from "react";
import { createIcon, loadingIcon, shareIcon } from "../../assets";
import { capitalizeFirstLetter, copyToClipboard } from "../../lib/generalt";
import UserEntity from "../../lib/entities/User";
import axios from "axios";
import { useAuthContext } from "../Hooks/useAuthContext";
import ProfileEdit from "./ProfileEdit";
import { useUIContext } from "../Hooks/useUIContext";

interface Props {
  id: string;
}

function ProfileHead({ id }: Props) {
  const { user: authUser, setUser: setAuthUser, loaded } = useAuthContext();
  const { showToast } = useUIContext();
  const [morePopover, setMorepopover] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [user, setUser] = useState<UserEntity>();
  const [editModal, setEditModal] = useState(false);

  const popOver = useRef(null);
  const imageInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadDetails();
    function handleClickOutside(e: Event) {
      if (popOver.current && !(popOver.current as any).contains(e.target)) {
        setMorepopover(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const loadDetails = async () => {
    const { data } = await axios.get(`/api/users/${id}`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    setUser(data);
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    setImageUploading(true);
    let formData = new FormData();
    formData.append("image", e.target.files[0]);

    const { data } = await axios.post(`/api/users/upload`, formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (user) setUser({ ...user, profilePic: data });
    setAuthUser({ ...authUser, profilePic: data });
    setImageUploading(false);
    showToast("Image uploaded successfully!");
  };

  const shareProfile = () => {
    const url = window.location.origin + "/profile/" + user?.id;
    copyToClipboard(url);
    showToast("Link copied!");
  };

  return (
    <div className="profile-head">
      <div className="profile-image">
        <input
          type="file"
          onChange={handleFileChange}
          style={{ display: "none" }}
          accept="image/*"
          ref={imageInput}
        />
        {imageUploading ? (
          <div className="loading">
            <img src={loadingIcon} alt="Loading gif" />
          </div>
        ) : (
          <div
            className="upload"
            onClick={() => {
              if (imageInput.current) imageInput.current.click();
            }}
          >
            <FiUpload />
          </div>
        )}
        <img
          src={
            user?.profilePic ||
            `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${user?.firstName}+${user?.lastName}`
          }
          alt="Profile image"
        />
      </div>
      <div className="card">
        <div className="details">
          <h4>
            {capitalizeFirstLetter(user?.firstName || "")}{" "}
            {capitalizeFirstLetter(user?.lastName || "")}{" "}
            <a href="#">{user?.email}</a>
          </h4>
          <p>
            @{user?.userName} | A member since{" "}
            {new Date(user?.createdAt || "").toLocaleString("en", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
        <div
          className={`action popover ${morePopover && "active"}`}
          ref={popOver}
        >
          <div onClick={() => setMorepopover((state) => !state)}>
            <FiMoreHorizontal />
          </div>
          <ul className={`menu ${morePopover && "active"}`}>
            <li onClick={shareProfile}>
              <img src={shareIcon} alt="Icon of share" /> Share profile
            </li>
            {id == authUser.id && (
              <li onClick={() => setEditModal(true)}>
                <img src={createIcon} alt="Icon of edit" /> Edit profile
              </li>
            )}
          </ul>
        </div>
      </div>

      {loaded && (
        <ProfileEdit
          active={editModal}
          onClose={() => setEditModal(false)}
          profileUser={user}
          setProfileUser={setUser}
        />
      )}
    </div>
  );
}

export default ProfileHead;
