"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "../../../lib/api";
import { useParams } from "next/navigation";
import css from "./NoteDetails.module.css";

interface NoteDetailsClientProps {
  noteId?: string;
  dehydratedState?: unknown; 
}

export default function NoteDetailsClient({ noteId }: NoteDetailsClientProps) {
  const params = useParams();
  const idParam = params.id;
  const id = noteId ?? (Array.isArray(idParam) ? idParam[0] : idParam);

  const { data: note, isLoading, error } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id!),
    refetchOnMount: false, 
  });

  if (isLoading) return <p>Loading...</p>;
  if (error || !note) return <p>Something went wrong.</p>;

  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
        </div>
        <p className={css.tag}>{note.tag}</p>
        <p className={css.content}>{note.content}</p>
        <p className={css.date}>{new Date(note.createdAt).toLocaleString()}</p>
      </div>
    </div>
  );
}