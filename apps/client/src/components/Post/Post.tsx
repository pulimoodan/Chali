import { FiArrowLeft, FiMoreHorizontal } from "react-icons/fi";
import "./Post.css";
import {
  commentsIcon,
  copyIcon,
  deleteIcon,
  postBookmarksIcon,
  reactionsIcon,
  shareIcon,
} from "../../assets";
import reactionImages from "../../assets/reactions";
import { useEffect, useRef, useState } from "react";
import { LinkToTop } from "../Link/LinkToTop";
import { PostEntity } from "../../lib/entities/Post";
import {
  capitalizeFirstLetter,
  convertTimeToSince,
  copyToClipboard,
} from "../../lib/generalt";
import axios from "axios";
import { useAuthContext } from "../Hooks/useAuthContext";
import { useUIContext } from "../Hooks/useUIContext";

const reactionValues = [-2, -1, 1, 2, 3, 4];

interface Props {
  alone?: boolean;
  post: PostEntity;
}

function Post({ alone = false, post }: Props) {
  const { user } = useAuthContext();
  const { showToast, setBodyWrap } = useUIContext();
  const [reacted, setReacted] = useState(post.reacted);
  const [bookmarked, setBookmarked] = useState(post.bookmarked);
  const [bookmarks, setBookmarks] = useState(post.bookmarks);
  const [reactions, setReactions] = useState(post.reactions);
  const [popularity, setPopularity] = useState(post.popularity);
  const [morePopover, setMorepopover] = useState(false);
  const [following, setFollowing] = useState(post.user.following);
  const [deleted, setDeleted] = useState(false);
  const popOver = useRef(null);

  const handleReaction = async (value: number) => {
    let currentPopularity = popularity;
    currentPopularity -= reacted;
    await axios.post(
      `/api/posts/react/${post.id}`,
      { value },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    currentPopularity += value;
    if (reacted == 0) setReactions((state) => ++state);
    setPopularity(currentPopularity);
    setReacted(value);
  };

  const handleBookmark = async () => {
    const value = !bookmarked;
    let currentBookmarks = bookmarks;
    await axios.post(
      `/api/posts/bookmark/${post.id}`,
      { value },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    currentBookmarks += value ? 1 : -1;
    setBookmarks(currentBookmarks);
    setBookmarked(value);
  };

  const handleFollow = async () => {
    await axios.post(
      `/api/users/follow/${post.user.id}`,
      {},
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    setFollowing(true);
  };

  const handleUnFollow = async () => {
    await axios.delete(`/api/users/follow/${post.user.id}`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    setFollowing(false);
  };

  const handlePostDelete = async () => {
    await axios.delete(`/api/posts/${post.id}`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    setDeleted(true);
    showToast("Post deleted successfully!");
  };

  const sharePost = () => {
    const url = window.location.origin + "/post/" + post.id;
    copyToClipboard(url);
    showToast("Link copied!");
  };

  const copyContent = () => {
    copyToClipboard(post.content);
    showToast("Content copied!");
  };

  useEffect(() => {
    function handleClickOutside(e: Event) {
      if (popOver.current && !(popOver.current as any).contains(e.target)) {
        setMorepopover(false);
      }
      return false;
    }

    document.addEventListener("mousedown", handleClickOutside, false);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside, false);
    };
  }, []);

  if (deleted) return <></>;

  return (
    <div className="post">
      <div className="top">
        {alone && (
          <div className="action">
            <LinkToTop to="/">
              <div className="wrapper">
                <FiArrowLeft />
              </div>
            </LinkToTop>
          </div>
        )}

        <a href={`/profile/${post.user.id}`} style={{ height: "40px" }}>
          <img
            src={
              post.user.profilePic ||
              `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${post.user.firstName}+${post.user.lastName}`
            }
            alt="Profile image"
          />
        </a>

        <div className="details">
          <h4>
            {capitalizeFirstLetter(post.user.firstName)}{" "}
            {capitalizeFirstLetter(post.user.lastName)}{" "}
            {user.id != post.user.id &&
              (following ? (
                <a onClick={handleUnFollow}>Following</a>
              ) : (
                <a onClick={handleFollow}>Follow</a>
              ))}
          </h4>
          <p>
            @{post.user.userName} | {convertTimeToSince(post.createdAt)}
          </p>
        </div>

        <div
          className={`action popover ${morePopover && "active"}`}
          ref={popOver}
        >
          <div
            onClick={() => {
              setMorepopover((state) => !state);
              setBodyWrap(true);
            }}
            className="wrapper"
          >
            <FiMoreHorizontal />
          </div>
          <ul className={`menu ${morePopover && "active"}`}>
            <li onClick={sharePost}>
              <img src={shareIcon} alt="Icon of share" /> Share post
            </li>
            <li onClick={copyContent}>
              <img src={copyIcon} alt="Icon of copy" /> Copy content
            </li>
            {user.id == post.user.id && (
              <li onClick={handlePostDelete}>
                <img src={deleteIcon} alt="Icon of delete" /> Delete post
              </li>
            )}
          </ul>
        </div>
      </div>

      <LinkToTop to={`/post/${post.id}`}>
        <div className="content">
          {post.content.split(/\r\n|\r|\n/gi).map((content, key) => (
            <p key={key}>{content}</p>
          ))}
        </div>
      </LinkToTop>
      <div className="bottom">
        <div className="actions">
          <div className={`action ${reacted != 0 && "active"}`}>
            <img
              src={
                reacted != 0
                  ? reactionImages[reactionValues.indexOf(reacted)]
                  : reactionsIcon
              }
              alt="Icon of reaction"
            />
            <p>{reactions}</p>
            <div className="reactions">
              {reactionImages.map((image, index) => (
                <div
                  className={`${
                    index == reactionValues.indexOf(reacted) && "active"
                  }`}
                  onClick={() => handleReaction(reactionValues[index])}
                >
                  <img
                    src={image}
                    alt="Icon of a type of reaction"
                    key={index}
                  />
                </div>
              ))}
            </div>
          </div>
          <LinkToTop to={`/post/${post.id}`}>
            <div className={`action ${post.commented && "active"}`}>
              <span className="label">Comment</span>
              <img src={commentsIcon} alt="Icon of comment" />
              <p>{post.comments}</p>
            </div>
          </LinkToTop>
          <div
            className={`action ${bookmarked && "active"}`}
            onClick={handleBookmark}
          >
            <span className="label">
              {bookmarked ? "Unbookmark" : "Bookmark"}
            </span>
            <img src={postBookmarksIcon} alt="Icon of bookmark" />
            <p>{bookmarks}</p>
          </div>
        </div>
        <div className="status">
          <p>{popularity} popularity</p>
        </div>
      </div>
    </div>
  );
}

export default Post;
