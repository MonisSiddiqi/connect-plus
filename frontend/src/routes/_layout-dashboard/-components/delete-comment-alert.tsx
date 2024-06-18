import { deleteCommentApi } from "@/api/post.api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoaderCircleIcon, Trash2Icon, TrashIcon } from "lucide-react";
import { FC, useState } from "react";

type Props = {
  commentId: string;
  postId: string;
};
export const DeleteCommentAlert: FC<Props> = ({ commentId, postId }) => {
  const [open, setOpen] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const { isPending, mutate } = useMutation({
    mutationKey: [`${commentId}/delete`],
    mutationFn: deleteCommentApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`${postId}/getComments`],
      });
      queryClient.invalidateQueries({
        queryKey: [`feed`],
      });
      setOpen(false);
    },
    onError: (error) => {
      setOpen(false);
      toast({
        variant: "destructive",
        title: "Could not delete",
        description: error.message,
      });
    },
  });

  const handleDelete = () => {
    mutate({ commentId, postId });
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogTrigger onClick={() => setOpen(true)}>
        {" "}
        <div className="px-4 py-2 flex items-center font-medium text-sm gap-2 rounded-md hover:bg-accent hover:text-accent-foreground h-9">
          <TrashIcon size={16} /> Delete
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            comment and likes of this comment from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="tracking-wider font-sans  bg-red-700 hover:bg-red-800"
            disabled={isPending}
          >
            {isPending ? (
              <div className="flex items-center gap-2">
                <LoaderCircleIcon size={20} className="animate-spin" />
                Delete...
              </div>
            ) : (
              <div onClick={handleDelete} className="flex items-center gap-2">
                <Trash2Icon size={20} />
                Yes Delete
              </div>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
