import React from "react";

interface Props {
  error: string | null;
}

export default function ErrorText({ error }: Props) {
  return (
    error && (
      <div>
        <p className="text-sm text-red-500 font-bold">{error}</p>
      </div>
    )
  );
}
