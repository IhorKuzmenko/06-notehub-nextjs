import NoteDetailsClient from "./NoteDetails.client";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { fetchNoteById } from "../../../lib/api";

interface NotePageProps {
  params: { id: string };
}

export default async function NotePage({ params }: NotePageProps) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", params.id],
    queryFn: () => fetchNoteById(params.id),
  });

  return (
    <NoteDetailsClient
      noteId={params.id}
      dehydratedState={dehydrate(queryClient)}
    />
  );
}