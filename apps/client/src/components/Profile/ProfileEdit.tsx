import { useAuthContext } from "../Hooks/useAuthContext";
import Modal from "../Modal/Modal";
import "./Profile.css";
import axios from "axios";
import {
  useEffect,
  useState,
  useMemo,
  ChangeEvent,
  SetStateAction,
  Dispatch,
} from "react";
import debounce from "lodash.debounce";
import UserEntity from "../../lib/entities/User";
import { useUIContext } from "../Hooks/useUIContext";

interface Props {
  active: boolean;
  onClose: () => void;
  profileUser: UserEntity | undefined;
  setProfileUser: Dispatch<SetStateAction<UserEntity | undefined>>;
}

type UserNameError = "hidden" | "error" | "success";

function ProfileEdit({ active, onClose, profileUser, setProfileUser }: Props) {
  const { user, setUser } = useAuthContext();
  const { showToast } = useUIContext();
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [userName, setUserName] = useState(user.userName);
  const [error, setError] = useState<UserNameError>("hidden");
  const [fetching, setFetching] = useState(false);

  const handleSave = async () => {
    setFetching(true);
    const { data } = await axios.patch(
      `/api/users/${user.id}`,
      { userName, firstName, lastName },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    setUser({ ...user, ...data });
    setProfileUser({ ...profileUser, ...data });
    setFetching(false);
    showToast("Details saved successfully!");
  };

  const fetchUserName = async () => {
    setFetching(true);
    const { data } = await axios.get(`/api/users/username/${userName}`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (data.success) {
      setError("success");
    } else {
      setError("error");
    }
    setFetching(false);
  };

  const handleUserNameChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
  };

  const debouncedResults = useMemo(() => {
    return debounce(handleUserNameChange, 300);
  }, []);

  useEffect(() => {
    return () => {
      debouncedResults.cancel();
    };
  });

  useEffect(() => {
    if (userName == user.userName) {
      setError("hidden");
    } else {
      fetchUserName();
    }
  }, [userName]);

  return (
    <Modal
      heading="Edit details"
      hint="Click save to update your details"
      action={{
        content: "Save",
        onAction: handleSave,
        loading: fetching,
        disabled: error == "error",
      }}
      active={active}
      onClose={onClose}
    >
      <div className="edit-details">
        <div className="row">
          <div className="input">
            <label htmlFor="firstName">First name</label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="input">
            <label htmlFor="lastName">Last name</label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>
        <div className="row">
          <div className="input">
            <label htmlFor="userName">Username</label>
            <input
              type="text"
              id="userName"
              defaultValue={userName}
              onChange={debouncedResults}
              autoComplete="none"
            />
            {error == "error" && (
              <p className="error">Oops! username already taken.</p>
            )}
            {error == "success" && (
              <p className="success">Yay! username is available.</p>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default ProfileEdit;
