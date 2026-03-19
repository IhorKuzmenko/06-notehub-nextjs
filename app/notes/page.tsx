
import { QueryClient, dehydrate } from "@tanstack/react-query";
import NotesClient from "./Notes.client";
import { fetchNotes } from "../../lib/api";

export default async function NotesPage() {
  const queryClient = new QueryClient();

  try {
    await queryClient.prefetchQuery({
      queryKey: ["notes", 1, ""],
      queryFn: () => fetchNotes(1, 12, ""),
    });
  } catch (err) {
    console.error("Failed to prefetch notes:", err);
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <div>
      <h1>Notes Page</h1>
      <NotesClient dehydratedState={dehydratedState} />
    </div>
  );
}