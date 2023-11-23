import {
  bookmarksIcon,
  commentsIcon,
  followingIcon,
  reactionsIcon,
  trendingIcon,
} from "../../assets";
import { convertTimeToSince } from "../../lib/generalt";
import "./Notification.css";
import reactionImages from "../../assets/reactions";

interface Props {
  type: "comment" | "reaction" | "bookmark" | "follow";
  read: boolean;
  content: string;
  link: string;
  createdAt: Date;
}

function Notification({ type, read, content, link, createdAt }: Props) {
  const icons = {
    comment: commentsIcon,
    reaction: reactionsIcon,
    bookmark: bookmarksIcon,
    follow: followingIcon,
    trending: trendingIcon,
  };

  return (
    <a className="notification" href={link}>
      <img src={icons[type]} alt="Icon representing the type of notification" />
      <div className="details">
        <p
          className="content"
          dangerouslySetInnerHTML={{
            __html: content
              .split("*")
              .map((i) => {
                const value = parseInt(i);
                if (!isNaN(value)) {
                  const image = reactionImages[value];
                  return image;
                }
                return i;
              })
              .join(""),
          }}
        ></p>
        <div className="info">
          <div className={`badge ${read && "read"}`}>
            <span className="label">{read ? "Read" : "New"}</span>
          </div>
          <p>{convertTimeToSince(createdAt)}</p>
        </div>
      </div>
    </a>
  );
}

export default Notification;
