import { Link } from "react-router-dom";

import PageTransition from "../components/common/PageTransition";

const NotFoundPage = () => (
  <PageTransition>
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="glass-panel max-w-lg rounded-[32px] p-10 text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-slate-400">404</p>
        <h1 className="mt-4 font-display text-5xl font-bold text-slate-900 dark:text-white">
          This page drifted away.
        </h1>
        <p className="mt-4 text-sm leading-7 text-slate-500 dark:text-slate-400">
          The route does not exist, but the rest of the product is ready to explore.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white dark:bg-white dark:text-slate-900"
        >
          Back home
        </Link>
      </div>
    </div>
  </PageTransition>
);

export default NotFoundPage;
