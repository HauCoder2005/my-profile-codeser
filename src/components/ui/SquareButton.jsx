import "./SquareButton.css";

function SquareButton({
  icon: Icon,
  text,
  children,
  type = "button",
  className = "",
  ...props
}) {
  const label = text || children;

  return (
    <button
      className={`square-button ${className}`.trim()}
      type={type}
      {...props}
    >
      {Icon ? <Icon className="square-button__icon" size={18} strokeWidth={2} /> : null}
      {label ? <span className="square-button__text">{label}</span> : null}
    </button>
  );
}

export default SquareButton;
