import { HeartIcon, MessageSquareMoreIcon } from "lucide-react";
import { FC } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postLikeApi } from "@/api/post.api";

import humanFormat from "human-format";

import { toast } from "@/components/ui/use-toast";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CommentsBox } from "./comments-box";

type Props = {
  option: string | null;
  setOption: (open: string | null) => void;
  isLike: boolean;
  id: string;
  likes: number;
  comments: number;
};

export const PostOptionsMenu: FC<Props> = ({ isLike, id, likes, comments }) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: postLikeApi,
    onError: (error) => {
      toast({
        variant: "destructive",
        title: `Could not ${isLike ? "unlike" : "like"}`,
        description: error.message,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`feed`] });
    },
  });

  const handleLikeClick = () => {
    if (isPending) return;
    mutate(id);
  };

  return (
    <div
      className={`flex gap-3 text-gray-800 p-2 border-t border-gray-200 mt-2`}
    >
      <div
        className={`rounded-md p-2  hover:bg-gray-100 flex gap-2 items-center cursor-pointer`}
        onClick={handleLikeClick}
      >
        <HeartIcon
          fill={"black"}
          className={`animate-bounce-1 min-h-6 min-w-6 size-6 max-h-6 max-w-6 ${!isLike && "hidden"}`}
        />

        <HeartIcon
          className={`animate-bounce-1 min-h-6 min-w-6 size-6 max-h-6 max-w-6 ${isLike && "hidden"}`}
        />
        <p className={`text-center font-medium`}>
          {" "}
          Likes ({humanFormat(likes)})
        </p>
      </div>
      <Dialog>
        <DialogTrigger>
          <div className="rounded-md hover:bg-gray-100 cursor-pointer p-2 flex gap-2 items-center">
            <MessageSquareMoreIcon className="min-h-6 min-w-6 size-6" />{" "}
            <p>Comments ({humanFormat(comments)})</p>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Comments ({humanFormat(comments)})</DialogTitle>
            <DialogDescription>
              <CommentsBox postId={id} />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};
