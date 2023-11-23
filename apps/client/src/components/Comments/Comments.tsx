import axios from "axios";
import { sendIcon } from "../../assets";
import Comment from "../Comment/Comment";
import "./Comments.css";
import { useEffect, useRef, useState } from "react";
import CommentEntity from "../../lib/entities/Comment";
import { useAuthContext } from "../Hooks/useAuthContext";
import EmptyContainer from "../Empty/Empty";

interface Props {
  id: string;
}

function Comments({ id }: Props) {
  const { user } = useAuthContext();
  const textArea = useRef<HTMLTextAreaElement>(null);
  const [comments, setComments] = useState<CommentEntity[]>([]);
  const [newComment, setNewComment] = useState("");

  const loadComments = async () => {
    const { data } = await axios.get(`/api/comments/post/${id}`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    setComments(data);
  };

  const hanldePostComment = async () => {
    if (newComment.trim().length > 0) {
      const { data } = await axios.post(
        `/api/comments`,
        { postId: id, userId: user.id, content: newComment },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setComments([data, ...comments]);
      setNewComment("");
    }
  };

  useEffect(() => {
    loadComments();
  }, []);

  function textAreaAdjust() {
    if (!textArea.current) return;
    textArea.current.style.height = "inherit";
    textArea.current.style.height = `${textArea.current.scrollHeight}px`;
  }

  return (
    <div className="comments">
      <div className="write">
        <img
          src={
            user.profilePic ||
            `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${user.firstName}+${user.lastName}`
          }
          alt="Profile image"
        />
        <div className="input">
          <textarea
            placeholder="Leave a comment"
            name="comment"
            rows={1}
            onKeyUp={textAreaAdjust}
            ref={textArea}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          ></textarea>
          <img src={sendIcon} alt="Icon of send" onClick={hanldePostComment} />
        </div>
      </div>
      <ul className="list">
        {comments.map((comment) => (
          <Comment comment={comment} key={comment.id} />
        ))}
        {comments.length == 0 && <EmptyContainer text="No comments yet." />}
      </ul>
    </div>
  );
}

export default Comments;
