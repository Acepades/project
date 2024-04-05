import React, { useState, useEffect } from 'react';
import { collection, query, doc, where, onSnapshot, updateDoc } from 'firebase/firestore'; // Import Firestore functions
import auth from 'lib/firebase';
import TaskCard from './TaskCard'; // Assuming TaskCard component path
import { db } from 'lib/firebase';

const ShowTasks = () => {
  const [tasks, setTasks] = useState([]);

  // Fetch tasks on component mount and listen for changes
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'Tasks'), where('createdBy', '==', auth.currentUser?.uid)),
      (querySnapshot) => {
        const newTasks = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("Fetched Tasks:", newTasks);
        setTasks(newTasks);
      },
      (error) => {
        console.error('Error fetching tasks:', error);
      }
    );

    return () => unsubscribe(); // Cleanup function to unsubscribe on unmount
  }, []);

  const handleMarkTaskComplete = async (taskId) => {
    try {
      // Update task completion in Firestore
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, { iscompleted: true });
      console.log("its swimming")

      // Update local tasks state
      setTasks((prevTasks) => prevTasks.map((task) => (task.id === taskId ? { ...task, iscompleted: true } : task)));
    } catch (err) {
      console.error('Error completing task:', err);
    }
  };

  const handleSubtaskCheck = async (taskId, subtaskName) => {
    try {
      // Update subtask completion in Firestore
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, {
        subtasks: {
          [subtaskName]: !tasks.find((task) => task.id === taskId).subtasks[subtaskName].iscomplete // Toggle completion based on current state
        }
      });

      // Update local task state (assuming tasks hold the current state)
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === taskId ? {
          ...task,
          subtasks: {
            ...task.subtasks,
            [subtaskName]: { ...task.subtasks[subtaskName], iscomplete: !task.find((innerTask) => innerTask.id === taskId).subtasks[subtaskName].iscomplete }
          }
        } : task))
      );
    } catch (err) {
      console.error('Error updating subtask:', err);
    }
  };

  return (
    <div className="all-tasks">
      <h2 className='bold'>Your Tasks</h2>
      {tasks.length === 0 ? (
        <p>You don't have any tasks yet.</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onMarkComplete={handleMarkTaskComplete}
              onSubtaskCheck={handleSubtaskCheck}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default ShowTasks;
