import { RefreshCcwIcon, LogInIcon, UserIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { registerApi } from "@/api/auth.api";
import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";

// import { Route as LoginRoute } from "@/routes";
import { Link, useRouteContext, useRouter } from "@tanstack/react-router";

import validator from "validator";
import { useRef, useState } from "react";

const formSchema = z
  .object({
    file: z
      .instanceof(FileList)
      .refine((file) => file?.length == 1, "Image is required."),
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string(),
    name: z.string().min(1, { message: "Name is required." }),
    mobile: z.string().refine(
      (mobile) => {
        return validator.isMobilePhone(mobile, validator.isMobilePhoneLocales, {
          strictMode: true,
        });
      },
      { message: "Invalid Mobile Number" }
    ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password and confirm password does not match.",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      if (data.mobile) {
        return validator.isMobilePhone(
          data.mobile,
          validator.isMobilePhoneLocales,
          { strictMode: true }
        );
      } else {
        return true;
      }
    },
    {
      message: "Invalid Mobile Number.",
      path: ["mobile"],
    }
  );

export const RegisterForm = () => {
  const [preview, setPreview] = useState<null | string>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      mobile: "",
      name: "",
      file: undefined,
    },
  });

  const { toast } = useToast();

  const { auth } = useRouteContext({ from: "__root__" });

  const { mutate, isPending } = useMutation({
    mutationKey: ["register"],
    mutationFn: registerApi,
    onSuccess: async (data) => {
      toast({
        className: "bg-green-200 text-green-800",
        title: "Register Successfully",
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

  const fileRef = form.register("file");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (event.target.files) {
      form.setValue("file", event.target.files);
    }
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid w-full gap-4">
          <div className="flex gap-20">
            <FormField
              control={form.control}
              name="file"
              render={() => {
                return (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image"
                        placeholder="Image"
                        {...fileRef}
                        className="w-fit hidden"
                        ref={inputRef}
                        onChange={handleFileChange}
                      />
                    </FormControl>
                    <div
                      onClick={() => {
                        if (inputRef.current) {
                          inputRef.current.click();
                        }
                      }}
                      className="flex border border-gray-300 border-dashed justify-center items-center cursor-pointer size-40"
                    >
                      {preview ? (
                        <img
                          src={preview}
                          alt="your image"
                          className="object-contain"
                        />
                      ) : (
                        <div className="mx-auto text-gray-400 rounded-sm font-semibold items-center gap-2">
                          <UserIcon size={50} />
                          <p>Browse</p>
                        </div>
                      )}
                    </div>
                    <FormDescription>Upload Image</FormDescription>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your name"
                    autoComplete="name"
                    className="border-gray-400 h-12 w-full focus:outline-none rounded-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="mobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your mobile number"
                      autoComplete="mobile"
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
          </div>
          <div className="grid grid-cols-2 gap-2">
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
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Your confirm password"
                      autoComplete="current-password"
                      className="border-gray-400  h-12 focus:outline-none rounded-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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
              Register
            </Button>
          </div>
          <Button asChild variant={"link"}>
            <Link to="/">Already have an account ? Login</Link>
          </Button>
        </div>
      </form>
    </Form>
  );
};
