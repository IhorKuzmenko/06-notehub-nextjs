"use client";

import { QueryClient, QueryClientProvider, useQuery, hydrate } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { useDebouncedCallback } from "use-debounce";
import { fetchNotes, FetchNotesResponse } from "../../lib/api";
import NoteList from "../../components/NoteList/NoteList";
import { Pagination } from "../../components/Pagination/Pagination";
import Modal from "../../components/Modal/Modal";
import NoteForm from "../../components/NoteForm/NoteForm";
import SearchBox from "../../components/SearchBox/SearchBox";
import css from "./Notes.module.css";

interface NotesClientProps {
  dehydratedState?: unknown;
}

export default function NotesClient({ dehydratedState }: NotesClientProps) {
  const [queryClient] = useState(() => new QueryClient());

  useMemo(() => {
    if (dehydratedState) {
      hydrate(queryClient, dehydratedState);
    }
  }, [dehydratedState, queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <NotesInner />
    </QueryClientProvider>
  );
}

function NotesInner() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const perPage = 12;

  const debounced = useDebouncedCallback((value: string) => {
    setDebouncedSearch(value);
    setCurrentPage(1);
  }, 500);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    debounced(value);
  };

  const { data, isLoading, isFetching, error } = useQuery<FetchNotesResponse, Error>({
    queryKey: ["notes", currentPage, debouncedSearch],
    queryFn: () => fetchNotes(currentPage, perPage, debouncedSearch),
    staleTime: 60_000, 
    placeholderData: () => ({
      notes: [],
      totalPages: 0,
    }),
  });

  const notes: FetchNotesResponse["notes"] = data?.notes ?? [];
  const totalPages: number = data?.totalPages ?? 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={handleSearchChange} />

        {totalPages > 1 && (
          <Pagination
            pageCount={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}

        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {isLoading && <p>Loading...</p>}
      {isFetching && <p>Loading page...</p>}
      {notes.length > 0 && <NoteList notes={notes} />}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onClose={() => setIsModalOpen(false)} />
        </Modal>
      )}

      {error && <p>Error loading notes</p>}
    </div>
  );
}