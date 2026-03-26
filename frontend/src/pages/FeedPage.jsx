import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";

import api, { extractErrorMessage } from "../services/api";
import PageTransition from "../components/common/PageTransition";
import CreatePostCard from "../components/posts/CreatePostCard";
import FeedSkeleton from "../components/posts/FeedSkeleton";
import PostCard from "../components/posts/PostCard";

const FeedPage = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [loadingPostId, setLoadingPostId] = useState(null);
  const [commentingPostId, setCommentingPostId] = useState(null);
  const [error, setError] = useState("");
  const totalLikes = posts.reduce((sum, post) => sum + post._count.likes, 0);
  const totalComments = posts.reduce((sum, post) => sum + post._count.comments, 0);

  const fetchFeed = async () => {
    try {
      const response = await api.get("/posts/feed?page=1&limit=10");
      setPosts(response.data.data);
    } catch (requestError) {
      setError(extractErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  const handleCreatePost = async (payload) => {
    setError("");
    setIsCreating(true);

    try {
      const response = await api.post("/posts", payload);
      const createdPost = {
        ...response.data.data,
        comments: [],
        likedByMe: false,
        _count: {
          likes: 0,
          comments: 0
        }
      };
      setPosts((currentPosts) => [createdPost, ...currentPosts]);
      return true;
    } catch (requestError) {
      setError(extractErrorMessage(requestError));
      return false;
    } finally {
      setIsCreating(false);
    }
  };

  const handleLikeToggle = async (post) => {
    setLoadingPostId(post.id);
    setError("");

    try {
      const endpoint = post.likedByMe ? `/posts/${post.id}/unlike` : `/posts/${post.id}/like`;
      await api.post(endpoint);

      setPosts((currentPosts) =>
        currentPosts.map((currentPost) =>
          currentPost.id === post.id
            ? {
                ...currentPost,
                likedByMe: !currentPost.likedByMe,
                _count: {
                  ...currentPost._count,
                  likes: currentPost.likedByMe
                    ? currentPost._count.likes - 1
                    : currentPost._count.likes + 1
                }
              }
            : currentPost
        )
      );
    } catch (requestError) {
      setError(extractErrorMessage(requestError));
    } finally {
      setLoadingPostId(null);
    }
  };

  const handleAddComment = async (postId, text) => {
    setCommentingPostId(postId);
    setError("");

    try {
      const response = await api.post(`/comments/${postId}`, { text });
      const newComment = response.data.data;

      setPosts((currentPosts) =>
        currentPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: [newComment, ...post.comments],
                _count: {
                  ...post._count,
                  comments: post._count.comments + 1
                }
              }
            : post
        )
      );

      return true;
    } catch (requestError) {
      setError(extractErrorMessage(requestError));
      return false;
    } finally {
      setCommentingPostId(null);
    }
  };

  return (
    <PageTransition>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-5">
          <CreatePostCard onCreatePost={handleCreatePost} isSubmitting={isCreating} />

          {error && (
            <div className="glass-panel rounded-[24px] border border-red-200 bg-red-50/80 p-4 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-950/40 dark:text-red-300">
              {error}
            </div>
          )}

          {isLoading ? (
            <FeedSkeleton />
          ) : (
            <AnimatePresence mode="popLayout">
              <div className="space-y-4">
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onLikeToggle={handleLikeToggle}
                    onSubmitComment={handleAddComment}
                    isLiking={loadingPostId === post.id}
                    isCommenting={commentingPostId === post.id}
                  />
                ))}
              </div>
            </AnimatePresence>
          )}
        </div>

        <aside className="space-y-5">
          <div className="glass-panel rounded-[30px] p-5">
            <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Feed snapshot</p>
            <h2 className="mt-3 font-display text-2xl font-bold text-slate-900 dark:text-white">
              What is happening right now
            </h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
              <div className="rounded-[24px] bg-white/75 p-4 dark:bg-slate-900/70">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Loaded posts</p>
                <p className="mt-2 font-display text-3xl font-bold text-slate-900 dark:text-white">
                  {posts.length}
                </p>
              </div>
              <div className="rounded-[24px] bg-white/75 p-4 dark:bg-slate-900/70">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Total likes</p>
                <p className="mt-2 font-display text-3xl font-bold text-slate-900 dark:text-white">
                  {totalLikes}
                </p>
              </div>
              <div className="rounded-[24px] bg-white/75 p-4 dark:bg-slate-900/70">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Comments</p>
                <p className="mt-2 font-display text-3xl font-bold text-slate-900 dark:text-white">
                  {totalComments}
                </p>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-[30px] p-5">
            <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Quick start</p>
            <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <li>Create a post from the composer at the top of the feed.</li>
              <li>Use the image toggle if you want to attach an image URL.</li>
              <li>Open comments on any post to join the conversation instantly.</li>
              <li>Visit your profile to review your posts and follower counts.</li>
            </ul>
          </div>
        </aside>
      </div>
    </PageTransition>
  );
};

export default FeedPage;
