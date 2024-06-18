import { ScrollArea } from "@/components/ui/scroll-area";
import { Comment } from "./comment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addCommentApi, findCommentsByPostIdApi } from "@/api/post.api";
import { FC, useState } from "react";
import { Loader2Icon, SendIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type Props = {
  postId: string;
};

export const CommentsBox: FC<Props> = ({ postId }) => {
  const [comment, setComment] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: [`${postId}/getComments`],
    queryFn: () => findCommentsByPostIdApi(postId),
  });

  const { mutate, isPending } = useMutation({
    mutationKey: [`${postId}/addComment`],
    mutationFn: addCommentApi,
    onError: (error) => {
      toast({
        title: error.message,
      });
    },
    onSuccess: () => {
      setComment("");
      queryClient.invalidateQueries({ queryKey: [`${postId}/getComments`] });
      queryClient.invalidateQueries({
        queryKey: [`feed`],
      });
    },
  });

  const onCommentSubmit = () => {
    if (comment.trim() === "" || isPending) {
      return;
    }
    mutate({ id: postId, content: comment });
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      onCommentSubmit();
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Loader2Icon className="animate-spin" />
      </div>
    );
  }
  if (error) {
    return <p>{error?.message}</p>;
  }

  if (!data) {
    return <p>Data not found</p>;
  }

  return (
    <div className="w-full h-[65vh]">
      <div className="w-full h-[calc(65vh-3rem)]">
        {data?.length > 0 ? (
          <ScrollArea className="flex flex-col gap-4 w-full h-full">
            {data?.map((item) => {
              return (
                <Comment
                  key={item.id}
                  _count={item._count}
                  content={item.content}
                  createdAt={item.createdAt}
                  id={item.id}
                  updatedAt={item.updatedAt}
                  user={item.user}
                  userId={item.userId}
                  postId={item.postId}
                  LikedComment={item.LikedComment}
                />
              );
            })}
          </ScrollArea>
        ) : (
          <div className="w-full h-full flex flex-col justify-center items-center">
            <p className="text-lg text-gray-700">No Comments</p>
            <p className="text-gray-500">Be the first to comment</p>
          </div>
        )}
      </div>

      <div className="flex items-center bg-gray-200 px-4 py-2 w-full rounded-2xl">
        <input
          onKeyDown={handleKeyDown}
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          type="text"
          className="w-full focus:outline-none bg-gray-200 placeholder:text-sm placeholder:font-medium"
          placeholder="Add Comment..."
        />
        {isPending ? (
          <Loader2Icon className="animate-spin" />
        ) : (
          <SendIcon
            onClick={onCommentSubmit}
            className="text-gray-700 cursor-pointer"
          />
        )}
      </div>
    </div>
  );
};
