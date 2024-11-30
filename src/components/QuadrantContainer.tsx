import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Task } from '../types/task';
import { TaskCard } from './TaskCard';
import { cn } from '../utils/cn';

interface QuadrantContainerProps {
  id: Task['quadrant'];
  title: string;
  description: string;
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (id: string, updates: Partial<Task>) => void;
}

const quadrantStyles = {
  'important-urgent': {
    container: 'bg-red-50 border-red-200',
    dropArea: 'bg-red-100/50',
    dropAreaHover: 'bg-red-100 ring-red-500/50',
    emptyText: 'text-red-500',
  },
  'important-not-urgent': {
    container: 'bg-blue-50 border-blue-200',
    dropArea: 'bg-blue-100/50',
    dropAreaHover: 'bg-blue-100 ring-blue-500/50',
    emptyText: 'text-blue-500',
  },
  'not-important-urgent': {
    container: 'bg-yellow-50 border-yellow-200',
    dropArea: 'bg-yellow-100/50',
    dropAreaHover: 'bg-yellow-100 ring-yellow-500/50',
    emptyText: 'text-yellow-600',
  },
  'not-important-not-urgent': {
    container: 'bg-green-50 border-green-200',
    dropArea: 'bg-green-100/50',
    dropAreaHover: 'bg-green-100 ring-green-500/50',
    emptyText: 'text-green-500',
  },
} as const;

export function QuadrantContainer({
  id,
  title,
  description,
  tasks,
  onToggleTask,
  onDeleteTask,
  onEditTask,
}: QuadrantContainerProps) {
  const { setNodeRef, isOver } = useDroppable({ id });
  const styles = quadrantStyles[id];

  return (
    <div className={cn(
      "flex h-full flex-col rounded-lg border p-4",
      styles.container
    )}>
      <div className="mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-gray-600">{description}</p>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          'flex-1 space-y-2 rounded-lg p-2',
          'transition-colors duration-200',
          styles.dropArea,
          isOver && styles.dropAreaHover,
          isOver && 'ring-2',
          tasks.length === 0 && 'flex items-center justify-center'
        )}
      >
        {tasks.length === 0 ? (
          <p className={cn(
            'text-center text-sm',
            !isOver && 'text-gray-500',
            isOver && styles.emptyText,
            isOver && 'font-medium'
          )}>
            {isOver ? 'Drop here' : 'Drop tasks here'}
          </p>
        ) : (
          <SortableContext items={tasks.map((task) => task._id)} strategy={verticalListSortingStrategy}>
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onToggle={onToggleTask}
                onDelete={onDeleteTask}
                onEdit={onEditTask}
              />
            ))}
          </SortableContext>
        )}
      </div>
    </div>
  );
}