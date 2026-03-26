import { motion } from "framer-motion";

const LoadingScreen = ({ label = "Loading your world..." }) => (
  <div className="flex min-h-screen items-center justify-center px-6">
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-panel flex w-full max-w-md flex-col items-center gap-5 rounded-[32px] px-8 py-10 text-center"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.4, ease: "linear" }}
        className="h-14 w-14 rounded-full border-4 border-aqua/20 border-t-ember"
      />
      <div>
        <p className="font-display text-2xl text-slate-900 dark:text-white">Pulse</p>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{label}</p>
      </div>
    </motion.div>
  </div>
);

export default LoadingScreen;
