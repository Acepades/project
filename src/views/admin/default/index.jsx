import ShowCollaborations from "./components/ShowCollaborations";
import ShowTasks, { ShowCompletedTasks } from "./components/ShowTasks";
import TaskComponent from "./components/TaskComponent";
import { ToastContainer } from 'react-toastify';


const Dashboard = () => {
  return (
    <div> 
      <ToastContainer />
      <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-1">
      <TaskComponent />
      </div>
      <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-2">
      <ShowTasks  />
      <ShowCompletedTasks/>
      </div>
      <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-1">
      <ShowCollaborations/>
      </div>
      
      
    </div>
  );
};

export default Dashboard;
