import { Outlet } from "react-router";
import { Toaster } from "sonner";

function Main() {
  return (
    // <div className="max-w-6xl mx-auto">
    <div>
      <Outlet />
      <Toaster richColors position="top-center" />
    </div>
  );
}

export default Main;
