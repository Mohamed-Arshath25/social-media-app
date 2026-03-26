import { motion } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Profile", to: "/profile" }
];

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="glass-panel hidden w-72 shrink-0 rounded-[32px] p-5 lg:flex lg:flex-col lg:justify-between">
      <div>
        <div className="mb-8">
          <p className="font-display text-3xl font-bold text-slate-900 dark:text-white">Pulse</p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Social that feels cinematic.
          </p>
        </div>

        <nav className="space-y-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                    : "text-slate-600 hover:bg-white/70 dark:text-slate-300 dark:hover:bg-slate-800/80"
                }`
              }
            >
              <span>{item.label}</span>
              <span className="text-xs uppercase tracking-[0.3em]">Go</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <motion.button
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleLogout}
        type="button"
        className="rounded-2xl bg-gradient-to-r from-ember to-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-glow"
      >
        Logout
      </motion.button>
    </aside>
  );
};

export default Sidebar;
