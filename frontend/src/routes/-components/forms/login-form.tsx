import { RefreshCcwIcon, LogInIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginApi } from "@/api/auth.api";
import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";

import { Route as LoginRoute } from "@/routes";
import { Link, useRouter } from "@tanstack/react-router";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

export const LoginForm = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // const { createSession } = useDashboardContext();
  const { toast } = useToast();
  const { auth } = LoginRoute.useRouteContext();

  const { mutate, isPending } = useMutation({
    mutationKey: ["login"],
    mutationFn: loginApi,
    onSuccess: async (data) => {
      toast({
        className: "bg-green-200 text-green-800",
        title: "Log in Successfully",
      });
      localStorage.setItem("access_token", data.access_token);
      auth.login();
      await router.invalidate();
    },
    onError: (e: any) => {
      toast({
        variant: "destructive",
        title: e.message,
      });
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid w-full items-center gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your email address"
                    autoComplete="email"
                    className="border-gray-400 h-12 focus:outline-none rounded-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Your password"
                    autoComplete="current-password"
                    className="border-gray-400  h-12 focus:outline-none rounded-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-full mt-4">
            <Button
              disabled={isPending}
              className="bg-brand-primary w-full hover:bg-brand-primary/90 duration-200 text-white text-lg  px-4 py-5 disabled:bg-gray-700"
              type="submit"
            >
              {isPending ? (
                <RefreshCcwIcon className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LogInIcon className="mr-2 h-4 w-4" />
              )}
              Log-in
            </Button>
          </div>
          <Button asChild variant={"link"}>
            <Link to="/register">Create new account</Link>
          </Button>
        </div>
      </form>
    </Form>
  );
};
