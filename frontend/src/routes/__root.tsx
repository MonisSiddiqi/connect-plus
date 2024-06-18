import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
// import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient } from "@tanstack/react-query";
import { Auth, AuthStatus, StorageKeys } from "@/utils/auth";
import { getMyProfileApi } from "@/api/user.api";

type RootContext = {
  auth: Auth;
  queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<RootContext>()({
  beforeLoad: async ({ context }) => {
    const status = localStorage.getItem(StorageKeys.status) as AuthStatus;
    if (status === "loggedIn") {
      const user = await getMyProfileApi();
      return (context.auth = {
        ...context.auth,
        user: user,
        status: status,
      });
    } else {
      return (context.auth.status = "loggedOut");
    }
  },
  component: () => (
    <>
      <Outlet />
      {/* <TanStackRouterDevtools /> */}
      <Toaster />
    </>
  ),
});
