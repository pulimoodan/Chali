import { Dispatch, SetStateAction, createContext, useContext } from "react";
import UserEntity from "../../lib/entities/User";

export interface AuthData {
  loaded: boolean;
  authenticated: boolean;
  user: UserEntity;
  setUser: Dispatch<SetStateAction<UserEntity>>;
}

export const AuthContext = createContext<AuthData>({
  loaded: false,
  authenticated: false,
  user: {
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
  },
  setUser: () => {},
});

export const useAuthContext = () => useContext(AuthContext);
