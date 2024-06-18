import { FC, useState } from "react";
import { FeedPostResponse } from "@/api/post.api";
import { BASE_URL } from "@/config";
import { PostOptionsMenu } from "./post-options";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils/helpers";
import moment from "moment";
import { Link } from "@tanstack/react-router";

export const PostFeed: FC<FeedPostResponse> = (props) => {
  const [option, setOption] = useState<string | null>(null);

  const handleSetOption = (value: string | null) => {
    setOption(value);
  };

  const isLike = props.PostLike.length > 0 ? true : false;

  const highlightTags = (text: string) => {
    const regex = /#\w+/g;
    return text.split(regex).reduce(
      (acc, part, index, array) => {
        if (index < array.length - 1) {
          const match = text.match(regex)?.[index];
          return acc.concat(
            part,
            <Link
              key={index}
              search={{ text: match as string }}
              className="text-blue-700 hover:underline cursor-pointer"
            >
              {match}
            </Link>
          );
        }
        return acc.concat(part);
      },
      [] as (string | JSX.Element)[]
    );
  };
  return (
    <div className="w-full bg-white rounded-md border border-gray-300 flex flex-col gap-4">
      <div className="flex items-center p-4 pb-0 gap-2">
        <Avatar>
          <AvatarImage
            src={BASE_URL + "/" + props.user.UserProfile.profilePhoto}
          />
          <AvatarFallback>
            {getInitials(props.user.UserProfile.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-1">
          <p>{props.user.UserProfile.name}</p>
          <p className="text-sm text-gray-500">
            {moment(props.createdAt).fromNow()}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 text-sm p-4">
        <p>{highlightTags(props.description)}</p>
      </div>
      {props.file && (
        <img
          src={`${BASE_URL}/${props.file}`}
          crossOrigin="anonymous"
          className="size-full object-contain bg-gray-900 z-10"
        />
      )}
      <PostOptionsMenu
        option={option}
        setOption={handleSetOption}
        isLike={isLike}
        id={props.id}
        likes={props._count.PostLike}
        comments={props._count.Comment}
      />
    </div>
  );
};
