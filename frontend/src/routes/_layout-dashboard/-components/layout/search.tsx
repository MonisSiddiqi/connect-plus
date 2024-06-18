import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { SearchIcon } from "lucide-react";
import { FC, useState } from "react";

type Props = {
  className?: string;
};
export const Search: FC<Props> = ({ className }) => {
  const [input, setInput] = useState("");
  // const navigate = useNavigate();

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      if (input.trim()) return;
    }
  };
  return (
    <div
      className={cn(
        "flex h-11 w-full bg-gray-100 rounded-2xl items-center pl-3",
        className
      )}
    >
      <input
        onKeyDown={handleKeyDown}
        type="text"
        className="w-full h-full focus:outline-none focus-visible:ring-0 bg-transparent px-2"
        placeholder="Search..."
        value={input}
        onChange={(event) => setInput(event.target.value)}
      />
      <Link
        search={{ text: input }}
        disabled={input.trim() === ""}
        className="rounded-full p-3 cursor-pointer"
      >
        <SearchIcon className="text-gray-400 " />
      </Link>
    </div>
  );
};
