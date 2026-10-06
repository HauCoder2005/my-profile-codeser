import React from 'react';

// Borderless, minimal card: just a faint frosted backdrop so text stays readable over the 3D space.
// Styles in index.css (`.panel`).
const Panel = ({ as: Tag = 'div', className = '', children, ...rest }) => (
  <Tag className={`panel group ${className}`} {...rest}>
    {children}
  </Tag>
);

export default Panel;
