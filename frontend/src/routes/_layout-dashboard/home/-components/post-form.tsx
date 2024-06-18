import { z } from "zod";
import { useForm } from "react-hook-form";
import { ImageIcon, RefreshCcwIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { addPostApi } from "@/api/post.api";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { FC, useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  handleOpen: (open: boolean) => void;
};
const formSchema = z.object({
  file: z.instanceof(FileList).optional(),
  description: z.string().min(1, "Description is required."),
});

export const PostForm: FC<Props> = ({ handleOpen }) => {
  const [preview, setPreview] = useState<null | string>(null);
  const [fileName, setFileName] = useState<null | string>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      file: undefined,
    },
  });

  const { reset } = form;

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ["addPost"],
    mutationFn: addPostApi,
    onSuccess: () => {
      reset({
        description: "",
        file: undefined,
      });

      toast({
        title: "Post Added Successfully",
        className: "bg-green-200 text-green-800",
      }),
        queryClient.invalidateQueries({ queryKey: [`feed`] });
      handleOpen(false);
    },
    onError: (e) => {
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
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-5">
        <div className="grid w-full items-center gap-4">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your thoughts </FormLabel>
                <FormControl className="border border-gray-300">
                  <Textarea
                    className="border border-gray-300 rounded-sm h-32 focus:outline-none  focus-visible:outline-none"
                    placeholder="Enter your thoughts..."
                    {...field}
                  />
                </FormControl>
                <p className="text-gray-500 text-sm">
                  include # before words to make them tags
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
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
                      accept="image/*"
                      placeholder="Image"
                      {...fileRef}
                      className="w-fit hidden"
                      onChange={handleFileChange}
                      ref={inputRef}
                    />
                  </FormControl>
                  <ImageIcon
                    onClick={() => inputRef.current?.click()}
                    className="text-gray-600 cursor-pointer hover:text-brand-primary "
                  />
                  {preview && (
                    <div className="w-full max-w-full overflow-x-hidden flex flex-col gap-4">
                      <p>{fileName}</p>
                      <img
                        className="object-contains w-full"
                        src={preview}
                        alt="preview"
                      />
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <div className={`flex flex-col ${preview ? "" : "mt-10"}`}>
            <Button
              disabled={isPending}
              type="submit"
              className="px-5 py-2 hover:bg-brand-primary/95 bg-brand-primary text-white"
            >
              {isPending && (
                <RefreshCcwIcon className="mr-2 h-4 w-4 animate-spin" />
              )}
              Submit
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
