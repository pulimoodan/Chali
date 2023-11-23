import { ReactNode } from "react";
import "./Modal.css";
import { TfiClose } from "react-icons/tfi";

interface Props {
  heading: string;
  hint: string;
  onClose: () => void;
  active: boolean;
  action: {
    content: string;
    onAction: () => void;
    loading: boolean;
    disabled: boolean;
  };
  children: ReactNode;
}

function Modal({ heading, hint, onClose, action, active, children }: Props) {
  return (
    <div className={`modal-wrapper ${active && "active"}`} onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="head">
          <h2>{heading}</h2>
          <button className="close" onClick={onClose}>
            <TfiClose />
          </button>
        </div>
        <div className="content">{children}</div>
        <div className="footer">
          <p className="hint">{hint}</p>
          <button
            className={`action ${
              (action.disabled || action.loading) && "disabled"
            }`}
            onClick={action.onAction}
            disabled={action.disabled}
          >
            Save
          </button>
        </div>
        {action.loading && (
          <div className="loading">
            <div className="bar"></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;
