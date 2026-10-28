type TokenProvider = () => Promise<string>;

let tokenProvider: TokenProvider = async () => '';

export function setTokenProvider(provider: TokenProvider) {
  tokenProvider = provider;
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = await tokenProvider();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> | undefined),
  };

  const response = await fetch(path, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const message =
      body && Array.isArray(body.message)
        ? body.message.join(', ')
        : body?.message || response.statusText;
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  dueDate?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  status: 'todo' | 'in_progress' | 'done';
  assigneeId: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export function createTask(data: CreateTaskPayload): Promise<Task> {
  return apiFetch<Task>('/api/tasks', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function getTasks(): Promise<Task[]> {
  return apiFetch<Task[]>('/api/tasks');
}
