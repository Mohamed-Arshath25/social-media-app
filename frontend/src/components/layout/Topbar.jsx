import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import ThemeToggle from "../common/ThemeToggle";

const Topbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="glass-panel sticky top-4 z-30 rounded-[28px] px-5 py-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Live feed</p>
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
            Welcome back, {user?.username}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/profile")}
            type="button"
            className="hidden rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-slate-900 sm:inline-flex"
          >
            View profile
          </motion.button>
          <button
            type="button"
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="glass-button lg:hidden"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
