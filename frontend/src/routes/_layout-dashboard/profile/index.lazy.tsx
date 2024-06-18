import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/utils/helpers";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

export const Route = createLazyFileRoute("/_layout-dashboard/profile/")({
  component: ProfilePage,
});

function ProfilePage() {
  const { auth } = Route.useRouteContext();
  const navigate = useNavigate();
  const user = auth.user;
  const handleLogout = () => {
    auth.logout();
    navigate({ to: "/" });
    toast({
      title: "Logged out",
      description: "You have been logged out",
      className: "text-green-700 bg-green-200",
    });
  };
  if (!user) {
    return null;
  }
  return (
    <main className="p-4 bg-white flex flex-col gap-4">
      <div className="flex justify-between">
        <div className="flex gap-2 items-center">
          <Avatar className="size-20">
            <AvatarFallback className="text-2xl">
              {getInitials(user.UserProfile.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <p className="text-gray-900">{user.UserProfile.name}</p>
            <p className="text-gray-400">{user.email}</p>
          </div>
        </div>
        <Button
          onClick={handleLogout}
          className="hover:bg-red-50 hover:text-destructive duration-0"
          variant={"ghost"}
        >
          Logout
        </Button>
      </div>
      <div className="w-full h-[1px] bg-gray-200"></div>
    </main>
  );
}
