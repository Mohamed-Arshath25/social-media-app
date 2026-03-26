import { Outlet } from "react-router-dom";

import MobileNav from "./MobileNav";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const AppShell = () => (
  <div className="mx-auto flex min-h-screen w-full max-w-[1440px] gap-6 px-4 py-4 sm:px-6 lg:px-8">
    <Sidebar />
    <div className="flex min-w-0 flex-1 flex-col gap-5">
      <Topbar />
      <main className="pb-8">
        <Outlet />
      </main>
    </div>
    <MobileNav />
  </div>
);

export default AppShell;
