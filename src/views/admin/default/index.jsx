import ShowTasks, { ShowCompletedTasks } from "./components/ShowTasks";
const Dashboard = () => {
  return (
    <div>
      <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-2">
      <ShowTasks />
      <ShowCompletedTasks/>
      </div>
      <div style={{ height: "80vh" }}></div>
    </div>
  );
};

export default Dashboard;
