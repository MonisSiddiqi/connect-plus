import {
  createFileRoute,
  redirect,
  useLayoutEffect,
} from "@tanstack/react-router";
import { LoginForm } from "@/routes/-components/forms/login-form";
import { useRouter } from "@tanstack/react-router";
import { RadioIcon } from "lucide-react";

export const Route = createFileRoute("/")({
  beforeLoad: ({ context }) => {
    if (context.auth.status === "loggedIn") {
      throw redirect({ to: "/home" });
    }
  },
  component: Index,
}).update({
  component: Index,
});

function Index() {
  const { status } = Route.useRouteContext({
    select: ({ auth }) => ({ status: auth?.status }),
  });

  const router = useRouter();

  useLayoutEffect(() => {
    if (status === "loggedIn") {
      router.history.push("/home");
    }
  }, [status, router.history]);

  return (
    <div className="w-full h-screen min-h-screen flex items-center overflow-hidden">
      <div className="w-full h-full flex bg-gray-100">
        <div className="w-1/2 flex justify-center items-center">
          <div className="w-2/3 flex justify-center flex-col gap-4">
            <h1 className="text-7xl text-brand-primary font-bold flex items-center gap-2">
              Connect <RadioIcon className="mt-3" size={50} />
            </h1>
            <p className="text-gray-800 text-3xl">
              Explore world and share your thoughts with Connect
            </p>
          </div>
        </div>
        <div className="w-1/2 flex justify-center items-center">
          <div className="w-1/2 bg-white shadow-lg rounded-sm p-5">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
