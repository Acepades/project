import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';

const tasksCollectionRef = collection(db, "Tasks");

// CRUD functions for tasks
export const createTask = async (task) => {
  try {
    if (!task.createdBy) {
      throw new Error('Missing createdBy field in task data.');
    }
    task.exp_to_gain = Number(task.exp_to_gain) || 0;
    await addDoc(tasksCollectionRef, task);
  } catch (err) {
    console.error('Error adding task:', err);
  }
};

export const getTasks = async () => {
  try {
    const querySnapshot = await getDocs(tasksCollectionRef);
    const tasks = [];
    querySnapshot.forEach((doc) => {
      tasks.push({ id: doc.id, ...doc.data() });
    });
    return tasks;
  } catch (err) {
    console.error("Error getting tasks:", err);
    return []; // Return empty array on error
  }
};

export const updateTask = async (taskId, updatedFields) => {
  try {
    const taskDocRef = doc(tasksCollectionRef, taskId);
    await updateDoc(taskDocRef, updatedFields);
  } catch (err) {
    console.error("Error updating task:", err);
  }
};

export const deleteTask = async (taskId) => {
  try {
    const taskDocRef = doc(tasksCollectionRef, taskId);
    await deleteDoc(taskDocRef);
  } catch (err) {
    console.error("Error deleting task:", err);
  }
};

