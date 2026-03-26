import { NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

const MobileNav = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="glass-panel fixed bottom-4 left-4 right-4 z-40 rounded-[26px] p-3 lg:hidden">
      <div className="flex items-center justify-between gap-2">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex-1 rounded-2xl px-4 py-3 text-center text-sm font-semibold ${
              isActive
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                : "text-slate-600 dark:text-slate-300"
            }`
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex-1 rounded-2xl px-4 py-3 text-center text-sm font-semibold ${
              isActive
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                : "text-slate-600 dark:text-slate-300"
            }`
          }
        >
          Profile
        </NavLink>
        <button
          type="button"
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="flex-1 rounded-2xl bg-gradient-to-r from-ember to-orange-500 px-4 py-3 text-sm font-semibold text-white"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default MobileNav;
