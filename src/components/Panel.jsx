import React from 'react';

// High-tech Cyber HUD Glass Panel with responsive corner brackets and zero layout reflow
const Panel = ({ as: Tag = 'div', className = '', children, showCorners = true, ...rest }) => (
  <Tag className={`panel group relative ${className}`} {...rest}>
    {showCorners && (
      <>
        {/* Tech Corner Brackets */}
        <span aria-hidden className="absolute -top-[1px] -left-[1px] w-2.5 h-2.5 border-t-2 border-l-2 border-accent/60 pointer-events-none group-hover:border-accent transition-colors duration-200 z-10" />
        <span aria-hidden className="absolute -top-[1px] -right-[1px] w-2.5 h-2.5 border-t-2 border-r-2 border-accent/60 pointer-events-none group-hover:border-accent transition-colors duration-200 z-10" />
        <span aria-hidden className="absolute -bottom-[1px] -left-[1px] w-2.5 h-2.5 border-b-2 border-l-2 border-accent/60 pointer-events-none group-hover:border-accent transition-colors duration-200 z-10" />
        <span aria-hidden className="absolute -bottom-[1px] -right-[1px] w-2.5 h-2.5 border-b-2 border-r-2 border-accent/60 pointer-events-none group-hover:border-accent transition-colors duration-200 z-10" />
      </>
    )}
    {children}
  </Tag>
);

export default Panel;
