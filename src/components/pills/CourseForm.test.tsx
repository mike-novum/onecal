import { fireEvent, render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import { CourseForm } from './CourseForm';

function fillValidCourse() {
  fireEvent.change(screen.getByLabelText('Название курса'), { target: { value: 'Антибиотик' } });
  fireEvent.change(screen.getByLabelText('Начало'), { target: { value: '2026-10-01' } });
  fireEvent.change(screen.getByLabelText('Окончание'), { target: { value: '2026-10-07' } });
  fireEvent.change(screen.getByLabelText('Название препарата'), { target: { value: 'Амоксициллин' } });
  fireEvent.change(screen.getByLabelText('Дозировка'), { target: { value: '500 мг' } });
  fireEvent.change(screen.getByLabelText('Раз в день'), { target: { value: '3' } });
  fireEvent.change(screen.getByLabelText('Приём'), { target: { value: 'after' } });
}

test('сабмит с пустым названием не вызывает onSubmit и показывает ошибку', () => {
  const onSubmit = vi.fn();
  render(<CourseForm initial={null} onSubmit={onSubmit} onCancel={() => {}} />);
  fireEvent.click(screen.getByRole('button', { name: 'Сохранить' }));
  expect(onSubmit).not.toHaveBeenCalled();
  expect(screen.getByText('Название курса обязательно')).toBeInTheDocument();
});

test('endDate раньше startDate отклоняется', () => {
  const onSubmit = vi.fn();
  render(<CourseForm initial={null} onSubmit={onSubmit} onCancel={() => {}} />);
  fireEvent.change(screen.getByLabelText('Название курса'), { target: { value: 'Курс' } });
  fireEvent.change(screen.getByLabelText('Начало'), { target: { value: '2026-10-07' } });
  fireEvent.change(screen.getByLabelText('Окончание'), { target: { value: '2026-10-01' } });
  fireEvent.click(screen.getByRole('button', { name: 'Сохранить' }));
  expect(onSubmit).not.toHaveBeenCalled();
  expect(screen.getByText('Дата окончания раньше даты начала')).toBeInTheDocument();
});

test('курс без препаратов отклоняется', () => {
  const onSubmit = vi.fn();
  render(<CourseForm initial={null} onSubmit={onSubmit} onCancel={() => {}} />);
  fireEvent.change(screen.getByLabelText('Название курса'), { target: { value: 'Курс' } });
  fireEvent.change(screen.getByLabelText('Начало'), { target: { value: '2026-10-01' } });
  fireEvent.change(screen.getByLabelText('Окончание'), { target: { value: '2026-10-07' } });
  fireEvent.click(screen.getByRole('button', { name: 'Удалить' }));
  fireEvent.click(screen.getByRole('button', { name: 'Сохранить' }));
  expect(onSubmit).not.toHaveBeenCalled();
  expect(screen.getByText('Добавьте хотя бы один препарат')).toBeInTheDocument();
});

test('препарат с пустым названием отклоняется', () => {
  const onSubmit = vi.fn();
  render(<CourseForm initial={null} onSubmit={onSubmit} onCancel={() => {}} />);
  fireEvent.change(screen.getByLabelText('Название курса'), { target: { value: 'Курс' } });
  fireEvent.change(screen.getByLabelText('Начало'), { target: { value: '2026-10-01' } });
  fireEvent.change(screen.getByLabelText('Окончание'), { target: { value: '2026-10-07' } });
  fireEvent.click(screen.getByRole('button', { name: 'Сохранить' }));
  expect(onSubmit).not.toHaveBeenCalled();
  expect(screen.getByText('Название препарата обязательно')).toBeInTheDocument();
});

test('препарат с кратностью 0 или нецелый отклоняется', () => {
  const onSubmit = vi.fn();
  render(<CourseForm initial={null} onSubmit={onSubmit} onCancel={() => {}} />);
  fireEvent.change(screen.getByLabelText('Название курса'), { target: { value: 'Курс' } });
  fireEvent.change(screen.getByLabelText('Начало'), { target: { value: '2026-10-01' } });
  fireEvent.change(screen.getByLabelText('Окончание'), { target: { value: '2026-10-07' } });
  fireEvent.change(screen.getByLabelText('Название препарата'), { target: { value: 'Амоксициллин' } });
  fireEvent.change(screen.getByLabelText('Раз в день'), { target: { value: '' } });
  fireEvent.click(screen.getByRole('button', { name: 'Сохранить' }));
  expect(onSubmit).not.toHaveBeenCalled();
  expect(screen.getByText('Кратность приёма должна быть целым числом не меньше 1')).toBeInTheDocument();
});

test('Escape закрывает форму без сохранения', () => {
  const onSubmit = vi.fn();
  const onCancel = vi.fn();
  render(<CourseForm initial={null} onSubmit={onSubmit} onCancel={onCancel} />);
  fireEvent.keyDown(document, { key: 'Escape' });
  expect(onCancel).toHaveBeenCalledOnce();
  expect(onSubmit).not.toHaveBeenCalled();
});

test('при открытии фокус на поле названия курса', () => {
  render(<CourseForm initial={null} onSubmit={() => {}} onCancel={() => {}} />);
  expect(screen.getByLabelText('Название курса')).toHaveFocus();
});

test('валидные данные вызывают onSubmit с курсом, у нового курса есть id', () => {
  const onSubmit = vi.fn();
  render(<CourseForm initial={null} onSubmit={onSubmit} onCancel={() => {}} />);
  fillValidCourse();
  fireEvent.click(screen.getByRole('button', { name: 'Сохранить' }));
  expect(onSubmit).toHaveBeenCalledOnce();
  const course = onSubmit.mock.calls[0][0];
  expect(course.title).toBe('Антибиотик');
  expect(course.startDate).toBe('2026-10-01');
  expect(course.endDate).toBe('2026-10-07');
  expect(course.id.length).toBeGreaterThan(0);
  expect(course.medications).toEqual([
    { name: 'Амоксициллин', dosage: '500 мг', timesPerDay: 3, intake: 'after' },
  ]);
});
