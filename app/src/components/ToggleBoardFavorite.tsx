import { Star } from "lucide-react";
import { Button, useToast } from "./ui";
import { Dispatch, SetStateAction, useState } from "react";
import { handleAxiosErrorMessage } from "@/lib/axios-client";
import { useBoardsStore } from "@/store/boards";

interface Props {
  isFav: boolean;
  setIsFav: Dispatch<SetStateAction<boolean>>;
  boardId: string;
}

export default function ToggleBoardFavorite({
  isFav,
  setIsFav,
  boardId,
}: Props) {
  const [loading, setLoading] = useState<boolean>(false);
  const { toggleFav } = useBoardsStore();

  const { toast } = useToast();

  const handleToggleFav = async () => {
    try {
      setLoading(true);
      const res = await toggleFav(boardId);
      if (res.status === 200) {
        setLoading(false);
        setIsFav(res.data.favorite);
      } else {
        setLoading(false);
        toast({
          title: res.data || "An unknown error occurred.",
          variant: "success",
        });
      }
    } catch (error) {
      setLoading(false);
      const errorMessage = handleAxiosErrorMessage(error);
      toast({
        title: errorMessage || "An unknown error occurred.",
        variant: "destructive",
      });
      throw new Error(errorMessage);
    }
  };

  return (
    <Button variant={"ghost"} onClick={handleToggleFav} disabled={loading}>
      {isFav ? (
        <Star fill="#FBBF24" stroke="#FBBF24" size={18} />
      ) : (
        <Star size={18} />
      )}
    </Button>
  );
}
