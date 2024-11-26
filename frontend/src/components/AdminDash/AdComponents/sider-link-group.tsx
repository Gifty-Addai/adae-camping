import React, { useState, ReactNode } from 'react';

interface SidebarLinkGroupProps {
  children: (handleClick: () => void, open: boolean) => ReactNode;
  activeCondition: boolean;
}

const SidebarLinkGroup = ({ children, activeCondition }: SidebarLinkGroupProps) => {
  const [open, setOpen] = useState(activeCondition);

  const handleClick = () => {
    setOpen(!open);
  };

  return <>{children(handleClick, open)}</>;
};

export default SidebarLinkGroup;
