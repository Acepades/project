import React, { useState, useEffect, useContext } from 'react';
import Card from 'components/card';
import Checkbox from 'components/checkbox';
import { TasksContext } from 'contexts/TasksContext';
import { Timestamp } from 'firebase/firestore';
import InviteCollaborator from '../default/components/InviteCollab';
import { collection, getDocs, query, where } from 'firebase/firestore'; 
import { db } from 'lib/firebase'; 
import auth from 'lib/firebase';
import { PointsContext } from '../default/components/PointsContext';

const CollabCard = ({ task }) => {
  const { updateTask, deleteTask } = useContext(TasksContext);
  const [collaboratorUsernames, setCollaboratorUsernames] = useState({});
  const { updatePoints } = useContext(PointsContext);


  // Fetch usernames for collaborators on component mount
  useEffect(() => {
    const fetchUsernames = async () => {
      const usernames = {};
      if (task.collaborators && task.collaborators.length > 0) {
        // Assuming document IDs are stored in the `id` field
        const userRefQuery = query(collection(db, 'Users'),where('__name__', 'in', task.collaborators));
  
        try {
          const userDocSnapshots = await getDocs(userRefQuery); 
            console.log(userDocSnapshots,"userdocsnapshots")
          userDocSnapshots.forEach((docSnapshot) => {
            const username = docSnapshot.data().username;
            console.log(docSnapshot.data(),"docsnapshot.data()") 
            console.log(username,"username")
            usernames[docSnapshot.id] = username; 
            console.log(usernames)
          });
        } catch (error) {
          console.error('Error fetching usernames:', error); 
        }
      }
      setCollaboratorUsernames(usernames);
    };

    fetchUsernames();
  }, [task.collaborators]);

   // Re-run on collaborator list change

   const handleMarkComplete = async () => {
    if (task) {
      try {
        await updateTask(task.id, {
          isComplete: true,
          completedAt: Timestamp.now(),
        });
        await updatePoints(task.collaborators, parseInt(task.exp_to_gain));
        console.log("done",);
      } catch (error) {
        console.error('Error marking task as complete:', error);
      }
    } else {
      console.error('Task is null');
    }
  };

  const handleDeleteTask = async () => {
    deleteTask(task.id); // Use deleteTask from context
  };

  const handleSubtaskCheck = async (subtaskName) => {
    try {
      const updatedSubtasks = {
        ...task.subtasks,
        [subtaskName]: {
          ...task.subtasks[subtaskName],
          isComplete: !task.subtasks[subtaskName].isComplete,
        },
      };

      await updateTask(task.id, { subtasks: updatedSubtasks }); // Update task with modified subtasks
    } catch (err) {
      console.error('Error updating subtask:', err);
    }
  };

  const renderCollaborators = () => {
    if (task.collaborators && task.collaborators.length > 0) {
      return task.collaborators.map((collaboratorId) => (
        <span key={collaboratorId}>
          {collaboratorId === auth.currentUser?.uid ? 'You' : collaboratorUsernames[collaboratorId] || collaboratorId}
          {task.collaborators.length > 1 && ', '}
        </span>
      ));
    }

    return <p>No collaborators yet.</p>;
  };

  return (
    <Card>
      <li key={task.id} className="m-3">
        <h3 className="font-bold text-lg mb-2 mt-2">{task.title}</h3>
        <p className="text-gray-700 mb-2">{task.description}</p>
        {task.Task_exp > 0 && (
          <p className="font-medium text-gray-500">
            <b>Experience Points:</b> {task.Task_exp}
          </p>
        )}
        <p className="text-gray-500 text-sm">
          <b>Created At:</b> {task.createdAt.toDate().toLocaleString()}
        </p>
        {task.isComplete ? (
          <>
            <ul className="list-none mt-4">
              {/* Disable subtask checkboxes for completed tasks */}
              {Object.entries(task.subtasks).map(([subtaskName, subtaskObj]) => (
                <li key={subtaskName} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={subtaskName}
                    checked={subtaskObj.isComplete} // Always show checked for completed tasks
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" // Disable checkbox interaction
                    disabled={true} // Set checkbox as disabled
                  />
                  <label htmlFor={subtaskName} className="text-gray-700 line-through"> {/* Add line-through for completed subtasks */}
                    {subtaskName}
                  </label>
                </li>
              ))}
            </ul>
            <p className="text-green-500 text-sm mt-2">
              <b>Completed At:</b> {task.completedAt?.toDate().toLocaleString() || '-'} {/* Show CompletedAt if available */}
            </p>
          </>
        ) : (
          <>
            {task.createdBy === auth.currentUser?.uid && <InviteCollaborator taskId={task.id} />}
            <ul className="list-none mt-4">
              {Object.entries(task.subtasks).map(([subtaskName, subtaskObj]) => (
                <li key={subtaskName} className="flex items-center mb-2">
                  <Checkbox
                    type="checkbox"
                    id={subtaskName}
                    checked={subtaskObj.isComplete}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    onChange={() => handleSubtaskCheck(subtaskName)} // Enable for incomplete tasks
                  />
                  <label htmlFor={subtaskName} className="text-gray-700">
                    {subtaskName}
                  </label>
                </li>
              ))}
            </ul> 
            <button style={{ background:"linear-gradient(90deg, rgba(56,68,244,1) 0%, rgba(56,78,244,1) 39%, rgba(184,0,255,1) 100%)", color: '#fff', border: 'none', borderRadius: '5px', padding: '8px 16px', cursor: 'pointer', marginLeft: '50%' }}  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 mr-2" onClick={handleMarkComplete} disabled={task.isComplete}>
            Complete Task
        </button>
        
          </>
        )}
        <p className="text-sm">
          <b>Created by:</b>
          {task.createdBy === auth.currentUser?.uid
            ? ' You'
            : ` ${collaboratorUsernames[task.createdBy] || task.createdBy}`}
        </p>
        <p className="text-sm"><b>Collaborators:</b> {renderCollaborators()}</p>
        <button onClick={handleDeleteTask} className="bg-gray-500 hover:bg-gray-700 text-white font-normal py-2 px-4 rounded">
            Delete
        </button>
        
      </li>
      
    </Card>
  );
}
export default CollabCard;
