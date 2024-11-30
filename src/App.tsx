import { useEffect, useState } from 'react';
import { DndContext, DragEndEvent, DragStartEvent, DragOverlay, closestCenter } from '@dnd-kit/core';
import { AddTaskForm } from './components/AddTaskForm';
import { QuadrantContainer } from './components/QuadrantContainer';
import { useTaskStore } from './store/useTaskStore';
import { Task } from './types/task';
import { TaskCard } from './components/TaskCard';
import { taskService } from './services/taskService';

function App() {
  const { tasks, fetchTasks, addTask, toggleTask, deleteTask, moveTask, editTask, isLoading, error } = useTaskStore();
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find(t => t._id === event.active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    
    if (!over) return;

    const targetQuadrant = ['important-urgent', 'important-not-urgent', 'not-important-urgent', 'not-important-not-urgent'].includes(over.id as string)
      ? over.id as Task['quadrant']
      : tasks.find(t => t._id === over.id)?.quadrant;

    if (targetQuadrant && active.id !== over.id) {
      moveTask(active.id as string, targetQuadrant);
    }
  };

  const handleDragCancel = () => {
    setActiveTask(null);
  };

  const getTasksByQuadrant = (quadrant: Task['quadrant']) => {
    return tasks.filter((task) => task.quadrant === quadrant);
  };

  const handleAddTask = async (title: string) => {
    await addTask({
      title,
      completed: false,
      quadrant: 'important-urgent',
    });
  };

  const handleBulkAddTasks = async (text: string) => {
    try {
      await taskService.parseTasks(text);
      // Refresh the task list to include the new tasks
      await fetchTasks();
    } catch (error) {
      console.error('Failed to parse tasks:', error);
    }
  };

  const handleToggleTask = (taskId: string) => {
    toggleTask(taskId);
  };

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="rounded-lg bg-white p-8 text-center shadow-md">
          <p className="text-red-500">Error: {error}</p>
          <button
            onClick={() => fetchTasks()}
            className="mt-4 rounded-lg bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">ToDo</h1>
          <p className="mt-2 text-gray-600">{new Date().toLocaleDateString()}</p>
        </div>
        
        <AddTaskForm 
          onSubmit={handleAddTask}
          onBulkSubmit={handleBulkAddTasks}
        />

        {isLoading && tasks.length === 0 ? (
          <div className="flex items-center justify-center">
            <p className="text-gray-500">Loading tasks...</p>
          </div>
        ) : (
          <DndContext 
            collisionDetection={closestCenter} 
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          >
            <div className="grid grid-cols-2 gap-4">
              <QuadrantContainer
                id="important-urgent"
                title="Do First"
                description="Important & Urgent"
                tasks={getTasksByQuadrant('important-urgent')}
                onToggleTask={handleToggleTask}
                onDeleteTask={deleteTask}
                onEditTask={editTask}
              />
              <QuadrantContainer
                id="important-not-urgent"
                title="Schedule"
                description="Important & Not Urgent"
                tasks={getTasksByQuadrant('important-not-urgent')}
                onToggleTask={handleToggleTask}
                onDeleteTask={deleteTask}
                onEditTask={editTask}
              />
              <QuadrantContainer
                id="not-important-urgent"
                title="Delegate"
                description="Not Important & Urgent"
                tasks={getTasksByQuadrant('not-important-urgent')}
                onToggleTask={handleToggleTask}
                onDeleteTask={deleteTask}
                onEditTask={editTask}
              />
              <QuadrantContainer
                id="not-important-not-urgent"
                title="Don't Do"
                description="Not Important & Not Urgent"
                tasks={getTasksByQuadrant('not-important-not-urgent')}
                onToggleTask={handleToggleTask}
                onDeleteTask={deleteTask}
                onEditTask={editTask}
              />
            </div>
            <DragOverlay>
              {activeTask ? (
                <div className="w-[calc(100vw-4rem)] max-w-md">
                  <TaskCard
                    task={activeTask}
                    onToggle={() => {}}
                    onDelete={() => {}}
                  />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>
    </div>
  );
}

export default App;