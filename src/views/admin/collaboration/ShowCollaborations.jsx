import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot} from 'firebase/firestore'; // Import v9 functions
import auth from 'lib/firebase'; 
import { db } from 'lib/firebase'; 
import CollabCard from './CollabCard';

const ShowCollaborations = () => {
  const [tasks, setTasks] = useState([]);

  // Fetch tasks on component mount and listen for changes
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'Tasks')
      ,where('collaborators', 'array-contains', auth.currentUser.uid)
      ,where('isCollab', '==', true)
      ,where('isComplete', '==', false)),
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
      <h2 style={{fontSize: '20px'}} className="font-bold capitalize hover:text-navy-700 dark:text-white">Your collabs</h2>
      {tasks.length === 0 ? (
        <p className=' dark:text-white'>You don't have any collabs yet.</p>
      ) : (
        <ul className='flex flex-col space-y-4'>
          {tasks.map((task) => (
            <CollabCard
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
      query(collection(db, 'Tasks'),
       where('createdBy', '==', auth.currentUser?.uid),
       where('isComplete', '==', true),
       where('isCollab','==', true)),
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
      <h2 style={{fontSize: '20px'}} className="font-bold capitalize hover:text-navy-700 dark:text-white">Collaborations History</h2>
      {tasks.length === 0 ? (
        <p className=' dark:text-white'>You haven't completed any collaborations.</p>
      ) : (
        <ul className="flex flex-col space-y-4">
          {tasks.map((task) => (
            <CollabCard
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