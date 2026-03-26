import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { useAuth } from "../context/AuthContext";
import PageTransition from "../components/common/PageTransition";
import { extractErrorMessage } from "../services/api";

const initialState = {
  username: "",
  email: "",
  password: "",
  bio: "",
  profilePic: ""
};

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let nextError = "";

    if (!form.username.trim() || !form.email.trim() || !form.password.trim()) {
      nextError = "Username, email, and password are required.";
    } else if (form.password.length < 6) {
      nextError = "Password must be at least 6 characters long.";
    }

    setError(nextError);

    if (nextError) {
      return;
    }

    setIsSubmitting(true);

    try {
      await register(form);
      navigate("/", { replace: true });
    } catch (requestError) {
      setError(extractErrorMessage(requestError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <div className="mx-auto flex min-h-screen max-w-6xl items-center px-4 py-10 sm:px-6">
        <div className="grid w-full gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.form
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="glass-panel rounded-[36px] p-7 sm:p-10"
          >
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Create your account</p>
            <h2 className="mt-3 font-display text-4xl font-bold text-slate-900 dark:text-white">
              Join Pulse
            </h2>

            <div className="mt-8 space-y-4">
              <input
                className="input-shell"
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
              />
              <input
                className="input-shell"
                name="email"
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={handleChange}
              />
              <input
                className="input-shell"
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
              />
              <textarea
                className="input-shell min-h-24 resize-none"
                name="bio"
                placeholder="Short bio"
                value={form.bio}
                onChange={handleChange}
              />
              <input
                className="input-shell"
                name="profilePic"
                type="url"
                placeholder="Profile picture URL"
                value={form.profilePic}
                onChange={handleChange}
              />
            </div>

            {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
              type="submit"
              className="mt-8 w-full rounded-2xl bg-gradient-to-r from-ember to-orange-500 px-5 py-4 font-semibold text-white shadow-glow"
            >
              {isSubmitting ? "Creating..." : "Create account"}
            </motion.button>

            <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">
              Already have an account?{" "}
              <Link className="font-semibold text-aqua" to="/login">
                Login
              </Link>
            </p>
          </motion.form>

          <div className="glass-panel hidden rounded-[36px] p-10 lg:block">
            <p className="text-xs uppercase tracking-[0.45em] text-slate-400">Launch ready</p>
            <h1 className="mt-6 max-w-xl font-display text-6xl font-bold leading-none text-slate-900 dark:text-white">
              A social interface with actual taste.
            </h1>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[28px] bg-white/75 p-5 dark:bg-slate-900/70">
                <p className="font-semibold text-slate-900 dark:text-white">Animated feed</p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Framer Motion powers cards, buttons, and transitions.
                </p>
              </div>
              <div className="rounded-[28px] bg-white/75 p-5 dark:bg-slate-900/70">
                <p className="font-semibold text-slate-900 dark:text-white">JWT auth</p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Secure route protection with token persistence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default RegisterPage;
