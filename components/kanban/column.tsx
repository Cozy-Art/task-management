/**
 * Column Component
 * One of three columns: Putting Off, Strategy, or Timely
 */

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { TodoistTask } from '@/lib/types/todoist';
import { SortableTaskCard } from './sortable-task-card';
import { cn } from '@/lib/utils';

export type ColumnType = 'putting-off' | 'strategy' | 'timely';

interface ColumnProps {
  id: string;
  type: ColumnType;
  title: string;
  tasks: TodoistTask[];
  color: string;
}

export function Column({ id, type, title, tasks, color }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      type: 'column',
      columnType: type,
    },
  });

  const taskIds = tasks.map((task) => task.id);

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex flex-col rounded-lg border bg-card min-h-[400px] transition-colors',
        isOver && 'ring-2 ring-primary bg-accent/50'
      )}
    >
      {/* Column Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
            <h3 className="font-semibold">{title}</h3>
          </div>
          <span className="text-sm text-muted-foreground">{tasks.length}</span>
        </div>
      </div>

      {/* Tasks */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-sm text-muted-foreground">No tasks yet</p>
            </div>
          ) : (
            tasks.map((task) => <SortableTaskCard key={task.id} task={task} />)
          )}
        </SortableContext>
      </div>
    </div>
  );
}
