// ui/menu.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';

interface MenuProps {
  children: React.ReactNode;
}

interface MenuItemProps {
  href: string;
  active?: boolean;
  children: React.ReactNode;
}

interface SubMenuProps {
  title: string;
  active?: boolean;
  children: React.ReactNode;
}

export const Menu = ({ children }: MenuProps) => (
  <ul className="space-y-2">{children}</ul>
);

Menu.Item = ({ href, active, children }: MenuItemProps) => (
  <li>
    <NavLink
      to={href}
      className={`block rounded p-2 text-sm ${
        active ? 'bg-gray-800 text-white' : 'hover:bg-gray-700 hover:text-white'
      }`}
    >
      {children}
    </NavLink>
  </li>
);

Menu.SubMenu = ({ title, active, children }: SubMenuProps) => (
  <li className="space-y-1">
    <button className="w-full text-left text-sm">
      {title}
    </button>
    <ul className={`${active ? 'block' : 'hidden'} pl-4 space-y-1`}>
      {children}
    </ul>
  </li>
);
