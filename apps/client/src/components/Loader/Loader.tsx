import { loadingIcon } from "../../assets";
import "./Loader.css";
import { useState, useRef, useEffect } from "react";

interface Props {
  loadPosts: (page: number) => Promise<boolean>;
}

function Loader({ loadPosts }: Props) {
  const [hideLoading, setHideloading] = useState(false);
  const loaderElem = useRef<HTMLDivElement>(null);

  let page = 0;
  let alreadyFetching = false;

  const handleScroll = async () => {
    if (!loaderElem.current) return;

    if (
      Math.ceil(loaderElem.current.getBoundingClientRect().top) >
        window.innerHeight ||
      alreadyFetching
    )
      return;

    page++;
    handleFetch();
  };

  const handleFetch = async () => {
    alreadyFetching = true;
    const done = await loadPosts(page);
    if (done) setHideloading(true);
    alreadyFetching = false;
  };

  useEffect(() => {
    handleFetch();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {!hideLoading && window.innerHeight <= document.body.offsetHeight && (
        <div
          className="loader"
          ref={loaderElem}
          style={{
            height: "30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img src={loadingIcon} alt="Loading gif" style={{ width: "20px" }} />
        </div>
      )}
    </>
  );
}

export default Loader;
