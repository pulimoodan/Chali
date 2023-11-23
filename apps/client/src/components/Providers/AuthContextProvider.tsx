import { useEffect, useState, ReactNode } from "react";
import { AuthContext } from "../Hooks/useAuthContext";
import axios from "axios";
import UserEntity from "../../lib/entities/User";

interface Props {
  children: ReactNode;
}

function AuthContextProvider({ children }: Props) {
  const [loaded, setLoaded] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<UserEntity>({
    firstName: "Unknown",
    lastName: "User",
    email: "mrunknown@chali.net",
    userName: "mrunknown",
    profilePic: "",
    id: "",
    createdAt: new Date(),
    _count: {
      notifications: 0,
    },
  });

  const getUser = async () => {
    try {
      const { data } = await axios.get("/api/users", {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      setUser({
        ...data,
      });
      setAuthenticated(true);
    } catch (_error) {}
    setLoaded(true);
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <AuthContext.Provider value={{ authenticated, loaded, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;
