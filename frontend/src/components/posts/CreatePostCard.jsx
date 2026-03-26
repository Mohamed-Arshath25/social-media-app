import { useState } from "react";
import { motion } from "framer-motion";

const CreatePostCard = ({ onCreatePost, isSubmitting }) => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [showImageInput, setShowImageInput] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!content.trim()) {
      return;
    }

    const payload = {
      content: content.trim()
    };

    if (image.trim()) {
      payload.image = image.trim();
    }

    const success = await onCreatePost(payload);

    if (success) {
      setContent("");
      setImage("");
      setShowImageInput(false);
    }
  };

  return (
    <motion.form layout onSubmit={handleSubmit} className="glass-panel rounded-[30px] p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="font-display text-xl font-bold text-slate-900 dark:text-white">Share a moment</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Drop a thought, a win, or something worth pausing for.
          </p>
        </div>
        <button
          type="button"
          className="glass-button"
          onClick={() => setShowImageInput((current) => !current)}
        >
          {showImageInput ? "Hide image" : "Add image"}
        </button>
      </div>

      <textarea
        className="input-shell min-h-32 resize-none"
        placeholder="What is moving through your world today?"
        value={content}
        onChange={(event) => setContent(event.target.value)}
      />

      {showImageInput && (
        <motion.input
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          type="url"
          className="input-shell mt-4"
          placeholder="Paste an image URL for now"
          value={image}
          onChange={(event) => setImage(event.target.value)}
        />
      )}

      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{content.length}/2000</p>
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          disabled={isSubmitting}
          type="submit"
          className="rounded-2xl bg-gradient-to-r from-aqua to-cyan-500 px-5 py-3 text-sm font-semibold text-slate-900 shadow-glow disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Posting..." : "Publish"}
        </motion.button>
      </div>
    </motion.form>
  );
};

export default CreatePostCard;
