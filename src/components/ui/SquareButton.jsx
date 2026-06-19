import "./SquareButton.css";

function SquareButton({
  as: Component = "button",
  icon: Icon,
  text,
  children,
  type = "button",
  className = "",
  ...props
}) {
  const label = text || children;
  const componentProps = Component === "button" ? { type } : {};

  return (
    <Component
      className={`square-button ${className}`.trim()}
      {...componentProps}
      {...props}
    >
      {Icon ? <Icon className="square-button__icon" size={18} strokeWidth={2} /> : null}
      {label ? <span className="square-button__text">{label}</span> : null}
    </Component>
  );
}

export default SquareButton;
