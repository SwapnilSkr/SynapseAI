import { Outlet } from "react-router-dom";

const Dashboard = (props: React.PropsWithChildren) => {
  return (
    <div className="flex w-full min-h-screen">
      {props.children} <Outlet />
    </div>
  );
};

export default Dashboard;
