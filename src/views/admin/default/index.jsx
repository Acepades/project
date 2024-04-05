import ShowTasks from "./components/ShowTasks";
import TaskComponent from "./components/task";
const Dashboard = () => {
  return (
    <div>
      <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-2">
      <TaskComponent />
      </div>
      <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-2">
      <ShowTasks />
      </div>
    </div>
  );
};

export default Dashboard;
