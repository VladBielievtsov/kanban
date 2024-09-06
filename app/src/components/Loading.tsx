import { LoadingSpinner } from "./icons/LoadingSpinner";

interface Props {
  loading: boolean;
}

export default function Loading({ loading }: Props) {
  return (
    loading && (
      <div className="absolute left-0 right-0 top-4 p-4 flex items-center justify-center">
        <LoadingSpinner size={32} />
      </div>
    )
  );
}
