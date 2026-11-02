import { fireEvent, render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import { MoodDayModal } from './MoodDayModal';

function renderModal(overrides: Partial<Parameters<typeof MoodDayModal>[0]> = {}) {
  const props = {
    title: '5 октября 2026',
    initial: undefined,
    onSave: vi.fn(),
    onClose: vi.fn(),
    ...overrides,
  };
  render(<MoodDayModal {...props} />);
  return props;
}

test('показывает эмоции и выделяет выбранные из initial', () => {
  renderModal({ initial: { emotions: ['joy'] } });
  const joy = screen.getByRole('button', { name: /Радость/ });
  expect(joy).toHaveAttribute('aria-pressed', 'true');
  const calm = screen.getByRole('button', { name: /Спокойствие/ });
  expect(calm).toHaveAttribute('aria-pressed', 'false');
  expect(screen.getByText('Всё хорошо')).toBeInTheDocument();
});

test('клик по кнопке эмоции переключает выбор и обновляет уровень настроения', () => {
  renderModal();
  const anger = screen.getByRole('button', { name: /Злость/ });
  fireEvent.click(anger);
  expect(anger).toHaveAttribute('aria-pressed', 'true');
  expect(screen.getByText('Очень тяжело')).toBeInTheDocument();

  fireEvent.click(anger);
  expect(anger).toHaveAttribute('aria-pressed', 'false');
  expect(screen.queryByText('Очень тяжело')).not.toBeInTheDocument();
});

test('клик «Сохранить» вызывает onSave с выбранными эмоциями', () => {
  const { onSave } = renderModal({ initial: { emotions: ['joy'] } });
  fireEvent.click(screen.getByRole('button', { name: /Вдохновение/ }));
  fireEvent.click(screen.getByRole('button', { name: 'Сохранить' }));
  expect(onSave).toHaveBeenCalledWith({ emotions: ['joy', 'inspiration'] });
});

test('клик «Сохранить» без выбранных эмоций передает null', () => {
  const { onSave } = renderModal({ initial: { emotions: [] } });
  fireEvent.click(screen.getByRole('button', { name: 'Сохранить' }));
  expect(onSave).toHaveBeenCalledWith(null);
});

test('клик «Очистить день» вызывает onSave(null)', () => {
  const { onSave } = renderModal({ initial: { emotions: ['joy'] } });
  fireEvent.click(screen.getByRole('button', { name: 'Очистить день' }));
  expect(onSave).toHaveBeenCalledWith(null);
});

test('клик по оверлею вызывает onClose без сохранения', () => {
  const { onSave, onClose } = renderModal();
  fireEvent.click(screen.getByTestId('mood-modal-overlay'));
  expect(onClose).toHaveBeenCalledOnce();
  expect(onSave).not.toHaveBeenCalled();
});

test('нажатие Escape закрывает модалку без сохранения', () => {
  const { onSave, onClose } = renderModal();
  fireEvent.keyDown(document, { key: 'Escape' });
  expect(onClose).toHaveBeenCalledOnce();
  expect(onSave).not.toHaveBeenCalled();
});

test('при открытии фокус установлен на кнопке закрытия', () => {
  renderModal();
  expect(screen.getByRole('button', { name: 'Закрыть' })).toHaveFocus();
});
