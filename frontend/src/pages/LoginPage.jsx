import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { useAuth } from "../context/AuthContext";
import PageTransition from "../components/common/PageTransition";
import { extractErrorMessage } from "../services/api";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectPath = useMemo(() => location.state?.from?.pathname || "/", [location.state]);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextError =
      !form.email.trim() || !form.password.trim()
        ? "Email and password are required."
        : null;

    setError(nextError || "");

    if (nextError) {
      return;
    }

    setIsSubmitting(true);

    try {
      await login(form);
      navigate(redirectPath, { replace: true });
    } catch (requestError) {
      setError(extractErrorMessage(requestError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <div className="mx-auto flex min-h-screen max-w-6xl items-center px-4 py-10 sm:px-6">
        <div className="grid w-full gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="glass-panel hidden rounded-[36px] p-10 lg:block">
            <p className="text-xs uppercase tracking-[0.45em] text-slate-400">Pulse Social</p>
            <h1 className="mt-6 max-w-xl font-display text-6xl font-bold leading-none text-slate-900 dark:text-white">
              A social space built to feel fast, elegant, and alive.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-slate-600 dark:text-slate-300">
              Share updates, follow people, comment on moments, and move through a polished social experience.
            </p>
          </div>

          <motion.form
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="glass-panel rounded-[36px] p-7 sm:p-10"
          >
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Welcome back</p>
            <h2 className="mt-3 font-display text-4xl font-bold text-slate-900 dark:text-white">
              Log in
            </h2>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              Pick up where you left off.
            </p>

            <div className="mt-8 space-y-4">
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
            </div>

            {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
              type="submit"
              className="mt-8 w-full rounded-2xl bg-gradient-to-r from-aqua to-cyan-500 px-5 py-4 font-semibold text-slate-900 shadow-glow"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </motion.button>

            <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">
              New here?{" "}
              <Link className="font-semibold text-ember" to="/register">
                Create an account
              </Link>
            </p>
          </motion.form>
        </div>
      </div>
    </PageTransition>
  );
};

export default LoginPage;
