import { memo } from 'react';
import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/alcohol', icon: '🍷', label: 'Алкоголь' },
  { to: '/fastfood', icon: '🍔', label: 'Фастфуд' },
  { to: '/pills', icon: '💊', label: 'Таблетки' },
  { to: '/mood', icon: '🌈', label: 'Настроение' },
  { to: '/intimate', icon: '❤️', label: 'Интим' },
];

export const BottomNav = memo(function BottomNav() {
  return (
    <nav
      aria-label="Нижняя навигация"
      className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-center justify-around border-t border-[color:var(--border)] px-2 lg:hidden"
      style={{
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        paddingBottom: 'max(0px, env(safe-area-inset-bottom))',
      }}
    >
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            [
              'flex min-h-[44px] flex-1 flex-col items-center justify-center rounded-xl py-1 transition select-none',
              isActive
                ? 'font-semibold text-white'
                : 'text-[color:var(--text-muted)] hover:text-[color:var(--text-secondary)]',
            ].join(' ')
          }
        >
          {({ isActive }) => (
            <>
              <span
                aria-hidden
                className={[
                  'flex h-7 w-7 items-center justify-center rounded-lg text-lg transition',
                  isActive ? 'scale-110 shadow-sm' : '',
                ].join(' ')}
                style={
                  isActive
                    ? { backgroundImage: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }
                    : undefined
                }
              >
                {item.icon}
              </span>
              <span className="mt-0.5 text-[10px] tracking-tight">{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
});
