import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { expect, test } from 'vitest';
import { CalendarTabs } from './CalendarTabs';

test('рендерит табы с правильными подписями', () => {
  render(
    <MemoryRouter>
      <CalendarTabs />
    </MemoryRouter>,
  );
  expect(screen.getByText('Алкоголь')).toBeInTheDocument();
  expect(screen.getByText('Таблетки')).toBeInTheDocument();
  expect(screen.getByText('Фастфуд')).toBeInTheDocument();
  expect(screen.getByText('Настроение')).toBeInTheDocument();
  expect(screen.getByText('Интим')).toBeInTheDocument();
});

test('помчает активный таб по текущему пути', () => {
  render(
    <MemoryRouter initialEntries={['/intimate']}>
      <CalendarTabs />
    </MemoryRouter>,
  );
  expect(screen.getByText('Интим')).toHaveAttribute('aria-current', 'page');
  expect(screen.getByText('Таблетки')).not.toHaveAttribute('aria-current');
  expect(screen.getByText('Алкоголь')).not.toHaveAttribute('aria-current');
  expect(screen.getByText('Фастфуд')).not.toHaveAttribute('aria-current');
});
