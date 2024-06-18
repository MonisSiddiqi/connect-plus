import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "@tanstack/react-router";
import { EyeIcon, Share2Icon } from "lucide-react";
import { FC } from "react";

type Props = {
  description: string;
  views: number;
  shares: number;
  showHeading?: boolean;
};
export const DescriptionBox: FC<Props> = ({
  description,
  views,
  shares,
  showHeading = true,
}) => {
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
    <div className="w-full h-full">
      {showHeading && (
        <p className="text-xl font-semibold text-gray-800 mb-2">Description</p>
      )}
      <ScrollArea className="w-full h-4/5">
        <div className="flex flex-col gap-2">
          <p className="text-lg text-gray-600">{highlightTags(description)}</p>
        </div>
      </ScrollArea>
      <div className="p-2 border border-gray-200 rounded-md flex gap-4 justify-center flex-col w-1/2 h-1/5">
        <div className="flex items-center text-gray-500 text-sm gap-2">
          <EyeIcon size={18} /> <p>{views} views</p>
        </div>
        <div className="flex items-center text-gray-500 text-sm gap-2">
          <Share2Icon size={18} /> <p>{shares} shares</p>
        </div>
      </div>
    </div>
  );
};
