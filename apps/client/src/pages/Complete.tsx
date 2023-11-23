import { logoIcon } from "../assets";

function CompletePage() {
  return (
    <form>
      <div className="logo">
        <img src={logoIcon} alt="Logo of chali" />
        <h3>Verify your email</h3>
      </div>
      <p className="header success">
        Signup completed successfully! <br /> Check your email for verfication
        link.
      </p>
      <a href="/signin">
        <button type="button">Go to login page</button>
      </a>
    </form>
  );
}

export default CompletePage;
