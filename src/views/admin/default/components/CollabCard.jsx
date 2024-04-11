import React, { useState, useEffect, useContext } from 'react';
import Card from 'components/card'; // Assuming Card component import
import Checkbox from 'components/checkbox'; // Assuming Checkbox component import
import { TasksContext } from 'contexts/TasksContext'; // Assuming context import
import { Timestamp } from 'firebase/firestore'; // Assuming Timestamp import
import InviteCollaborator from './InviteCollab';
import { collection, getDocs, query, where } from 'firebase/firestore'; // Import v9 Firestore functions
import { db } from 'lib/firebase'; // Assuming database reference import
import auth from 'lib/firebase';
const CollabCard = ({ task }) => {
  const { updateTask, deleteTask } = useContext(TasksContext); // Access context values
  const [collaboratorUsernames, setCollaboratorUsernames] = useState({}); // State for collaborator usernames

  // Fetch usernames for collaborators on component mount
  useEffect(() => {
    const fetchUsernames = async () => {
      const usernames = {};
      if (task.collaborators && task.collaborators.length > 0) {
        // Assuming document IDs are stored in the `id` field
        const userRefQuery = query(collection(db, 'Users'),where('__name__', 'in', task.collaborators));
  
        try {
          const userDocSnapshots = await getDocs(userRefQuery); // Use getDocs with collection query
            console.log(userDocSnapshots,"userdocsnapshots")
          userDocSnapshots.forEach((docSnapshot) => {
            const username = docSnapshot.data().username;
            console.log(docSnapshot.data(),"docsnapshot.data()") // Access username from retrieved document
            console.log(username,"username")
            usernames[docSnapshot.id] = username; // Map username to collaborator ID (document ID)
            console.log(usernames)
          });
        } catch (error) {
          console.error('Error fetching usernames:', error); // Handle potential errors
        }
      }
      setCollaboratorUsernames(usernames);
    };
  
    fetchUsernames();
  }, [task.collaborators]);
  
   // Re-run on collaborator list change

  const handleMarkComplete = async () => {
    updateTask(task.id, {
      isComplete: true,
      completedAt: Timestamp.now(),
    }); // Use updateTask from context
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
          {task.collaborators.length > 1 && ', '} {/* Add comma and space except for last collaborator */}
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
                  <Checkbox
                    type="checkbox"
                    id={subtaskName}
                    checked={subtaskObj.isComplete} // Always show checked for completed tasks
                    className="mr-2 h-5 w-5 rounded focus:ring-0 focus:ring-offset-0 focus:outline-none focus:ring-primary-500 disabled:opacity-50 cursor-not-allowed" // Disable checkbox interaction
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
                    className="mr-2 h-5 w-5 rounded focus:ring-0 focus:ring-offset-0 focus:outline-none focus:ring-primary-500"
                    onChange={() => handleSubtaskCheck(subtaskName)} // Enable for incomplete tasks
                  />
                  <label htmlFor={subtaskName} className="text-gray-700">
                    {subtaskName}
                  </label>
                </li>
              ))}
            </ul>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4" onClick={handleMarkComplete} disabled={task.isComplete}>
              Complete Task
            </button>
          </>
        )}
        <p className="text-sm">
          {task.createdBy === auth.currentUser?.uid
            ? 'Created by: You'
            : `Created by: ${collaboratorUsernames[task.createdBy] || task.createdBy}`}
        </p>
        <p className="text-sm">Collaborators: {renderCollaborators()}</p>
        <button onClick={handleDeleteTask}>delete</button>
      </li>
    </Card>
  );
}
export default CollabCard;
