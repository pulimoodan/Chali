import Post from "../components/Post/Post";
import Comments from "../components/Comments/Comments";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { PostEntity } from "../lib/entities/Post";

function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState<PostEntity>();

  const loadPost = async () => {
    const { data } = await axios.get(`/api/posts/${id}`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    setPost(data);
  };

  useEffect(() => {
    loadPost();
  }, []);

  return (
    <>
      {post && <Post alone post={post} />}
      <Comments id={id || ""} />
    </>
  );
}

export default PostPage;
