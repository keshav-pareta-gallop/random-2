import { render, screen } from '@testing-library/react';
import TaskCard from './TaskCard';
import type { Task } from '../types/task';

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: '111',
    title: 'Test task',
    description: null,
    dueDate: null,
    status: 'todo',
    assigneeId: null,
    createdBy: '222',
    createdAt: '2026-10-29T10:00:00.000Z',
    updatedAt: '2026-10-29T10:00:00.000Z',
    ...overrides,
  };
}

describe('TaskCard', () => {
  it('renders task title', () => {
    render(<TaskCard task={makeTask({ title: 'My important task' })} />);
    expect(screen.getByText('My important task')).toBeInTheDocument();
  });

  it('renders description when present', () => {
    render(<TaskCard task={makeTask({ description: 'Some details' })} />);
    expect(screen.getByText('Some details')).toBeInTheDocument();
  });

  it('does not render description when null', () => {
    render(<TaskCard task={makeTask({ description: null })} />);
    expect(screen.queryByText('Some details')).not.toBeInTheDocument();
  });

  it('renders formatted due date when present', () => {
    render(<TaskCard task={makeTask({ dueDate: '2026-11-15' })} />);
    // formatDate appends 'T00:00:00' and formats as 'Nov 15, 2026'
    expect(screen.getByText('Nov 15, 2026')).toBeInTheDocument();
  });

  it('does not render due date when null', () => {
    render(<TaskCard task={makeTask({ dueDate: null })} />);
    expect(screen.queryByText(/\w+ \d+, \d{4}/)).not.toBeInTheDocument();
  });
});
