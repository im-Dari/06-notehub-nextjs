'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchNotes } from '../../lib/api';
import { useDebouncedCallback } from 'use-debounce';

import NoteList from '../../components/NoteList/NoteList';
import Pagination from '../../components/Pagination/Pagination';
import SearchBox from '../../components/SearchBox/SearchBox';
import Modal from '../../components/Modal/Modal';
import NoteForm from '../../components/NoteForm/NoteForm';

import css from './NotesPage.module.css';

export default function NotesClient() {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const perPage = 12;

  const handleSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 500);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', page, search],
    queryFn: () => fetchNotes({ page, perPage, search }),

    placeholderData: () =>
      queryClient.getQueryData(['notes', page - 1, search]) ?? {
        notes: [],
        totalPages: 0,
      },

    staleTime: 5000,
  });

  const notes = data?.notes ?? [];

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={(value) => handleSearch(value)} />

        {data && data.totalPages > 1 && (
          <Pagination
            totalPages={data.totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}

        <button className={css.button} onClick={() => setIsOpen(true)}>
          Create note +
        </button>
      </header>

      {isLoading && <p>Loading, please wait...</p>}
      {isError && <p>Could not fetch the list of notes.</p>}

      {notes.length > 0 ? (
        <NoteList notes={notes} />
      ) : (
        !isLoading && <p>No notes found</p>
      )}

      {}
      {isOpen && (
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <NoteForm onClose={() => setIsOpen(false)} />
        </Modal>
      )}
    </div>
  );
}