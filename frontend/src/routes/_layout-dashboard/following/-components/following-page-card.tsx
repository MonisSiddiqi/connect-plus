import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/utils/helpers";
import { FC } from "react";
import humanFormat from "human-format";

type Props = {
  id: string;
  name: string;
  views: number;
  description: string;
  thumbnails: { thumbnail: string }[];
};

import pagePhoto from "@/assets/page-1.png";
export const FollowingPageCard: FC<Props> = ({
  name,
  description,
  views,
  thumbnails,
}) => {
  return (
    <div className="w-full flex flex-col gap-2 max-w-[40rem]">
      <div className="w-full flex gap-2">
        <Avatar className="size-24 rounded-sm overflow-hidden">
          <AvatarImage
            src={pagePhoto}
            crossOrigin="anonymous"
            className="object-cover rounded-none"
          />
          <AvatarFallback className="rounded-none">
            {getInitials("My Page")}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-1 w-full">
          <div className="flex justify-between">
            <p className="text-gray-700 text-xl font-medium">{name}</p>
            <Button className="bg-blue-700 hover:bg-blue-800">Unfollow</Button>
          </div>
          <p className="text-gray-400 -mt-1">{humanFormat(views)} Views</p>
          <p className="text-gray-400 line-clamp-2">{description}</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {thumbnails.map(({ thumbnail }, index) => {
          return (
            <div key={index} className="h-72 w-full bg-gray-100">
              <img
                src={thumbnail}
                alt="thumbnail"
                className="object-cover h-72 w-full"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
