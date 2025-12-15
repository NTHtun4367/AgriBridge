import SideBar from "@/components/admin/SideBar";
import { Outlet } from "react-router";

function Panel() {
  return (
    <>
      <nav className="w-full px-8 py-3 shadow">
        <h1 className="text-3xl text-primary font-extrabold italic">
          AgriBridge
        </h1>
      </nav>
      <section className="grid grid-cols-12">
        <div className="col-span-2 mt-6">
          <SideBar />
        </div>
        <div className="col-span-10">
          <Outlet />
        </div>
      </section>
    </>
  );
}

export default Panel;
