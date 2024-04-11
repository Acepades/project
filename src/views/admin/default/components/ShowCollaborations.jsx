import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot} from 'firebase/firestore'; // Import v9 functions
import auth from 'lib/firebase'; // Assuming auth configuration
import TaskCard from './TaskCard'; // Assuming TaskCard component path
import { db } from 'lib/firebase'; // Assuming database reference

const ShowCollaborations = () => {
  const [tasks, setTasks] = useState([]);

  // Fetch tasks on component mount and listen for changes
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'Tasks')
      ,where('collaborators', 'array-contains', auth.currentUser.uid)),
      (querySnapshot) => {
        const newTasks = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log(newTasks, "new tasks in the collabs")
        setTasks(newTasks);
      },
      (error) => {
        console.error('Error fetching tasks:', error);
      }
    );

    return () => unsubscribe(); // Cleanup function to unsubscribe on unmount
  }, []);

  return (
    <div >
      <h2 className='bold'>Your collabs</h2>
      {tasks.length === 0 ? (
        <p>You don't have any collabs yet.</p>
      ) : (
        <ul className='flex flex-col space-y-4'>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
            />
          ))}
        </ul>
      )}
    </div>
  );
};
const ShowCompletedCollaborations = () => {
  const [tasks, setTasks] = useState([]);

  // Fetch tasks on component mount and listen for changes
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'Tasks'), where('createdBy', '==', auth.currentUser?.uid),where('isComplete', '==', true)),
      (querySnapshot) => {
        const newTasks = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTasks(newTasks);
      },
      (error) => {
        console.error('Error fetching tasks:', error);
      }
    );

    return () => unsubscribe(); // Cleanup function to unsubscribe on unmount
  }, []);

  return (
    <div >
      <h2 className='bold'>Task History</h2>
      {tasks.length === 0 ? (
        <p>You haven't completed any tasks.</p>
      ) : (
        <ul className="flex flex-col space-y-4">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default ShowCollaborations;
export {ShowCompletedCollaborations}