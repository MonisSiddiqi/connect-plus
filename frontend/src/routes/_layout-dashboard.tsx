import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Header } from "@/routes/_layout-dashboard/-components/layout/header";
import { getMyProfileApi } from "@/api/user.api";

export const Route = createFileRoute("/_layout-dashboard")({
  beforeLoad: async ({ context }) => {
    if (context.auth.status === "loggedOut") {
      throw redirect({ to: "/" });
    }
    const user = await getMyProfileApi();
    context.auth.user = user;
  },
  component: LayoutDashboard,
});

function LayoutDashboard() {
  const { auth } = Route.useRouteContext();

  return (
    <div className="flex flex-col max-h-screen min-h-screen flex-1 overflow-hidden">
      <Header auth={auth} />
      <div className="flex flex-1 flex-row overflow-hidden shadow custom-height">
        <div className="flex flex-1 bg-gray-50 overflow-hidden justify-between">
          <ScrollArea className="w-1/4"></ScrollArea>
          <ScrollArea className="w-3/4">
            <Outlet />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
