import { cn } from "@/lib/utils";
import { LoadingSpinner } from "../icons/LoadingSpinner";

interface Props {
  loading: boolean[];
  className?: string;
}

export default function Loading({ loading, className }: Props) {
  const isLoading = loading.some((value) => value);

  return (
    isLoading && (
      <div
        className={cn(
          "fixed pl-[319px] left-0 right-0 top-20 p-4 flex items-center justify-center",
          className
        )}
      >
        <LoadingSpinner size={32} />
      </div>
    )
  );
}
