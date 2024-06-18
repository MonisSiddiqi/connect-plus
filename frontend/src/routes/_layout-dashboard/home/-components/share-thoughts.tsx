import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils/helpers";
import { useRouteContext } from "@tanstack/react-router";
import { PostForm } from "./post-form";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BASE_URL } from "@/config";

export const ShareThoughts = () => {
  const { auth } = useRouteContext({ from: "__root__" });
  const [open, setOpen] = useState(false);
  const handleOpen = (value: boolean) => {
    setOpen(value);
  };

  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger>
        <div className="bg-white rounded-md border border-gray-300 p-4 flex gap-2 items-center">
          <Avatar>
            <AvatarImage
              src={BASE_URL + "/" + auth.user?.UserProfile.profilePhoto}
            />
            <AvatarFallback>
              {getInitials(auth.user?.UserProfile.name as string)}
            </AvatarFallback>
          </Avatar>
          <div className="rounded-2xl px-4 py-2 hover:bg-gray-200 duration-300 bg-gray-100 text-gray-700 cursor-pointer w-full">
            <p>Share your thoughts {auth.user?.UserProfile.name}</p>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex gap-2 items-center">
            <div>
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.pngg" />
                <AvatarFallback>
                  {getInitials(auth.user?.UserProfile.name as string)}
                </AvatarFallback>
              </Avatar>
            </div>
            <p>{auth.user?.UserProfile.name as string}</p>
          </DialogTitle>
          <DialogDescription>
            <ScrollArea className="w-full h-[60vh] pr-2">
              <PostForm handleOpen={handleOpen} />
            </ScrollArea>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
