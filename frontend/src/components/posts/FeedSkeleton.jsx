import { motion } from "framer-motion";

const skeletonRows = Array.from({ length: 3 });

const FeedSkeleton = () => (
  <div className="space-y-4">
    {skeletonRows.map((_, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.2, delay: index * 0.1 }}
        className="glass-panel rounded-[28px] p-5"
      >
        <div className="h-4 w-24 rounded-full bg-slate-200 dark:bg-slate-700" />
        <div className="mt-4 h-3 w-full rounded-full bg-slate-200 dark:bg-slate-700" />
        <div className="mt-2 h-3 w-2/3 rounded-full bg-slate-200 dark:bg-slate-700" />
        <div className="mt-5 h-48 rounded-[24px] bg-slate-200 dark:bg-slate-700" />
      </motion.div>
    ))}
  </div>
);

export default FeedSkeleton;
