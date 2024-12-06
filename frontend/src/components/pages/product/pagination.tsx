import { Button } from '@/components/ui/button';

const Pagination: React.FC<{ currentPage: number, totalPages: number, goToPage: (page: number) => void }> = ({ currentPage, totalPages, goToPage }) => {
  // Function to generate the page numbers with a limit of three page numbers at a time
  const generatePageNumbers = (): number[] => {
    const pageNumbers: number[] = [];
    // const maxPagesToShow = 3;

    let startPage = Math.max(currentPage - 1, 1);  // Show one page before
    let endPage = Math.min(currentPage + 1, totalPages);  // Show one page after

    // Ensure the range is always 3 pages at most, with ellipses if necessary
    if (currentPage <= 2) {
      startPage = 1;
      endPage = Math.min(3, totalPages);  // Show the first 3 pages
    } else if (currentPage >= totalPages - 1) {
      startPage = Math.max(totalPages - 2, 1);  // Show the last 3 pages
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
        onClick={() => goToPage(currentPage - 1)} 
        disabled={currentPage === 1}
      >
        Previous
      </Button>

      {/* Page numbers */}
      <div className="flex items-center space-x-2">
        {/* Show '1' if not in page numbers */}
        {pageNumbers[0] !== 1 && (
          <>
            <span 
              onClick={() => goToPage(1)} 
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
            onClick={() => goToPage(page)} 
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
              onClick={() => goToPage(totalPages)} 
              className="cursor-pointer text-card-foreground text-sm"
            >
              {totalPages}
            </span>
          </>
        )}
      </div>

      {/* Next button */}
      <Button 
        onClick={() => goToPage(currentPage + 1)} 
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
