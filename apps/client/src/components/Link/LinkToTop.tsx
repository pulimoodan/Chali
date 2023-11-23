import { MouseEventHandler, ReactNode } from "react";
import { Link } from "react-router-dom";
import { useNavigateToTop } from "./useNavigateToTop";

interface Props {
  children: ReactNode;
  className?: string;
  to: string;
}

/** Link to the top of a page so that the scroll position isn't persisted between pages. Use this instead of React's build-in @see {@link Link}. */
export const LinkToTop = (props: Props) => {
  const navigateToTop = useNavigateToTop();

  const navigateAndReset: MouseEventHandler<HTMLAnchorElement> = (event) => {
    event.preventDefault();
    navigateToTop(props.to);
  };

  return (
    <Link className={props.className} onClick={navigateAndReset} to={props.to}>
      {props.children}
    </Link>
  );
};
