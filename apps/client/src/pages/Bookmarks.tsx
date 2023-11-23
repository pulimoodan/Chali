import { useState } from "react";
import Post from "../components/Post/Post";
import axios from "axios";
import { PostEntity } from "../lib/entities/Post";
import Loader from "../components/Loader/Loader";
import EmptyContainer from "../components/Empty/Empty";

function BookmarksPage() {
  const [posts, setPosts] = useState<PostEntity[]>([]);

  const loadPosts = async (page: number = 0) => {
    const { data } = await axios.get(
      `/api/posts?type=bookmarked&page=${page}`,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (data.length == 0) return true;
    setPosts((state) => [...state, ...data]);
    return false;
  };

  return (
    <>
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
      <Loader loadPosts={loadPosts} />
      {posts.length == 0 && <EmptyContainer text="Nothing here." />}
    </>
  );
}

export default BookmarksPage;
