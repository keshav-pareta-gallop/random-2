import type { ReactNode } from 'react';
import type { Task } from '../types/task';
import TaskCard from './TaskCard';

interface BoardColumnProps {
  title: string;
  tasks: Task[];
  dotColor: string;
  labelColor: string;
  badgeBg: string;
  badgeText: string;
  columnBg: string;
  columnBorder: string;
  emptyIcon: ReactNode;
  emptyIconColor: string;
  emptyLabelColor: string;
  emptyLabel: string;
}

export default function BoardColumn({
  title,
  tasks,
  dotColor,
  labelColor,
  badgeBg,
  badgeText,
  columnBg,
  columnBorder,
  emptyIcon,
  emptyIconColor,
  emptyLabelColor,
  emptyLabel,
}: BoardColumnProps) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-3 h-3 rounded-full ${dotColor}`} />
        <h2 className={`text-sm font-semibold uppercase tracking-wide ${labelColor}`}>
          {title}
        </h2>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${badgeBg} ${badgeText}`}>
          {tasks.length}
        </span>
      </div>
      <div className={`flex flex-col gap-3 min-h-[200px] rounded-xl p-3 border ${columnBg} ${columnBorder}`}>
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <span className={emptyIconColor}>{emptyIcon}</span>
            <p className={`text-sm ${emptyLabelColor}`}>{emptyLabel}</p>
          </div>
        ) : (
          tasks.map((task) => <TaskCard key={task.id} task={task} />)
        )}
      </div>
    </div>
  );
}
