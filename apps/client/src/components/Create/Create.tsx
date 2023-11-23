import axios from "axios";
import { partyIcon, sendIcon } from "../../assets";
import "./Create.css";
import { useEffect, useState, ChangeEvent } from "react";
import { useAuthContext } from "../Hooks/useAuthContext";
import { capitalizeFirstLetter, getOrdinal } from "../../lib/generalt";
import { useUIContext } from "../Hooks/useUIContext";

const MAX_LENGTH = 500;

function Create() {
  const { user, loaded } = useAuthContext();
  const { showToast } = useUIContext();
  const [posts, setPosts] = useState(0);
  const [content, setContent] = useState("");

  const loadStats = async () => {
    const { data } = await axios.get(`/api/users/stats/${user.id}`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    setPosts(data.posts);
  };

  const handlePost = async () => {
    if (content.trim().length > 0) {
      await axios.post(
        `/api/posts`,
        {
          content,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setContent("");
      showToast("Post published successfully!");
    }
  };

  const handleContentChange = async (e: ChangeEvent<HTMLTextAreaElement>) => {
    let tempContent = e.target.value;
    if (tempContent.length > MAX_LENGTH) return;
    setContent(tempContent);
  };

  useEffect(() => {
    if (loaded) {
      loadStats();
    }
  }, [loaded]);

  return (
    <div className="create">
      <div className="top">
        <img
          src={
            user?.profilePic ||
            `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${user?.firstName}+${user?.lastName}`
          }
          alt="Profile image"
        />

        <div className="details">
          <h4>
            {capitalizeFirstLetter(user?.firstName || "")}{" "}
            {capitalizeFirstLetter(user?.lastName || "")}
          </h4>
          <p>@{user.userName}</p>
        </div>

        <div className="update">
          <img src={partyIcon} alt="Icon of party" />
          <p>It's your {getOrdinal(posts + 1)} post</p>
        </div>
      </div>
      <div className="content">
        <textarea
          name="content"
          placeholder="Write something..."
          rows={10}
          value={content}
          onChange={handleContentChange}
        ></textarea>
      </div>
      <div className="bottom">
        <p className="info">
          {content.length.toString()} / {MAX_LENGTH.toString()}
        </p>
        <div className="action" onClick={handlePost}>
          <p>Post</p>
          <img src={sendIcon} alt="Icon of send" />
        </div>
      </div>
    </div>
  );
}

export default Create;
