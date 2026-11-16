import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { expect, test } from 'vitest';
import { BottomNav } from './BottomNav';

test('рендерит 5 навигационных ссылок с правильными адресами', () => {
  render(
    <MemoryRouter initialEntries={['/alcohol']}>
      <BottomNav />
    </MemoryRouter>,
  );

  const links = screen.getAllByRole('link');
  expect(links).toHaveLength(5);
  expect(screen.getByRole('link', { name: /Алкоголь/ })).toHaveAttribute('href', '/alcohol');
  expect(screen.getByRole('link', { name: /Фастфуд/ })).toHaveAttribute('href', '/fastfood');
  expect(screen.getByRole('link', { name: /Таблетки/ })).toHaveAttribute('href', '/pills');
  expect(screen.getByRole('link', { name: /Настроение/ })).toHaveAttribute('href', '/mood');
  expect(screen.getByRole('link', { name: /Интим/ })).toHaveAttribute('href', '/intimate');
});
