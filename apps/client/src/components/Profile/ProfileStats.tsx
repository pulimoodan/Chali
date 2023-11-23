import axios from "axios";
import {
  bookmarksIcon,
  createIcon,
  followingIcon,
  trendingIcon,
} from "../../assets";
import { useEffect, useState } from "react";

interface Props {
  id: string;
}

function ProfileStats({ id }: Props) {
  const [stats, setStats] = useState({
    posts: 0,
    followers: 0,
    popularity: 0,
    bookmarks: 0,
  });

  const loadStats = async () => {
    const { data } = await axios.get(`/api/users/stats/${id}`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    setStats(data);
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div className="profile-stats">
      <div className="item">
        <div className="value">
          <img src={followingIcon} alt="Icon of followers" />
          <h3>{stats.followers}</h3>
        </div>
        <div className="label">Followers</div>
      </div>
      <div className="item">
        <div className="value">
          <img src={trendingIcon} alt="Icon of popularity" />
          <h3>{stats.popularity}</h3>
        </div>
        <div className="label">Popularity</div>
      </div>
      <div className="item">
        <div className="value">
          <img src={bookmarksIcon} alt="Icon of bookmarks" />
          <h3>{stats.bookmarks}</h3>
        </div>
        <div className="label">Bookmarks</div>
      </div>
      <div className="item">
        <div className="value">
          <img src={createIcon} alt="Icon of bookmarks" />
          <h3>{stats.posts}</h3>
        </div>
        <div className="label">Posts</div>
      </div>
    </div>
  );
}

export default ProfileStats;
