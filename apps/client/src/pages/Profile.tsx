import ProfileHead from "../components/Profile/ProfileHead";
import ProfileStats from "../components/Profile/ProfileStats";
import ProfilePosts from "../components/Profile/ProfilePosts";
import { useParams } from "react-router-dom";

function ProfilePage() {
  const { id } = useParams();

  return (
    <>
      <ProfileHead id={id || ""} />
      <ProfileStats id={id || ""} />
      <ProfilePosts id={id || ""} />
    </>
  );
}

export default ProfilePage;
