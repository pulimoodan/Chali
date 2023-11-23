import "./Empty.css";

interface Props {
  text: string;
}

function EmptyContainer({ text }: Props) {
  return <p className="empty">{text}</p>;
}

export default EmptyContainer;
