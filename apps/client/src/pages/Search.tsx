import { useEffect, useState } from "react";
import Post from "../components/Post/Post";
import axios from "axios";
import { PostEntity } from "../lib/entities/Post";
import Loader from "../components/Loader/Loader";
import EmptyContainer from "../components/Empty/Empty";

interface Props {
  search: string;
}

function SearchPage({ search }: Props) {
  const [results, setResults] = useState<PostEntity[]>([]);

  const loadResults = async (page: number = 0) => {
    const { data } = await axios.get(
      `/api/posts/search?page=${page}&query=${search}`,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (data.length == 0) return true;
    setResults((state) => [...state, ...data]);
    return false;
  };

  useEffect(() => {
    setResults(() => []);
    loadResults();
  }, [search]);

  return (
    <>
      {results.map((result) => (
        <Post post={result as PostEntity} key={result.id} />
      ))}
      {results.length == 0 && <EmptyContainer text="Nothing found." />}
      <Loader loadPosts={loadResults} />
    </>
  );
}

export default SearchPage;
