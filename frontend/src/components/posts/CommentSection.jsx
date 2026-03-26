import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const CommentSection = ({
  postId,
  comments = [],
  isOpen,
  onToggle,
  onSubmitComment,
  isSubmitting
}) => {
  const [text, setText] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!text.trim()) {
      return;
    }

    const success = await onSubmitComment(postId, text.trim());

    if (success) {
      setText("");
    }
  };

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={onToggle}
        className="text-sm font-semibold text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
      >
        {isOpen ? "Hide comments" : `View comments (${comments.length})`}
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="mt-4 flex gap-3">
              <input
                value={text}
                onChange={(event) => setText(event.target.value)}
                className="input-shell"
                placeholder="Write a comment..."
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white dark:bg-white dark:text-slate-900"
              >
                Send
              </button>
            </form>

            <div className="mt-4 space-y-3">
              {comments.length === 0 && (
                <p className="text-sm text-slate-500 dark:text-slate-400">No comments yet.</p>
              )}

              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="rounded-2xl border border-slate-200/80 bg-white/70 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/70"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-slate-900 dark:text-white">
                      @{comment.user.username}
                    </p>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{comment.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CommentSection;
