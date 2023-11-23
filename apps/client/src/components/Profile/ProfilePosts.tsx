import { PostEntity } from "../../lib/entities/Post";
import EmptyContainer from "../Empty/Empty";
import Loader from "../Loader/Loader";
import Post from "../Post/Post";
import "./Profile.css";
import axios from "axios";
import { useState } from "react";

interface Props {
  id: string;
}

function ProfilePosts({ id }: Props) {
  const [posts, setPosts] = useState<PostEntity[]>([]);

  const loadPosts = async (page: number = 0) => {
    const { data } = await axios.get(`/api/posts/profile/${id}?page=${page}`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (data.length == 0) return true;
    setPosts((state) => [...state, ...data]);
    return false;
  };

  return (
    <div className="profile-posts">
      <p className="title">Posts</p>

      <div className="list">
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
        <Loader loadPosts={loadPosts} />
        {posts.length == 0 && <EmptyContainer text="Nothing here." />}
      </div>
    </div>
  );
}

export default ProfilePosts;
