import { motion } from "framer-motion";

import { useTheme } from "../../context/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={toggleTheme}
      className="glass-button gap-2"
      type="button"
    >
      <span>{theme === "dark" ? "Light" : "Dark"}</span>
      <span className="text-xs uppercase tracking-[0.25em]">
        {theme === "dark" ? "Sun" : "Moon"}
      </span>
    </motion.button>
  );
};

export default ThemeToggle;
