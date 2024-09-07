import { LoadingSpinner } from "./icons/LoadingSpinner";

interface Props {
  loading: boolean[];
}

export default function Loading({ loading }: Props) {
  const isLoading = loading.some((value) => value);

  return (
    isLoading && (
      <div className="fixed pl-[319px] left-0 right-0 top-20 p-4 flex items-center justify-center">
        <LoadingSpinner size={32} />
      </div>
    )
  );
}
