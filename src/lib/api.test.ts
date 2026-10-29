import { createTask, getTasks, setTokenProvider } from './api';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

beforeEach(() => {
  mockFetch.mockReset();
  setTokenProvider(async () => 'test-token-123');
});

function jsonResponse(body: unknown, status = 200) {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? 'OK' : 'Bad Request',
    json: () => Promise.resolve(body),
  });
}

describe('createTask', () => {
  it('sends POST to /api/tasks with JSON body and auth header', async () => {
    const task = { id: '1', title: 'New task', description: null, dueDate: null, status: 'todo', assigneeId: null, createdBy: '2', createdAt: '', updatedAt: '' };
    mockFetch.mockReturnValue(jsonResponse(task, 200));

    const result = await createTask({ title: 'New task' });

    expect(mockFetch).toHaveBeenCalledWith('/api/tasks', {
      method: 'POST',
      body: JSON.stringify({ title: 'New task' }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer test-token-123',
      },
    });
    expect(result).toEqual(task);
  });
});

describe('getTasks', () => {
  it('sends GET to /api/tasks with auth header', async () => {
    const tasks = [{ id: '1', title: 'Task A' }];
    mockFetch.mockReturnValue(jsonResponse(tasks));

    const result = await getTasks();

    expect(mockFetch).toHaveBeenCalledWith('/api/tasks', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer test-token-123',
      },
    });
    expect(result).toEqual(tasks);
  });
});

describe('error handling', () => {
  it('throws an error with message from response body', async () => {
    mockFetch.mockReturnValue(jsonResponse({ message: ['Title is required'] }, 400));

    await expect(createTask({ title: '' })).rejects.toThrow('Title is required');
  });

  it('throws with statusText when body has no message', async () => {
    mockFetch.mockReturnValue(
      Promise.resolve({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: () => Promise.reject(new Error('no json')),
      }),
    );

    await expect(getTasks()).rejects.toThrow('Internal Server Error');
  });
});
