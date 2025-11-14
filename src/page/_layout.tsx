import { Outlet } from "react-router";

export default function Layout() {
  return (
    <div className="max-w-lg w-full mx-auto">
      <Outlet />
    </div>
  );
}
