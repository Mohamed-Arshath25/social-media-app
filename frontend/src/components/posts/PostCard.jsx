import { useState } from "react";
import { motion } from "framer-motion";

import CommentSection from "./CommentSection";

const PostCard = ({
  post,
  onLikeToggle,
  onSubmitComment,
  isLiking,
  isCommenting
}) => {
  const [commentsOpen, setCommentsOpen] = useState(false);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      whileHover={{ y: -4 }}
      className="glass-panel rounded-[30px] p-5"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-slate-900 dark:text-white">@{post.user.username}</p>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white dark:bg-white dark:text-slate-900">
          {post._count.likes} likes
        </div>
      </div>

      <p className="mt-4 text-[15px] leading-7 text-slate-600 dark:text-slate-300">{post.content}</p>

      {post.image && (
        <div className="mt-4 overflow-hidden rounded-[26px]">
          <img src={post.image} alt="Post" className="h-80 w-full object-cover" />
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          disabled={isLiking}
          onClick={() => onLikeToggle(post)}
          type="button"
          className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
            post.likedByMe
              ? "bg-gradient-to-r from-ember to-orange-500 text-white"
              : "border border-slate-200 bg-white/80 text-slate-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200"
          }`}
        >
          {post.likedByMe ? "Unlike" : "Like"}
        </motion.button>

        <button
          type="button"
          onClick={() => setCommentsOpen((current) => !current)}
          className="glass-button"
        >
          Comment
        </button>
      </div>

      <CommentSection
        postId={post.id}
        comments={post.comments}
        isOpen={commentsOpen}
        onToggle={() => setCommentsOpen((current) => !current)}
        onSubmitComment={onSubmitComment}
        isSubmitting={isCommenting}
      />
    </motion.article>
  );
};

export default PostCard;
