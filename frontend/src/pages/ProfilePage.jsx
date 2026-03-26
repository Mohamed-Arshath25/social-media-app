import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";

import FeedSkeleton from "../components/posts/FeedSkeleton";
import PageTransition from "../components/common/PageTransition";
import { useAuth } from "../context/AuthContext";
import api, { extractErrorMessage } from "../services/api";

const ProfilePage = () => {
  const { id } = useParams();
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const profileId = useMemo(() => id || user?.id, [id, user?.id]);
  const isOwnProfile = Number(profileId) === user?.id;

  const fetchProfile = async () => {
    if (!profileId) {
      return;
    }

    try {
      const response = await api.get(`/users/${profileId}`);
      setProfile(response.data.data);
      setIsFollowing(Boolean(response.data.data.isFollowing));
    } catch (requestError) {
      setError(extractErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [profileId]);

  const handleFollowToggle = async () => {
    if (!profileId || isOwnProfile) {
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const endpoint = isFollowing ? `/users/unfollow/${profileId}` : `/users/follow/${profileId}`;
      await api.post(endpoint);
      setIsFollowing((current) => !current);
      setProfile((currentProfile) =>
        currentProfile
          ? {
              ...currentProfile,
              _count: {
                ...currentProfile._count,
                followers: isFollowing
                  ? currentProfile._count.followers - 1
                  : currentProfile._count.followers + 1
              }
            }
          : currentProfile
      );
      await refreshUser();
    } catch (requestError) {
      setError(extractErrorMessage(requestError));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <FeedSkeleton />;
  }

  return (
    <PageTransition>
      <div className="space-y-5">
        {error && (
          <div className="glass-panel rounded-[24px] border border-red-200 bg-red-50/80 p-4 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </div>
        )}

        {profile && (
          <section className="glass-panel rounded-[32px] p-6 sm:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-gradient-to-br from-aqua to-emerald-300 text-2xl font-bold text-slate-900">
                  {profile.username?.slice(0, 1).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Profile</p>
                  <h2 className="font-display text-4xl font-bold text-slate-900 dark:text-white">
                    @{profile.username}
                  </h2>
                  <p className="mt-2 max-w-xl text-sm leading-7 text-slate-500 dark:text-slate-400">
                    {profile.bio || "No bio yet."}
                  </p>
                </div>
              </div>

              {!isOwnProfile && (
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting}
                  onClick={handleFollowToggle}
                  type="button"
                  className="rounded-2xl bg-gradient-to-r from-slate-900 to-slate-700 px-5 py-3 text-sm font-semibold text-white dark:from-white dark:to-slate-300 dark:text-slate-900"
                >
                  {isSubmitting ? "Updating..." : isFollowing ? "Unfollow" : "Follow"}
                </motion.button>
              )}
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[24px] bg-white/75 p-4 dark:bg-slate-900/70">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Posts</p>
                <p className="mt-2 font-display text-3xl font-bold text-slate-900 dark:text-white">
                  {profile._count.posts}
                </p>
              </div>
              <div className="rounded-[24px] bg-white/75 p-4 dark:bg-slate-900/70">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Followers</p>
                <p className="mt-2 font-display text-3xl font-bold text-slate-900 dark:text-white">
                  {profile._count.followers}
                </p>
              </div>
              <div className="rounded-[24px] bg-white/75 p-4 dark:bg-slate-900/70">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Following</p>
                <p className="mt-2 font-display text-3xl font-bold text-slate-900 dark:text-white">
                  {profile._count.following}
                </p>
              </div>
            </div>
          </section>
        )}

        <section className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Posts</p>
            <h3 className="mt-2 font-display text-3xl font-bold text-slate-900 dark:text-white">
              Recent drops
            </h3>
          </div>

          {profile?.posts?.map((post) => (
            <article key={post.id} className="glass-panel rounded-[28px] p-5">
              <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">{post.content}</p>
              {post.image && (
                <img
                  src={post.image}
                  alt="Post"
                  className="mt-4 h-72 w-full rounded-[24px] object-cover"
                />
              )}
            </article>
          ))}

          {profile?.posts?.length === 0 && (
            <div className="glass-panel rounded-[28px] p-5 text-sm text-slate-500 dark:text-slate-400">
              No posts yet.
            </div>
          )}
        </section>
      </div>
    </PageTransition>
  );
};

export default ProfilePage;
