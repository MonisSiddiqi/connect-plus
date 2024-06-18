import { FC, useEffect, useRef, useState } from "react";
import {
  editCommentApi,
  FindCommentsResponse,
  likeCommentApi,
} from "@/api/post.api";
import moment from "moment";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouteContext } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  EllipsisVertical,
  HeartIcon,
  LoaderCircleIcon,
  PenIcon,
} from "lucide-react";
import { DeleteCommentAlert } from "@/routes/_layout-dashboard/-components/delete-comment-alert";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BASE_URL } from "@/config";

export const Comment: FC<FindCommentsResponse> = (props) => {
  const [isEditing, setIsEditing] = useState<Boolean>(false);
  const [editingContent, setEditingContent] = useState<string>(props.content);
  const inputRef = useRef<HTMLInputElement>(null);
  const context = useRouteContext({ from: "__root__" });
  const user = context.auth.user;
  const isLike = props.LikedComment.length > 0 ? true : false;

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const queryClient = useQueryClient();

  const { mutate, isPending: isLikePending } = useMutation({
    mutationKey: ["commentLike"],
    mutationFn: likeCommentApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`${props.postId}/getComments`],
      });
    },
  });

  const { isPending: isCommentEditPending, mutate: commentEditMutation } =
    useMutation({
      mutationKey: [`${props.id}/edit`],
      mutationFn: editCommentApi,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [`${props.postId}/getComments`],
        });
      },
    });
  const handleCommentLike = () => {
    if (isLikePending) return;
    mutate(props.id);
  };

  const handleSave = () => {
    setIsEditing(false);
    commentEditMutation({ id: props.id, content: editingContent });
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      handleSave();
    }
  };

  return (
    <div className="flex w-full gap-2 py-4 border-b border-gray-200 pr-4">
      <Avatar>
        <AvatarImage
          src={BASE_URL + "/" + props.user.UserProfile.profilePhoto}
        />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>

      {isEditing ? (
        <div className="w-full flex flex-col gap-2 mr-4">
          <input
            onKeyDown={handleKeyDown}
            ref={inputRef}
            className="focus:outline-none border-b-2 border-gray-200 focus:border-gray-700 pr-4 py-1"
            type="text"
            value={editingContent}
            onChange={(event) => {
              setEditingContent(event.target.value);
            }}
          />
          <div className="flex justify-end gap-1">
            <Button
              onClick={() => {
                setIsEditing(false);
                setEditingContent(props.content);
              }}
              variant={"ghost"}
              className="rounded-full"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={
                props.content === editingContent.trim() || editingContent === ""
              }
              className="disabled:bg-gray-300 disabled:text-gray-700 bg-blue-800 hover:bg-blue-900 rounded-full"
            >
              Save
            </Button>
          </div>
        </div>
      ) : isCommentEditPending ? (
        <div className="flex justify-center items-center w-full h-full my-auto mr-14">
          <LoaderCircleIcon className="animate-spin" />
        </div>
      ) : (
        <div className="w-full">
          <div className="w-full flex items-center justify-between">
            <div className="w-full truncate">
              <p className="font-semibold text-sm">
                {props.user.UserProfile.name}
              </p>
            </div>
            {user?.id === props.userId && (
              <Popover>
                <PopoverTrigger>
                  <EllipsisVertical />
                </PopoverTrigger>
                <PopoverContent className="w-fit p-2 gap-2 flex flex-col justify-start">
                  <Button
                    onClick={() => {
                      setIsEditing(true);
                    }}
                    variant={"ghost"}
                    className="flex items-center gap-2 w-full"
                  >
                    <PenIcon size={16} /> <p className="mr-auto">Edit</p>
                  </Button>
                  <DeleteCommentAlert
                    commentId={props.id}
                    postId={props.postId}
                  />
                </PopoverContent>
              </Popover>
            )}
          </div>

          <div className="mt-1">
            <p className="text-sm text-gray-500">{props.content}</p>
          </div>
          <div className="flex mt-3 items-center gap-1">
            <HeartIcon
              onClick={handleCommentLike}
              size={20}
              fill={isLike ? "pink" : ""}
            />
            <div className="flex justify-between w-full">
              <p className="text-sm text-gray-500">
                {props._count.LikedComment}
              </p>{" "}
              <div className="flex gap-1 items-center">
                {props.createdAt !== props.updatedAt && (
                  <p className="text-xs text-gray-400">(Edited)</p>
                )}
                <p className="text-gray-400 text-xs">
                  {moment(props.updatedAt).fromNow()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
