import { memo } from 'react';
import { NavLink } from 'react-router-dom';

interface MenuItemProps {
  to: string;
  icon: string;
  label: string;
  onClick?: () => void;
}

export const MenuItem = memo(function MenuItem({ to, icon, label, onClick }: MenuItemProps) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        [
          'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
          isActive
            ? 'text-white'
            : 'text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]',
        ].join(' ')
      }
      style={({ isActive }) =>
        isActive
          ? { backgroundImage: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }
          : undefined
      }
    >
      <span aria-hidden className="text-base leading-none">
        {icon}
      </span>
      <span>{label}</span>
    </NavLink>
  );
});
