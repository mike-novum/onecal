import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { expect, test } from 'vitest';
import { CalendarTabs } from './CalendarTabs';

test('рендерит три таба с правильными подписями', () => {
  render(
    <MemoryRouter>
      <CalendarTabs />
    </MemoryRouter>,
  );
  expect(screen.getByText('Алкоголь')).toBeInTheDocument();
  expect(screen.getByText('Таблетки')).toBeInTheDocument();
  expect(screen.getByText('Фастфуд')).toBeInTheDocument();
});

test('помчает активный таб по текущему пути', () => {
  render(
    <MemoryRouter initialEntries={['/pills']}>
      <CalendarTabs />
    </MemoryRouter>,
  );
  expect(screen.getByText('Таблетки')).toHaveAttribute('aria-current', 'page');
  expect(screen.getByText('Алкоголь')).not.toHaveAttribute('aria-current');
  expect(screen.getByText('Фастфуд')).not.toHaveAttribute('aria-current');
});
