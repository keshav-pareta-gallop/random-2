import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskForm from './TaskForm';
import { ToastProvider } from './Toast';
import * as api from '../lib/api';

vi.mock('../lib/api', () => ({
  createTask: vi.fn(),
  setTokenProvider: vi.fn(),
}));

const mockedCreateTask = vi.mocked(api.createTask);

function renderForm(props: Partial<{ onClose: () => void; onTaskCreated: () => void }> = {}) {
  const onClose = props.onClose ?? vi.fn();
  const onTaskCreated = props.onTaskCreated ?? vi.fn();
  const result = render(
    <ToastProvider>
      <TaskForm onClose={onClose} onTaskCreated={onTaskCreated} />
    </ToastProvider>,
  );
  return { ...result, onClose, onTaskCreated };
}

const fakeTask = {
  id: '1',
  title: 'Test',
  description: null,
  dueDate: null,
  status: 'todo' as const,
  assigneeId: null,
  createdBy: '2',
  createdAt: '2026-10-29T10:00:00.000Z',
  updatedAt: '2026-10-29T10:00:00.000Z',
};

beforeEach(() => {
  mockedCreateTask.mockReset();
});

describe('TaskForm', () => {
  it('renders form with title input, description textarea, due date input, Create Task and Cancel buttons', () => {
    renderForm();
    expect(screen.getByPlaceholderText('Enter task title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Add a description...')).toBeInTheDocument();
    expect(screen.getByLabelText('Due Date')).toBeInTheDocument();
    expect(screen.getByText('Create Task')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('shows "Title is required" error when submitting with empty title and does NOT call API', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByText('Create Task'));

    expect(screen.getByText('Title is required')).toBeInTheDocument();
    expect(mockedCreateTask).not.toHaveBeenCalled();
  });

  it('shows "Title is required" error for whitespace-only title', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByPlaceholderText('Enter task title'), '   ');
    await user.click(screen.getByText('Create Task'));

    expect(screen.getByText('Title is required')).toBeInTheDocument();
    expect(mockedCreateTask).not.toHaveBeenCalled();
  });

  it('calls onClose when Cancel is clicked', async () => {
    const user = userEvent.setup();
    const { onClose } = renderForm();

    await user.click(screen.getByText('Cancel'));

    expect(onClose).toHaveBeenCalled();
  });

  it('submits with title only — calls createTask, onTaskCreated, onClose', async () => {
    const user = userEvent.setup();
    mockedCreateTask.mockResolvedValue(fakeTask);
    const { onClose, onTaskCreated } = renderForm();

    await user.type(screen.getByPlaceholderText('Enter task title'), 'My Task');
    await user.click(screen.getByText('Create Task'));

    await waitFor(() => {
      expect(mockedCreateTask).toHaveBeenCalledWith({ title: 'My Task' });
    });
    expect(onTaskCreated).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it('submits with all fields — calls createTask with title, description, dueDate', async () => {
    const user = userEvent.setup();
    mockedCreateTask.mockResolvedValue({ ...fakeTask, description: 'Details', dueDate: '2026-12-01' });
    const { onClose, onTaskCreated } = renderForm();

    await user.type(screen.getByPlaceholderText('Enter task title'), 'Full Task');
    await user.type(screen.getByPlaceholderText('Add a description...'), 'Details');
    // type a date into the date input
    const dateInput = screen.getByLabelText('Due Date');
    await user.type(dateInput, '2026-12-01');

    await user.click(screen.getByText('Create Task'));

    await waitFor(() => {
      expect(mockedCreateTask).toHaveBeenCalledWith({
        title: 'Full Task',
        description: 'Details',
        dueDate: '2026-12-01',
      });
    });
    expect(onTaskCreated).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it('on API error — does NOT call onClose and does not crash', async () => {
    const user = userEvent.setup();
    mockedCreateTask.mockRejectedValue(new Error('Server error'));
    const { onClose, onTaskCreated } = renderForm();

    await user.type(screen.getByPlaceholderText('Enter task title'), 'Fail Task');
    await user.click(screen.getByText('Create Task'));

    await waitFor(() => {
      expect(mockedCreateTask).toHaveBeenCalled();
    });
    // On error, onClose and onTaskCreated should NOT be called
    expect(onTaskCreated).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });
});
