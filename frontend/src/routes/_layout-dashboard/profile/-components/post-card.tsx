import humanFormat from "human-format";
import { FC } from "react";
import playIcon from "@/assets/play-icon.png";

type Props = {
  img: string;
  views: number;
};

export const Card: FC<Props> = ({ img, views }) => {
  return (
    <div className="relative cursor-pointer">
      <img src={img} alt="image" className="w-full object-cover aspect-reel" />
      <div className="absolute left-2 bottom-2 flex gap-1 items-center text-white bg-black rounded-full px-3 py-1 opacity-40">
        <img src={playIcon} alt="play icon" className="w-fit h-fit" />
        <p className="text-sm">{humanFormat(views)} Views</p>
      </div>
    </div>
  );
};
