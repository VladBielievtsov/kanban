import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";

export interface ISVGProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
}

export const LoadingSpinner = ({
  size = 24,
  className,
  ...props
}: ISVGProps) => {
  return (
    <LoaderCircle
      size={size}
      {...props}
      className={cn("animate-spin", className)}
    />
  );
};
