import { useEffect } from "react";
import { X } from "lucide-react";
import "./SquareModal.css";

function SquareModal({ open, title, onClose, children }) {
  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="square-modal__overlay"
      role="presentation"
      onMouseDown={onClose}
    >
      <section
        aria-modal="true"
        aria-label={title}
        className="square-modal"
        role="dialog"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="square-modal__bar">
          <h2 className="square-modal__title">{title}</h2>
          <button
            aria-label="Close project detail"
            className="square-modal__close"
            type="button"
            onClick={onClose}
          >
            <X size={20} strokeWidth={2} />
          </button>
        </div>
        <div className="square-modal__body">{children}</div>
      </section>
    </div>
  );
}

export default SquareModal;
