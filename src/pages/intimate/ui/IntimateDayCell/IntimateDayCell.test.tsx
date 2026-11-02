import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { IntimateDayCell } from './IntimateDayCell';

describe('IntimateDayCell', () => {
  it('рендерит номер дня когда нет эмодзи', () => {
    render(
      <IntimateDayCell
        dayNumber={15}
        emoji={null}
        onClick={vi.fn()}
        isToday={false}
      />,
    );
    expect(screen.getByText('15')).toBeInTheDocument();
  });

  it('рендерит эмодзи если он передан', () => {
    render(
      <IntimateDayCell
        dayNumber={15}
        emoji="❤️"
        onClick={vi.fn()}
        isToday={false}
      />,
    );
    expect(screen.getByText('❤️')).toBeInTheDocument();
    expect(screen.queryByText('15')).not.toBeInTheDocument();
  });

  it('вызывает onClick при клике', () => {
    const handleClick = vi.fn();
    render(
      <IntimateDayCell
        dayNumber={15}
        emoji={null}
        onClick={handleClick}
        isToday={false}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'день 15' }));
    expect(handleClick).toHaveBeenCalledOnce();
  });
});
