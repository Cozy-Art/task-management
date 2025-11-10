/**
 * SortableTaskCard Component
 * Wraps TaskCard with drag-and-drop functionality
 */

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TodoistTask } from '@/lib/types/todoist';
import { TaskCard } from './task-card';

interface SortableTaskCardProps {
  task: TodoistTask;
}

export function SortableTaskCard({ task }: SortableTaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: {
      type: 'task',
      task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
      <TaskCard task={task} isDragging={isDragging} />
    </div>
  );
}
