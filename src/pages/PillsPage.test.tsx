import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, expect, test } from 'vitest';
import { useAppStore } from '../store/useAppStore';
import { PillsPage } from './PillsPage';

beforeEach(() => {
  useAppStore.getState().resetAll();
});

function renderPage() {
  render(
    <MemoryRouter>
      <PillsPage />
    </MemoryRouter>,
  );
}

function fillAndSubmitForm() {
  fireEvent.change(screen.getByLabelText('Название курса'), { target: { value: 'Антибиотик' } });
  fireEvent.change(screen.getByLabelText('Начало'), { target: { value: '2026-10-01' } });
  fireEvent.change(screen.getByLabelText('Окончание'), { target: { value: '2026-10-07' } });
  fireEvent.change(screen.getByLabelText('Название препарата'), { target: { value: 'Амоксициллин' } });
  fireEvent.change(screen.getByLabelText('Дозировка'), { target: { value: '500 мг' } });
  fireEvent.change(screen.getByLabelText('Раз в день'), { target: { value: '3' } });
  fireEvent.change(screen.getByLabelText('Приём'), { target: { value: 'after' } });
  fireEvent.click(screen.getByRole('button', { name: 'Сохранить' }));
}

test('клик «Новый курс» показывает форму, сабмит добавляет курс в store', () => {
  renderPage();
  fireEvent.click(screen.getByRole('button', { name: 'Новый курс' }));
  expect(screen.getByRole('dialog')).toBeInTheDocument();

  fillAndSubmitForm();
  const courses = useAppStore.getState().pillCourses;
  expect(courses).toHaveLength(1);
  expect(courses[0].title).toBe('Антибиотик');
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

test('клик «Удалить» на карточке удаляет курс', () => {
  useAppStore.getState().addCourse({
    id: 'c1',
    title: 'Антибиотик',
    startDate: '2026-10-01',
    endDate: '2026-10-07',
    medications: [{ name: 'Амоксициллин', dosage: '500 мг', timesPerDay: 3, intake: 'after' }],
  });
  renderPage();
  fireEvent.click(screen.getByRole('button', { name: 'Удалить' }));
  expect(useAppStore.getState().pillCourses).toHaveLength(0);
});
