import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const Pagination: React.FC<{ currentPage: number, totalPages: number, goToPage: (page: number) => void }> = ({ currentPage, totalPages, goToPage }) => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', 
    });
  };

  const handlePageChange = (page: number) => {
    scrollToTop();
    goToPage(page); 
  };


    const generatePageNumbers = (): number[] => {
    const pageNumbers: number[] = [];
    // const maxPagesToShow = 3;

    let startPage = Math.max(currentPage - 1, 1);
    let endPage = Math.min(currentPage + 1, totalPages);

    // Ensure the range is always 3 pages at most, with ellipses if necessary
    if (currentPage <= 2) {
      startPage = 1;
      endPage = Math.min(3, totalPages);
    } else if (currentPage >= totalPages - 1) {
      startPage = Math.max(totalPages - 2, 1);
      endPage = totalPages;
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className="flex justify-center mt-8 items-center space-x-2">
      {/* Previous button */}
      <Button
        size={"icon"}
        variant={'secondary'}
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft color='white' />
      </Button>

      {/* Page numbers */}
      <div className="flex items-center space-x-2">
        {/* Show '1' if not in page numbers */}
        {pageNumbers[0] !== 1 && (
          <>
            <span
              onClick={() => handlePageChange(1)}
              className="cursor-pointer text-card-foreground text-sm"
            >
              1
            </span>
            {pageNumbers[0] > 2 && <span className="text-sm text-card-foreground">...</span>}
          </>
        )}

        {/* Middle page numbers */}
        {pageNumbers.map(page => (
          <span
            key={page}
            onClick={() => handlePageChange(page)}
            className={`cursor-pointer text-sm text-card-foreground ${page === currentPage ? 'font-bold' : ''}`}
          >
            {page}
          </span>
        ))}

        {/* Show last page if not in page numbers */}
        {pageNumbers[pageNumbers.length - 1] !== totalPages && (
          <>
            {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && <span className="text-sm text-card-foreground">...</span>}
            <span
              onClick={() => handlePageChange(totalPages)}
              className="cursor-pointer text-card-foreground text-sm"
            >
              {totalPages}
            </span>
          </>
        )}
      </div>

      {/* Next button */}
      <Button
        size={"icon"}
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight color='white' />
      </Button>
    </div>
  );
};

export default Pagination;
