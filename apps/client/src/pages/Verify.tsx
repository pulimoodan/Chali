import axios from "axios";
import { useEffect, useState } from "react";
import { loadingIcon, logoIcon } from "../assets";
import { useParams } from "react-router-dom";

function VerifyPage() {
  const { id } = useParams();
  const [fetching, setFetching] = useState(true);
  const [verified, setVerified] = useState(false);

  const handleSubmit = async () => {
    try {
      const { data } = await axios.post(
        "/api/auth/verify",
        {
          verificationId: id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (data.success) {
        setVerified(true);
      }
    } catch (_e) {
      setVerified(false);
    }
    setFetching(false);
  };

  useEffect(() => {
    handleSubmit();
  }, []);

  return (
    <form>
      <div className="logo">
        <img src={logoIcon} alt="Logo of chali" />
        <h3>Verify Email</h3>
      </div>
      {!fetching && verified && (
        <p className="header success">Email verified successfully!</p>
      )}
      {!fetching && !verified && (
        <p className="header error">Email verification failed!</p>
      )}

      {fetching && (
        <>
          <p className="header">Verifying...</p>
          <img src={loadingIcon} alt="Loading gif" style={{ width: "15px" }} />
        </>
      )}
      <a href="/signin">
        <button type="button" disabled={fetching}>
          Go to login page
        </button>
      </a>
    </form>
  );
}

export default VerifyPage;
