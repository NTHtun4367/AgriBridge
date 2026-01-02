import { ModeToggle } from "@/components/ModeToggle";
import { useNotifications } from "@/hooks/useNotification";
import { useCurrentUserQuery } from "@/store/slices/userApi";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router";

function NavBar() {
  const { data: user } = useCurrentUserQuery();
  const navigate = useNavigate();
  useNotifications();

  return (
    <nav className="w-full flex items-center justify-between px-8 py-3 shadow border-b-2 border-b-primary/35">
      <h1 className="text-3xl text-primary font-extrabold italic">
        {/* <Link to={"/"}>AgriBridge</Link> */}
      </h1>
      <div className="flex items-center gap-4">
        <ModeToggle />
        <Bell
          onClick={() => navigate("/farmer/notifications")}
          className="cursor-pointer"
        />
        <div>
          {user && (
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                {user.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium">{user.name}</p>
                {user.role === "admin" ? (
                  <span className="text-xs">Adminstrator</span>
                ) : user.role === "farmer" ? (
                  <span className="text-xs">Farmer</span>
                ) : (
                  <span className="text-xs">Merchant</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
