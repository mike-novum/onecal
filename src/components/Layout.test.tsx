import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { useAppStore } from '../store/useAppStore';
import { accentForPath } from '../theme';
import { Layout } from './Layout';

beforeEach(() => {
  useAppStore.getState().resetAll();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

test('показывает три таба и выделяет активный роут', () => {
  render(
    <MemoryRouter initialEntries={['/alcohol']}>
      <Layout />
    </MemoryRouter>,
  );
  expect(screen.getByText('Алкоголь')).toHaveAttribute('aria-current', 'page');
  expect(screen.getByText('Таблетки')).not.toHaveAttribute('aria-current');
  expect(screen.getByText('Фастфуд')).toBeInTheDocument();
});

test('accentForPath определяет календарь по пути', () => {
  expect(accentForPath('/pills')).toBe('pills');
  expect(accentForPath('/fastfood')).toBe('fastfood');
  expect(accentForPath('/anything')).toBe('alcohol');
});

test('клик «Экспорт» создаёт Blob со снапшотом store и скачивает файл', () => {
  useAppStore.setState({ alcohol: { '2026-10-05': { items: ['beer'], wasBad: false } } });
  const createObjectURL = vi.fn((_blob: Blob) => 'blob:mock');
  URL.createObjectURL = createObjectURL;
  const anchorClick = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

  render(
    <MemoryRouter>
      <Layout />
    </MemoryRouter>,
  );
  fireEvent.click(screen.getByRole('button', { name: 'Экспорт' }));

  expect(createObjectURL).toHaveBeenCalledOnce();
  const blob = createObjectURL.mock.calls[0][0];
  expect(blob.type).toBe('application/json');
  anchorClick.mockRestore();
});

test('импорт невалидного файла показывает ошибку и не меняет store', async () => {
  useAppStore.setState({ alcohol: { '2026-10-05': { items: ['beer'], wasBad: false } } });
  render(
    <MemoryRouter>
      <Layout />
    </MemoryRouter>,
  );
  const input = screen.getByLabelText('Импорт', { selector: 'input' });
  const file = new File(['{oops'], 'x.json', { type: 'application/json' });
  fireEvent.change(input, { target: { files: [file] } });

  expect(await screen.findByText(/не является валидным JSON/)).toBeInTheDocument();
  expect(useAppStore.getState().alcohol['2026-10-05']).toEqual({ items: ['beer'], wasBad: false });
});

test('импорт валидного файла после подтверждения заменяет store', async () => {
  useAppStore.setState({ alcohol: { '2026-10-05': { items: ['beer'], wasBad: false } } });
  vi.stubGlobal('confirm', vi.fn(() => true));
  render(
    <MemoryRouter>
      <Layout />
    </MemoryRouter>,
  );
  const snapshot = {
    alcohol: {},
    fastfood: { '2026-10-06': { items: ['burger'], wasBad: true } },
    pillCourses: [],
  };
  const input = screen.getByLabelText('Импорт', { selector: 'input' });
  const file = new File([JSON.stringify(snapshot)], 'ok.json', { type: 'application/json' });
  fireEvent.change(input, { target: { files: [file] } });

  await screen.findByText(/данные импортированы/i);
  const s = useAppStore.getState();
  expect(s.alcohol).toEqual({});
  expect(s.fastfood['2026-10-06']).toEqual({ items: ['burger'], wasBad: true });
});
