import ShowCollaborations, { ShowCompletedCollaborations } from "../collaboration/ShowCollaborations";
import ShowTasks, { ShowCompletedTasks } from "./components/ShowTasks";
const Dashboard = () => {
  return (
    <div>
      <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-2">
      <ShowTasks />
      <ShowCompletedTasks/>
      </div>
      <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-2">
      <ShowCollaborations/>
      <ShowCompletedCollaborations/>
      </div>
    </div>
  );
};

export default Dashboard;
