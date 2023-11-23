import CommentEntity from "../../lib/entities/Comment";
import { capitalizeFirstLetter, convertTimeToSince } from "../../lib/generalt";
import "./Comment.css";

interface Props {
  comment: CommentEntity;
}

function Comment({ comment }: Props) {
  return (
    <div className="comment">
      <img
        src={
          comment.user.profilePic ||
          `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${comment.user.firstName}+${comment.user.lastName}`
        }
        alt="Profile image"
      />
      <div className="content">
        <div className="details">
          <h4>
            {capitalizeFirstLetter(comment.user.firstName)}{" "}
            {capitalizeFirstLetter(comment.user.lastName)}
          </h4>
          <p>
            @{comment.user.userName} | {convertTimeToSince(comment.createdAt)}
          </p>
        </div>
        <p>{comment.content}</p>
      </div>
    </div>
  );
}

export default Comment;
