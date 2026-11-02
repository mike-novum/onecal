import { fireEvent, render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import { IntimateDayModal } from './IntimateDayModal';

function renderModal(overrides: Partial<Parameters<typeof IntimateDayModal>[0]> = {}) {
  const props = {
    title: '5 октября 2026',
    initial: undefined,
    onSave: vi.fn(),
    onClose: vi.fn(),
    ...overrides,
  };
  render(<IntimateDayModal {...props} />);
  return props;
}

test('показывает кнопки Секс и Мастурбация с начальными значениями', () => {
  renderModal({ initial: { sex: 2, masturbation: 1 } });
  expect(screen.getByRole('button', { name: 'Секс: 2' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Мастурбация: 1' })).toBeInTheDocument();
});

test('клик по правой части кнопки Секс увеличивает счетчик', () => {
  renderModal({ initial: { sex: 1, masturbation: 0 } });
  const sexIncrement = screen.getByTestId('sex-increment');
  fireEvent.click(sexIncrement);
  expect(screen.getByRole('button', { name: 'Секс: 2' })).toBeInTheDocument();
});

test('клик по левой части кнопки Секс уменьшает счетчик и не опускает ниже нуля', () => {
  renderModal({ initial: { sex: 1, masturbation: 0 } });
  const sexDecrement = screen.getByTestId('sex-decrement');
  fireEvent.click(sexDecrement);
  expect(screen.getByRole('button', { name: 'Секс: 0' })).toBeInTheDocument();

  fireEvent.click(sexDecrement);
  expect(screen.getByRole('button', { name: 'Секс: 0' })).toBeInTheDocument();
});

test('клик по правой части кнопки Мастурбация увеличивает счетчик', () => {
  renderModal({ initial: { sex: 0, masturbation: 0 } });
  const masturbationIncrement = screen.getByTestId('masturbation-increment');
  fireEvent.click(masturbationIncrement);
  expect(screen.getByRole('button', { name: 'Мастурбация: 1' })).toBeInTheDocument();
});

test('клик по левой части кнопки Мастурбация уменьшает счетчик', () => {
  renderModal({ initial: { sex: 0, masturbation: 2 } });
  const masturbationDecrement = screen.getByTestId('masturbation-decrement');
  fireEvent.click(masturbationDecrement);
  expect(screen.getByRole('button', { name: 'Мастурбация: 1' })).toBeInTheDocument();
});

test('клик по кнопке с координатами левой и правой половины меняет счетчик', () => {
  renderModal({ initial: { sex: 1, masturbation: 1 } });
  const sexButton = screen.getByRole('button', { name: 'Секс: 1' });

  fireEvent.click(sexButton, { clientX: 180 });
  expect(screen.getByRole('button', { name: 'Секс: 2' })).toBeInTheDocument();

  fireEvent.click(sexButton, { clientX: 20 });
  expect(screen.getByRole('button', { name: 'Секс: 1' })).toBeInTheDocument();
});

test('клик «Сохранить» вызывает onSave с заполненными значениями', () => {
  const { onSave } = renderModal({ initial: { sex: 1, masturbation: 0 } });
  fireEvent.click(screen.getByTestId('masturbation-increment'));
  fireEvent.click(screen.getByRole('button', { name: 'Сохранить' }));
  expect(onSave).toHaveBeenCalledWith({ sex: 1, masturbation: 1 });
});

test('клик «Сохранить» при нулевых значениях передает null', () => {
  const { onSave } = renderModal({ initial: { sex: 0, masturbation: 0 } });
  fireEvent.click(screen.getByRole('button', { name: 'Сохранить' }));
  expect(onSave).toHaveBeenCalledWith(null);
});

test('клик «Очистить день» вызывает onSave(null)', () => {
  const { onSave } = renderModal({ initial: { sex: 2, masturbation: 1 } });
  fireEvent.click(screen.getByRole('button', { name: 'Очистить день' }));
  expect(onSave).toHaveBeenCalledWith(null);
});

test('клик по оверлею вызывает onClose без сохранения', () => {
  const { onSave, onClose } = renderModal();
  fireEvent.click(screen.getByTestId('intimate-modal-overlay'));
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
