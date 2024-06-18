import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { useNavigate } from "@tanstack/react-router"

export const BackButton = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate({ to: ".." });
  };
  return (
    <Button
      variant={"outline"}
      className=" border-none shadow-none"
      onClick={handleClick}
    >
      <ArrowLeftIcon />
    </Button>
  );
};
