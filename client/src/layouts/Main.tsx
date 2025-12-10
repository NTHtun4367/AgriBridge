import { Outlet } from "react-router";

function Main() {
  return (
    <div className="max-w-6xl mx-auto">
      <Outlet />
    </div>
  );
}

export default Main;
