import "./SquareCard.css";

function SquareCard({ as: Component = "div", className = "", children, ...props }) {
  return (
    <Component className={`square-card ${className}`.trim()} {...props}>
      {children}
    </Component>
  );
}

export default SquareCard;
