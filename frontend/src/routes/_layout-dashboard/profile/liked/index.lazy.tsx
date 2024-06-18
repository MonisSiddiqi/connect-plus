import { getInitials } from "@/utils/helpers";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { createLazyFileRoute, Link } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_layout-dashboard/profile/liked/")({
  component: LikedPage,
});

function LikedPage() {
  const { auth } = Route.useRouteContext();
  const user = auth.user;
  if (!user) {
    return null;
  }
  return (
    <main className="p-4 bg-white flex flex-col gap-4">
      <div className="flex gap-2 items-center">
        <Avatar className="size-20 flex flex-col items-center justify-center rounded-full bg-accent">
          <AvatarFallback className="text-2xl">
            {getInitials(user.UserProfile.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-1">
          <p className="text-gray-900">{user.UserProfile.name}</p>
          <p className="text-gray-400">{user.email}</p>
        </div>
      </div>
      <div className="w-full h-[1px] bg-gray-200"></div>

      <div className="flex gap-5">
        <Link
          to="/profile"
          className="px-6 py-3 hover:border-b hover:text-blue-800 border-blue-800"
        >
          Saved
        </Link>
        <Link
          to="/profile/liked"
          className="px-6 py-3 border-b border-blue-700 text-blue-700"
        >
          Liked
        </Link>
      </div>
    </main>
  );
}
