import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css"; 

interface PaginationProps {
  pageCount: number;
  currentPage: number; 
  onPageChange: (selectedPage: number) => void;
}

export function Pagination({ pageCount, currentPage, onPageChange }: PaginationProps) {
  if (pageCount <= 1) return null;

  return (
    <ReactPaginate
      previousLabel="← Попередня"
      nextLabel="Наступна →"
      pageCount={pageCount}
      forcePage={currentPage - 1} // 0-based для ReactPaginate
      onPageChange={(event: { selected: number }) => onPageChange(event.selected + 1)}
      containerClassName={css.pagination}     
      activeClassName={css.active}      
    />
  );
}