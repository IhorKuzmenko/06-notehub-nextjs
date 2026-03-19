"use client";

interface NoteErrorProps {
  error: Error;
  reset: () => void;
}

export default function NoteError({ error, reset }: NoteErrorProps) {
  return (
    <div>
      <p>Could not fetch note details. {error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}