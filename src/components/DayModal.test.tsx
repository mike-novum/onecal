import { fireEvent, render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import { ALCOHOL_ITEMS } from '../data/catalogs';
import { DayModal } from './DayModal';

function renderModal(overrides: Partial<Parameters<typeof DayModal>[0]> = {}) {
  const props = {
    dateISO: '2026-10-05',
    title: '5 октября 2026',
    catalog: ALCOHOL_ITEMS,
    initial: undefined,
    badLabel: 'Было плохо на утро',
    onSave: vi.fn(),
    onClose: vi.fn(),
    ...overrides,
  };
  render(<DayModal {...props} />);
  return props;
}

test('показывает чипы каталога и выделяет выбранные позиции из initial', () => {
  renderModal({ initial: { items: ['beer'], wasBad: true } });
  const beer = screen.getByRole('button', { name: /Пиво/ });
  expect(beer).toHaveAttribute('aria-pressed', 'true');
  const wine = screen.getByRole('button', { name: /Вино/ });
  expect(wine).toHaveAttribute('aria-pressed', 'false');
  expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
});

test('клик по чипу и по свитчу меняют состояние', () => {
  renderModal();
  const wine = screen.getByRole('button', { name: /Вино/ });
  fireEvent.click(wine);
  expect(wine).toHaveAttribute('aria-pressed', 'true');
  const toggle = screen.getByRole('switch');
  fireEvent.click(toggle);
  expect(toggle).toHaveAttribute('aria-checked', 'true');
});

test('Сохранить вызывает onSave с текущим логом', () => {
  const { onSave } = renderModal({ initial: { items: ['beer'], wasBad: false } });
  fireEvent.click(screen.getByRole('button', { name: /Вино/ }));
  fireEvent.click(screen.getByRole('button', { name: 'Сохранить' }));
  expect(onSave).toHaveBeenCalledWith({ items: ['beer', 'wine'], wasBad: false });
});

test('Очистить день вызывает onSave(null)', () => {
  const { onSave } = renderModal({ initial: { items: ['beer'], wasBad: true } });
  fireEvent.click(screen.getByRole('button', { name: 'Очистить день' }));
  expect(onSave).toHaveBeenCalledWith(null);
});

test('клик по оверлею вызывает onClose без сохранения', () => {
  const { onSave, onClose } = renderModal();
  fireEvent.click(screen.getByTestId('modal-overlay'));
  expect(onClose).toHaveBeenCalledOnce();
  expect(onSave).not.toHaveBeenCalled();
});

test('Escape закрывает модалку без сохранения', () => {
  const { onSave, onClose } = renderModal();
  fireEvent.keyDown(document, { key: 'Escape' });
  expect(onClose).toHaveBeenCalledOnce();
  expect(onSave).not.toHaveBeenCalled();
});

test('при открытии фокус на кнопке закрытия', () => {
  renderModal();
  expect(screen.getByRole('button', { name: 'Закрыть' })).toHaveFocus();
});

test('Сохранить с пустым логом шлёт onSave(null)', () => {
  const { onSave } = renderModal({ initial: { items: [], wasBad: false } });
  fireEvent.click(screen.getByRole('button', { name: 'Сохранить' }));
  expect(onSave).toHaveBeenCalledWith(null);
});
