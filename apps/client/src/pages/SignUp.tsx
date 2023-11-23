import axios, { AxiosError } from "axios";
import { useState } from "react";
import { loadingIcon, logoIcon } from "../assets";
import { useUIContext } from "../components/Hooks/useUIContext";

function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [fetching, setFetching] = useState(false);
  const { showToast } = useUIContext();

  const handleSubmit = async (e: any) => {
    setFetching(true);
    try {
      e.preventDefault();
      const { data } = await axios.post(
        "/api/auth/signup",
        {
          email,
          password,
          firstName,
          lastName,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (data) {
        window.location.href = `${window.location.origin}/signup/completed`;
      }
    } catch (e) {
      if (e instanceof AxiosError) {
        showToast(e.response?.data.message);
      }
    }
    setFetching(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="logo">
        <img src={logoIcon} alt="Logo of chali" />
        <h3>Sign Up</h3>
      </div>
      <label htmlFor="first-name">First name</label>
      <input
        type="text"
        name="first-name"
        id="first-name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        required
      />
      <label htmlFor="last-name">Last name</label>
      <input
        type="text"
        name="last-name"
        id="last-name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        required
      />
      <label htmlFor="email">Email</label>
      <input
        type="email"
        name="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <label htmlFor="password">Password</label>
      <input
        type="password"
        name="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">
        {fetching ? (
          <img src={loadingIcon} alt="Loading gif" style={{ width: "15px" }} />
        ) : (
          "Sign Up"
        )}
      </button>
      <p className="footer">
        Already registered? <a href="/signin">Sign In</a>
      </p>
    </form>
  );
}

export default SignUpPage;
