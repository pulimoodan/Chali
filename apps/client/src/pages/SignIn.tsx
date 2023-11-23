import axios, { AxiosError } from "axios";
import { useState } from "react";
import { loadingIcon, logoIcon } from "../assets";
import { useUIContext } from "../components/Hooks/useUIContext";

function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fetching, setFetching] = useState(false);
  const { showToast } = useUIContext();

  const handleSubmit = async (e: any) => {
    setFetching(true);
    try {
      e.preventDefault();
      const { data } = await axios.post(
        "/api/auth/signin",
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (data.token) {
        window.location.href = `${window.location.origin}/`;
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
        <h3>Sign In</h3>
      </div>
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
          "Sign In"
        )}
      </button>
      <p className="footer">
        New here? <a href="/signup">Sign Up</a>
      </p>
    </form>
  );
}

export default SignInPage;
