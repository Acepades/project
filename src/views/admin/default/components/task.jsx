import React, { useState} from 'react';
import Card from 'components/card'; // Assuming Card component path
import { createTask } from 'lib/taskCRUD'; // Import createTask function
import auth from 'lib/firebase';
import { Timestamp } from 'firebase/firestore';

const TaskComponent = () => {

  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    exp_to_gain: 0,
    iscomplete: false,
    subtasks: {}, // Map to store subtasks with completion state
    createdBy: auth.currentUser?.uid,
    createdAt: Timestamp.now(),
  });

  const [newSubtask, setNewSubtask] = useState('');

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setTaskData({
      ...taskData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleAddSubtask = () => {
    if (!newSubtask.trim()) return; // Ignore empty subtasks

    setTaskData({
      ...taskData,
      subtasks: {
        ...taskData.subtasks,
        [newSubtask]: { name: newSubtask, iscomplete: false }, // Add subtask with initial false
      },
    });
    setNewSubtask(''); // Clear input after adding
  };

  const toggleSubtaskCompletion = (subtaskName) => {
    setTaskData({
      ...taskData,
      subtasks: {
        ...taskData.subtasks,
        [subtaskName]: {
          ...taskData.subtasks[subtaskName],
          iscomplete: !taskData.subtasks[subtaskName].iscomplete,
        },
      },
    });
  };

  const handleCreateTask = async () => {
    if (!taskData.title.trim()) {
      alert('Please enter a task title.');
      return;
    }

    const newTask = {
      title: taskData.title,
      description: taskData.description,
      exp_to_gain: taskData.exp_to_gain,
      iscomplete: taskData.iscomplete,
      subtasks: Object.fromEntries( // Convert map to object for Firestore
        Object.entries(taskData.subtasks).map(([subtaskName, subtaskObj]) => [
          subtaskName,
          subtaskObj,
        ])
      ),
      createdBy: auth.currentUser?.uid,
      createdAt: Timestamp.now(),
    };


    try {
      await createTask(newTask);
      console.log('Task created successfully!');

      // Clear form fields
      setTaskData({
        title: '',
        description: '',
        exp_to_gain: 0,
        iscomplete: false,
        subtasks: {},
        createdBy: auth.currentUser?.uid,
        createdAt: Timestamp.now(),
      });

      setNewSubtask('');
    } catch (err) {
      console.error('Error creating task:', err);
      alert('An error occurred while creating the task. Please try again.');
    }
  };

  return (
    <Card title="Create Task" extra="w-full">
      <div className="ml-3 mt-3 grid grid-cols-1 gap-4 ">
        <label htmlFor="taskTitle">
          Title:
        </label>
        <input
          type="text"
          id="taskTitle"
          value={taskData.title}
          onChange={handleChange}
          placeholder="Enter task title"
          name="title"
        />
        <label htmlFor="taskDescription">
          Description (optional):
        </label>
        <textarea
          id="taskDescription"
          value={taskData.description}
          onChange={handleChange}
          placeholder="Enter task description"
          name="description"
        />
        <label htmlFor="expToGain">
          Experience Points:
        </label>
        <input
          type="number"
          id="expToGain"
          value={taskData.exp_to_gain}
          onChange={handleChange}
          placeholder="Enter experience points to gain"
          name="exp_to_gain"
        />

        <div>
          <label htmlFor="newSubtask">
            Subtask:
          </label>
          <input
            type="text"
            id="newSubtask"
            value={newSubtask}
            onChange={(e) => setNewSubtask(e.target.value)}
            placeholder="Enter subtask"
            name="newSubtask"
          />
          <button onClick={handleAddSubtask}>Add Subtask</button>
        </div>

        <ul>
          {Object.entries(taskData.subtasks).map(([subtaskName, subtaskObj]) => (
            <li key={subtaskName}>
              <input
                type="checkbox"
                id={subtaskName} // Unique ID for each checkbox
                checked={subtaskObj.iscomplete} // Set checked based on iscomplete
                onChange={() => toggleSubtaskCompletion(subtaskName)} // Call toggle function on change
              />
              <label htmlFor={subtaskName}>{subtaskName}</label>
            </li>
          ))}
        </ul>

        <button type="button" onClick={handleCreateTask}>
          Create Task
        </button>
      </div>
    </Card>
  );
};

export default TaskComponent;

