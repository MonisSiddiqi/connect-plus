import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search } from "@/routes/_layout-dashboard/-components/layout/search";
import { BellIcon, RadioIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { FC } from "react";
import { Auth } from "@/utils/auth";
import { getInitials } from "@/utils/helpers";
import { BASE_URL } from "@/config";

type Props = {
  auth: Auth;
};

export const Header: FC<Props> = ({ auth }) => {
  return (
    <div className="flex items-center justify-between bg-white px-5 py-3.5 h-[4.5rem] border-b border-gray-200">
      <div className="lg:flex items-center hidden">
        <Link
          to="/home"
          className="text-brand-primary text-3xl flex items-center gap-1"
        >
          <RadioIcon size={36} />
        </Link>
        <div
          className="mx-auto flex items-center w-80
          ml-5"
        >
          <Search />
        </div>
      </div>
      {/* <div className="p-3 rounded-xl text-white bg-brand-primary">
        <HomeIcon />
      </div> */}

      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-full hover:bg-gray-100 duration-300 cursor-pointer">
          <BellIcon className="cursor-pointer w-6 h-6" />
        </div>
        <Link to="/profile">
          <Avatar>
            <AvatarImage
              src={BASE_URL + "/" + auth.user?.UserProfile.profilePhoto}
            />
            <AvatarFallback>
              {getInitials(auth.user?.UserProfile.name as string)}
            </AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </div>
  );
};
