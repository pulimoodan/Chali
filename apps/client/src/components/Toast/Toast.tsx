import "./Toast.css";

interface Props {
  text: string;
  active: boolean;
}

function Toast({ text, active }: Props) {
  return (
    <div className={`toast ${active && "active"}`}>
      <p className="content">{text}</p>
    </div>
  );
}

export default Toast;
