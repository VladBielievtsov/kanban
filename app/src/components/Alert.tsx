import { cn } from "@/lib/utils";

interface Props {
  variant: "danger" | "warning";
  children: React.ReactNode;
}

export default function Alert({ variant, children }: Props) {
  return (
    <div
      className={cn(
        "border-zinc-600 border p-3 rounded bg-zinc-500 bg-opacity-5",
        variant === "danger" && "border-red-600 bg-red-500",
        variant === "warning" && "border-yellow-600 bg-yellow-500"
      )}
    >
      <p
        className={cn(
          "text-sm text-zinc-500 font-bold",
          variant === "danger" && "text-red-500",
          variant === "warning" && "text-yellow-500"
        )}
      >
        {children}
      </p>
    </div>
  );
}
