import React from 'react';
import Card from 'components/card'; // Assuming Card component handles basic card structure
import Checkbox from 'components/checkbox';

const TaskCard = ({ task, onMarkComplete, onSubtaskCheck }) => {
  return (
    <Card>
      <li key={task.id} className="task-card p-4 rounded-md shadow-sm border border-gray-200">
        <h3 className="font-bold text-lg mb-2">{task.title}</h3>
        <p className="text-gray-700 mb-2">{task.description}</p>
        {task.exp_to_gain > 0 && (
          <p className="font-medium text-gray-500">
            <b>Experience Points:</b> {task.exp_to_gain}
          </p>
        )}
        <p className="text-gray-500 text-sm">
          <b>Created At:</b> {task.createdAt.toDate().toLocaleString()}
        </p>
        <ul className="list-none mt-4">
          {Object.entries(task.subtasks).map(([subtaskName, subtaskObj]) => (
            <li key={subtaskName} className="flex items-center mb-2">
              <Checkbox
                type="checkbox"
                id={subtaskName}
                checked={subtaskObj.iscomplete}
                className="mr-2 h-5 w-5 rounded focus:ring-0 focus:ring-offset-0 focus:outline-none focus:ring-primary-500"
                onChange={() => onSubtaskCheck(task.id, subtaskName)} // Handle subtask check
              />
              <label htmlFor={subtaskName} className="text-gray-700">
                {subtaskName}
              </label>
            </li>
          ))}
        </ul>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4" onClick={() => onMarkComplete(task.id)}>
          Complete Task
        </button>
      </li>
    </Card>
  );
};

export default TaskCard;
